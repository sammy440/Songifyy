"use client";

import { Music2, Disc3, User, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SpotifySearchResults, SpotifyTrack } from "@/lib/spotify";
import { TrackCard } from "./track-card";
import { AlbumCard } from "./album-card";
import { ArtistCard } from "./artist-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SearchResultsProps {
  results: SpotifySearchResults | null;
  curatedTracks: SpotifyTrack[];
  onCurate: (track: SpotifyTrack) => void;
  onRemove: (trackId: string) => void;
  onTrackClick: (trackId: string) => void;
  onArtistClick: (artistId: string) => void;
  isLoading: boolean;
  searchQuery: string;
}

export function SearchResults({
  results,
  curatedTracks,
  onCurate,
  onRemove,
  onTrackClick,
  onArtistClick,
  isLoading,
  searchQuery,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          </div>
          <p className="text-muted-foreground animate-pulse">
            Searching for &quot;{searchQuery}&quot;...
          </p>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const hasResults =
    (results.tracks?.items.length ?? 0) > 0 ||
    (results.artists?.items.length ?? 0) > 0 ||
    (results.albums?.items.length ?? 0) > 0;

  if (!hasResults) {
    return (
      <div className="py-16">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="p-4 rounded-full bg-muted">
            <SearchX className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No results found</h3>
          <p className="text-muted-foreground max-w-md">
            We couldn&apos;t find anything for &quot;{searchQuery}&quot;. Try
            different keywords or check your spelling.
          </p>
        </div>
      </div>
    );
  }

  const trackCount = results.tracks?.items.length ?? 0;
  const artistCount = results.artists?.items.length ?? 0;
  const albumCount = results.albums?.items.length ?? 0;

  return (
    <div className="py-8 animate-fade-in">
      <Tabs defaultValue="tracks" className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-8 bg-card/50 p-1 rounded-full">
          <TabsTrigger
            value="tracks"
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-full",
              "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            )}
          >
            <Music2 className="h-4 w-4" />
            <span>Tracks</span>
            <span className="text-xs opacity-70">({trackCount})</span>
          </TabsTrigger>
          <TabsTrigger
            value="artists"
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-full",
              "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            )}
          >
            <User className="h-4 w-4" />
            <span>Artists</span>
            <span className="text-xs opacity-70">({artistCount})</span>
          </TabsTrigger>
          <TabsTrigger
            value="albums"
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-full",
              "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            )}
          >
            <Disc3 className="h-4 w-4" />
            <span>Albums</span>
            <span className="text-xs opacity-70">({albumCount})</span>
          </TabsTrigger>
        </TabsList>

        {/* Tracks */}
        <TabsContent value="tracks" className="mt-0">
          {trackCount > 0 ? (
            <div className="space-y-2">
              {results.tracks?.items.map((track, index) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  index={index}
                  isCurated={curatedTracks.some((t) => t.id === track.id)}
                  onCurate={onCurate}
                  onRemove={onRemove}
                  onClick={onTrackClick}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No tracks found
            </p>
          )}
        </TabsContent>

        {/* Artists */}
        <TabsContent value="artists" className="mt-0">
          {artistCount > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.artists?.items.map((artist, index) => (
                <ArtistCard key={artist.id} artist={artist} index={index} onClick={onArtistClick} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No artists found
            </p>
          )}
        </TabsContent>

        {/* Albums */}
        <TabsContent value="albums" className="mt-0">
          {albumCount > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.albums?.items.map((album, index) => (
                <AlbumCard key={album.id} album={album} index={index} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No albums found
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
