"use client";

import React, { useState } from "react";
import { Search, Sparkles, X, ArrowRight, Tag, MapPin, DollarSign } from "lucide-react";

export interface AISearchFilters {
  query: string;
  category?: string;
  maxPrice?: number;
  location?: string;
}

export default function AISmartSearch({
  onFilterChange,
}: {
  onFilterChange: (filters: AISearchFilters) => void;
}) {
  const [searchInput, setSearchInput] = useState("");
  const [activeFilters, setActiveFilters] = useState<AISearchFilters>({ query: "" });

  const parseQuery = (text: string) => {
    const lower = text.toLowerCase();
    const filters: AISearchFilters = { query: text };

    // Detect price: "under 500", "below 1000", "< 600"
    const priceMatch = lower.match(/(?:under|below|<|upto|less than)\s*₹?\s*(\d+)/i);
    if (priceMatch && priceMatch[1]) {
      filters.maxPrice = Number(priceMatch[1]);
    }

    // Detect campus location
    if (lower.includes("mh-1") || lower.includes("mh1")) filters.location = "MH-1";
    else if (lower.includes("mh-2") || lower.includes("mh2")) filters.location = "MH-2";
    else if (lower.includes("mh-3") || lower.includes("mh3")) filters.location = "MH-3";
    else if (lower.includes("lh-1") || lower.includes("lh1")) filters.location = "LH-1";
    else if (lower.includes("lh-2") || lower.includes("lh2")) filters.location = "LH-2";
    else if (lower.includes("library")) filters.location = "Library";
    else if (lower.includes("ab-1") || lower.includes("ab1")) filters.location = "AB-1";

    // Detect category
    if (lower.includes("calculator") || lower.includes("casio")) filters.category = "Calculators";
    else if (lower.includes("book") || lower.includes("notes") || lower.includes("manual"))
      filters.category = "Books";
    else if (lower.includes("drafter") || lower.includes("lab") || lower.includes("coat"))
      filters.category = "Academic/Lab";
    else if (lower.includes("headphone") || lower.includes("laptop") || lower.includes("charger"))
      filters.category = "Electronics";
    else if (lower.includes("kettle") || lower.includes("mattress") || lower.includes("lamp"))
      filters.category = "Hostel Essentials";

    setActiveFilters(filters);
    onFilterChange(filters);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    parseQuery(val);
  };

  const handleClear = () => {
    setSearchInput("");
    setActiveFilters({ query: "" });
    onFilterChange({ query: "" });
  };

  const exampleQueries = [
    "calculator under ₹500 near MH-2",
    "engineering mathematics book",
    "lab coat in LH-1",
    "kettle under ₹800",
  ];

  return (
    <div className="space-y-3">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-4 flex items-center gap-1.5 text-blue-600 pointer-events-none">
          <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          placeholder='Try AI search: "calculator under ₹500 near MH-2" or "maths book in Library"...'
          className="w-full bg-white border border-slate-200/90 rounded-2xl py-3.5 pl-11 pr-10 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
        />
        {searchInput && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Real-time AI Parsing Badges */}
      {(activeFilters.category || activeFilters.maxPrice || activeFilters.location) && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs animate-fadeIn">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            AI Detected Filters:
          </span>
          {activeFilters.category && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200/60 px-2.5 py-0.5 rounded-lg font-semibold text-[11px]">
              <Tag className="w-3 h-3" />
              Category: {activeFilters.category}
            </span>
          )}
          {activeFilters.maxPrice && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-0.5 rounded-lg font-semibold text-[11px]">
              <DollarSign className="w-3 h-3" />
              Max Price: ₹{activeFilters.maxPrice}
            </span>
          )}
          {activeFilters.location && (
            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200/60 px-2.5 py-0.5 rounded-lg font-semibold text-[11px]">
              <MapPin className="w-3 h-3" />
              Location: {activeFilters.location}
            </span>
          )}
        </div>
      )}

      {/* Suggested Prompt Chips */}
      {!searchInput && (
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-400">Quick searches:</span>
          {exampleQueries.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setSearchInput(ex);
                parseQuery(ex);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200/80 transition cursor-pointer"
            >
              {ex}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
