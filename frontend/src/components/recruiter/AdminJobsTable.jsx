import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
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
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
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
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableCaption className="py-4 text-muted-foreground">
            A list of your posted jobs
          </TableCaption>

          <TableHeader className="bg-muted/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-bold text-muted-foreground">Company Name</TableHead>
              <TableHead className="font-bold text-muted-foreground">Role</TableHead>
              <TableHead className="font-bold text-muted-foreground">Posted Date</TableHead>
              <TableHead className="text-right font-bold text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!allAdminJobs || allAdminJobs.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={4}
                  className="text-center py-12 text-muted-foreground font-medium"
                >
                  No jobs posted yet
                </TableCell>
              </TableRow>
            ) : (
              allAdminJobs.map((job) => (
                <TableRow
                  key={job._id}
                  className="hover:bg-muted/30 transition-colors border-border"
                >
                  <TableCell className="font-bold text-foreground">
                    {job?.company?.name || "N/A"}
                  </TableCell>

                  <TableCell className="font-medium text-foreground">
                    {job?.title || "N/A"}
                  </TableCell>

                  <TableCell className="text-muted-foreground font-medium">
                    {job?.createdAt?.split("T")[0] || "N/A"}
                  </TableCell>

                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="p-2.5 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border">
                          <MoreHorizontal className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                        </button>
                      </PopoverTrigger>

                      <PopoverContent
                        className="w-48 p-2 rounded-xl border-border bg-card shadow-lg"
                        align="end"
                      >
                        <div
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-colors hover:bg-primary/10 hover:text-primary"
                          onClick={() =>
                            navigate(`/admin/jobs/${job._id}`)
                          }
                        >
                          <Edit2 size={16} className="text-primary" />
                          <span className="text-sm font-bold">
                            Edit Job
                          </span>
                        </div>

                        <div
                          className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-colors hover:bg-primary/10 hover:text-primary"
                          onClick={() =>
                            navigate(
                              `/admin/jobs/${job._id}/applicants`
                            )
                          }
                        >
                          <Eye size={16} className="text-primary" />
                          <span className="text-sm font-bold">
                            View Applicants
                          </span>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
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
