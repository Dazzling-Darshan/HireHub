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

const fuzzyMatchJob = (job, query) => {
  if (!query || !query.trim()) return true;
  const q = query.toLowerCase().trim();
  const searchTokens = q.split(/\s+/).filter(Boolean);
  if (searchTokens.length === 0) return true;

  const targetText = `${job?.title || ''} ${job?.description || ''} ${job?.company?.name || ''} ${job?.location || ''} ${(job?.requirements || []).join(' ')} ${job?.jobType || ''}`.toLowerCase();

  // Direct substring match
  if (targetText.includes(q)) return true;

  // 70-80% Token overlap match
  let matchedTokens = 0;
  searchTokens.forEach((token) => {
    if (targetText.includes(token)) {
      matchedTokens++;
    } else {
      const words = targetText.split(/\s+/);
      const partialFound = words.some((word) => {
        if (word.length >= 4 && token.length >= 4) {
          return word.includes(token) || token.includes(word);
        }
        return false;
      });
      if (partialFound) matchedTokens += 0.8;
    }
  });

  return (matchedTokens / searchTokens.length) >= 0.7;
};

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
    experience: [],
    salary: []
  });

  useEffect(() => {
    setPage(1);
  }, [searchedQuery, filters]);

  useEffect(() => {
    let result = [...allJobs];

    // Apply 70-80% fuzzy search query
    if (searchedQuery && searchedQuery.trim() !== "") {
      result = result.filter((job) => fuzzyMatchJob(job, searchedQuery));
    }

    // Apply filters
    if (filters.location && filters.location.length > 0) {
      result = result.filter(job =>
        filters.location.some(loc =>
          job?.location?.toLowerCase().includes(loc.toLowerCase()) ||
          loc.toLowerCase().includes(job?.location?.toLowerCase())
        )
      );
    }
    if (filters.title && filters.title.length > 0) {
      result = result.filter(job => filters.title.some(title => job?.title?.toLowerCase().includes(title.toLowerCase())));
    }
    if (filters.jobType && filters.jobType.length > 0) {
      result = result.filter(job => filters.jobType.some(jt => job?.jobType?.toLowerCase().includes(jt.toLowerCase())));
    }
    if (filters.experience && filters.experience.length > 0) {
      result = result.filter((job) => {
        const exp = Number(job?.experience) || 0;
        return filters.experience.some((expRange) => {
          if (expRange.includes('Fresher')) return exp === 0;
          if (expRange.includes('1-2')) return exp >= 1 && exp <= 2;
          if (expRange.includes('3-4')) return exp >= 3 && exp <= 4;
          if (expRange.includes('5+')) return exp >= 5;
          return true;
        });
      });
    }
    if (filters.salary && filters.salary.length > 0) {
      result = result.filter(job => {
        const salary = Number(job?.salary) || 0;
        return filters.salary.some(range => {
          if (range === "0-10") return salary >= 0 && salary <= 10;
          if (range === "11-20") return salary >= 11 && salary <= 20;
          if (range === "21-30") return salary >= 21 && salary <= 30;
          if (range === "30+" || range === "40+") return salary >= 30;
          return true;
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