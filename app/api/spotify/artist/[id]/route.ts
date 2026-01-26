import { NextRequest, NextResponse } from "next/server";
import { getArtist, getArtistTopTracks } from "@/lib/spotify";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const [artist, topTracks] = await Promise.all([
      getArtist(id),
      getArtistTopTracks(id),
    ]);

    return NextResponse.json({ artist, topTracks });
  } catch (error) {
    console.error("Artist fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch artist" },
      { status: 500 }
    );
  }
}
