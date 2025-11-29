"use client";

import { useState, useEffect } from "react";
import { DownloadLink } from "@/lib/types/movieData.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faSpinner, faExclamationTriangle, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

interface Episode {
  episodeNumber: number;
  episodeName: string;
  links: DownloadLink[];
}

interface SeriesEpisodesSectionProps {
  seriesId: string | number;
}

export default function SeriesEpisodesSection({ seriesId }: SeriesEpisodesSectionProps) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedEpisodes, setExpandedEpisodes] = useState<Set<number>>(new Set([1]));

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/downloads/series/${seriesId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setEpisodes([]);
            return;
          }
          throw new Error("Failed to fetch episodes");
        }

        const data = await response.json();
        setEpisodes(data.episodes || []);
      } catch (err) {
        console.error("Error fetching episodes:", err);
        setError("Unable to load episodes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (seriesId) {
      fetchEpisodes();
    }
  }, [seriesId]);

  const toggleEpisode = (episodeNumber: number) => {
    const newExpanded = new Set(expandedEpisodes);
    if (newExpanded.has(episodeNumber)) {
      newExpanded.delete(episodeNumber);
    } else {
      newExpanded.add(episodeNumber);
    }
    setExpandedEpisodes(newExpanded);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-900 to-purple-800 rounded-xl shadow-lg p-8 mb-8 mt-2 animate-pulse">
        <div className="flex items-center justify-center gap-3 text-white">
          <FontAwesomeIcon icon={faSpinner} className="text-2xl animate-spin" />
          <p className="text-lg font-medium">Loading episodes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 bg-opacity-20 border-2 border-red-500 rounded-xl shadow-lg p-6 mb-8 mt-2">
        <div className="flex items-start gap-4">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-2xl mt-1" />
          <div>
            <h3 className="text-red-500 font-bold text-lg mb-1">Error Loading Episodes</h3>
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (episodes.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 rounded-xl shadow-2xl p-6 mb-6 border border-purple-700 mt-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-3 rounded-lg">
            <FontAwesomeIcon icon={faDownload} className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Episodes</h3>
            <p className="text-purple-300 text-sm">{episodes.length} episodes available</p>
          </div>
        </div>
      </div>

      {/* Episodes List */}
      <div className="space-y-3">
        {episodes.map((episode) => (
          <div key={episode.episodeNumber} className="border border-purple-600 rounded-lg overflow-hidden">
            {/* Episode Header */}
            <button
              onClick={() => toggleEpisode(episode.episodeNumber)}
              className="w-full bg-purple-800 hover:bg-purple-700 transition-colors p-4 flex items-center justify-between text-white"
            >
              <div className="flex items-center gap-4 text-left">
                <span className="font-bold text-lg min-w-12">Ep {episode.episodeNumber}</span>
                <span className="text-purple-200">{episode.episodeName}</span>
              </div>
              <FontAwesomeIcon
                icon={expandedEpisodes.has(episode.episodeNumber) ? faChevronUp : faChevronDown}
                className="text-purple-300"
              />
            </button>

            {/* Episode Downloads */}
            {expandedEpisodes.has(episode.episodeNumber) && (
              <div className="bg-purple-950 p-4">
                {episode.links && episode.links.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {episode.links
                      .sort((a, b) => {
                        const qualityA = parseInt(a.quality.replace(/\D/g, "")) || 0;
                        const qualityB = parseInt(b.quality.replace(/\D/g, "")) || 0;
                        return qualityB - qualityA;
                      })
                      .map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-purple-500 overflow-hidden"
                        >
                          {/* Shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

                          <div className="relative flex flex-col items-center justify-center gap-1">
                            <FontAwesomeIcon icon={faDownload} className="text-lg" />
                            <div className="text-center">
                              <p className="font-bold text-sm">{link.quality}</p>
                              {link.size && <p className="text-purple-200 text-xs mt-0.5">{link.size}</p>}
                            </div>
                          </div>
                        </a>
                      ))}
                  </div>
                ) : (
                  <p className="text-purple-300 text-center py-4">No download links available for this episode</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
