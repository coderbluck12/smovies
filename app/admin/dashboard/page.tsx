"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/configs/firebase";
import toast from "react-hot-toast";
import { Film, Tv, LogOut, Plus } from "lucide-react";
import MovieDownloadForm from "@/components/Admin/MovieDownloadForm";
import SeriesDownloadForm from "@/components/Admin/SeriesDownloadForm";
import AddCustomMovieForm from "@/components/Admin/AddCustomMovieForm";
import AddCustomSeriesForm from "@/components/Admin/AddCustomSeriesForm";

type TabType = "movies" | "series" | "custom-movie" | "custom-series";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("movies");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = async (): Promise<void> => {
    setLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem("adminToken");
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (error) {
      toast.error("Error logging out");
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MovieMex Admin</h1>
                <p className="text-xs text-gray-500">Content Management Panel</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-4 h-4" />
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("movies")}
              className={`relative px-6 py-4 font-medium transition-all whitespace-nowrap ${
                activeTab === "movies"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4" />
                Movies
              </div>
              {activeTab === "movies" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("series")}
              className={`relative px-6 py-4 font-medium transition-all whitespace-nowrap ${
                activeTab === "series"
                  ? "text-purple-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4" />
                Series
              </div>
              {activeTab === "series" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("custom-movie")}
              className={`relative px-6 py-4 font-medium transition-all whitespace-nowrap ${
                activeTab === "custom-movie"
                  ? "text-green-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Custom Movie
              </div>
              {activeTab === "custom-movie" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("custom-series")}
              className={`relative px-6 py-4 font-medium transition-all whitespace-nowrap ${
                activeTab === "custom-series"
                  ? "text-pink-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Custom Series
              </div>
              {activeTab === "custom-series" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-600 to-rose-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "movies" && <MovieDownloadForm />}
        {activeTab === "series" && <SeriesDownloadForm />}
        {activeTab === "custom-movie" && <AddCustomMovieForm />}
        {activeTab === "custom-series" && <AddCustomSeriesForm />}
      </main>
    </div>
  );
}