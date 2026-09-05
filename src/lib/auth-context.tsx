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
    return email.trim().toLowerCase().endsWith("@vitap.ac.in");
  };

  const login = async (email: string, password?: string) => {
    if (!email.trim()) {
      return { success: false, error: "Please enter your university email." };
    }

    if (!validateVitapEmail(email)) {
      return {
        success: false,
        error: "UniSwap is exclusively for VIT-AP students. Please enter an email ending with @vitap.ac.in.",
      };
    }

    const prefix = email.split("@")[0].toLowerCase();
    const extractedReg = prefix.match(/\d{2}[a-zA-Z]{3}\d{3,4}/)?.[0]?.toUpperCase() || "23BCE1024";

    // Auto-detect role based on email or default to student
    const role: UserRole = prefix.includes("admin")
      ? "admin"
      : prefix.includes("mod") || prefix.includes("council")
      ? "moderator"
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
        error: "Access restricted: Only @vitap.ac.in student emails are allowed to register.",
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
