export type MovieData = {
  id: string | number;
  title: string;
  original_language: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
};

export type DownloadLink = {
  quality: "480p" | "720p" | "1080p" | "4K";
  url: string;
  size?: string;
};

export type MovieDownload = {
  movieId: string | number;
  title: string;
  links: DownloadLink[];
  createdAt: number;
  updatedAt: number;
};

export type Episode = {
  episodeNumber: number;
  episodeName: string;
  links: DownloadLink[];
};

export type SeriesDownload = {
  seriesId: string | number;
  title: string;
  episodes: Episode[];
  createdAt: number;
  updatedAt: number;
};
