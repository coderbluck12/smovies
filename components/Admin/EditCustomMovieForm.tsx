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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Movies List
        </button>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edit Custom Movie</h2>
        {/* Form fields... */}
    </div>
  );
}
