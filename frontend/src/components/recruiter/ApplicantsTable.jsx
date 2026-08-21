import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  MoreHorizontal,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { updateApplicantStatus } from "@/redux/applicationSlice";
import { APPLICATION_API_ENDPOINT } from "@/utils/constant";
import axios from "axios";
import { toast } from "sonner";
import Pagination from "../shared/Pagination";

const ApplicantsTable = ({ page, onPageChange, searchQuery = "", statusFilter = "all" }) => {
  const { applicants, applicantsPagination } = useSelector((store) => store.application);
  const { total = 0, totalPages = 1, limit = 10 } = applicantsPagination || {};
  const dispatch = useDispatch();

  const statusHandler = async (status, id) => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_ENDPOINT}/status/${id}/update`,
        { status },
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(updateApplicantStatus({ id, status }));
        toast.success(res.data.message || `Status updated to ${status}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const applications = applicants?.applications || [];

  // Filter applications by search query and status filter
  const filteredApplications = applications.filter((app) => {
    const candidate = app?.applicant;
    const nameMatch = candidate?.fullName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const emailMatch = candidate?.email
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const phoneMatch = candidate?.phoneNumber
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const skillsMatch = Array.isArray(candidate?.profile?.skills)
      ? candidate.profile.skills.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : false;
    const resumeMatch = candidate?.profile?.resumeOriginalName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesSearch =
      !searchQuery ||
      nameMatch ||
      emailMatch ||
      phoneMatch ||
      skillsMatch ||
      resumeMatch;

    const currentStatus = (app?.status || "pending").toLowerCase();
    const matchesStatus =
      statusFilter === "all" || currentStatus === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-bold text-muted-foreground">Candidate</TableHead>
              <TableHead className="font-bold text-muted-foreground hidden sm:table-cell">Contact & Skills</TableHead>
              <TableHead className="font-bold text-muted-foreground">Resume</TableHead>
              <TableHead className="font-bold text-muted-foreground hidden md:table-cell">Applied Date</TableHead>
              <TableHead className="font-bold text-muted-foreground">Status</TableHead>
              <TableHead className="text-right font-bold text-muted-foreground">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredApplications.length === 0 ? (
              <TableRow className="hover:bg-transparent border-border">
                <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-base font-bold text-foreground">
                      No matching applicants found
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {searchQuery
                        ? "Try clearing your search query or adjusting your filters."
                        : "Candidates will appear here as soon as they apply for this role."}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredApplications.map((app) => {
                const candidate = app?.applicant;
                const formattedDate = app?.createdAt
                  ? new Date(app.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A";

                const currentStatus = (app?.status || "pending").toLowerCase();

                return (
                  <TableRow
                    key={app._id}
                    className="hover:bg-muted/30 transition-colors border-border"
                  >
                    {/* Candidate Name & Bio */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-sm">
                          {candidate?.fullName || "Anonymous Candidate"}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 sm:hidden">
                          <Mail className="w-3 h-3 text-primary" />
                          {candidate?.email}
                        </span>
                        {candidate?.profile?.bio && (
                          <span className="text-[11px] text-muted-foreground line-clamp-1 max-w-[200px] mt-0.5 italic">
                            "{candidate.profile.bio}"
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Contact & Skills */}
                    <TableCell className="hidden sm:table-cell">
                      <div className="space-y-1">
                        <div className="text-xs text-foreground font-medium flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-primary" />
                          <span>{candidate?.email || "No email"}</span>
                        </div>
                        {candidate?.phoneNumber && (
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span>{candidate.phoneNumber}</span>
                          </div>
                        )}
                        {/* Skills preview tags */}
                        {Array.isArray(candidate?.profile?.skills) &&
                          candidate.profile.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1 max-w-[250px]">
                              {candidate.profile.skills.slice(0, 3).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-foreground font-medium border border-border"
                                >
                                  {skill}
                                </span>
                              ))}
                              {candidate.profile.skills.length > 3 && (
                                <span className="text-[10px] text-muted-foreground font-semibold">
                                  +{candidate.profile.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                      </div>
                    </TableCell>

                    {/* Resume */}
                    <TableCell>
                      {candidate?.profile?.resume ? (
                        <a
                          href={candidate.profile.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-bold transition-colors inline-flex items-center gap-1.5 text-xs bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 hover:bg-primary/10"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span className="max-w-[120px] truncate">
                            {candidate.profile.resumeOriginalName || "View PDF"}
                          </span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-xs font-medium">
                          No resume
                        </span>
                      )}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="hidden md:table-cell text-muted-foreground font-medium text-xs">
                      {formattedDate}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {currentStatus === "accepted" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3" /> Shortlisted
                        </span>
                      )}
                      {currentStatus === "rejected" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-destructive/10 text-destructive border border-destructive/20">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                      {currentStatus === "pending" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </TableCell>

                    {/* Action Dropdown */}
                    <TableCell className="text-right">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="p-2 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border">
                            <MoreHorizontal className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-primary transition-colors" />
                          </button>
                        </PopoverTrigger>

                        <PopoverContent
                          className="w-44 p-1.5 rounded-2xl border-border bg-card shadow-xl"
                          align="end"
                        >
                          <div
                            onClick={() => statusHandler("accepted", app._id)}
                            className="flex items-center gap-2 rounded-xl px-3 py-2 cursor-pointer hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors text-xs font-bold text-foreground"
                          >
                            <CheckCircle size={14} className="text-emerald-500" />
                            <span>Shortlist Candidate</span>
                          </div>

                          <div
                            onClick={() => statusHandler("pending", app._id)}
                            className="flex items-center gap-2 rounded-xl px-3 py-2 cursor-pointer hover:bg-amber-500/10 hover:text-amber-600 transition-colors text-xs font-bold text-foreground"
                          >
                            <Clock size={14} className="text-amber-500" />
                            <span>Mark as Pending</span>
                          </div>

                          <div
                            onClick={() => statusHandler("rejected", app._id)}
                            className="flex items-center gap-2 rounded-xl px-3 py-2 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors text-xs font-bold text-foreground"
                          >
                            <XCircle size={14} className="text-destructive" />
                            <span>Reject Candidate</span>
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

export default ApplicantsTable;