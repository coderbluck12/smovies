import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const sortBy = searchParams.get("sortBy") || "release_date.asc";

    const token = process.env.NEXT_PUBLIC_TMDB_READ_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "TMDB token not configured" },
        { status: 500 }
      );
    }

    let url = `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${page}`;

    if (sortBy === "popularity.desc") {
      url += "&sort_by=popularity.desc";
    } else {
      url += "&sort_by=release_date.asc";
    }

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
    console.error("Error fetching upcoming movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch upcoming movies" },
      { status: 500 }
    );
  }
}
