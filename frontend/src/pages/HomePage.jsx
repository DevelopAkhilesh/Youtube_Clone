import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getVideos } from "../services/videoService";
import { useDebounce } from "../utils/useDebounce";
import FilterBar from "../components/video/FilterBar";
import VideoCard from "../components/video/VideoCard";

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read filters from URL
  const searchQuery = searchParams.get("search") || "";
  const activeCategory = searchParams.get("category") || "";
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Fetch videos when search or category changes
  useEffect(() => {
    let cancelled = false;

    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (activeCategory) params.category = activeCategory;

        const res = await getVideos(params);
        if (!cancelled) {
          setVideos(res.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Failed to load videos");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchVideos();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, activeCategory]);

  // Handlers
  const handleSearch = (value) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set("search", value);
      } else {
        prev.delete("search");
      }
      prev.delete("category"); // Clear category when searching
      return prev;
    });
  };

  const handleCategorySelect = (category) => {
    setSearchParams((prev) => {
      if (category) {
        prev.set("category", category);
      } else {
        prev.delete("category");
      }
      prev.delete("search"); // Clear search when selecting category
      return prev;
    });
  };

  // Render states
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Loading videos...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
        Error: {error}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p>No videos found {debouncedSearch && `for "${debouncedSearch}"`}</p>
      </div>
    );
  }

  return (
    <div>
      <FilterBar
        searchQuery={searchQuery}
        onSearch={handleSearch}
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;