"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  ExternalLink,
  Users,
  Play,
  Pause,
  Disc3,
  Music2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SpotifyArtist, SpotifyTrack, SpotifyAlbum } from "@/lib/spotify";
import { formatDuration, getImageUrl } from "@/lib/spotify";

interface ArtistDetailModalProps {
  artistId: string | null;
  onClose: () => void;
  onTrackClick?: (track: SpotifyTrack) => void;
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

export function ArtistDetailModal({
  artistId,
  onClose,
  onTrackClick,
}: ArtistDetailModalProps) {
  const [artist, setArtist] = useState<SpotifyArtist | null>(null);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [activeTab, setActiveTab] = useState<"tracks" | "albums">("tracks");

  useEffect(() => {
    if (!artistId) return;

    const fetchArtistData = async () => {
      setIsLoading(true);
      try {
        const [artistRes, albumsRes] = await Promise.all([
          fetch(`/api/spotify/artist/${artistId}`),
          fetch(`/api/spotify/artist/${artistId}/albums`),
        ]);

        if (artistRes.ok) {
          const data = await artistRes.json();
          setArtist(data.artist);
          setTopTracks(data.topTracks || []);
        }

        if (albumsRes.ok) {
          const data = await albumsRes.json();
          setAlbums(data.albums || []);
        }
      } catch (error) {
        console.error("Failed to fetch artist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistData();
  }, [artistId]);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [audio]);

  const handlePlayTrack = (track: SpotifyTrack) => {
    if (!track.preview_url) return;

    if (playingTrackId === track.id && audio) {
      audio.pause();
      setPlayingTrackId(null);
    } else {
      if (audio) {
        audio.pause();
      }
      const newAudio = new Audio(track.preview_url);
      newAudio.volume = 0.5;
      newAudio.play();
      newAudio.onended = () => setPlayingTrackId(null);
      setAudio(newAudio);
      setPlayingTrackId(track.id);
    }
  };

  if (!artistId) return null;

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
          "relative w-full max-w-4xl max-h-[90vh] overflow-hidden",
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
        ) : artist ? (
          <div className="overflow-y-auto max-h-[90vh]">
            {/* Hero section */}
            <div className="relative h-64 sm:h-80">
              <Image
                src={getImageUrl(artist.images, "large") || "/placeholder.svg"}
                alt={artist.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

              {/* Artist info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-end gap-4">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-primary/50 shrink-0">
                    <Image
                      src={getImageUrl(artist.images, "medium") || "/placeholder.svg"}
                      alt={artist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl sm:text-4xl font-bold text-foreground truncate">
                      {artist.name}
                    </h2>
                    <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        <span>{formatFollowers(artist.followers.total)} followers</span>
                      </div>
                    </div>
                    {artist.genres.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {artist.genres.slice(0, 4).map((genre) => (
                          <span
                            key={genre}
                            className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm capitalize"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Tabs */}
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("tracks")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                    activeTab === "tracks"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  <Music2 className="h-4 w-4" />
                  Popular Tracks
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("albums")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                    activeTab === "albums"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  <Disc3 className="h-4 w-4" />
                  Discography
                </button>
              </div>

              {/* Top Tracks */}
              {activeTab === "tracks" && (
                <div className="space-y-2">
                  {topTracks.map((track, index) => (
                    <div
                      key={track.id}
                      className={cn(
                        "group flex items-center gap-4 p-3 rounded-xl",
                        "bg-secondary/30 hover:bg-secondary/50",
                        "transition-all duration-200 cursor-pointer"
                      )}
                      onClick={() => onTrackClick?.(track)}
                    >
                      <span className="w-6 text-center text-muted-foreground text-sm">
                        {index + 1}
                      </span>

                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={getImageUrl(track.album.images, "small") || "/placeholder.svg"}
                          alt={track.album.name}
                          fill
                          className="object-cover"
                        />
                        {track.preview_url && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayTrack(track);
                            }}
                            className={cn(
                              "absolute inset-0 flex items-center justify-center",
                              "bg-background/60 opacity-0 group-hover:opacity-100",
                              "transition-opacity"
                            )}
                          >
                            {playingTrackId === track.id ? (
                              <Pause className="h-5 w-5 text-primary fill-primary" />
                            ) : (
                              <Play className="h-5 w-5 text-primary fill-primary" />
                            )}
                          </button>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {track.name}
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {track.album.name}
                        </p>
                      </div>

                      <span className="text-sm text-muted-foreground">
                        {formatDuration(track.duration_ms)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Albums */}
              {activeTab === "albums" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {albums.map((album) => (
                    <a
                      key={album.id}
                      href={album.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                        <Image
                          src={getImageUrl(album.images, "medium") || "/placeholder.svg"}
                          alt={album.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors" />
                      </div>
                      <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {album.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {album.release_date.split("-")[0]} · {album.total_tracks} tracks
                      </p>
                    </a>
                  ))}
                </div>
              )}

              {/* Open in Spotify */}
              <div className="mt-8 pt-6 border-t border-border">
                <a
                  href={artist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 px-6 py-3 rounded-full",
                    "bg-primary text-primary-foreground font-medium",
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
            Artist not found
          </div>
        )}
      </div>
    </div>
  );
}
