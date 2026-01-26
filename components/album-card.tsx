"use client";

import { Play, ExternalLink } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { SpotifyAlbum } from "@/lib/spotify";
import { getImageUrl } from "@/lib/spotify";

interface AlbumCardProps {
  album: SpotifyAlbum;
  index?: number;
}

export function AlbumCard({ album, index = 0 }: AlbumCardProps) {
  return (
    <a
      href={album.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex flex-col p-4 rounded-2xl",
        "bg-card/50 hover:bg-card border border-transparent hover:border-border/50",
        "transition-all duration-300",
        "opacity-0 animate-slide-up"
      )}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
    >
      {/* Album art */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
        <Image
          src={getImageUrl(album.images, "medium") || "/placeholder.svg"}
          alt={album.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Play overlay */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "bg-background/40 backdrop-blur-sm",
            "opacity-0 group-hover:opacity-100",
            "transition-all duration-300"
          )}
        >
          <div
            className={cn(
              "p-4 rounded-full bg-primary text-primary-foreground",
              "transform translate-y-4 group-hover:translate-y-0",
              "transition-all duration-300 shadow-lg shadow-primary/25"
            )}
          >
            <Play className="h-6 w-6 fill-current" />
          </div>
        </div>

        {/* External link icon */}
        <div
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full",
            "bg-background/60 backdrop-blur-sm",
            "opacity-0 group-hover:opacity-100",
            "transition-opacity duration-200"
          )}
        >
          <ExternalLink className="h-4 w-4" />
        </div>
      </div>

      {/* Album info */}
      <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
        {album.name}
      </h3>
      <p className="text-sm text-muted-foreground truncate mt-1">
        {album.artists.map((a) => a.name).join(", ")}
      </p>
      <p className="text-xs text-muted-foreground/70 mt-1">
        {new Date(album.release_date).getFullYear()} • {album.total_tracks} tracks
      </p>
    </a>
  );
}
