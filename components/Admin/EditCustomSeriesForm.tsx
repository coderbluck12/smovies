"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Tv, Plus, X, ArrowLeft } from "lucide-react";
import { DownloadLink } from "@/lib/types/movieData.types";
import { CustomSeries, CustomSeriesEpisode } from "@/lib/types/custom.types";

interface EditCustomSeriesFormProps {
  series: CustomSeries;
  onBack: () => void;
  onSuccess: () => void;
}

export default function EditCustomSeriesForm({ series, onBack, onSuccess }: EditCustomSeriesFormProps) {
  const [formData, setFormData] = useState({
    title: series.title,
    overview: series.overview,
    releaseDate: series.release_date,
    posterUrl: series.poster_path,
    backdropUrl: series.backdrop_path || "",
    rating: String(series.vote_average || "7.5"),
    totalSeasons: String(series.total_seasons || "1"),
  });

  const [episodes, setEpisodes] = useState<CustomSeriesEpisode[]>(series.episodes);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEpisode = (): void => {
    const newEpisodeNumber = episodes.length > 0 ? Math.max(...episodes.map((e) => e.episodeNumber)) + 1 : 1;
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
    updatedEpisodes[index] = { ...updatedEpisodes[index], [field]: value };
    setEpisodes(updatedEpisodes);
  };

  const handleAddLink = (episodeIndex: number): void => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[episodeIndex].links.push({ quality: "720p", url: "", size: "" });
    setEpisodes(updatedEpisodes);
  };

  const handleRemoveLink = (episodeIndex: number, linkIndex: number): void => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[episodeIndex].links = updatedEpisodes[episodeIndex].links.filter((_, i) => i !== linkIndex);
    setEpisodes(updatedEpisodes);
  };

  const handleLinkChange = (
    episodeIndex: number,
    linkIndex: number,
    field: keyof DownloadLink,
    value: string
  ): void => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[episodeIndex].links[linkIndex] = { ...updatedEpisodes[episodeIndex].links[linkIndex], [field]: value };
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

      const response = await fetch(`/api/admin/series/custom?seriesId=${series.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          rating: parseFloat(formData.rating),
          totalSeasons: parseInt(formData.totalSeasons),
          episodes: episodes.filter((ep) => ep.episodeName && ep.links.some(link => link.url)),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update series");
      }

      toast.success(data.message || "Series updated successfully!");
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Series List
        </button>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edit Custom Series</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Series Details Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Series Details</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Series Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Release Date</label>
              <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleInputChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-10)</label>
              <input type="number" name="rating" value={formData.rating} onChange={handleInputChange} min="1" max="10" step="0.1" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Seasons</label>
              <input type="number" name="totalSeasons" value={formData.totalSeasons} onChange={handleInputChange} min="1" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Poster URL</label>
              <input type="url" name="posterUrl" value={formData.posterUrl} onChange={handleInputChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Backdrop URL</label>
              <input type="url" name="backdropUrl" value={formData.backdropUrl} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Overview</label>
            <textarea name="overview" value={formData.overview} onChange={handleInputChange} required rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
          </div>
        </div>

        {/* Episodes Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Episodes</h3>
            <span className="text-xs text-gray-500">{episodes.length} episode(s)</span>
          </div>
          <div className="space-y-6">
            {episodes.map((episode, episodeIndex) => (
              <div key={episodeIndex} className="relative group p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                {episodes.length > 1 && (
                  <button type="button" onClick={() => handleRemoveEpisode(episodeIndex)} className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Episode Number</label>
                    <input type="number" value={episode.episodeNumber} onChange={(e) => handleEpisodeChange(episodeIndex, "episodeNumber", parseInt(e.target.value))} min="1" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Episode Name</label>
                    <input type="text" value={episode.episodeName} onChange={(e) => handleEpisodeChange(episodeIndex, "episodeName", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-medium text-gray-600">Download Links</label>
                  {episode.links.map((link, linkIndex) => (
                    <div key={linkIndex} className="relative group/link">
                      <div className="p-3 border border-gray-200 rounded-lg bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                          <div className="md:col-span-3">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Quality</label>
                            <select value={link.quality} onChange={(e) => handleLinkChange(episodeIndex, linkIndex, "quality", e.target.value as DownloadLink["quality"])} className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs">
                              <option value="480p">480p</option>
                              <option value="720p">720p</option>
                              <option value="1080p">1080p</option>
                              <option value="4K">4K</option>
                            </select>
                          </div>
                          <div className="md:col-span-6">
                            <label className="block text-xs font-medium text-gray-500 mb-1">URL</label>
                            <input type="url" value={link.url} onChange={(e) => handleLinkChange(episodeIndex, linkIndex, "url", e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs" />
                          </div>
                          <div className="md:col-span-3">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Size</label>
                            <input type="text" value={link.size || ""} onChange={(e) => handleLinkChange(episodeIndex, linkIndex, "size", e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs" />
                          </div>
                        </div>
                        {episode.links.length > 1 && (
                          <button type="button" onClick={() => handleRemoveLink(episodeIndex, linkIndex)} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/link:opacity-100">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => handleAddLink(episodeIndex)} className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 text-xs font-medium">
                    <Plus className="w-3 h-3" />
                    Add Link
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddEpisode} className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 font-medium">
            <Plus className="w-4 h-4" />
            Add Another Episode
          </button>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50">
            {loading ? "Updating Series..." : "Update Series"}
          </button>
          <button type="button" onClick={onBack} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
