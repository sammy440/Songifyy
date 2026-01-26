"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  ExternalLink,
  Play,
  Pause,
  Plus,
  Check,
  User,
  Disc3,
  Clock,
  Music2,
  Loader2,
  Zap,
  Heart,
  Mic2,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SpotifyTrack, SpotifyArtist, AudioFeatures } from "@/lib/spotify";
import { formatDuration, getImageUrl } from "@/lib/spotify";

interface TrackDetailModalProps {
  trackId: string | null;
  onClose: () => void;
  onArtistClick?: (artistId: string) => void;
  isCurated?: boolean;
  onCurate?: (track: SpotifyTrack) => void;
  onRemove?: (trackId: string) => void;
}

const keyNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function FeatureBar({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Zap }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          <span>{label}</span>
        </div>
        <span className="text-foreground font-medium">{Math.round(value * 100)}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full transition-all duration-500"
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );
}

export function TrackDetailModal({
  trackId,
  onClose,
  onArtistClick,
  isCurated = false,
  onCurate,
  onRemove,
}: TrackDetailModalProps) {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [artistDetails, setArtistDetails] = useState<SpotifyArtist | null>(null);
  const [audioFeatures, setAudioFeatures] = useState<AudioFeatures | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!trackId) return;

    const fetchTrackData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/spotify/track/${trackId}`);
        if (response.ok) {
          const data = await response.json();
          setTrack(data.track);
          setArtistDetails(data.artistDetails);
          setAudioFeatures(data.audioFeatures);
        }
      } catch (error) {
        console.error("Failed to fetch track:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrackData();
  }, [trackId]);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [audio]);

  const handlePlayPause = () => {
    if (!track?.preview_url) return;

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
    if (!track) return;
    if (isCurated && onRemove) {
      onRemove(track.id);
    } else if (onCurate) {
      onCurate(track);
    }
  };

  if (!trackId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md animate-fade-in" />

      {/* Modal */}
      <div
        className={cn(
          "relative w-full max-w-2xl max-h-[90vh] overflow-hidden",
          "bg-card border border-border rounded-2xl shadow-2xl",
          "animate-slide-up"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/50 hover:bg-background transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : track ? (
          <div className="overflow-y-auto max-h-[90vh]">
            {/* Album art hero */}
            <div className="relative aspect-video sm:aspect-[2/1]">
              <Image
                src={getImageUrl(track.album.images, "large") || "/placeholder.svg"}
                alt={track.album.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />

              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                {track.preview_url && (
                  <button
                    type="button"
                    onClick={handlePlayPause}
                    className={cn(
                      "w-20 h-20 rounded-full flex items-center justify-center",
                      "bg-primary text-primary-foreground",
                      "hover:scale-105 transition-transform",
                      "shadow-xl shadow-primary/30",
                      isPlaying && "animate-pulse-glow"
                    )}
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8 fill-current" />
                    ) : (
                      <Play className="h-8 w-8 fill-current ml-1" />
                    )}
                  </button>
                )}
              </div>

              {/* Track info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {track.name}
                </h2>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  {track.artists.map((artist, i) => (
                    <span key={artist.id}>
                      <button
                        type="button"
                        onClick={() => onArtistClick?.(artist.id)}
                        className="hover:text-primary transition-colors"
                      >
                        {artist.name}
                      </button>
                      {i < track.artists.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Track details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                  <Disc3 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Album</p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {track.album.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDuration(track.duration_ms)}
                    </p>
                  </div>
                </div>
                {audioFeatures && (
                  <>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                      <Music2 className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Key</p>
                        <p className="text-sm font-medium text-foreground">
                          {keyNames[audioFeatures.key]} {audioFeatures.mode === 1 ? "Major" : "Minor"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                      <Zap className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Tempo</p>
                        <p className="text-sm font-medium text-foreground">
                          {Math.round(audioFeatures.tempo)} BPM
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Audio features */}
              {audioFeatures && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Audio Analysis</h3>
                  <div className="grid gap-3">
                    <FeatureBar label="Energy" value={audioFeatures.energy} icon={Zap} />
                    <FeatureBar label="Danceability" value={audioFeatures.danceability} icon={Heart} />
                    <FeatureBar label="Acousticness" value={audioFeatures.acousticness} icon={Mic2} />
                    <FeatureBar label="Liveness" value={audioFeatures.liveness} icon={Volume2} />
                    <FeatureBar label="Valence" value={audioFeatures.valence} icon={Heart} />
                  </div>
                </div>
              )}

              {/* Artist preview */}
              {artistDetails && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Artist</h3>
                  <button
                    type="button"
                    onClick={() => onArtistClick?.(artistDetails.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl",
                      "bg-secondary/30 hover:bg-secondary/50",
                      "transition-colors text-left group"
                    )}
                  >
                    <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={getImageUrl(artistDetails.images, "small") || "/placeholder.svg"}
                        alt={artistDetails.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {artistDetails.name}
                      </h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        {(artistDetails.followers.total / 1_000_000).toFixed(1)}M followers
                      </p>
                    </div>
                    <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleCurate}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-full font-medium",
                    "transition-colors",
                    isCurated
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {isCurated ? (
                    <>
                      <Check className="h-4 w-4" />
                      In Your Collection
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add to Collection
                    </>
                  )}
                </button>

                <a
                  href={track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-full font-medium",
                    "bg-primary text-primary-foreground",
                    "hover:opacity-90 transition-opacity"
                  )}
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in Spotify
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            Track not found
          </div>
        )}
      </div>
    </div>
  );
}
