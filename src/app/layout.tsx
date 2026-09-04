import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col justify-between">
        <main className="flex-1">{children}</main>
        <footer className="bg-[#0A2540] text-blue-200 text-xs py-8 border-t border-blue-900/50 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-yellow-400 text-slate-950 font-bold flex items-center justify-center text-xs">U</span>
              <span className="font-bold text-white">UniSwap • VIT-AP Edition</span>
              <span className="text-slate-400">| Designed for VIT-AP Students</span>
            </div>
            <div className="flex items-center gap-6">
              <span>Escrow via Razorpay</span>
              <span>AI via Groq Llama 3</span>
              <span>Campus Pickups: MH, LH & Library</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
