import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "UniSwap — VIT-AP Campus Peer Marketplace",
  description: "Exclusive student marketplace for VIT-AP University. Buy, sell, and swap pre-owned engineering books, calculators, and electronics safely with Razorpay Standard Checkout and Groq AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-[#f9fafb] text-[#0a1b33] antialiased flex flex-col justify-between selection:bg-yellow-200">
        <AuthProvider>
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
