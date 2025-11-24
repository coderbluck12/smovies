"use client";

import { useState, useEffect } from "react";
import { MovieData } from "@/lib/types/movieData.types";
import Navbar from "@/components/UI/Navbar";
import Footer from "@/components/UI/Footer";
import MovieDetailsShowcase from "@/components/UI/Home/movie-details";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faClock, faStar, faBell, faTicket, faArrowTrendUp, faFire } from "@fortawesome/free-solid-svg-icons";

interface UpcomingPageProps {}

const UpcomingPage: React.FC<UpcomingPageProps> = () => {
  const [upcomingMovies, setUpcomingMovies] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"date" | "popularity">("date");

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          sortBy: sortBy === "date" ? "release_date.asc" : "popularity.desc",
        });

        const res = await fetch(`/api/discover/upcoming?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch upcoming movies");

        const data = await res.json();
        const formattedMovies: MovieData[] = data.results.map((movie: MovieData) => ({
          id: movie.id,
          title: movie.title,
          original_language: movie.original_language,
          overview: movie.overview,
          backdrop_path: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
          poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          vote_average: movie.vote_average,
          genre_ids: movie.genre_ids,
          release_date: movie.release_date,
        }));

        setUpcomingMovies(formattedMovies);
      } catch (error) {
        console.error("Error fetching upcoming movies:", error);
        setUpcomingMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMovies();
  }, [currentPage, sortBy]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const releaseDate = new Date(dateString);
    const diffTime = releaseDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getMonthName = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short" });
  };

  const getDay = (dateString: string) => {
    return new Date(dateString).getDate();
  };

  return (
    <>
      <Navbar isTransparent="true" />

      <div className="min-h-screen bg-gray-950">
      {/* Hero Section with Cinematic Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6bTAgMjhjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMi0xMi01LjM3My0xMi0xMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4">
              <FontAwesomeIcon icon={faTicket} className="text-amber-300" />
              <span>Coming to Theaters</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              Upcoming
              <span className="block bg-gradient-to-r from-amber-200 via-yellow-200 to-orange-200 bg-clip-text text-transparent">
                Blockbusters
              </span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Be the first to know about the most anticipated movies coming soon
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
        {/* Control Panel */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 p-6 md:p-8 mb-12 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></div>
                Most Anticipated
              </h2>
              <p className="text-gray-400 ml-4">Mark your calendars for these upcoming releases</p>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 bg-gray-800/50 p-1.5 rounded-xl border border-gray-700">
              <button
                onClick={() => {
                  setSortBy("date");
                  setCurrentPage(1);
                }}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  sortBy === "date"
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <FontAwesomeIcon icon={faCalendarDays} className="mr-2" />
                Release Date
              </button>
              <button
                onClick={() => {
                  setSortBy("popularity");
                  setCurrentPage(1);
                }}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  sortBy === "popularity"
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <FontAwesomeIcon icon={faArrowTrendUp} className="mr-2" />
                Popularity
              </button>
            </div>
          </div>
        </div>

        {/* Featured Next Release */}
        {upcomingMovies.length > 0 && (
          <div className="mb-12">
            <div className="relative group bg-gray-900 rounded-2xl overflow-hidden border border-amber-500/30 hover:border-amber-500/60 transition-all duration-300 shadow-2xl">
              <div className="absolute top-4 left-4 z-10">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-lg">
                  <FontAwesomeIcon icon={faFire} className="text-white animate-pulse" />
                  <span className="text-white font-bold text-sm">Next Big Release</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 p-8">
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src={upcomingMovies[0].poster_path}
                    alt={upcomingMovies[0].title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col justify-center space-y-6">
                  <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                    {upcomingMovies[0].title}
                  </h3>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                      <span className="text-2xl font-bold text-white">{upcomingMovies[0].vote_average}</span>
                      <span className="text-gray-400">Expected Rating</span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-lg leading-relaxed">
                    {upcomingMovies[0].overview}
                  </p>

                  <div className="flex items-center gap-4 p-6 bg-amber-500/10 rounded-xl border border-amber-500/30">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex flex-col items-center justify-center shadow-lg">
                      <span className="text-xs text-amber-100 font-semibold uppercase">
                        {getMonthName(upcomingMovies[0].release_date)}
                      </span>
                      <span className="text-2xl font-bold text-white">
                        {getDay(upcomingMovies[0].release_date)}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">
                        {formatDate(upcomingMovies[0].release_date)}
                      </p>
                      <p className="text-amber-400 font-semibold">
                        {getDaysUntil(upcomingMovies[0].release_date)} days to go
                      </p>
                    </div>
                  </div>

                  <button className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-amber-500/50 hover:scale-105">
                    <FontAwesomeIcon icon={faBell} />
                    <span>Remind Me</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Cards */}
        <div className="mb-12 space-y-4">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <FontAwesomeIcon icon={faClock} className="text-amber-500" />
            Release Timeline
          </h3>
          
          <div className="grid gap-4">
            {upcomingMovies.slice(1, 4).map((movie, index) => (
              <div
                key={movie.id}
                className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10"
              >
                <div className="flex items-center gap-6 p-5">
                  {/* Calendar Icon */}
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex flex-col items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-xs text-amber-100 font-semibold uppercase">
                      {getMonthName(movie.release_date)}
                    </span>
                    <span className="text-3xl font-bold text-white">
                      {getDay(movie.release_date)}
                    </span>
                  </div>

                  {/* Movie Info */}
                  <div className="flex-grow">
                    <h4 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
                      {movie.title}
                    </h4>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-1">{movie.overview}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-amber-400 font-semibold flex items-center gap-2">
                        <FontAwesomeIcon icon={faClock} />
                        {getDaysUntil(movie.release_date)} days away
                      </span>
                      <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xs" />
                        <span className="text-white font-semibold">{movie.vote_average}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rank Badge */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border-2 border-amber-500/30 font-bold text-amber-500 text-lg">
                    #{index + 2}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Upcoming Movies Grid */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></div>
            All Upcoming Releases
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center space-y-4">
                <div className="inline-block w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-lg">Loading upcoming movies...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {upcomingMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-2"
                  >
                    {/* Poster */}
                    <div className="relative aspect-[2/3] overflow-hidden bg-gray-800">
                      <img
                        src={movie.poster_path}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      {/* Days Until Badge */}
                      <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-white text-xs font-bold shadow-lg">
                        {getDaysUntil(movie.release_date)}d
                      </div>

                      {/* Rating */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-black/80 backdrop-blur-sm rounded-full">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xs" />
                        <span className="text-white font-bold text-xs">{movie.vote_average}</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-2">
                      <h4 className="text-white font-bold text-sm line-clamp-2 group-hover:text-amber-400 transition-colors leading-tight">
                        {movie.title}
                      </h4>
                      <p className="text-amber-500 text-xs font-semibold">
                        {formatDate(movie.release_date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all border border-gray-700"
                >
                  Previous
                </button>
                <span className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-bold shadow-lg">
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

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-y border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-4">
              <FontAwesomeIcon icon={faBell} className="text-white text-2xl" />
            </div>
            <h3 className="text-3xl font-bold text-white">Never Miss a Release</h3>
            <p className="text-gray-400 text-lg">
              Get notified about upcoming blockbusters and be the first to book tickets for the most anticipated movies
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-amber-500/50 hover:scale-105">
              Enable Notifications
            </button>
          </div>
        </div>
      </div>
    </div>

      <Footer />
    </>
  );
};

export default UpcomingPage;
