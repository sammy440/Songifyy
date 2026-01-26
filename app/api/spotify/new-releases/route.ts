import { NextRequest, NextResponse } from "next/server";
import { getNewReleases } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "20");

  try {
    const releases = await getNewReleases(limit);
    return NextResponse.json({ albums: releases });
  } catch (error) {
    console.error("Spotify new releases error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to get new releases",
      },
      { status: 500 }
    );
  }
}
