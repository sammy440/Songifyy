import { NextRequest, NextResponse } from "next/server";
import { getTrack, getTrackAudioFeatures, getArtist } from "@/lib/spotify";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const track = await getTrack(id);
    
    // Get artist details for the primary artist
    const artistDetails = await getArtist(track.artists[0].id);
    
    // Try to get audio features (may fail for some tracks)
    let audioFeatures = null;
    try {
      audioFeatures = await getTrackAudioFeatures(id);
    } catch {
      // Audio features not available for this track
    }

    return NextResponse.json({ track, artistDetails, audioFeatures });
  } catch (error) {
    console.error("Track fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch track" },
      { status: 500 }
    );
  }
}
