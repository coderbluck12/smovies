import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";

    const token = process.env.NEXT_PUBLIC_TMDB_READ_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "TMDB token not configured" },
        { status: 500 }
      );
    }

    const url = `https://api.themoviedb.org/3/discover/tv?language=en-US&page=${page}&sort_by=popularity.desc`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await fetch(url, options);

    if (!res.ok) {
      return NextResponse.json(
        { error: `TMDB API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching TV series:", error);
    return NextResponse.json(
      { error: "Failed to fetch TV series" },
      { status: 500 }
    );
  }
}
