import React, { useState } from "react";
import { X } from "lucide-react";

const filterData = [
  {
    filterType: "Location",
    key: "location",
    array: [
      "Bangalore",
      "Hyderabad",
      "Mumbai",
      "Pune",
      "Delhi NCR",
      "Gurgaon",
      "Noida",
      "Chennai",
      "Kolkata",
      "Ahmedabad",
      "Kochi",
      "Jaipur",
      "Chandigarh",
      "Indore",
      "Bhubaneswar",
      "Remote",
    ],
  },
  {
    filterType: "Industry / Role",
    key: "title",
    array: [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Data Engineer",
      "ML Engineer",
      "Cloud Architect",
      "DevOps Engineer",
    ],
  },
  {
    filterType: "Job Type",
    key: "jobType",
    array: ["Full Time", "Part Time", "Contract", "Internship", "Freelance"],
  },
  {
    filterType: "Salary (LPA)",
    key: "salary",
    array: ["0-5", "6-10", "11-20", "21-40", "40+"],
  },
];

const FilterCard = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    location: new Set(),
    title: new Set(),
    jobType: new Set(),
    salary: new Set(),
  });

  const toggleFilter = (key, value) => {
    setSelectedFilters((prev) => {
      const updated = { ...prev, [key]: new Set(prev[key]) };
      if (updated[key].has(value)) {
        updated[key].delete(value);
      } else {
        updated[key].add(value);
      }
      const asArrays = {};
      Object.entries(updated).forEach(([k, v]) => {
        asArrays[k] = Array.from(v);
      });
      onFilterChange?.(asArrays);
      return updated;
    });
  };

  const clearAll = () => {
    const empty = {
      location: new Set(),
      title: new Set(),
      jobType: new Set(),
      salary: new Set(),
    };
    setSelectedFilters(empty);
    onFilterChange?.({ location: [], title: [], jobType: [], salary: [] });
  };

  const totalActive = Object.values(selectedFilters).reduce((acc, s) => acc + s.size, 0);

  return (
    <div className="w-full p-6 bg-card rounded-2xl border border-border shadow-sm sticky top-24">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold text-foreground">Filters</h1>
          {totalActive > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2.5 py-0.5 font-bold shadow-sm">
              {totalActive}
            </span>
          )}
        </div>
        {totalActive > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors font-semibold bg-destructive/10 px-2 py-1 rounded-md"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      <hr className="my-4 border-border" />

      {/* Filter sections */}
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
        {filterData.map((data, index) => (
          <div key={index}>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
              {data.filterType}
            </h2>
            <div className="space-y-1.5">
              {data.array.map((item, idx) => {
                const isChecked = selectedFilters[data.key]?.has(item);
                return (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 group ${
                      isChecked
                        ? "bg-primary/10 border border-primary/20"
                        : "border border-transparent hover:bg-muted"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleFilter(data.key, item)}
                      className="w-4 h-4 accent-primary cursor-pointer rounded border-border"
                    />
                    <span className={`text-sm transition-colors ${isChecked ? "text-primary font-bold" : "text-foreground group-hover:text-primary"}`}>
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
            {index < filterData.length - 1 && <hr className="mt-6 border-border" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterCard;