"use client";

import { useState, useEffect } from "react";
import { MovieData } from "@/lib/types/movieData.types";
import Navbar from "@/components/UI/Navbar";
import Footer from "@/components/UI/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTv, faPlay, faStar, faCrown, faEye, faTrophy, faHeart } from "@fortawesome/free-solid-svg-icons";

interface TVSeriesPageProps {}

const TVSeriesPage: React.FC<TVSeriesPageProps> = () => {
  const [series, setSeries] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const featuredShow = series[0];

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

      <div className="min-h-screen bg-gray-950">
      {/* Hero Section with Featured Show */}
      <div className="relative h-[85vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={featuredShow.backdrop_path}
            alt={featuredShow.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/95 to-gray-950/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-center h-full max-w-2xl space-y-6 pt-20">
            {/* TV Badge */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full">
                <FontAwesomeIcon icon={faTv} className="text-purple-400" />
                <span className="text-purple-300 font-semibold text-sm">TV Series</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full">
                <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />
                <span className="text-yellow-300 font-semibold text-sm">Award Winner</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-8xl font-bold text-white leading-tight">
              {featuredShow.title}
            </h1>

            {/* Meta Info */}
            <div className="flex items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                <span className="font-bold text-white">{featuredShow.vote_average}</span>
                <span className="text-gray-400">Rating</span>
              </div>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <span>{featuredShow.release_date}</span>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <span>5 Seasons</span>
            </div>

            {/* Overview */}
            <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
              {featuredShow.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <button className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105">
                <FontAwesomeIcon icon={faPlay} className="group-hover:scale-110 transition-transform" />
                <span>Start Watching</span>
              </button>
              <button className="group flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/20 hover:border-white/40 transition-all duration-200">
                <FontAwesomeIcon icon={faHeart} className="group-hover:scale-110 transition-transform" />
                <span>Add to List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Trending Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                <h2 className="text-4xl font-bold text-white">
                  Trending <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">Shows</span>
                </h2>
              </div>
              <p className="text-gray-400 ml-4">Most popular series this week</p>
            </div>
          </div>

          {/* Horizontal Scroll */}
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {series.slice(0, 6).map((show, index) => (
              <div
                key={show.id}
                className="group relative flex-shrink-0 w-80 bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                {/* Rank Badge */}
                {index < 3 && (
                  <div className="absolute top-4 left-4 z-10 flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>
                )}

                <div className="flex gap-4 p-4">
                  {/* Poster */}
                  <div className="relative w-32 h-48 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                    <img
                      src={show.poster_path}
                      alt={show.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faPlay} className="text-white ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                        {show.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                        {show.overview}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-sm" />
                        <span className="text-white font-bold">{show.vote_average}</span>
                      </div>
                      <div className="text-gray-500 text-sm">{show.release_date}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Series Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                <h2 className="text-4xl font-bold text-white">
                  Popular <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">Series</span>
                </h2>
              </div>
              <p className="text-gray-400 ml-4">Binge-worthy shows everyone&apos;s watching</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center space-y-4">
                <div className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-lg">Loading series...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {series.map((show, index) => (
                  <div
                    key={show.id}
                    className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2"
                  >
                    {/* Top Rated Badge */}
                    {show.vote_average >= 9.0 && (
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg">
                        <FontAwesomeIcon icon={faCrown} className="text-white text-xs" />
                        <span className="text-white font-bold text-xs">Top Rated</span>
                      </div>
                    )}

                    {/* Poster Image */}
                    <div className="relative aspect-[2/3] overflow-hidden bg-gray-800">
                      <img
                        src={show.poster_path}
                        alt={show.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/80 backdrop-blur-sm rounded-full">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xs" />
                        <span className="text-white font-bold text-xs">{show.vote_average}</span>
                      </div>

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-600 transition-colors cursor-pointer hover:scale-110 transform duration-200">
                          <FontAwesomeIcon icon={faPlay} className="text-white ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* Show Info */}
                    <div className="p-4 space-y-2">
                      <h3 className="text-white font-bold text-sm line-clamp-2 group-hover:text-purple-400 transition-colors leading-tight">
                        {show.title}
                      </h3>
                      <p className="text-gray-500 text-xs">{show.release_date}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all border border-gray-700 disabled:border-gray-800"
                >
                  Previous
                </button>
                <span className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-bold shadow-lg shadow-purple-500/30">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-all border border-gray-700"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-y border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-3">Why Choose TV Series?</h3>
            <p className="text-gray-400 text-lg">Endless entertainment at your fingertips</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: faTv,
                title: "Endless Entertainment",
                description: "Multiple seasons and episodes to keep you hooked for hours",
                gradient: "from-purple-500 to-pink-600"
              },
              {
                icon: faTrophy,
                title: "Award-Winning Content",
                description: "Emmy and Golden Globe winning shows from top studios",
                gradient: "from-yellow-400 to-orange-500"
              },
              {
                icon: faEye,
                title: "Diverse Genres",
                description: "Drama, comedy, thriller, sci-fi, fantasy, and much more",
                gradient: "from-blue-500 to-cyan-600"
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <FontAwesomeIcon icon={item.icon} className="text-white text-2xl" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMTZjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMi0xMi01LjM3My0xMi0xMnptMCAyOGMwLTYuNjI3IDUuMzczLTEyIDEyLTEyczEyIDUuMzczIDEyIDEyLTUuMzczIDEyLTEyIDEyLTEyLTUuMzczLTEyLTEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
          
          <div className="relative space-y-6 max-w-2xl mx-auto">
            <h3 className="text-4xl font-bold text-white">Start Your Binge Session</h3>
            <p className="text-purple-100 text-lg">
              Discover thousands of series across all genres. From gripping dramas to hilarious comedies.
            </p>
            <button className="px-8 py-4 bg-white hover:bg-gray-100 text-purple-600 font-bold rounded-xl transition-all duration-200 shadow-lg hover:scale-105">
              Browse All Series
            </button>
          </div>
        </div>
      </div>
    </div>

      <Footer />
    </>
  );
};

export default TVSeriesPage;
