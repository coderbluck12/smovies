"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Tv, Plus, X, Upload } from "lucide-react";
import { DownloadLink } from "@/lib/types/movieData.types";

interface Episode {
  episodeNumber: number;
  episodeName: string;
  links: DownloadLink[];
}

export default function AddCustomSeriesForm() {
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    releaseDate: "",
    posterUrl: "",
    backdropUrl: "",
    rating: "7.5",
    totalSeasons: "1",
  });

  const [episodes, setEpisodes] = useState<Episode[]>([
    {
      episodeNumber: 1,
      episodeName: "",
      links: [{ quality: "480p", url: "", size: "" }],
    },
  ]);

  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEpisode = (): void => {
    const newEpisodeNumber = Math.max(...episodes.map((e) => e.episodeNumber)) + 1;
    setEpisodes([
      ...episodes,
      {
        episodeNumber: newEpisodeNumber,
        episodeName: "",
        links: [{ quality: "480p", url: "", size: "" }],
      },
    ]);
  };

  const handleRemoveEpisode = (index: number): void => {
    setEpisodes(episodes.filter((_, i) => i !== index));
  };

  const handleEpisodeChange = (
    index: number,
    field: "episodeNumber" | "episodeName",
    value: string | number
  ): void => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[index] = {
      ...updatedEpisodes[index],
      [field]: value,
    };
    setEpisodes(updatedEpisodes);
  };

  const handleAddLink = (episodeIndex: number): void => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[episodeIndex].links.push({
      quality: "720p",
      url: "",
      size: "",
    });
    setEpisodes(updatedEpisodes);
  };

  const handleRemoveLink = (episodeIndex: number, linkIndex: number): void => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[episodeIndex].links = updatedEpisodes[
      episodeIndex
    ].links.filter((_, i) => i !== linkIndex);
    setEpisodes(updatedEpisodes);
  };

  const handleLinkChange = (
    episodeIndex: number,
    linkIndex: number,
    field: keyof DownloadLink,
    value: string
  ): void => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[episodeIndex].links[linkIndex] = {
      ...updatedEpisodes[episodeIndex].links[linkIndex],
      [field]: value,
    };
    setEpisodes(updatedEpisodes);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      // Validate required fields
      if (
        !formData.title ||
        !formData.overview ||
        !formData.releaseDate ||
        !formData.posterUrl ||
        episodes.length === 0
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Validate episodes have at least one link
      const validEpisodes = episodes.filter(
        (ep) => ep.episodeName && ep.links.filter((link) => link.url).length > 0
      );

      if (validEpisodes.length === 0) {
        toast.error("Each episode must have a name and at least one download link");
        return;
      }

      const response = await fetch("/api/admin/series/custom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          overview: formData.overview,
          releaseDate: formData.releaseDate,
          posterUrl: formData.posterUrl,
          backdropUrl: formData.backdropUrl,
          rating: parseFloat(formData.rating),
          totalSeasons: parseInt(formData.totalSeasons),
          episodes: validEpisodes.map((ep) => ({
            episodeNumber: ep.episodeNumber,
            episodeName: ep.episodeName,
            links: ep.links.filter((link) => link.url),
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to add series");
      }

      toast.success(data.message || "Series added successfully!");
      setFormData({
        title: "",
        overview: "",
        releaseDate: "",
        posterUrl: "",
        backdropUrl: "",
        rating: "7.5",
        totalSeasons: "1",
      });
      setEpisodes([
        {
          episodeNumber: 1,
          episodeName: "",
          links: [{ quality: "480p", url: "", size: "" }],
        },
      ]);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An error occurred";
      console.error("Error adding series:", errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Add Custom Series
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Add a new TV series not available in the app with episode download links
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Series Details Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Series Details
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Series Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="e.g., Breaking Bad"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Release Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating (1-10)
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                min="1"
                max="10"
                step="0.1"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="8.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Seasons
              </label>
              <input
                type="number"
                name="totalSeasons"
                value={formData.totalSeasons}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poster URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="https://example.com/poster.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backdrop URL
              </label>
              <input
                type="url"
                name="backdropUrl"
                value={formData.backdropUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="https://example.com/backdrop.jpg"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overview <span className="text-red-500">*</span>
            </label>
            <textarea
              name="overview"
              value={formData.overview}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              placeholder="Enter series description..."
            />
          </div>
        </div>

        {/* Episodes Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Episodes <span className="text-red-500">*</span>
            </h3>
            <span className="text-xs text-gray-500">{episodes.length} episode(s)</span>
          </div>

          <div className="space-y-6">
            {episodes.map((episode, episodeIndex) => (
              <div
                key={episodeIndex}
                className="relative group p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-all bg-gray-50"
              >
                {episodes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEpisode(episodeIndex)}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Episode Number
                    </label>
                    <input
                      type="number"
                      value={episode.episodeNumber}
                      onChange={(e) =>
                        handleEpisodeChange(
                          episodeIndex,
                          "episodeNumber",
                          parseInt(e.target.value)
                        )
                      }
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Episode Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={episode.episodeName}
                      onChange={(e) =>
                        handleEpisodeChange(
                          episodeIndex,
                          "episodeName",
                          e.target.value
                        )
                      }
                      placeholder="e.g., Pilot"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Episode Download Links */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-600">
                      Download Links <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-gray-500">
                      {episode.links.length} link(s)
                    </span>
                  </div>

                  {episode.links.map((link, linkIndex) => (
                    <div key={linkIndex} className="relative group">
                      <div className="p-3 border border-gray-300 rounded-lg bg-white hover:border-purple-300 transition-all">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                          <div className="md:col-span-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Quality
                            </label>
                            <select
                              value={link.quality}
                              onChange={(e) =>
                                handleLinkChange(
                                  episodeIndex,
                                  linkIndex,
                                  "quality",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                            >
                              <option value="480p">480p</option>
                              <option value="720p">720p</option>
                              <option value="1080p">1080p</option>
                              <option value="4K">4K</option>
                            </select>
                          </div>

                          <div className="md:col-span-6">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              URL
                            </label>
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) =>
                                handleLinkChange(
                                  episodeIndex,
                                  linkIndex,
                                  "url",
                                  e.target.value
                                )
                              }
                              placeholder="https://example.com/download"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>

                          <div className="md:col-span-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Size
                            </label>
                            <input
                              type="text"
                              value={link.size || ""}
                              onChange={(e) =>
                                handleLinkChange(
                                  episodeIndex,
                                  linkIndex,
                                  "size",
                                  e.target.value
                                )
                              }
                              placeholder="1.2GB"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        {episode.links.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveLink(episodeIndex, linkIndex)
                            }
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleAddLink(episodeIndex)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-gray-300 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Quality
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddEpisode}
            className="mt-4 w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Episode
          </button>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding Series..." : "Add Series"}
          </button>
          <button
            type="button"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
