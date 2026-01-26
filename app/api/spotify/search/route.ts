import { NextRequest, NextResponse } from "next/server";
import { searchSpotify } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const types = searchParams.get("types")?.split(",") as
    | ("track" | "artist" | "album")[]
    | undefined;
  const limit = parseInt(searchParams.get("limit") || "20");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  try {
    const results = await searchSpotify(query, types, limit);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Spotify search error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to search Spotify",
      },
      { status: 500 }
    );
  }
}
