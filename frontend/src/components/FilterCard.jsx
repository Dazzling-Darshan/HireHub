import React, { useState } from "react";
import { X } from "lucide-react";

const filterData = [
  {
    filterType: "Location",
    key: "location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai", "Remote"],
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
    <div className="w-full p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-sm sticky top-20">

      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-[#0F172A]">Filters</h1>
          {totalActive > 0 && (
            <span className="bg-[#2563EB] text-white text-xs rounded-full px-2 py-0.5 font-medium">
              {totalActive}
            </span>
          )}
        </div>
        {totalActive > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-[#EF4444] hover:text-red-600 transition font-medium"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      <hr className="my-3 border-[#E2E8F0]" />

      {/* Filter sections */}
      <div className="space-y-5 max-h-[68vh] overflow-y-auto pr-1 custom-scrollbar">
        {filterData.map((data, index) => (
          <div key={index}>
            <h2 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
              {data.filterType}
            </h2>
            <div className="space-y-1">
              {data.array.map((item, idx) => {
                const isChecked = selectedFilters[data.key]?.has(item);
                return (
                  <label
                    key={idx}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-150 ${
                      isChecked
                        ? "bg-blue-50 border border-blue-100"
                        : "border border-transparent hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleFilter(data.key, item)}
                      className="w-3.5 h-3.5 accent-[#2563EB] cursor-pointer rounded"
                    />
                    <span className={`text-xs ${isChecked ? "text-[#2563EB] font-medium" : "text-[#64748B]"}`}>
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
            {index < filterData.length - 1 && <hr className="mt-4 border-[#E2E8F0]" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterCard;