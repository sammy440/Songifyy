"use client";

import { Music, Trash2, ExternalLink, ListMusic } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { SpotifyTrack } from "@/lib/spotify";
import { formatDuration, getImageUrl } from "@/lib/spotify";

interface CuratedSectionProps {
  tracks: SpotifyTrack[];
  onRemove: (trackId: string) => void;
  onClearAll: () => void;
}

export function CuratedSection({ tracks, onRemove, onClearAll }: CuratedSectionProps) {
  if (tracks.length === 0) {
    return (
      <section id="curated" className="py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-card mb-6">
            <ListMusic className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your Curated Collection</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Start building your personal collection by adding tracks from your search
            results. Click the + button on any track to add it here.
          </p>
        </div>
      </section>
    );
  }

  const totalDuration = tracks.reduce((acc, track) => acc + track.duration_ms, 0);

  return (
    <section id="curated" className="py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Music className="h-6 w-6 text-primary" />
            </div>
            Your Curated Collection
          </h2>
          <p className="text-muted-foreground mt-1">
            {tracks.length} track{tracks.length !== 1 ? "s" : ""} •{" "}
            {formatDuration(totalDuration)} total
          </p>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg",
            "bg-destructive/10 text-destructive hover:bg-destructive/20",
            "transition-colors duration-200"
          )}
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </button>
      </div>

      {/* Track list */}
      <div className="space-y-2">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={cn(
              "group flex items-center gap-4 p-4 rounded-xl",
              "bg-card/50 hover:bg-card border border-border/30",
              "transition-all duration-300",
              "opacity-0 animate-fade-in"
            )}
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: "forwards" }}
          >
            {/* Number */}
            <span className="w-6 text-center text-sm text-muted-foreground">
              {index + 1}
            </span>

            {/* Album art */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
              <Image
                src={getImageUrl(track.album.images, "small") || "/placeholder.svg"}
                alt={track.album.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Track info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">{track.name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {track.artists.map((a) => a.name).join(", ")}
              </p>
            </div>

            {/* Album name */}
            <span className="hidden md:block text-sm text-muted-foreground truncate max-w-[200px]">
              {track.album.name}
            </span>

            {/* Duration */}
            <span className="text-sm text-muted-foreground">
              {formatDuration(track.duration_ms)}
            </span>

            {/* Actions */}
            <div
              className={cn(
                "flex items-center gap-2",
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-200"
              )}
            >
              <a
                href={track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                title="Open in Spotify"
              >
                <ExternalLink className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={() => onRemove(track.id)}
                className="p-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                title="Remove from collection"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
