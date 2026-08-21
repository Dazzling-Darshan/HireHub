import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Edit2, Eye, MoreHorizontal, Users, MapPin, IndianRupee } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Pagination from "../shared/Pagination";

const AdminJobsTable = ({ page, onPageChange }) => {
  const navigate = useNavigate();

  const { allAdminJobs, adminJobsPagination } = useSelector(
    (store) => store.job
  );
  const { total = 0, totalPages = 1, limit = 10 } = adminJobsPagination || {};

  return (
    <div>
      <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-bold text-muted-foreground">Company</TableHead>
              <TableHead className="font-bold text-muted-foreground">Job Title</TableHead>
              <TableHead className="font-bold text-muted-foreground hidden sm:table-cell">Location</TableHead>
              <TableHead className="font-bold text-muted-foreground hidden md:table-cell">Salary</TableHead>
              <TableHead className="font-bold text-muted-foreground">Applicants</TableHead>
              <TableHead className="font-bold text-muted-foreground hidden lg:table-cell">Posted</TableHead>
              <TableHead className="text-right font-bold text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!allAdminJobs || allAdminJobs.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={7}
                  className="text-center py-16 text-muted-foreground font-medium"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-base font-bold text-foreground">No jobs posted yet</p>
                    <p className="text-xs text-muted-foreground">
                      Click "+ Post New Job" to publish your first opening.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              allAdminJobs.map((job) => {
                const applicantCount = Array.isArray(job?.applications)
                  ? job.applications.length
                  : 0;

                return (
                  <TableRow
                    key={job._id}
                    className="hover:bg-muted/30 transition-colors border-border"
                  >
                    {/* Company */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-border rounded-xl shadow-xs bg-white shrink-0 p-1 flex items-center justify-center overflow-hidden">
                          <AvatarImage
                            src={job?.company?.logo}
                            alt={job?.company?.name || "Company"}
                            className="object-contain w-full h-full"
                          />
                          <AvatarFallback className="font-bold text-xs bg-primary/10 text-primary rounded-xl">
                            {(job?.company?.name || "CO").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-foreground text-sm truncate max-w-[130px]">
                          {job?.company?.name || "Independent"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <span className="font-bold text-foreground text-sm block">
                        {job?.title || "Untitled Role"}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[11px] font-semibold text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                          {job?.jobType || "Full-Time"}
                        </span>
                        {job?.position && (
                          <span className="text-[11px] text-muted-foreground font-medium">
                            {job.position} {job.position === 1 ? "opening" : "openings"}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Location */}
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate max-w-[120px]">{job?.location || "Remote"}</span>
                      </span>
                    </TableCell>

                    {/* Salary */}
                    <TableCell className="hidden md:table-cell text-emerald-600 font-bold text-sm">
                      {job?.salary ? `₹${job.salary} LPA` : "Not disclosed"}
                    </TableCell>

                    {/* Applicants Badge */}
                    <TableCell>
                      <button
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-105 ${
                          applicantCount > 0
                            ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{applicantCount} {applicantCount === 1 ? "Applicant" : "Applicants"}</span>
                      </button>
                    </TableCell>

                    {/* Posted Date */}
                    <TableCell className="hidden lg:table-cell text-muted-foreground font-medium text-xs">
                      {job?.createdAt
                        ? new Date(job.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="p-2 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                          </button>
                        </PopoverTrigger>

                        <PopoverContent
                          className="w-48 p-1.5 rounded-2xl border-border bg-card shadow-xl"
                          align="end"
                        >
                          <div
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors text-xs font-bold"
                            onClick={() => navigate(`/admin/jobs/${job._id}`)}
                          >
                            <Edit2 size={14} className="text-primary" />
                            <span>Edit Job</span>
                          </div>

                          <div
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors text-xs font-bold"
                            onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                          >
                            <Users size={14} className="text-indigo-500" />
                            <span>View Applicants ({applicantCount})</span>
                          </div>
                        </PopoverContent>
                      </Popover>
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

export default AdminJobsTable;
