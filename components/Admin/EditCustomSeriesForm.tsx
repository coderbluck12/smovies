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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Series List
        </button>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edit Custom Series</h2>
        {/* Form fields... */}
    </div>
  );
}
