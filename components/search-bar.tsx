"use client";

import React from "react"

import { Search, X, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  isLoading?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  isLoading = false,
  inputRef,
}: SearchBarProps) {
  const localRef = useRef<HTMLInputElement>(null);
  const ref = inputRef || localRef;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        ref.current?.focus();
      }
      if (e.key === "Escape") {
        ref.current?.blur();
        onClear();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [ref, onClear]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Glow effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500",
          "bg-primary/20 blur-xl",
          value && "opacity-100"
        )}
      />

      {/* Search input container */}
      <div
        className={cn(
          "relative flex items-center gap-3 px-5 py-4 rounded-2xl",
          "bg-card/80 backdrop-blur-xl border border-border/50",
          "focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20",
          "transition-all duration-300"
        )}
      >
        <Search className="h-5 w-5 text-muted-foreground shrink-0" />

        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for songs, artists, or albums..."
          className={cn(
            "flex-1 bg-transparent text-foreground placeholder:text-muted-foreground",
            "text-lg outline-none"
          )}
        />

        {isLoading && (
          <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
        )}

        {value && !isLoading && (
          <button
            type="button"
            onClick={onClear}
            className={cn(
              "p-1 rounded-full",
              "hover:bg-secondary text-muted-foreground hover:text-foreground",
              "transition-colors duration-200"
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search hint */}
      {!value && (
        <p className="text-center text-sm text-muted-foreground mt-3 animate-fade-in">
          Press{" "}
          <kbd className="px-2 py-0.5 rounded bg-secondary text-xs font-mono">
            ⌘K
          </kbd>{" "}
          to search anytime
        </p>
      )}
    </div>
  );
}
