import Link from 'next/link';
import Image from 'next/image';
import { MovieData } from '@/lib/types/movieData.types';

interface MovieCardProps {
  movie: MovieData & { isCustom?: boolean };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const imageUrl = movie.isCustom && movie.poster_path 
    ? movie.poster_path 
    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="bg-gray-800 rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 shadow-lg group">
        <div className="relative h-80">
          <Image 
            src={imageUrl}
            alt={movie.title} 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
        </div>
        <div className="p-4">
          <h3 className="text-white text-lg font-bold truncate group-hover:text-rose-400 transition-colors duration-300">{movie.title}</h3>
          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-400 text-sm">
              {new Date(movie.release_date).getFullYear()}
            </p>
            <p className="text-yellow-400 font-bold text-sm">
              {movie.vote_average.toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
