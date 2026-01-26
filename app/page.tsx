"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { SearchBar } from "@/components/search-bar";
import { SearchResults } from "@/components/search-results";
import { CuratedSection } from "@/components/curated-section";
import { ApiSetupBanner } from "@/components/api-setup-banner";
import { ArtistDetailModal } from "@/components/artist-detail-modal";
import { TrackDetailModal } from "@/components/track-detail-modal";
import type { SpotifySearchResults, SpotifyTrack } from "@/lib/spotify";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SpotifySearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [curatedTracks, setCuratedTracks] = useState<SpotifyTrack[]>([]);
  const [apiConfigured, setApiConfigured] = useState(true);
  const [showApiBanner, setShowApiBanner] = useState(false);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(searchQuery, 400);

  // Search Spotify when debounced query changes
  useEffect(() => {
    const searchSpotify = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults(null);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/spotify/search?q=${encodeURIComponent(debouncedQuery)}&types=track,artist,album&limit=20`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Search failed");
        }

        const data = await response.json();
        setSearchResults(data);
        setApiConfigured(true);
        setShowApiBanner(false);
      } catch (error) {
        console.error("Search error:", error);
        if (error instanceof Error && error.message.includes("credentials")) {
          setApiConfigured(false);
          setShowApiBanner(true);
        } else {
          toast.error("Search failed. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    searchSpotify();
  }, [debouncedQuery]);

  // Load curated tracks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("soundwave-curated");
    if (saved) {
      try {
        setCuratedTracks(JSON.parse(saved));
      } catch {
        // Invalid data, ignore
      }
    }
  }, []);

  // Save curated tracks to localStorage
  useEffect(() => {
    localStorage.setItem("soundwave-curated", JSON.stringify(curatedTracks));
  }, [curatedTracks]);

  const handleSearchClear = useCallback(() => {
    setSearchQuery("");
    setSearchResults(null);
  }, []);

  const handleCurate = useCallback((track: SpotifyTrack) => {
    setCuratedTracks((prev) => {
      if (prev.some((t) => t.id === track.id)) {
        return prev;
      }
      toast.success(`Added "${track.name}" to your collection`);
      return [...prev, track];
    });
  }, []);

  const handleRemove = useCallback((trackId: string) => {
    setCuratedTracks((prev) => {
      const track = prev.find((t) => t.id === trackId);
      if (track) {
        toast.info(`Removed "${track.name}" from your collection`);
      }
      return prev.filter((t) => t.id !== trackId);
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setCuratedTracks([]);
    toast.info("Cleared your collection");
  }, []);

  const handleSearchFocus = useCallback(() => {
    searchInputRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearchFocus={handleSearchFocus}
        curatedCount={curatedTracks.length}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Search Section */}
        <section className="py-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={handleSearchClear}
            isLoading={isLoading}
            inputRef={searchInputRef}
          />
        </section>

        {/* Search Results */}
        {(searchResults || isLoading) && (
          <SearchResults
            results={searchResults}
            curatedTracks={curatedTracks}
            onCurate={handleCurate}
            onRemove={handleRemove}
            isLoading={isLoading}
            searchQuery={searchQuery}
          />
        )}

        {/* Curated Collection */}
        <CuratedSection
          tracks={curatedTracks}
          onRemove={handleRemove}
          onClearAll={handleClearAll}
        />

        {/* Footer */}
        <footer className="py-12 border-t border-border/50 mt-16">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>Built with the Spotify API. Not affiliated with Spotify.</p>
            <div className="flex items-center gap-4">
              <a
                href="https://developer.spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Spotify for Developers
              </a>
            </div>
          </div>
        </footer>
      </main>

      {/* API Setup Banner */}
      <ApiSetupBanner show={showApiBanner && !apiConfigured} />
    </div>
  );
}
