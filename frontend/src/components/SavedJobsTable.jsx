import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { useSelector, useDispatch } from 'react-redux'
import { toggleSaveJob } from '@/redux/jobSlice'
import { useNavigate } from 'react-router-dom'
import { Trash2, ExternalLink, Bookmark } from 'lucide-react'
import Pagination from './shared/Pagination'
import { PAGE_LIMITS, paginateArray, getTotalPages } from '@/utils/pagination'

const SavedJobsTable = () => {
  const { savedJobs } = useSelector((store) => store.job)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const limit = PAGE_LIMITS.savedJobs

  const jobs = Array.isArray(savedJobs) ? savedJobs : [];
  const paginatedJobs = paginateArray(jobs, page, limit);
  const totalPages = getTotalPages(jobs.length, limit);

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 bg-[#F8FAFC] rounded-full border border-[#E2E8F0] flex items-center justify-center mb-4">
          <Bookmark className="w-6 h-6 text-[#64748B]" />
        </div>
        <p className="font-medium text-[#0F172A] mb-1">No saved jobs yet</p>
        <p className="text-sm text-[#64748B]">Browse jobs and click "Save for Later" to see them here.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full overflow-x-auto rounded-lg border border-[#E2E8F0]">
        <Table className="min-w-full text-sm">
          <TableHeader className="bg-[#F8FAFC]">
            <TableRow className="border-b border-[#E2E8F0]">
              <TableHead className="font-semibold text-[#64748B] text-xs uppercase tracking-wide py-3">Job Role</TableHead>
              <TableHead className="font-semibold text-[#64748B] text-xs uppercase tracking-wide py-3">Company</TableHead>
              <TableHead className="font-semibold text-[#64748B] text-xs uppercase tracking-wide py-3">Location</TableHead>
              <TableHead className="font-semibold text-[#64748B] text-xs uppercase tracking-wide py-3">Type</TableHead>
              <TableHead className="font-semibold text-[#64748B] text-xs uppercase tracking-wide py-3">Salary</TableHead>
              <TableHead className="text-right font-semibold text-[#64748B] text-xs uppercase tracking-wide py-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedJobs.map((job) => (
              <TableRow
                key={job._id}
                className="border-b border-[#E2E8F0] last:border-none hover:bg-[#F8FAFC] transition-colors duration-150"
              >
                <TableCell className="py-3.5 font-semibold text-[#0F172A]">{job?.title || 'N/A'}</TableCell>
                <TableCell className="py-3.5 text-[#64748B]">{job?.company?.name || 'N/A'}</TableCell>
                <TableCell className="py-3.5 text-[#64748B]">{job?.location || 'N/A'}</TableCell>
                <TableCell className="py-3.5">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100 font-medium">
                    {job?.jobType || 'N/A'}
                  </span>
                </TableCell>
                <TableCell className="py-3.5">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-[#10B981] border border-emerald-100 font-medium">
                    {job?.salary} LPA
                  </span>
                </TableCell>
                <TableCell className="text-right py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="p-1.5 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-blue-50 transition-all duration-150"
                      onClick={() => navigate(`/description/${job._id}`)}
                      title="View job"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#EF4444] hover:text-[#EF4444] hover:bg-red-50 transition-all duration-150"
                      onClick={() => dispatch(toggleSaveJob(job))}
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
        onPageChange={setPage}
      />
    </div>
  )
}

export default SavedJobsTable
