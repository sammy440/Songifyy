import { NextRequest, NextResponse } from "next/server";
import { getArtistAlbums } from "@/lib/spotify";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const albums = await getArtistAlbums(id);
    return NextResponse.json({ albums });
  } catch (error) {
    console.error("Artist albums fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch albums" },
      { status: 500 }
    );
  }
}
