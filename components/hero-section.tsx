"use client";

import { cn } from "@/lib/utils";

function AnimatedVinyl() {
  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full animate-pulse" />
      
      {/* Outer ring with grooves */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] animate-[spin_8s_linear_infinite] shadow-2xl">
        {/* Vinyl grooves */}
        <div className="absolute inset-[8%] rounded-full border border-[#2a2a2a]" />
        <div className="absolute inset-[16%] rounded-full border border-[#252525]" />
        <div className="absolute inset-[24%] rounded-full border border-[#2a2a2a]" />
        <div className="absolute inset-[32%] rounded-full border border-[#252525]" />
        
        {/* Label area */}
        <div className="absolute inset-[35%] rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
          <div className="text-primary-foreground font-bold text-xs sm:text-sm" style={{ fontFamily: 'var(--font-display)' }}>
            SONGIFY
          </div>
        </div>
        
        {/* Center hole */}
        <div className="absolute inset-[47%] rounded-full bg-background" />
        
        {/* Light reflection */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      </div>
      
      {/* Floating music notes */}
      <div className="absolute -top-4 -right-4 text-3xl animate-bounce" style={{ animationDelay: '0s' }}>
        <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
      </div>
      <div className="absolute -bottom-2 -left-6 text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>
        <svg className="w-6 h-6 text-primary/70" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
      </div>
      <div className="absolute top-1/2 -right-8 text-xl animate-bounce" style={{ animationDelay: '0.6s' }}>
        <svg className="w-5 h-5 text-primary/50" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
      </div>
    </div>
  );
}

function SoundWaves() {
  return (
    <div className="flex items-end gap-1 h-16">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="w-1.5 sm:w-2 bg-gradient-to-t from-primary/50 to-primary rounded-full"
          style={{
            height: '100%',
            animation: `equalizer 0.8s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </div>
  );
}

export function HeroSection() {
  return (
    <div className="relative pt-28 pb-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -top-20 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-40 left-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.22_0_0)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.22_0_0)_1px,transparent_1px)] bg-[size:4rem_4rem]"
          style={{ maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)" }}
        />
      </div>

      {/* Content - Two column layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left - Text content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-sm font-medium text-primary">
                Powered by Spotify API
              </span>
            </div>

            {/* Heading */}
            <h1
              className={cn(
                "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold",
                "bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent",
                "leading-tight mb-6 animate-fade-in opacity-0"
              )}
              style={{ animationDelay: "0.1s", animationFillMode: "forwards", fontFamily: 'var(--font-display)' }}
            >
              <span className="text-balance">Discover Your Next Favorite Sound</span>
            </h1>

            {/* Subtitle */}
            <p
              className={cn(
                "text-lg sm:text-xl text-muted-foreground max-w-xl mb-8",
                "animate-fade-in opacity-0"
              )}
              style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
            >
              <span className="text-pretty">
                Search millions of tracks, explore artists, and curate your perfect
                playlist. Your musical journey starts here.
              </span>
            </p>

            {/* Sound waves animation */}
            <div
              className={cn(
                "flex justify-center lg:justify-start mb-8",
                "animate-fade-in opacity-0"
              )}
              style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
            >
              <SoundWaves />
            </div>

            {/* Stats */}
            <div
              className={cn(
                "flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8",
                "animate-fade-in opacity-0"
              )}
              style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
            >
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>100M+</div>
                <div className="text-sm text-muted-foreground">Tracks</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>11M+</div>
                <div className="text-sm text-muted-foreground">Artists</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>500M+</div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
            </div>
          </div>

          {/* Right - Animated vinyl */}
          <div
            className={cn(
              "flex-shrink-0 animate-fade-in opacity-0"
            )}
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            <AnimatedVinyl />
          </div>
        </div>
      </div>
    </div>
  );
}
