const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/api/token";

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: {
    id: string;
    name: string;
    images: { url: string; width: number; height: number }[];
  };
  duration_ms: number;
  preview_url: string | null;
  external_urls: { spotify: string };
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: { url: string; width: number; height: number }[];
  genres: string[];
  followers: { total: number };
  external_urls: { spotify: string };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  images: { url: string; width: number; height: number }[];
  release_date: string;
  total_tracks: number;
  external_urls: { spotify: string };
}

export interface SpotifySearchResults {
  tracks?: { items: SpotifyTrack[] };
  artists?: { items: SpotifyArtist[] };
  albums?: { items: SpotifyAlbum[] };
}

let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Spotify API credentials not configured. Please add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to your environment variables."
    );
  }

  // Return cached token if still valid
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const response = await fetch(SPOTIFY_AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to authenticate with Spotify");
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error("Failed to get access token from Spotify");
  }

  const token = data.access_token as string;
  accessToken = token;
  tokenExpiry = Date.now() + data.expires_in * 1000 - 60000; // Refresh 1 minute early

  return token;
}

export async function searchSpotify(
  query: string,
  types: ("track" | "artist" | "album")[] = ["track", "artist", "album"],
  limit: number = 20
): Promise<SpotifySearchResults> {
  const token = await getAccessToken();

  const params = new URLSearchParams({
    q: query,
    type: types.join(","),
    limit: limit.toString(),
  });

  const response = await fetch(`${SPOTIFY_API_BASE}/search?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to search Spotify");
  }

  return response.json();
}

export async function getTrack(id: string): Promise<SpotifyTrack> {
  const token = await getAccessToken();

  const response = await fetch(`${SPOTIFY_API_BASE}/tracks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get track");
  }

  return response.json();
}

export async function getArtist(id: string): Promise<SpotifyArtist> {
  const token = await getAccessToken();

  const response = await fetch(`${SPOTIFY_API_BASE}/artists/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get artist");
  }

  return response.json();
}

export async function getArtistTopTracks(id: string): Promise<SpotifyTrack[]> {
  const token = await getAccessToken();

  const response = await fetch(
    `${SPOTIFY_API_BASE}/artists/${id}/top-tracks?market=US`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get artist top tracks");
  }

  const data = await response.json();
  return data.tracks;
}

export async function getArtistAlbums(id: string, limit: number = 20): Promise<SpotifyAlbum[]> {
  const token = await getAccessToken();

  const response = await fetch(
    `${SPOTIFY_API_BASE}/artists/${id}/albums?include_groups=album,single&market=US&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get artist albums");
  }

  const data = await response.json();
  return data.items;
}

export interface AudioFeatures {
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  duration_ms: number;
  time_signature: number;
}

export async function getTrackAudioFeatures(id: string): Promise<AudioFeatures> {
  const token = await getAccessToken();

  const response = await fetch(
    `${SPOTIFY_API_BASE}/audio-features/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get audio features");
  }

  return response.json();
}

export async function getNewReleases(limit: number = 20): Promise<SpotifyAlbum[]> {
  const token = await getAccessToken();

  const response = await fetch(
    `${SPOTIFY_API_BASE}/browse/new-releases?limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get new releases");
  }

  const data = await response.json();
  return data.albums.items;
}

export async function getFeaturedPlaylists(limit: number = 20) {
  const token = await getAccessToken();

  const response = await fetch(
    `${SPOTIFY_API_BASE}/browse/featured-playlists?limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get featured playlists");
  }

  const data = await response.json();
  return data.playlists.items;
}

export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function getImageUrl(
  images: { url: string; width: number; height: number }[],
  size: "small" | "medium" | "large" = "medium"
): string {
  if (!images || images.length === 0) {
    return "/placeholder-album.jpg";
  }

  const sizeMap = { small: 2, medium: 1, large: 0 };
  const index = Math.min(sizeMap[size], images.length - 1);
  return images[index]?.url || images[0].url;
}
