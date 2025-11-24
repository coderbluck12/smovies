"use client";

import { useState, useEffect } from "react";
import { DownloadLink } from "@/lib/types/movieData.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faSpinner, faExclamationTriangle, faShieldAlt } from "@fortawesome/free-solid-svg-icons";

interface DownloadLinksSectionProps {
  movieId?: string | number;
  seriesId?: string | number;
  type: "movie" | "series";
  episodeNumber?: number;
}

export default function DownloadLinksSection({
  movieId,
  seriesId,
  type,
  episodeNumber,
}: DownloadLinksSectionProps) {
  const [links, setLinks] = useState<DownloadLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDownloadLinks = async () => {
      try {
        setLoading(true);
        setError(null);
        const id = type === "movie" ? movieId : seriesId;
        const endpoint =
          type === "movie"
            ? `/api/downloads/movie/${id}`
            : `/api/downloads/series/${id}`;

        const response = await fetch(endpoint);

        if (!response.ok) {
          if (response.status === 404) {
            setLinks([]);
            return;
          }
          throw new Error("Failed to fetch download links");
        }

        const data = await response.json();

        if (type === "movie") {
          setLinks(data.links || []);
        } else {
          // For series, find the specific episode
          const episode = data.episodes?.find(
            (ep: any) => ep.episodeNumber === episodeNumber
          );
          setLinks(episode?.links || []);
        }
      } catch (err) {
        console.error("Error fetching download links:", err);
        setError("Unable to load download options. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if ((type === "movie" && movieId) || (type === "series" && seriesId)) {
      fetchDownloadLinks();
    }
  }, [movieId, seriesId, type, episodeNumber]);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl shadow-lg p-8 mb-8 animate-pulse">
        <div className="flex items-center justify-center gap-3 text-white">
          <FontAwesomeIcon icon={faSpinner} className="text-2xl animate-spin" />
          <p className="text-lg font-medium">Loading download options...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 bg-opacity-20 border-2 border-red-500 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-start gap-4">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-2xl mt-1" />
          <div>
            <h3 className="text-red-500 font-bold text-lg mb-1">Error Loading Downloads</h3>
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (links.length === 0) {
    return null;
  }

  // Sort links by quality (assuming quality format like "1080p", "720p", etc.)
  const sortedLinks = [...links].sort((a, b) => {
    const qualityA = parseInt(a.quality.replace(/\D/g, "")) || 0;
    const qualityB = parseInt(b.quality.replace(/\D/g, "")) || 0;
    return qualityB - qualityA;
  });

  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-xl shadow-2xl p-6 mb-6 border border-blue-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-3 rounded-lg">
            <FontAwesomeIcon icon={faDownload} className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Download Options</h3>
            <p className="text-blue-300 text-sm">Choose your preferred quality</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-blue-950 px-4 py-2 rounded-lg">
          <FontAwesomeIcon icon={faShieldAlt} className="text-blue-400" />
          <span className="text-blue-300 text-sm font-medium">{links.length} Available</span>
        </div>
      </div>

      {/* Download Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {sortedLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-5 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-blue-500 overflow-hidden"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            
            <div className="relative flex flex-col items-center justify-center gap-2">
              <FontAwesomeIcon icon={faDownload} className="text-2xl" />
              <div className="text-center">
                <p className="font-bold text-lg">{link.quality}</p>
                {link.size && (
                  <p className="text-blue-200 text-sm mt-1">{link.size}</p>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}