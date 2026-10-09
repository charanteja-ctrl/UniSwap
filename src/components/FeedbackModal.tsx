"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { FeedbackCategory } from "@/lib/types";
import {
  Star,
  X,
  MessageSquarePlus,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Image as ImageIcon,
  ShieldCheck,
  EyeOff,
  Sparkles,
  Trash2,
} from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CATEGORIES: FeedbackCategory[] = [
  "General Website",
  "Buying Experience",
  "Selling Experience",
  "Payment Issues",
  "Campus Meetup",
  "Bug Report",
  "Feature Request",
  "Other",
];

const RATING_LABELS: Record<number, string> = {
  1: "Poor — Needs urgent fix",
  2: "Fair — Room for improvement",
  3: "Good — Decent experience",
  4: "Very Good — Really helpful",
  5: "Excellent — Outstanding platform!",
};

export default function FeedbackModal({ isOpen, onClose, onSuccess }: FeedbackModalProps) {
  const { user } = useAuth();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<FeedbackCategory>("General Website");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Restore draft from sessionStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedDraft = sessionStorage.getItem("uniswap_feedback_draft");
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed.rating) setRating(parsed.rating);
          if (parsed.category) setCategory(parsed.category);
          if (parsed.title) setTitle(parsed.title);
          if (parsed.message) setMessage(parsed.message);
          if (parsed.isAnonymous !== undefined) setIsAnonymous(parsed.isAnonymous);
        }
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  // Save draft whenever user types
  useEffect(() => {
    if (typeof window !== "undefined" && !isSuccess) {
      try {
        sessionStorage.setItem(
          "uniswap_feedback_draft",
          JSON.stringify({ rating, category, title, message, isAnonymous })
        );
      } catch (e) {
        // Ignore
      }
    }
  }, [rating, category, title, message, isAnonymous, isSuccess]);

  // Handle ESC key to close modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. File Type Validation
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Only PNG, JPEG, or WebP images are permitted.");
      return;
    }

    // 2. File Size Validation (Max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum allowed size is 5 MB.");
      return;
    }

    // Read and encode to Base64
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setScreenshot(uploadEvent.target?.result as string);
      setScreenshotName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = () => {
    setScreenshot(null);
    setScreenshotName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Front-end validations
    if (!rating || rating < 1 || rating > 5) {
      setError("Please select a star rating between 1 and 5.");
      return;
    }
    if (title.trim().length < 3) {
      setError("Please provide a concise title (at least 3 characters).");
      return;
    }
    if (message.trim().length < 10) {
      setError("Please provide detailed feedback (at least 10 characters).");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          category,
          title: title.trim(),
          message: message.trim(),
          isAnonymous,
          screenshot: screenshot || undefined,
          userId: user?.id,
          userName: user?.name,
          userEmail: user?.email,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit feedback.");
      }

      // Clear draft on successful submission
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("uniswap_feedback_draft");
      }

      setIsSuccess(true);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setIsSuccess(false);
        setTitle("");
        setMessage("");
        setScreenshot(null);
        setScreenshotName("");
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An error occurred while sending your suggestion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#0A2540] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#239867] to-emerald-400 flex items-center justify-center text-slate-950 shadow">
              <MessageSquarePlus className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 id="feedback-modal-title" className="text-base font-extrabold tracking-tight">
                Feedback & Suggestions
              </h2>
              <p className="text-[11px] text-blue-200">Help improve UniSwap for all VIT-AP students</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-white">
          {isSuccess ? (
            <div className="py-10 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Feedback Received!</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Thank you for helping us shape the campus marketplace. Our team reviews all suggestions.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Notice */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1. Star Rating */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Rate Your Experience
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 hover:scale-110 transition-transform focus:outline-none"
                          aria-label={`${star} Star`}
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              active
                                ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                                : "text-slate-600 hover:text-slate-400"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-semibold text-amber-300 ml-2">
                    {RATING_LABELS[hoverRating || rating]}
                  </span>
                </div>
              </div>

              {/* 2. Category Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Feedback Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#239867]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Title / Subject
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Add cycling rack pickup pin on campus map"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#239867]"
                  maxLength={150}
                />
              </div>

              {/* 4. Detailed Message */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Detailed Suggestion
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {message.length} / 2000
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you liked, what felt confusing, or describe a bug you encountered..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#239867] resize-none leading-relaxed"
                  maxLength={2000}
                />
              </div>

              {/* 5. Screenshot Upload */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Attach Screenshot (Optional)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />

                {screenshot ? (
                  <div className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <ImageIcon className="w-4 h-4 text-[#239867] flex-shrink-0" />
                      <span className="truncate text-slate-300 text-[11px] font-mono">
                        {screenshotName || "screenshot.png"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveScreenshot}
                      className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-500/10 transition"
                      aria-label="Remove screenshot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border border-dashed border-slate-700 hover:border-slate-500 bg-slate-950/60 p-3 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white transition"
                  >
                    <UploadCloud className="w-4 h-4 text-[#239867]" />
                    <span>Upload image (PNG, JPG, WebP up to 5 MB)</span>
                  </button>
                )}
              </div>

              {/* 6. Anonymous Display Preference */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="anonymous-toggle"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-[#239867] focus:ring-[#239867]"
                />
                <label htmlFor="anonymous-toggle" className="text-xs text-slate-300 cursor-pointer select-none">
                  <span className="font-semibold block text-white flex items-center gap-1.5">
                    <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                    <span>Display as Anonymous Student</span>
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Your real name will be hidden from public feedback digests.
                  </span>
                </label>
              </div>

              {/* 7. Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#239867] to-emerald-600 hover:from-[#1e855a] hover:to-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
