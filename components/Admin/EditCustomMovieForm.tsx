"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Film, Plus, X, ArrowLeft } from "lucide-react";
import { DownloadLink } from "@/lib/types/movieData.types";
import { CustomMovie } from "@/lib/types/custom.types";

interface EditCustomMovieFormProps {
  movie: CustomMovie;
  onBack: () => void;
  onSuccess: () => void;
}

export default function EditCustomMovieForm({ movie, onBack, onSuccess }: EditCustomMovieFormProps) {
  const [formData, setFormData] = useState({
    title: movie.title,
    overview: movie.overview,
    releaseDate: movie.release_date,
    posterUrl: movie.poster_path,
    backdropUrl: movie.backdrop_path || "",
    rating: String(movie.vote_average || "7.5"),
  });

  const [links, setLinks] = useState<DownloadLink[]>(movie.links);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

      const response = await fetch(`/api/admin/movies/custom?movieId=${movie.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          rating: parseFloat(formData.rating),
          links: links.filter((link) => link.url),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update movie");
      }

      toast.success(data.message || "Movie updated successfully!");
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
            Back to Movies List
        </button>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edit Custom Movie</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Movie Details Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Movie Details</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Movie Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Release Date</label>
              <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleInputChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-10)</label>
              <input type="number" name="rating" value={formData.rating} onChange={handleInputChange} min="1" max="10" step="0.1" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Poster URL</label>
              <input type="url" name="posterUrl" value={formData.posterUrl} onChange={handleInputChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Backdrop URL</label>
            <input type="url" name="backdropUrl" value={formData.backdropUrl} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Overview</label>
            <textarea name="overview" value={formData.overview} onChange={handleInputChange} required rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>
        </div>

        {/* Download Links Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">Download Links</label>
            <span className="text-xs text-gray-500">{links.length} link(s) added</span>
          </div>
          <div className="space-y-3">
            {links.map((link, index) => (
              <div key={index} className="relative group">
                <div className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Quality</label>
                      <select value={link.quality} onChange={(e) => handleLinkChange(index, "quality", e.target.value as DownloadLink["quality"])} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm">
                        <option value="480p">480p</option>
                        <option value="720p">720p</option>
                        <option value="1080p">1080p</option>
                        <option value="4K">4K</option>
                      </select>
                    </div>
                    <div className="md:col-span-6">
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Download URL</label>
                      <input type="url" value={link.url} onChange={(e) => handleLinkChange(index, "url", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">File Size</label>
                      <input type="text" value={link.size || ""} onChange={(e) => handleLinkChange(index, "size", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                  </div>
                  {links.length > 1 && (
                    <button type="button" onClick={() => handleRemoveLink(index)} className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddLink} className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add Another Quality
          </button>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50">
            {loading ? "Updating Movie..." : "Update Movie"}
          </button>
          <button type="button" onClick={onBack} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
