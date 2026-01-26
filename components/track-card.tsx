"use client";

import { Play, Pause, Plus, Check, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SpotifyTrack } from "@/lib/spotify";
import { formatDuration, getImageUrl } from "@/lib/spotify";

interface TrackCardProps {
  track: SpotifyTrack;
  isCurated?: boolean;
  onCurate?: (track: SpotifyTrack) => void;
  onRemove?: (trackId: string) => void;
  onClick?: (trackId: string) => void;
  index?: number;
}

export function TrackCard({
  track,
  isCurated = false,
  onCurate,
  onRemove,
  onClick,
  index = 0,
}: TrackCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handlePlayPause = () => {
    if (!track.preview_url) return;

    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio) {
        audio.play();
      } else {
        const newAudio = new Audio(track.preview_url);
        newAudio.volume = 0.5;
        newAudio.play();
        newAudio.onended = () => setIsPlaying(false);
        setAudio(newAudio);
      }
      setIsPlaying(true);
    }
  };

  const handleCurate = () => {
    if (isCurated && onRemove) {
      onRemove(track.id);
    } else if (onCurate) {
      onCurate(track);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 p-3 rounded-xl",
        "bg-card/50 hover:bg-card border border-transparent hover:border-border/50",
        "transition-all duration-300 cursor-pointer",
        "opacity-0 animate-fade-in"
      )}
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "forwards" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(track.id)}
    >
      {/* Album art with play button */}
      <div className="relative shrink-0">
        <div
          className={cn(
            "relative w-14 h-14 rounded-lg overflow-hidden",
            "ring-2 ring-transparent group-hover:ring-primary/30",
            "transition-all duration-300"
          )}
        >
          <Image
            src={getImageUrl(track.album.images, "small") || "/placeholder.svg"}
            alt={track.album.name}
            fill
            className="object-cover"
          />

          {/* Play overlay */}
          {track.preview_url && (
            <button
              type="button"
              onClick={handlePlayPause}
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                "bg-background/60 backdrop-blur-sm",
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-200"
              )}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-primary fill-primary" />
              ) : (
                <Play className="h-6 w-6 text-primary fill-primary" />
              )}
            </button>
          )}
        </div>

        {/* Playing indicator */}
        {isPlaying && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-end gap-0.5">
            <div className="w-1 bg-primary rounded-full animate-equalizer" />
            <div
              className="w-1 bg-primary rounded-full animate-equalizer"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-1 bg-primary rounded-full animate-equalizer"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        )}
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {track.name}
        </h3>
        <p className="text-sm text-muted-foreground truncate">
          {track.artists.map((a) => a.name).join(", ")}
        </p>
      </div>

      {/* Duration */}
      <span className="text-sm text-muted-foreground hidden sm:block">
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
        <button
          type="button"
          onClick={handleCurate}
          className={cn(
            "p-2 rounded-full",
            isCurated
              ? "bg-primary text-primary-foreground"
              : "bg-secondary hover:bg-primary hover:text-primary-foreground",
            "transition-all duration-200"
          )}
          title={isCurated ? "Remove from curated" : "Add to curated"}
        >
          {isCurated ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>

        <a
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "p-2 rounded-full",
            "bg-secondary hover:bg-secondary/80",
            "transition-colors duration-200"
          )}
          title="Open in Spotify"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
