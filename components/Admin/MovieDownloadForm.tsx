"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Film, Plus, X } from "lucide-react";
import { DownloadLink } from "@/lib/types/movieData.types";

export default function MovieDownloadForm() {
  const [movieId, setMovieId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [links, setLinks] = useState<DownloadLink[]>([
    { quality: "480p", url: "", size: "" },
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddLink = (): void => {
    setLinks([...links, { quality: "720p", url: "", size: "" }]);
  };

  const handleRemoveLink = (index: number): void => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (
    index: number,
    field: keyof DownloadLink,
    value: string
  ): void => {
    const updatedLinks = [...links];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setLinks(updatedLinks);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const response = await fetch("/api/admin/downloads/movie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId,
          title,
          links: links.filter((link) => link.url),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to save download links");
      }

      toast.success(data.message || "Movie download links saved successfully!");
      setMovieId("");
      setTitle("");
      setLinks([{ quality: "480p", url: "", size: "" }]);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An error occurred";
      console.error("Error saving movie links:", errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add Movie Download Links</h2>
            <p className="text-sm text-gray-600 mt-0.5">Upload download options for a movie</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Movie ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={movieId}
              onChange={(e) => setMovieId(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., 12345"
            />
            <p className="text-xs text-gray-500 mt-1.5">Enter the TMDB Movie ID</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Movie Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., The Matrix"
            />
            <p className="text-xs text-gray-500 mt-1.5">Enter the full movie title</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Download Links <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-gray-500">{links.length} link(s) added</span>
          </div>

          <div className="space-y-3">
            {links.map((link, index) => (
              <div key={index} className="relative group">
                <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-all bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Quality</label>
                      <select
                        value={link.quality}
                        onChange={(e) =>
                          handleLinkChange(
                            index,
                            "quality",
                            e.target.value as DownloadLink["quality"]
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                      >
                        <option value="480p">480p</option>
                        <option value="720p">720p</option>
                        <option value="1080p">1080p</option>
                        <option value="4K">4K</option>
                      </select>
                    </div>

                    <div className="md:col-span-6">
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Download URL</label>
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                        placeholder="https://example.com/download"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">File Size</label>
                      <input
                        type="text"
                        value={link.size || ""}
                        onChange={(e) => handleLinkChange(index, "size", e.target.value)}
                        placeholder="1.2GB"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(index)}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddLink}
            className="mt-4 w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Another Quality
          </button>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Download Links"}
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