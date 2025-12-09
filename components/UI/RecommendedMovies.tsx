'use client'

import { useState, useEffect } from 'react';
import { MovieData } from '@/lib/types/movieData.types';
import MovieCard from '@/components/UI/MovieCard';

interface RecommendedMoviesProps {
  movieId: string | number;
  isCustom: boolean;
  title: string;
}

const RecommendedMovies: React.FC<RecommendedMoviesProps> = ({ movieId, isCustom, title }) => {
  const [recommendations, setRecommendations] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      let finalMovieId = movieId;

      if (isCustom) {
        try {
          const searchRes = await fetch(`/api/movie/search/${encodeURIComponent(title)}`);
          const searchData = await searchRes.json();
          const tmdbMovie = searchData.results.find((m: MovieData) => !m.id.toString().startsWith('custom'));
          if (tmdbMovie) {
            finalMovieId = tmdbMovie.id;
          }
        } catch (error) {
          console.error('Error finding TMDB match for custom movie:', error);
          setLoading(false);
          return;
        }
      }

      try {
        const res = await fetch(`/api/movie/${finalMovieId}/recommendations`);
        const data = await res.json();
        setRecommendations(data.results || []);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }

      setLoading(false);
    };

    fetchRecommendations();
  }, [movieId, isCustom, title]);

  if (loading) {
    return (
      <div className="py-4">
        <h2 className="text-3xl font-bold mb-6 text-white">Recommended Movies</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-gray-800 rounded-lg animate-pulse h-80"></div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="py-4">
      <h2 className="text-3xl font-bold mb-6 text-white">Recommended Movies</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {recommendations.slice(0, 10).map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedMovies;
