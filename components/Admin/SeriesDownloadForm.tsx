"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Episode, DownloadLink } from "@/lib/types/movieData.types";

export default function SeriesDownloadForm() {
  const [seriesId, setSeriesId] = useState("");
  const [title, setTitle] = useState("");
  const [episodes, setEpisodes] = useState<Episode[]>([
    { episodeNumber: 1, episodeName: "", links: [{ quality: "720p", url: "", size: "" }] },
  ]);
  const [loading, setLoading] = useState(false);

  const handleAddEpisode = () => {
    setEpisodes([
      ...episodes,
      {
        episodeNumber: episodes.length + 1,
        episodeName: "",
        links: [{ quality: "720p", url: "", size: "" }],
      },
    ]);
  };

  const handleRemoveEpisode = (index: number) => {
    setEpisodes(episodes.filter((_, i) => i !== index));
  };

  const handleEpisodeChange = (index: number, field: string, value: string | number) => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[index] = { ...updatedEpisodes[index], [field]: value };
    setEpisodes(updatedEpisodes);
  };

  const handleAddLink = (episodeIndex: number) => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[episodeIndex].links.push({
      quality: "720p",
      url: "",
      size: "",
    });
    setEpisodes(updatedEpisodes);
  };

  const handleRemoveLink = (episodeIndex: number, linkIndex: number) => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[episodeIndex].links = updatedEpisodes[episodeIndex].links.filter(
      (_, i) => i !== linkIndex
    );
    setEpisodes(updatedEpisodes);
  };

  const handleLinkChange = (
    episodeIndex: number,
    linkIndex: number,
    field: keyof DownloadLink,
    value: string
  ) => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[episodeIndex].links[linkIndex] = {
      ...updatedEpisodes[episodeIndex].links[linkIndex],
      [field]: value,
    };
    setEpisodes(updatedEpisodes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const response = await fetch("/api/admin/downloads/series", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          seriesId,
          title,
          episodes: episodes.map((ep) => ({
            ...ep,
            links: ep.links.filter((link) => link.url),
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save download links");
      }

      toast.success("Series download links saved successfully!");
      setSeriesId("");
      setTitle("");
      setEpisodes([
        { episodeNumber: 1, episodeName: "", links: [{ quality: "720p", url: "", size: "" }] },
      ]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Series Download Links</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Series ID</label>
        <input
          type="text"
          value={seriesId}
          onChange={(e) => setSeriesId(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter TMDB Series ID"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Series Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter series title"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Episodes</label>
        {episodes.map((episode, episodeIndex) => (
          <div key={episodeIndex} className="mb-4 p-4 border rounded-lg bg-gray-50">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <input
                type="number"
                value={episode.episodeNumber}
                onChange={(e) =>
                  handleEpisodeChange(episodeIndex, "episodeNumber", parseInt(e.target.value))
                }
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Episode Number"
              />
              <input
                type="text"
                value={episode.episodeName}
                onChange={(e) =>
                  handleEpisodeChange(episodeIndex, "episodeName", e.target.value)
                }
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Episode Name"
              />
            </div>

            <div className="mb-3">
              <label className="text-sm font-medium mb-2 block">Download Links</label>
              {episode.links.map((link, linkIndex) => (
                <div key={linkIndex} className="grid grid-cols-3 gap-2 mb-2">
                  <select
                    value={link.quality}
                    onChange={(e) =>
                      handleLinkChange(
                        episodeIndex,
                        linkIndex,
                        "quality",
                        e.target.value as DownloadLink["quality"]
                      )
                    }
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="480p">480p</option>
                    <option value="720p">720p</option>
                    <option value="1080p">1080p</option>
                    <option value="4K">4K</option>
                  </select>

                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) =>
                      handleLinkChange(episodeIndex, linkIndex, "url", e.target.value)
                    }
                    placeholder="Download URL"
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    value={link.size || ""}
                    onChange={(e) =>
                      handleLinkChange(episodeIndex, linkIndex, "size", e.target.value)
                    }
                    placeholder="File size"
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleAddLink(episodeIndex)}
                className="text-blue-600 text-sm hover:underline"
              >
                + Add Quality
              </button>
            </div>

            {episodes.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveEpisode(episodeIndex)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove Episode
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddEpisode}
          className="mt-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm"
        >
          + Add Episode
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Download Links"}
      </button>
    </form>
  );
}
