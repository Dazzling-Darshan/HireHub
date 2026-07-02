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
    <div className="bg-[#F8FAFC] min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-12">

        {/* Mobile header */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <h1 className="font-semibold text-lg text-[#0F172A]">
            Jobs <span className="text-[#2563EB]">({filteredJobs.length})</span>
          </h1>
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-sm font-medium text-[#0F172A] hover:border-[#2563EB] transition"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#64748B]" />
            Filters
            {totalActiveFilters > 0 && (
              <span className="bg-[#2563EB] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {totalActiveFilters}
              </span>
            )}
          </button>
        </div>

        {showMobileFilter && (
          <div className="lg:hidden mb-4">
            <FilterCard onFilterChange={(f) => { setActiveFilters(f); setShowMobileFilter(false); }} />
          </div>
        )}

        <div className="flex gap-5">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterCard onFilterChange={setActiveFilters} />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Search bar */}
            <div className="flex items-center gap-3 bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 mb-5 hover:border-[#2563EB] transition-all duration-200 shadow-sm">
              <Search className="w-4 h-4 text-[#64748B] flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by title, company, or description..."
                className="outline-none border-none w-full text-sm text-[#0F172A] placeholder-[#64748B] bg-transparent"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {searchText && (
                <button onClick={() => setSearchText("")}>
                  <X className="w-4 h-4 text-[#64748B] hover:text-[#EF4444] transition" />
                </button>
              )}
            </div>

            {/* Desktop results count */}
            <div className="hidden lg:flex items-center justify-between mb-4">
              <p className="text-sm text-[#64748B]">
                Showing <span className="font-semibold text-[#0F172A]">{filteredJobs.length}</span> jobs
                {totalActiveFilters > 0 && (
                  <span className="ml-2 text-[#2563EB]">· {totalActiveFilters} filter{totalActiveFilters > 1 ? "s" : ""} applied</span>
                )}
              </p>
            </div>

            {/* Jobs grid */}
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-[#E2E8F0]">
                <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-4">
                  <Search className="w-7 h-7 text-[#64748B]" />
                </div>
                <h2 className="text-base font-semibold text-[#0F172A] mb-1">No jobs found</h2>
                <p className="text-sm text-[#64748B] max-w-xs">
                  Try adjusting your filters or search keyword.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginatedJobs.map((job) => (
                    <Job key={job?._id} job={job} />
                  ))}
                </div>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  total={filteredJobs.length}
                  limit={limit}
                  onPageChange={setPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Jobs;
