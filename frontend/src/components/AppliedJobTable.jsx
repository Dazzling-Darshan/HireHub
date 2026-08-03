import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { useSelector } from 'react-redux'
import Pagination from './shared/Pagination'

const AppliedJobTable = ({ page, onPageChange }) => {
  const { allAppliedJobs, appliedJobsPagination } = useSelector((store) => store.job);
  const { total = 0, totalPages = 1, limit = 10 } = appliedJobsPagination || {};

  return (
    <div>
      <div className="w-full overflow-x-auto rounded-xl border border-border shadow-sm">
        <Table className="min-w-full text-sm text-foreground">
          <TableCaption className="text-muted-foreground py-3">
            A list of your applied jobs
          </TableCaption>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="font-bold text-muted-foreground">Date Applied</TableHead>
              <TableHead className="font-bold text-muted-foreground">Job Role</TableHead>
              <TableHead className="font-bold text-muted-foreground">Company</TableHead>
              <TableHead className="text-right font-bold text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              !allAppliedJobs || allAppliedJobs.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground font-medium">
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
                      className="hover:bg-muted/30 transition-colors border-b border-border last:border-none"
                    >
                      <TableCell className="py-4 text-muted-foreground font-medium">
                        {formattedDate}
                      </TableCell>
                      <TableCell className="py-4 font-bold text-foreground">
                        {app.job?.title || "N/A"}
                      </TableCell>
                      <TableCell className="py-4 text-muted-foreground font-medium">
                        {app.job?.company?.name || "N/A"}
                      </TableCell>
                      <TableCell className="text-right py-4">
                        {app?.status === "accepted" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-600 border border-green-500/20 shadow-sm">
                            Shortlisted
                          </span>
                        )}
                        {app?.status === "rejected" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-destructive/10 text-destructive border border-destructive/20 shadow-sm">
                            Rejected
                          </span>
                        )}
                        {app?.status === "pending" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600 border border-orange-500/20 shadow-sm">
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
