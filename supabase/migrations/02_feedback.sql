-- UniSwap — Migration 02: Student Feedback & Suggestions Table
-- Includes Row Level Security (RLS), Status Controls, and Analytics Indexes

-- 1. Create Feedback Table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT, -- Authenticated student/user ID
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  category TEXT NOT NULL CHECK (category IN (
    'General Website',
    'Buying Experience',
    'Selling Experience',
    'Payment Issues',
    'Campus Meetup',
    'Bug Report',
    'Feature Request',
    'Other'
  )),
  title TEXT NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 150),
  message TEXT NOT NULL CHECK (char_length(message) >= 10 AND char_length(message) <= 2000),
  is_anonymous BOOLEAN DEFAULT FALSE,
  screenshot_path TEXT,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'In Progress', 'Resolved')),
  admin_reply TEXT,
  admin_reply_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Performance Indexes for Admin Filtering & Metrics
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON public.feedback(category);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON public.feedback(rating);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.feedback(user_id);

-- 3. Row Level Security (RLS) Policies
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Students can insert feedback (restricted from setting admin status or reply on creation)
CREATE POLICY "Students can insert own feedback"
ON public.feedback FOR INSERT
WITH CHECK (
  status = 'New' AND 
  admin_reply IS NULL AND 
  admin_reply_at IS NULL
);

-- Students can view their own feedback submissions
CREATE POLICY "Students can view own feedback"
ON public.feedback FOR SELECT
USING (
  auth.uid()::text = user_id OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'master_admin', 'moderator')
);

-- Only verified administrators can update status and post official replies
CREATE POLICY "Admins can update feedback status and reply"
ON public.feedback FOR UPDATE
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'master_admin', 'moderator')
);

-- Only administrators can delete inappropriate feedback
CREATE POLICY "Admins can delete feedback"
ON public.feedback FOR DELETE
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'master_admin', 'moderator')
);
