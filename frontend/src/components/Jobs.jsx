import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import Pagination from "./shared/Pagination";
import { PAGE_LIMITS, paginateArray, getTotalPages } from "@/utils/pagination";
import { Search, SlidersHorizontal, X } from "lucide-react";

const parseSalaryRange = (rangeStr) => {
  if (!rangeStr) return { min: 0, max: Infinity };
  if (rangeStr === "40+") return { min: 40, max: Infinity };
  const parts = rangeStr.split("-").map(Number);
  return { min: parts[0] || 0, max: parts[1] ?? Infinity };
};

const Jobs = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.job);
  const [activeFilters, setActiveFilters] = useState({
    location: [], title: [], jobType: [], salary: [],
  });
  const [searchText, setSearchText] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [page, setPage] = useState(1);
  const limit = PAGE_LIMITS.jobs;

  useEffect(() => {
    setPage(1);
  }, [activeFilters, searchText]);

  useEffect(() => {
    let result = [...allJobs];

    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      result = result.filter((job) =>
        job?.title?.toLowerCase().includes(q) ||
        job?.description?.toLowerCase().includes(q) ||
        job?.company?.name?.toLowerCase().includes(q)
      );
    }
    if (activeFilters.location.length > 0) {
      result = result.filter((job) =>
        activeFilters.location.some((loc) =>
          job?.location?.toLowerCase().includes(loc.toLowerCase())
        )
      );
    }
    if (activeFilters.title.length > 0) {
      result = result.filter((job) =>
        activeFilters.title.some((t) =>
          job?.title?.toLowerCase().includes(t.toLowerCase())
        )
      );
    }
    if (activeFilters.jobType.length > 0) {
      result = result.filter((job) =>
        activeFilters.jobType.some((jt) =>
          job?.jobType?.toLowerCase().includes(jt.toLowerCase())
        )
      );
    }
    if (activeFilters.salary.length > 0) {
      result = result.filter((job) => {
        const salary = Number(job?.salary) || 0;
        return activeFilters.salary.some((rangeStr) => {
          const { min, max } = parseSalaryRange(rangeStr);
          return salary >= min && salary <= max;
        });
      });
    }
    setFilteredJobs(result);
  }, [allJobs, activeFilters, searchText]);

  const paginatedJobs = paginateArray(filteredJobs, page, limit);
  const totalPages = getTotalPages(filteredJobs.length, limit);

  const totalActiveFilters = Object.values(activeFilters).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-16">

        {/* Mobile header */}
        <div className="flex items-center justify-between mb-6 lg:hidden animate-in fade-in duration-500">
          <h1 className="font-bold text-xl text-foreground">
            Jobs <span className="text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full text-sm">({filteredJobs.length})</span>
          </h1>
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border text-sm font-medium text-foreground hover:border-primary hover:bg-muted transition-all shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            Filters
            {totalActiveFilters > 0 && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                {totalActiveFilters}
              </span>
            )}
          </button>
        </div>

        {showMobileFilter && (
          <div className="lg:hidden mb-6 animate-in slide-in-from-top-4 duration-300">
            <FilterCard onFilterChange={(f) => { setActiveFilters(f); setShowMobileFilter(false); }} />
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0 animate-in slide-in-from-left-8 duration-700">
            <div className="sticky top-24">
              <FilterCard onFilterChange={setActiveFilters} />
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0 animate-in slide-in-from-right-8 duration-700">
            {/* Search bar */}
            <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 mb-6 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by title, company, or description..."
                className="outline-none border-none w-full text-base text-foreground placeholder:text-muted-foreground bg-transparent"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {searchText && (
                <button onClick={() => setSearchText("")} className="p-1 hover:bg-muted rounded-md transition-colors">
                  <X className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
                </button>
              )}
            </div>

            {/* Desktop results count */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredJobs.length}</span> jobs
                {totalActiveFilters > 0 && (
                  <span className="ml-2 text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">· {totalActiveFilters} filter{totalActiveFilters > 1 ? "s" : ""} applied</span>
                )}
              </p>
            </div>

            {/* Jobs grid */}
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-2xl border border-border shadow-sm animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-5 shadow-inner">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">No jobs found</h2>
                <p className="text-base text-muted-foreground max-w-sm">
                  Try adjusting your filters or search keyword to find more opportunities.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedJobs.map((job) => (
                    <div key={job?._id} className="animate-in fade-in zoom-in-95 duration-500">
                      <Job job={job} />
                    </div>
                  ))}
                </div>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  total={filteredJobs.length}
                  limit={limit}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Jobs;
