"use client";

import { Heart, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onSearchFocus?: () => void;
  curatedCount?: number;
}

export function Header({ onSearchFocus, curatedCount = 0 }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full group-hover:bg-primary/50 transition-all duration-500" />
              <svg 
                className="h-9 w-9 text-primary relative z-10" 
                viewBox="0 0 40 40" 
                fill="none"
              >
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2.5" className="opacity-30" />
                <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="2.5" className="opacity-50" />
                <circle cx="20" cy="20" r="6" fill="currentColor" />
                <path d="M20 2 L20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 32 L20 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M2 20 L8 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M32 20 L38 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Songify
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Discover
            </Link>
            <Link
              href="#browse"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Browse
            </Link>
            <Link
              href="#curated"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative"
            >
              Curated
              {curatedCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {curatedCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onSearchFocus}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full",
                "bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground",
                "transition-all duration-300 group"
              )}
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">Search</span>
              <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            <button
              type="button"
              className={cn(
                "relative p-2 rounded-full",
                "hover:bg-secondary transition-colors duration-300"
              )}
            >
              <Heart className="h-5 w-5" />
              {curatedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {curatedCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
