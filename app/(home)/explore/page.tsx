"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MovieData } from "@/lib/types/movieData.types";
import Navbar from "@/components/UI/Navbar";
import Footer from "@/components/UI/Footer";
import MovieDetailsShowcase from "@/components/UI/Home/movie-details";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter, faFilm, faStar, faCalendar } from "@fortawesome/free-solid-svg-icons";

interface ExplorePageProps {}

const ExplorePage: React.FC<ExplorePageProps> = () => {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const genres = [
    { id: "all", name: "All Genres" },
    { id: "28", name: "Action" },
    { id: "12", name: "Adventure" },
    { id: "16", name: "Animation" },
    { id: "35", name: "Comedy" },
    { id: "80", name: "Crime" },
    { id: "99", name: "Documentary" },
    { id: "18", name: "Drama" },
    { id: "10751", name: "Family" },
    { id: "14", name: "Fantasy" },
    { id: "36", name: "History" },
    { id: "27", name: "Horror" },
    { id: "10402", name: "Music" },
    { id: "9648", name: "Mystery" },
    { id: "10749", name: "Romance" },
    { id: "878", name: "Science Fiction" },
    { id: "10770", name: "TV Movie" },
    { id: "53", name: "Thriller" },
    { id: "10752", name: "War" },
    { id: "37", name: "Western" },
  ];

  const router = useRouter();

  const handleViewDetails = (movieId: number | string) => {
    router.push(`/movies/${movieId}`);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          genre: selectedGenre,
        });

        const res = await fetch(`/api/discover/movies?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch movies");

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
          release_date: new Date(movie.release_date).getFullYear(),
        }));

        setMovies(formattedMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenre, currentPage]);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar isTransparent="true" />

      <div className="min-h-screen bg-gray-950">
      {/* Animated Hero Section with Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-purple-600 to-indigo-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6bTAgMjhjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMi0xMi01LjM3My0xMi0xMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4">
              <FontAwesomeIcon icon={faFilm} className="text-rose-300" />
              <span>Explore Movies</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              Discover Your Next
              <span className="block bg-gradient-to-r from-rose-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                Favorite Movie
              </span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Explore thousands of movies across all genres. Find hidden gems and timeless classics.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
        {/* Search and Filter Card */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 p-6 md:p-8 space-y-6 backdrop-blur-sm">
          {/* Search Bar */}
          <div className="relative group">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-rose-500 transition-colors text-lg"
            />
            <input
              type="text"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-800/50 text-white text-lg rounded-xl border-2 border-gray-700 focus:border-rose-500 focus:outline-none transition-all duration-200 placeholder:text-gray-500"
            />
          </div>

          {/* Genre Filter */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-rose-500 to-purple-600 rounded-lg">
                <FontAwesomeIcon icon={faFilter} className="text-white text-sm" />
              </div>
              <span className="text-white font-semibold text-lg">Filter by Genre</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => {
                    setSelectedGenre(genre.id);
                    setCurrentPage(1);
                  }}
                  className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${
                    selectedGenre === genre.id
                      ? "bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg shadow-rose-500/30 scale-105"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-8 mb-6">
          <p className="text-gray-400">
            Showing <span className="text-white font-semibold">{filteredMovies.length}</span> movies
          </p>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center space-y-4">
              <div className="inline-block w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 text-lg">Loading amazing movies...</p>
            </div>
          </div>
        ) : filteredMovies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-rose-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/10 hover:-translate-y-1"
                >
                  {/* Poster Image */}
                  <div className="relative h-96 overflow-hidden bg-gray-800">
                    <img
                      src={movie.poster_path}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full">
                      <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-sm" />
                      <span className="text-white font-bold text-sm">{movie.vote_average}</span>
                    </div>
                  </div>

                  {/* Movie Info */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                      {movie.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faCalendar} className="text-gray-500" />
                        <span>{movie.release_date}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                      {movie.overview}
                    </p>

                    {/* View Details Button */}
                    <button onClick={() => handleViewDetails(movie.id)} className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Pagination */}
            <div className="flex items-center justify-center gap-3 mt-16">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all border border-gray-700 disabled:border-gray-800"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                <span className="px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-lg font-bold shadow-lg shadow-rose-500/30">
                  {currentPage}
                </span>
              </div>
              
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-all border border-gray-700"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-32">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-6">
              <FontAwesomeIcon icon={faSearch} className="text-gray-600 text-3xl" />
            </div>
            <p className="text-gray-400 text-xl mb-2">No movies found</p>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>

      <Footer />
    </>
  );
};

export default ExplorePage;
