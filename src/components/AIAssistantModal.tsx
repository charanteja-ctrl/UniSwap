"use client";

import React, { useState } from "react";
import { Sparkles, Send, Bot, User, X, Loader2 } from "lucide-react";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function AIAssistantModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! I'm your UniSwap VIT-AP Campus Assistant powered by Groq Llama 3. Ask me anything about safe campus meetups, Razorpay checkout, the 2% fee, or how to swap items!"
    }
  ]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          conversationHistory: messages,
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: data.error || "Sorry, I couldn't reach the AI service right now." }
        ]);
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Connection error. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full h-[540px] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#0A2540] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-yellow-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm">Ask UniSwap AI</div>
              <div className="text-[11px] text-blue-200">Powered by Groq • VIT-AP Knowledge Base</div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat message body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-sm">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  m.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-900 text-yellow-400"
                }`}
              >
                {m.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div
                className={`rounded-2xl px-4 py-2.5 max-w-[80%] leading-relaxed ${
                  m.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none text-right"
                    : "bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>UniSwap AI is thinking...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setInput("Where can I safely meet the buyer near Central Library?")}
            className="whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full text-[11px]"
          >
            📍 Library Meetup
          </button>
          <button
            onClick={() => setInput("How does the 2% UniSwap fee work for ₹1,000 item?")}
            className="whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full text-[11px]"
          >
            💳 2% Fee Explanation
          </button>
          <button
            onClick={() => setInput("Can I swap my book instead of selling it?")}
            className="whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full text-[11px]"
          >
            🔄 How Swap Works
          </button>
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask a question about campus exchange..."
            className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-[#0A2540] hover:bg-blue-900 disabled:opacity-50 text-white p-2.5 rounded-xl transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
