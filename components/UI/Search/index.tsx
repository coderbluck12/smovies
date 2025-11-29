"use client";

import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { MovieData } from "@/lib/types/movieData.types";
import { useState } from "react";
import toast from "react-hot-toast";
import { Dna } from "react-loader-spinner";
import Link from "next/link";

interface SearchResult extends MovieData {
  isCustom?: boolean;
  isSeries?: boolean;
}

interface SearchComponentProps {
  isOpen: boolean;
  togggleOpen(): void;
}

const SearchComponent = ({ isOpen, togggleOpen }: SearchComponentProps) => {
  const [moviesResults, setMoviesResult] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<{ loading: boolean }>({ loading: false });
  const [moviesHighestLength] = useState<number>(25);

  const searchForMovie = async (movieTitle: string) => {
    if (!movieTitle) return;

    setStatus({ ...status, loading: true });
    const res = await fetch(`/api/movie/search/${movieTitle}`);
    if (!res.ok) {
      setMoviesResult([]);
      toast.error("Sorry an error occurred, you might not be connected to the internet", { id: "error message" });
      setStatus({ ...status, loading: false });
      return;
    }

    const moviesFullBody = await res.json();
    const mainResults: MovieData[] = moviesFullBody.results;

    if (mainResults.length === 0) {
      toast.error("No result found", { id: "no result" });
    }

    const limiter = mainResults.slice(0, moviesHighestLength);

    setStatus({ ...status, loading: false });
    setMoviesResult(mainResults);
  };

  return (
    <div
      className={`fixed overscroll-y-scroll w-full flex items-center backdrop-blur-sm left-0 top-0 duration-200 ${
        isOpen ? "z-[250] h-full" : "-z-[250] h-0 opacity-0"
      }`}
    >
      <div className="max-w-[560px] min-h-[10rem] max-h-[35rem] w-11/12 mx-auto overflow-y-auto bg-white z-[1000] px-4 dark:bg-darkShade shadow-md rounded-lg dark:text-white text-black relative">
        <div className="sticky top-0 bg-white dark:bg-darkShade">
          <div className="flex justify-between items-center py-2">
            <div className="flex space-x-2 items-center">
              <Image src={`/images/others/movie_box_logo.png`} width={40} height={40} alt="Logo" />
              <h3 className="font-bold text-xl">
                <span className="text-rose-500 font-extrabold">SMovies</span>
              </h3>
            </div>
            <FontAwesomeIcon icon={faClose} className="text-2xl cursor-pointer" onClick={togggleOpen} title="Close" />
          </div>

          <div className="w-full flex items-center border-b-4 duration-200 px-2 rounded-sm space-x-2 border-gray-300 dark:border-gray-600 focus-within:border-rose-200">
            <FontAwesomeIcon icon={faSearch} className="text-lg text-gray-300 dark:text-gray-600" />
            <input
              type="text"
              className="py-2 bg-transparent outline-none flex-grow"
              placeholder="Search SMovies"
              onKeyUp={(e: any) => searchForMovie(e.target.value)}
            />
          </div>
        </div>

        <div className="my-4 py-4">
          {status.loading ? (
            <div className="flex justify-center items-center">
              <Dna
                visible={true}
                height="80"
                width="80"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
              />
            </div>
          ) : (
            <>
              {moviesResults && moviesResults.length > 0 ? (
                <ul className="space-y-2">
                  {moviesResults.map((movie) => (
                    <li key={movie.id}>
                      <Link href={`/movies/${movie.id}`}>
                        <div
                          className="flex space-x-4 cursor-pointer duration-200 hover:bg-rose-50 dark:hover:bg-rose-600 p-1 rounded-md relative"
                          title={movie.title}
                        >
                          <div className="h-16 w-16 overflow-hidden rounded-md relative flex-shrink-0">
                            <Image
                              src={
                                movie.isCustom && movie.poster_path
                                  ? movie.poster_path
                                  : `https://image.tmdb.org/t/p/w200${movie.backdrop_path}`
                              }
                              alt={movie.title}
                              width={500}
                              height={500}
                              className="w-full h-full object-cover"
                            />
                            {movie.isCustom && (
                              <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                                Custom
                              </div>
                            )}
                            {movie.isSeries && (
                              <div className="absolute bottom-1 right-1 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                                Series
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <h4 className="text-lg font-bold">{movie.title}</h4>
                            <p className="text-sm text-gray-500">
                              {movie.release_date
                                ? new Date(movie.release_date).getFullYear()
                                : "N/A"}
                            </p>
                            {movie.overview && (
                              <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                                {movie.overview}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">No results found</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
