"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StudentUser, UserRole } from "./types";

interface AuthContextType {
  user: StudentUser | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string,
    regNo: string,
    hostel: string,
    role?: UserRole
  ) => Promise<{ success: boolean; error?: string }>;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_USERS: Record<UserRole, StudentUser> = {
  student: {
    id: "usr_student_charan",
    name: "Charan Teja",
    email: "charan.23bce1024@vitap.ac.in",
    regNo: "23BCE1024",
    hostel: "MH-2",
    role: "student",
    isVerified: true,
  },
  moderator: {
    id: "usr_mod_sundaram",
    name: "Student Council Lead",
    email: "council.moderator@vitap.ac.in",
    regNo: "MOD-2026",
    hostel: "MH-1",
    role: "moderator",
    isVerified: true,
  },
  admin: {
    id: "usr_admin_platform",
    name: "UniSwap Administrator",
    email: "admin.uniswap@vitap.ac.in",
    regNo: "ADMIN-01",
    hostel: "Central Admin",
    role: "admin",
    isVerified: true,
  },
  super_admin: {
    id: "usr_super_admin",
    name: "Platform Super Admin",
    email: "superadmin.uniswap@vitap.ac.in",
    regNo: "ROOT-001",
    hostel: "Office of Director",
    role: "super_admin",
    isVerified: true,
  },
  master_admin: {
    id: "usr_master_admin",
    name: "UniSwap Master Admin",
    email: "master.admin@vitap.ac.in",
    regNo: "EXEC-001",
    hostel: "University Executive Secretariat",
    role: "master_admin",
    isVerified: true,
  },
  club_manager: {
    id: "usr_club_ieee",
    name: "IEEE Student Chapter Lead",
    email: "ieee.chapter@vitap.ac.in",
    regNo: "CLUB-IEEE-01",
    hostel: "Student Activity Center",
    role: "club_manager",
    clubName: "IEEE VIT-AP Student Branch",
    isVerified: true,
  },
  business_advertiser: {
    id: "usr_biz_pizza",
    name: "Campus Pizza Partner",
    email: "partners.pizza@vitap.ac.in",
    regNo: "BIZ-8802",
    hostel: "Rock Plaza Dining Complex",
    role: "business_advertiser",
    businessName: "Campus Pizza & Cafe",
    isVerified: true,
  },
  finance_manager: {
    id: "usr_finance_dept",
    name: "UniSwap Finance Manager",
    email: "finance.uniswap@vitap.ac.in",
    regNo: "FIN-2026",
    hostel: "Central Admin Block",
    role: "finance_manager",
    isVerified: true,
  },
  support_manager: {
    id: "usr_support_desk",
    name: "Campus Support Lead",
    email: "support.uniswap@vitap.ac.in",
    regNo: "SUP-101",
    hostel: "Hostel Helpdesk",
    role: "support_manager",
    isVerified: true,
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StudentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("uniswap_vitap_user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default to student demo so testing is frictionless
        setUser(DEMO_USERS.student);
        localStorage.setItem("uniswap_vitap_user", JSON.stringify(DEMO_USERS.student));
      }
    } catch (e) {
      console.error("Failed to load auth session", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateVitapEmail = (email: string): boolean => {
    const clean = email.trim().toLowerCase();
    return (
      clean.endsWith("@vitap.ac.in") ||
      clean.endsWith("@vitapstudent.ac.in") ||
      clean.endsWith("@uniswap.vitap") ||
      clean === "student@demo.com" ||
      clean === "admin@demo.com"
    );
  };

  const login = async (email: string, password?: string) => {
    if (!email.trim()) {
      return { success: false, error: "Please enter your university email." };
    }

    if (!validateVitapEmail(email)) {
      return {
        success: false,
        error: "UniSwap is exclusively for VIT-AP. Please enter an email ending with @vitapstudent.ac.in or @vitap.ac.in.",
      };
    }

    if (password && password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters long.",
      };
    }

    const prefix = email.split("@")[0].toLowerCase();
    const extractedReg = prefix.match(/\d{2}[a-zA-Z]{3}\d{3,4}/)?.[0]?.toUpperCase() || "23BCE1024";

    // Auto-detect role based on email or default to student
    const role: UserRole = prefix.includes("master")
      ? "master_admin"
      : prefix.includes("admin")
      ? "admin"
      : prefix.includes("mod") || prefix.includes("council")
      ? "moderator"
      : prefix.includes("club") || prefix.includes("ieee") || prefix.includes("acm")
      ? "club_manager"
      : prefix.includes("partner") || prefix.includes("biz") || prefix.includes("pizza")
      ? "business_advertiser"
      : "student";

    const authenticatedUser: StudentUser = {
      id: `usr_${Date.now()}`,
      name: prefix.split(".")[0] ? prefix.split(".")[0].toUpperCase() : "VIT-AP Student",
      email: email.toLowerCase().trim(),
      regNo: extractedReg,
      hostel: "MH-2",
      role,
      isVerified: true,
    };

    setUser(authenticatedUser);
    localStorage.setItem("uniswap_vitap_user", JSON.stringify(authenticatedUser));
    return { success: true };
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    regNo: string,
    hostel: string,
    role: UserRole = "student"
  ) => {
    if (!name.trim() || !email.trim() || !regNo.trim()) {
      return { success: false, error: "Please fill in all required student details." };
    }

    if (!validateVitapEmail(email)) {
      return {
        success: false,
        error: "Access restricted: Please register using a valid @vitapstudent.ac.in or @vitap.ac.in email.",
      };
    }

    if (password && password.length < 6) {
      return {
        success: false,
        error: "Security requirement: Password must be at least 6 characters.",
      };
    }

    const newUser: StudentUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      regNo: regNo.toUpperCase().trim(),
      hostel: hostel || "MH-2",
      role,
      isVerified: true,
    };

    setUser(newUser);
    localStorage.setItem("uniswap_vitap_user", JSON.stringify(newUser));
    return { success: true };
  };

  const loginAsRole = (role: UserRole) => {
    const selected = DEMO_USERS[role];
    setUser(selected);
    localStorage.setItem("uniswap_vitap_user", JSON.stringify(selected));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("uniswap_vitap_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        loginAsRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
