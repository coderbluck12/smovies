import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/configs/firebase-admin";

export async function GET(_: any, { params }: { params: any }) {
  const { movieTitle } = params;

  try {
    // Fetch from TMDB API
    const getMovies = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&query=${movieTitle}`
    );
    
    let tmdbResults = [];
    if (getMovies.ok) {
      const moviesData = await getMovies.json();
      tmdbResults = moviesData.results || [];
    }

    // Fetch custom movies from Firestore
    const customMoviesSnapshot = await adminDb
      .collection("customMovies")
      .get();
    
    const customMovies = customMoviesSnapshot.docs
      .map((doc) => ({
        id: doc.data().id,
        title: doc.data().title,
        overview: doc.data().overview,
        backdrop_path: doc.data().backdrop_path,
        poster_path: doc.data().poster_path,
        release_date: doc.data().release_date,
        vote_average: doc.data().vote_average,
        isCustom: true,
      }))
      .filter((movie) =>
        movie.title.toLowerCase().includes(movieTitle.toLowerCase())
      );

    // Fetch custom series from Firestore
    const customSeriesSnapshot = await adminDb
      .collection("customSeries")
      .get();
    
    const customSeries = customSeriesSnapshot.docs
      .map((doc) => ({
        id: doc.data().id,
        title: doc.data().title,
        overview: doc.data().overview,
        backdrop_path: doc.data().backdrop_path,
        poster_path: doc.data().poster_path,
        release_date: doc.data().release_date,
        vote_average: doc.data().vote_average,
        isCustom: true,
        isSeries: true,
      }))
      .filter((series) =>
        series.title.toLowerCase().includes(movieTitle.toLowerCase())
      );

    // Combine all results
    const allResults = [...tmdbResults, ...customMovies, ...customSeries];

    return NextResponse.json({
      results: allResults,
      total_results: allResults.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { results: [], error: "Search failed" },
      { status: 500 }
    );
  }
}
