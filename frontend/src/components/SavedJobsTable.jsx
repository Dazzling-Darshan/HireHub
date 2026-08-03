import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { useSelector, useDispatch } from 'react-redux'
import { toggleSaveJob } from '@/redux/jobSlice'
import { useNavigate } from 'react-router-dom'
import { Trash2, ExternalLink, Bookmark } from 'lucide-react'
import Pagination from './shared/Pagination'
import { PAGE_LIMITS, paginateArray, getTotalPages } from '@/utils/pagination'

const SavedJobsTable = ({ page, onPageChange }) => {
  const { savedJobs } = useSelector((store) => store.job)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const limit = PAGE_LIMITS.savedJobs

  const jobs = Array.isArray(savedJobs) ? savedJobs : [];
  const paginatedJobs = paginateArray(jobs, page, limit);
  const totalPages = getTotalPages(jobs.length, limit);

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-2xl border border-border shadow-sm">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-5 shadow-inner">
          <Bookmark className="w-7 h-7 text-muted-foreground" />
        </div>
        <p className="text-lg font-bold text-foreground mb-2">No saved jobs yet</p>
        <p className="text-base text-muted-foreground">Browse jobs and click "Save for Later" to see them here.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full overflow-x-auto rounded-xl border border-border shadow-sm">
        <Table className="min-w-full text-sm">
          <TableHeader className="bg-muted/50">
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="font-bold text-muted-foreground text-xs uppercase tracking-wide py-4">Job Role</TableHead>
              <TableHead className="font-bold text-muted-foreground text-xs uppercase tracking-wide py-4">Company</TableHead>
              <TableHead className="font-bold text-muted-foreground text-xs uppercase tracking-wide py-4">Location</TableHead>
              <TableHead className="font-bold text-muted-foreground text-xs uppercase tracking-wide py-4">Type</TableHead>
              <TableHead className="font-bold text-muted-foreground text-xs uppercase tracking-wide py-4">Salary</TableHead>
              <TableHead className="text-right font-bold text-muted-foreground text-xs uppercase tracking-wide py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedJobs.map((job) => (
              <TableRow
                key={job._id}
                className="border-b border-border last:border-none hover:bg-muted/30 transition-colors duration-200"
              >
                <TableCell className="py-4 font-bold text-foreground">{job?.title || 'N/A'}</TableCell>
                <TableCell className="py-4 text-muted-foreground font-medium">{job?.company?.name || 'N/A'}</TableCell>
                <TableCell className="py-4 text-muted-foreground font-medium">{job?.location || 'N/A'}</TableCell>
                <TableCell className="py-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold shadow-sm">
                    {job?.jobType || 'N/A'}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-600 border border-green-500/20 font-bold shadow-sm">
                    {job?.salary} LPA
                  </span>
                </TableCell>
                <TableCell className="text-right py-4">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      className="p-2 rounded-xl border border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/10 transition-all duration-200 shadow-sm"
                      onClick={() => navigate(`/description/${job._id}`)}
                      title="View job"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 rounded-xl border border-border text-muted-foreground hover:border-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 shadow-sm"
                      onClick={() => dispatch(toggleSaveJob(job))}
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        total={jobs.length}
        limit={limit}
        onPageChange={onPageChange}
      />
    </div>
  )
}

export default SavedJobsTable
