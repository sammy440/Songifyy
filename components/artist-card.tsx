"use client";

import { Users, Eye } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { SpotifyArtist } from "@/lib/spotify";
import { getImageUrl } from "@/lib/spotify";

interface ArtistCardProps {
  artist: SpotifyArtist;
  index?: number;
  onClick?: (artistId: string) => void;
}

function formatFollowers(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }
  return count.toString();
}

export function ArtistCard({ artist, index = 0, onClick }: ArtistCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(artist.id)}
      className={cn(
        "group relative flex flex-col items-center p-6 rounded-2xl w-full",
        "bg-card/50 hover:bg-card border border-transparent hover:border-border/50",
        "transition-all duration-300",
        "opacity-0 animate-slide-up"
      )}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
    >
      {/* Artist image */}
      <div className="relative mb-4">
        <div
          className={cn(
            "relative w-32 h-32 rounded-full overflow-hidden",
            "ring-4 ring-border/50 group-hover:ring-primary/50",
            "transition-all duration-300"
          )}
        >
          <Image
            src={getImageUrl(artist.images, "medium") || "/placeholder.svg"}
            alt={artist.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Glow effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-primary/0 group-hover:bg-primary/20",
            "blur-xl transition-all duration-500"
          )}
        />

        {/* External link */}
        <div
          className={cn(
            "absolute -bottom-2 -right-2 p-2 rounded-full",
            "bg-primary text-primary-foreground",
            "opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100",
            "transition-all duration-300 shadow-lg"
          )}
        >
          <Eye className="h-4 w-4" />
        </div>
      </div>

      {/* Artist info */}
      <h3 className="font-semibold text-foreground text-center group-hover:text-primary transition-colors">
        {artist.name}
      </h3>

      {/* Followers */}
      <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
        <Users className="h-3.5 w-3.5" />
        <span>{formatFollowers(artist.followers.total)} followers</span>
      </div>

      {/* Genres */}
      {artist.genres.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          {artist.genres.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="px-2 py-0.5 rounded-full bg-secondary text-xs text-muted-foreground capitalize"
            >
              {genre}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
