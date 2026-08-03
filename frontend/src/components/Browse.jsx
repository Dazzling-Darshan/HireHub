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
    <div className="bg-background min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">
          {/* Sidebar with Filters */}
          <div className="hidden lg:block w-72 flex-shrink-0 animate-in slide-in-from-left-8 duration-700">
            <div className="sticky top-24">
                <FilterCard onFilterChange={setFilters} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 animate-in slide-in-from-right-8 duration-700">
            {/* Active search indicator */}
            {searchedQuery && (
              <div className="flex items-center gap-2 mb-6 px-4 py-2.5 bg-primary/10 border border-primary/20 rounded-xl w-fit shadow-sm">
                <Search className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">
                  Searching for: <span className="font-bold text-primary">"{searchedQuery}"</span>
                </span>
                <button
                  onClick={() => dispatch(setSearchedQuery(""))}
                  className="ml-2 text-muted-foreground hover:text-destructive transition-colors p-1 hover:bg-muted rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Heading */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-bold text-2xl text-foreground">
                {searchedQuery ? "Search Results" : "Browse All Jobs"}
                <span className="ml-3 text-sm font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  ({filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"})
                </span>
              </h1>
            </div>

            {/* Empty state */}
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-2xl border border-border shadow-sm animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-5 shadow-inner">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">No jobs found</h2>
                <p className="text-base text-muted-foreground max-w-sm">
                  {searchedQuery
                    ? `No results for "${searchedQuery}". Try a different search.`
                    : "No jobs available yet. Check back soon!"}
                </p>
                {searchedQuery && (
                  <button
                    onClick={() => dispatch(setSearchedQuery(""))}
                    className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-all font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Show All Jobs
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedJobs.map((job) => (
                    <div key={job._id} className="animate-in fade-in zoom-in-95 duration-500">
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
  )
}

export default Browse