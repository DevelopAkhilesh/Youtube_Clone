import { CATEGORIES } from "../../constants/categories";

function FilterBar({ searchQuery, onSearch, activeCategory, onCategorySelect }) {
  const allCategories = ["All", ...CATEGORIES];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        alignItems: "center",
        padding: "10px 0",
      }}
    >
      <input
        type="text"
        placeholder="Search videos..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        style={{
          padding: "8px 16px",
          borderRadius: "20px",
          border: "1px solid #ccc",
          width: "250px",
        }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategorySelect(cat === "All" ? "" : cat)}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "none",
              background:
                activeCategory === cat || (cat === "All" && !activeCategory)
                  ? "#000"
                  : "#f1f1f1",
              color:
                activeCategory === cat || (cat === "All" && !activeCategory)
                  ? "#fff"
                  : "#000",
              cursor: "pointer",
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterBar;