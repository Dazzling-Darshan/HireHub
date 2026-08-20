import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Pagination from './shared/Pagination';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { ExternalLink, CheckCircle2, XCircle, Clock, Check } from 'lucide-react';

const AppliedJobTable = ({ page, onPageChange }) => {
  const navigate = useNavigate();
  const { allAppliedJobs, appliedJobsPagination } = useSelector((store) => store.job);
  const { total = 0, totalPages = 1, limit = 10 } = appliedJobsPagination || {};

  return (
    <div>
      <div className="w-full overflow-x-auto rounded-xl border border-border shadow-sm">
        <Table className="min-w-full text-sm text-foreground">
          <TableCaption className="text-muted-foreground py-3">
            Real-time tracking of your job applications
          </TableCaption>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="font-bold text-muted-foreground py-4">Company & Role</TableHead>
              <TableHead className="font-bold text-muted-foreground py-4">Location</TableHead>
              <TableHead className="font-bold text-muted-foreground py-4">Applied Date</TableHead>
              <TableHead className="font-bold text-muted-foreground py-4">Application Progress</TableHead>
              <TableHead className="text-right font-bold text-muted-foreground py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!allAppliedJobs || allAppliedJobs.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground font-medium">
                  You haven't applied to any jobs yet. Start exploring active job openings!
                </TableCell>
              </TableRow>
            ) : (
              allAppliedJobs.map((app) => {
                const formattedDate = app?.createdAt
                  ? new Date(app.createdAt).toLocaleDateString("en-US", {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : "N/A";

                const isAccepted = app?.status === "accepted";
                const isRejected = app?.status === "rejected";
                const isPending = app?.status === "pending" || !app?.status;

                return (
                  <TableRow
                    key={app._id}
                    className="hover:bg-muted/30 transition-colors border-b border-border last:border-none"
                  >
                    {/* Company & Role */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-border rounded-xl shrink-0 bg-muted/40 p-1">
                          <AvatarImage
                            src={app.job?.company?.logo}
                            alt={app.job?.company?.name}
                            className="object-contain w-full h-full"
                          />
                          <AvatarFallback className="rounded-xl font-bold text-xs bg-primary/10 text-primary">
                            {app.job?.company?.name?.charAt(0) || "C"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground hover:text-primary transition-colors cursor-pointer truncate" onClick={() => navigate(`/description/${app.job?._id}`)}>
                            {app.job?.title || "N/A"}
                          </p>
                          <p className="text-xs text-muted-foreground font-medium truncate">
                            {app.job?.company?.name || "N/A"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Location */}
                    <TableCell className="py-4 text-muted-foreground font-medium">
                      {app.job?.location || "India"}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="py-4 text-muted-foreground font-medium">
                      {formattedDate}
                    </TableCell>

                    {/* Visual Progress Stepper */}
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1.5 min-w-[200px]">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className={isPending ? "text-amber-600 font-bold" : "text-muted-foreground"}>
                            1. Applied
                          </span>
                          <span className={isPending ? "text-amber-600 font-bold" : isAccepted ? "text-emerald-600 font-bold" : "text-muted-foreground"}>
                            2. In Review
                          </span>
                          <span className={isAccepted ? "text-emerald-600 font-bold" : isRejected ? "text-destructive font-bold" : "text-muted-foreground"}>
                            3. {isRejected ? "Rejected" : "Shortlisted"}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden flex">
                          <div className={`h-2 transition-all duration-500 ${isRejected ? "w-full bg-destructive" : isAccepted ? "w-full bg-emerald-500" : "w-1/2 bg-amber-500"}`} />
                        </div>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right py-4">
                      <button
                        onClick={() => navigate(`/description/${app.job?._id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
                        title="View Job Details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Details
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
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
  );
};

export default AppliedJobTable;
