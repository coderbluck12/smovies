import { DownloadLink } from "./movieData.types";

export interface CustomMovie {
  id: string;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  backdrop_path?: string;
  vote_average?: number;
  isCustom: true;
  links: DownloadLink[];
  createdAt: number;
  updatedAt: number;
}

export interface CustomSeriesEpisode {
  episodeNumber: number;
  episodeName: string;
  links: DownloadLink[];
}

export interface CustomSeries {
  id: string;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  backdrop_path?: string;
  vote_average?: number;
  total_seasons?: number;
  isCustom: true;
  episodes: CustomSeriesEpisode[];
  createdAt: number;
  updatedAt: number;
}
