import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { useSelector } from 'react-redux'
import Pagination from './shared/Pagination'

const AppliedJobTable = ({ page, onPageChange }) => {
  const { allAppliedJobs, appliedJobsPagination } = useSelector((store) => store.job);
  const { total = 0, totalPages = 1, limit = 10 } = appliedJobsPagination || {};

  return (
    <div>
      <div className="w-full overflow-x-auto rounded-xl border border-gray-100 shadow-xs">
        <Table className="min-w-full text-sm text-gray-700">
          <TableCaption className="text-gray-550 py-3">
            A list of your applied jobs
          </TableCaption>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-b border-gray-100">
              <TableHead className="font-semibold text-gray-600">Date Applied</TableHead>
              <TableHead className="font-semibold text-gray-600">Job Role</TableHead>
              <TableHead className="font-semibold text-gray-600">Company</TableHead>
              <TableHead className="text-right font-semibold text-gray-600">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              !allAppliedJobs || allAppliedJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-gray-400">
                    You haven't applied to any jobs yet.
                  </TableCell>
                </TableRow>
              ) : (
                allAppliedJobs.map((app) => {
                  const formattedDate = app?.createdAt ? new Date(app.createdAt).toLocaleDateString("en-US", {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : "N/A";

                  return (
                    <TableRow 
                      key={app._id} 
                      className="hover:bg-gray-50/30 transition border-b border-gray-100 last:border-none"
                    >
                      <TableCell className="py-3.5 text-gray-600 font-medium">
                        {formattedDate}
                      </TableCell>
                      <TableCell className="py-3.5 font-semibold text-gray-800">
                        {app.job?.title || "N/A"}
                      </TableCell>
                      <TableCell className="py-3.5 text-gray-600">
                        {app.job?.company?.name || "N/A"}
                      </TableCell>
                      <TableCell className="text-right py-3.5">
                        {app?.status === "accepted" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-55/10 text-emerald-700 border border-emerald-250">
                            Shortlisted
                          </span>
                        )}
                        {app?.status === "rejected" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-55/10 text-rose-700 border border-rose-250">
                            Rejected
                          </span>
                        )}
                        {app?.status === "pending" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-55/10 text-amber-700 border border-amber-250">
                            Pending
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )
            }
          </TableBody>
        </Table>
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={onPageChange}
      />
    </div>
  )
}

export default AppliedJobTable
