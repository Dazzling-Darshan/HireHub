import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import Footer from './Footer'
import FilterCard from './FilterCard'
import { useSelector, useDispatch } from 'react-redux'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import Pagination from './shared/Pagination'
import { PAGE_LIMITS, paginateArray, getTotalPages } from '@/utils/pagination'
import { setSearchedQuery } from '@/redux/jobSlice'
import { Search, X } from 'lucide-react'

const Browse = () => {
  useGetAllJobs();
  const { allJobs, searchedQuery } = useSelector(store => store.job);
  const dispatch = useDispatch();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [page, setPage] = useState(1);
  const limit = PAGE_LIMITS.jobs;
  const [filters, setFilters] = useState({
    location: [],
    title: [],
    jobType: [],
    salary: []
  });

  useEffect(() => {
    setPage(1);
  }, [searchedQuery, filters]);

  useEffect(() => {
    let result = allJobs;

    // Apply search query
    if (searchedQuery && searchedQuery.trim() !== "") {
      const query = searchedQuery.toLowerCase();
      result = result.filter((job) =>
        job?.title?.toLowerCase().includes(query) ||
        job?.description?.toLowerCase().includes(query) ||
        job?.location?.toLowerCase().includes(query) ||
        job?.company?.name?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.location.length > 0) {
      result = result.filter(job => filters.location.includes(job?.location));
    }
    if (filters.title.length > 0) {
      result = result.filter(job => filters.title.some(title => job?.title?.toLowerCase().includes(title.toLowerCase())));
    }
    if (filters.jobType.length > 0) {
      result = result.filter(job => filters.jobType.includes(job?.jobType));
    }
    if (filters.salary.length > 0) {
      result = result.filter(job => {
        const salary = Number(job?.salary) || 0;
        return filters.salary.some(range => {
          if (range === "0-5") return salary >= 0 && salary <= 5;
          if (range === "6-10") return salary >= 6 && salary <= 10;
          if (range === "11-20") return salary >= 11 && salary <= 20;
          if (range === "21-40") return salary >= 21 && salary <= 40;
          if (range === "40+") return salary >= 40;
          return false;
        });
      });
    }

    setFilteredJobs(result);
  }, [allJobs, searchedQuery, filters]);

  const paginatedJobs = paginateArray(filteredJobs, page, limit);
  const totalPages = getTotalPages(filteredJobs.length, limit);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-6">
          {/* Sidebar with Filters */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <FilterCard onFilterChange={setFilters} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Active search indicator */}
            {searchedQuery && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg w-fit">
                <Search className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="text-sm text-[#0F172A]">
                  Searching for: <span className="font-semibold text-[#2563EB]">"{searchedQuery}"</span>
                </span>
                <button
                  onClick={() => dispatch(setSearchedQuery(""))}
                  className="ml-1 text-[#64748B] hover:text-[#EF4444] transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Heading */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-semibold text-xl text-[#0F172A]">
                {searchedQuery ? "Search Results" : "Browse All Jobs"}
                <span className="ml-2 text-sm font-normal text-[#64748B]">
                  ({filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"})
                </span>
              </h1>
            </div>

            {/* Empty state */}
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-white rounded-full border border-[#E2E8F0] flex items-center justify-center mb-4 shadow-sm">
                  <Search className="w-7 h-7 text-[#64748B]" />
                </div>
                <h2 className="text-base font-semibold text-[#0F172A] mb-2">No jobs found</h2>
                <p className="text-sm text-[#64748B] max-w-sm">
                  {searchedQuery
                    ? `No results for "${searchedQuery}". Try a different search.`
                    : "No jobs available yet. Check back soon!"}
                </p>
                {searchedQuery && (
                  <button
                    onClick={() => dispatch(setSearchedQuery(""))}
                    className="mt-4 px-5 py-2 bg-[#2563EB] text-white rounded-lg text-sm hover:bg-[#1D4ED8] transition font-medium"
                  >
                    Show All Jobs
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {paginatedJobs.map((job) => (
                    <Job key={job._id} job={job} />
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
  )
}

export default Browse