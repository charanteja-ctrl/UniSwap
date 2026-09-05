import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "UniSwap — VIT-AP Campus Peer Marketplace",
  description: "Exclusive student marketplace for VIT-AP University. Buy, sell, and swap pre-owned engineering books, calculators, and electronics safely with Razorpay Standard Checkout and Groq AI.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", sizes: "any" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="min-h-screen bg-[#f9fafb] text-[#0a1b33] antialiased flex flex-col justify-between selection:bg-yellow-200">
        <AuthProvider>
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
