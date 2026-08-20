import React, { useMemo, useState } from "react";
import { X, MapPin, Briefcase, Award, DollarSign } from "lucide-react";
import { useSelector } from "react-redux";

const FilterCard = ({ onFilterChange }) => {
  const { allJobs = [] } = useSelector((store) => store.job);

  const [selectedFilters, setSelectedFilters] = useState({
    location: new Set(),
    title: new Set(),
    jobType: new Set(),
    experience: new Set(),
    salary: new Set(),
  });

  // Dynamically compute unique options and counts present in the actual database jobs
  const dynamicFilterData = useMemo(() => {
    const locationCounts = {};
    const titleCounts = {};
    const jobTypeCounts = {};
    const expCounts = {
      "Fresher (0 yrs)": 0,
      "1-2 yrs": 0,
      "3-4 yrs": 0,
      "5+ yrs": 0,
    };
    const salaryCounts = {
      "0-10": 0,
      "11-20": 0,
      "21-30": 0,
      "30+": 0,
    };

    allJobs.forEach((job) => {
      // Locations
      if (job.location) {
        locationCounts[job.location] = (locationCounts[job.location] || 0) + 1;
      }
      // Titles / Roles
      if (job.title) {
        titleCounts[job.title] = (titleCounts[job.title] || 0) + 1;
      }
      // Job Types
      if (job.jobType) {
        jobTypeCounts[job.jobType] = (jobTypeCounts[job.jobType] || 0) + 1;
      }
      // Experience
      const exp = Number(job.experience) || 0;
      if (exp === 0) expCounts["Fresher (0 yrs)"]++;
      else if (exp <= 2) expCounts["1-2 yrs"]++;
      else if (exp <= 4) expCounts["3-4 yrs"]++;
      else expCounts["5+ yrs"]++;

      // Salary
      const sal = Number(job.salary) || 0;
      if (sal <= 10) salaryCounts["0-10"]++;
      else if (sal <= 20) salaryCounts["11-20"]++;
      else if (sal <= 30) salaryCounts["21-30"]++;
      else salaryCounts["30+"]++;
    });

    const locations = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([loc, count]) => ({ label: loc, value: loc, count }));

    const titles = Object.entries(titleCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([title, count]) => ({ label: title, value: title, count }));

    const jobTypes = Object.entries(jobTypeCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([jt, count]) => ({ label: jt, value: jt, count }));

    const experiences = Object.entries(expCounts)
      .filter(([_, count]) => count > 0)
      .map(([label, count]) => ({ label, value: label, count }));

    const salaries = Object.entries(salaryCounts)
      .filter(([_, count]) => count > 0)
      .map(([range, count]) => ({
        label: range === "30+" ? "30+ LPA" : `${range} LPA`,
        value: range,
        count,
      }));

    return [
      {
        filterType: "Locations",
        icon: <MapPin className="w-4 h-4 text-primary" />,
        key: "location",
        items: locations,
      },
      {
        filterType: "Job Roles",
        icon: <Briefcase className="w-4 h-4 text-primary" />,
        key: "title",
        items: titles,
      },
      {
        filterType: "Job Types",
        icon: <Award className="w-4 h-4 text-primary" />,
        key: "jobType",
        items: jobTypes,
      },
      {
        filterType: "Experience Level",
        icon: <Award className="w-4 h-4 text-primary" />,
        key: "experience",
        items: experiences,
      },
      {
        filterType: "Salary Range",
        icon: <DollarSign className="w-4 h-4 text-primary" />,
        key: "salary",
        items: salaries,
      },
    ].filter((section) => section.items.length > 0);
  }, [allJobs]);

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
      experience: new Set(),
      salary: new Set(),
    };
    setSelectedFilters(empty);
    onFilterChange?.({ location: [], title: [], jobType: [], experience: [], salary: [] });
  };

  const totalActive = Object.values(selectedFilters).reduce((acc, s) => acc + s.size, 0);

  return (
    <div className="w-full p-6 bg-card rounded-2xl border-2 border-border shadow-md sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-extrabold text-foreground tracking-tight">Filters</h1>
          {totalActive > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2.5 py-0.5 font-extrabold shadow-sm">
              {totalActive}
            </span>
          )}
        </div>
        {totalActive > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors font-bold bg-destructive/10 px-2.5 py-1 rounded-lg"
          >
            <X className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        Showing real openings active in database
      </p>

      <hr className="my-3 border-border" />

      {/* Filter sections */}
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
        {dynamicFilterData.map((data, index) => (
          <div key={index}>
            <div className="flex items-center gap-2 mb-3">
              {data.icon}
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                {data.filterType}
              </h2>
            </div>
            <div className="space-y-1.5">
              {data.items.map((item, idx) => {
                const isChecked = selectedFilters[data.key]?.has(item.value);
                return (
                  <label
                    key={idx}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 group ${
                      isChecked
                        ? "bg-primary/10 border border-primary/30 shadow-sm"
                        : "border border-transparent hover:bg-muted/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleFilter(data.key, item.value)}
                        className="w-4 h-4 accent-primary cursor-pointer rounded border-border shrink-0"
                      />
                      <span
                        className={`text-sm truncate transition-colors ${
                          isChecked ? "text-primary font-bold" : "text-foreground group-hover:text-primary"
                        }`}
                        title={item.label}
                      >
                        {item.label}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground ml-2 px-1.5 py-0.5 rounded bg-muted">
                      {item.count}
                    </span>
                  </label>
                );
              })}
            </div>
            {index < dynamicFilterData.length - 1 && <hr className="mt-5 border-border" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterCard;