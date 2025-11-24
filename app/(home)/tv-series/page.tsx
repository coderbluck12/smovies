"use client";

import { useState, useEffect } from "react";
import { MovieData } from "@/lib/types/movieData.types";
import Navbar from "@/components/UI/Navbar";
import Footer from "@/components/UI/Footer";
import MovieDetailsShowcase from "@/components/UI/Home/movie-details";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTv, faChevronRight, faSpinner } from "@fortawesome/free-solid-svg-icons";

interface TVSeriesPageProps {}

const TVSeriesPage: React.FC<TVSeriesPageProps> = () => {
  const [series, setSeries] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTVSeries = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
        });

        const res = await fetch(`/api/discover/tv?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch TV series");

        const data = await res.json();
        const formattedSeries: MovieData[] = data.results.map((show: any) => ({
          id: show.id,
          title: show.name,
          original_language: show.original_language,
          overview: show.overview,
          backdrop_path: `https://image.tmdb.org/t/p/original${show.backdrop_path}`,
          poster_path: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
          vote_average: show.vote_average,
          genre_ids: show.genre_ids,
          release_date: new Date(show.first_air_date).getFullYear(),
        }));

        setSeries(formattedSeries);
      } catch (error) {
        console.error("Error fetching TV series:", error);
        setSeries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTVSeries();
  }, [currentPage]);

  return (
    <>
      <Navbar isTransparent="true" />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <FontAwesomeIcon icon={faTv} className="text-4xl text-white" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">TV Series</h1>
            </div>
            <p className="text-purple-100 text-lg">Discover the best TV series from around the world</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">
                Popular <span className="text-purple-500">Series</span>
              </h2>
              <p className="text-gray-400 mt-2">Binge-worthy shows and series</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-purple-500 cursor-pointer hover:text-purple-400 transition-colors">
              <span className="font-semibold">View All</span>
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </div>

          {/* Series Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <FontAwesomeIcon icon={faSpinner} className="text-4xl text-purple-500 animate-spin mb-4" />
                <p className="text-gray-400">Loading TV series...</p>
              </div>
            </div>
          ) : series.length > 0 ? (
            <>
              <div className="grid md:grid-cols-3 grid-cols-2 md:gap-20 sm:gap-16 gap-8 py-12">
                {series.map((show) => (
                  <MovieDetailsShowcase key={show.id} movie={show} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4 py-12">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  Previous
                </button>
                <span className="text-gray-400">
                  Page <span className="text-purple-500 font-bold">{currentPage}</span>
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No TV series found at the moment.</p>
            </div>
          )}
        </div>

        {/* Featured Section */}
        <div className="bg-gradient-to-r from-purple-900/50 to-purple-800/50 border-t border-purple-700/50 py-12 px-4 mt-12">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Why Watch TV Series?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 p-6 rounded-lg border border-purple-700/30 hover:border-purple-500/50 transition-colors">
                <div className="text-3xl text-purple-500 mb-3">📺</div>
                <h4 className="text-lg font-semibold text-white mb-2">Endless Entertainment</h4>
                <p className="text-gray-400">Multiple seasons and episodes to keep you entertained for hours</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg border border-purple-700/30 hover:border-purple-500/50 transition-colors">
                <div className="text-3xl text-purple-500 mb-3">🎬</div>
                <h4 className="text-lg font-semibold text-white mb-2">Quality Content</h4>
                <p className="text-gray-400">Award-winning shows from top production studios worldwide</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg border border-purple-700/30 hover:border-purple-500/50 transition-colors">
                <div className="text-3xl text-purple-500 mb-3">⭐</div>
                <h4 className="text-lg font-semibold text-white mb-2">Diverse Genres</h4>
                <p className="text-gray-400">Drama, comedy, thriller, fantasy, and much more to explore</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TVSeriesPage;
