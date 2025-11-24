import { MovieData } from "@/lib/types/movieData.types";
import { faFilm, faMagic, faPlayCircle, faStar, faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import DownloadLinksSection from "@/components/UI/DownloadLinksSection";

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: any }) {
  const { movieId } = params;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.READ_ACCESS_TOKEN}`,
    },
  };

  const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options);
  if (!res.ok) return {};

  const movieData: MovieData = await res.json();

  return {
    title: `${movieData.title} (${new Date(movieData.release_date).getFullYear()}) - MovieMex`,
    description: movieData.overview,
  };
}

const getMovieDetails = async (params: any) => {
  const { movieId } = params;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.READ_ACCESS_TOKEN}`,
    },
    next: { revalidate: 300 },
  };

  const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options);
  return response.json();
};

const MainMovieDetails = async ({ params }: { params: any }) => {
  const movieDetails: any = await getMovieDetails(params);

  const formateDate = (date: string) => {
    const formDate = new Date(date);
    const day = formDate.getUTCDate();
    const formattedDay = `${day}${day === 3 || day === 23 ? "rd" : day === 2 || day === 22 ? "nd" : day === 1 || day === 21 || day === 31 ? "st" : "th"}`;

    const allMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = allMonths[formDate.getUTCMonth()];
    const year = formDate.getUTCFullYear();

    return `${formattedDay} ${month}, ${year}`;
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero Section with Backdrop */}
      <header className="relative w-full rounded-xl overflow-hidden shadow-2xl mb-8">
        <div className="relative h-[500px]">
          <Image
            src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`}
            alt={`${movieDetails.title} Movie Cover`}
            fill
            className="object-cover"
            priority
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/40">
            <button className="transform hover:scale-110 transition-transform duration-200">
              <FontAwesomeIcon icon={faPlayCircle} className="text-white text-8xl drop-shadow-2xl" />
              <p className="text-white text-2xl font-bold mt-4">Watch Trailer</p>
            </button>
          </div>

          {/* Movie Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg" data-testid="movie-title">
              {movieDetails.original_title}
            </h1>
            <div className="flex items-center gap-4 text-lg">
              {movieDetails.vote_average > 0 && (
                <div className="flex items-center gap-2 bg-yellow-500/90 px-3 py-1 rounded-full">
                  <FontAwesomeIcon icon={faStar} />
                  <span className="font-semibold">{movieDetails.vote_average.toFixed(1)}</span>
                </div>
              )}
              <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                {new Date(movieDetails.release_date).getFullYear()}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                PG-13
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm" data-testid="movie-runtime">
                {formatRuntime(movieDetails.runtime || 124)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <section className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {movieDetails.genres.map((genre: { id: number; name: string }) => (
              <span
                key={genre.id}
                className="px-4 py-2 rounded-full bg-rose-100 text-rose-600 font-medium text-sm hover:bg-rose-200 transition-colors cursor-pointer border border-rose-200"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Overview */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Overview</h2>
            <p className="text-gray-700 leading-relaxed text-lg" data-testid="overview">
              {movieDetails.overview}
            </p>
          </div>

          {/* Movie Details */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Details</h2>
            
            {movieDetails.tagline && (
              <div className="pb-4 border-b border-gray-200">
                <p className="text-gray-600 text-sm uppercase tracking-wide mb-1">Tagline</p>
                <p className="text-rose-600 font-semibold italic text-lg">&quot;{movieDetails.tagline}&quot;</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm uppercase tracking-wide mb-1">Status</p>
                <p className="text-gray-900 font-semibold">{movieDetails.status}</p>
              </div>

              <div>
                <p className="text-gray-600 text-sm uppercase tracking-wide mb-1">Release Date</p>
                <p className="text-gray-900 font-semibold" data-testid="movie-release-date">
                  <FontAwesomeIcon icon={faCalendar} className="mr-2 text-rose-500" />
                  {formateDate(movieDetails.release_date)}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm uppercase tracking-wide mb-1">Runtime</p>
                <p className="text-gray-900 font-semibold">
                  <FontAwesomeIcon icon={faClock} className="mr-2 text-rose-500" />
                  {formatRuntime(movieDetails.runtime || 124)}
                </p>
              </div>

              {movieDetails.budget > 0 && (
                <div>
                  <p className="text-gray-600 text-sm uppercase tracking-wide mb-1">Budget</p>
                  <p className="text-gray-900 font-semibold">
                    ${(movieDetails.budget / 1000000).toFixed(1)}M
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Actions & Extras */}
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-3">
            <button className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white rounded-lg px-6 py-3 font-semibold flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-lg">
              <FontAwesomeIcon icon={faMagic} />
              <span>See Showtimes</span>
            </button>
            <button className="w-full bg-white hover:bg-rose-50 text-rose-600 rounded-lg px-6 py-3 font-semibold flex items-center justify-center gap-3 border-2 border-rose-600 transition-all">
              <FontAwesomeIcon icon={faFilm} />
              <span>More Watch Options</span>
            </button>
          </div>

          {/* Featured Collection */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative h-48 grid grid-cols-4">
              <div className="bg-gradient-to-br from-rose-300 to-rose-400"></div>
              <div className="bg-gradient-to-br from-rose-400 to-rose-500"></div>
              <div className="bg-gradient-to-br from-rose-500 to-rose-600"></div>
              <div className="bg-gradient-to-br from-rose-600 to-rose-700"></div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                <div className="w-full p-4 text-center text-white">
                  <FontAwesomeIcon icon={faFilm} className="text-2xl mb-2" />
                  <p className="font-semibold">Best Movies in September</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Card */}
          {movieDetails.vote_count > 0 && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md p-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-3">
                  <FontAwesomeIcon icon={faStar} className="text-white text-2xl" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{movieDetails.vote_average.toFixed(1)}</p>
                <p className="text-gray-600 text-sm mt-1">
                  Based on {movieDetails.vote_count.toLocaleString()} votes
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* Download Links Section - Prominent Position */}
      <DownloadLinksSection 
        movieId={movieDetails.id} 
        type="movie" 
      />
    </div>
  );
};

export default MainMovieDetails;