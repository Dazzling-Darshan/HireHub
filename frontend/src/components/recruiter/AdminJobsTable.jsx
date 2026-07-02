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
      <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
        <Table>
          <TableCaption className="py-4 text-[#64748B]">
            A list of your posted jobs
          </TableCaption>

          <TableHeader className="bg-[#F8FAFC]">
            <TableRow>
              <TableHead className="font-semibold text-[#0F172A]">Company Name</TableHead>
              <TableHead className="font-semibold text-[#0F172A]">Role</TableHead>
              <TableHead className="font-semibold text-[#0F172A]">Posted Date</TableHead>
              <TableHead className="text-right font-semibold text-[#0F172A]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!allAdminJobs || allAdminJobs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-12 text-[#64748B]"
                >
                  No jobs posted yet
                </TableCell>
              </TableRow>
            ) : (
              allAdminJobs.map((job) => (
                <TableRow
                  key={job._id}
                  className="hover:bg-[#F8FAFC] transition-colors"
                >
                  <TableCell className="font-medium text-[#0F172A]">
                    {job?.company?.name || "N/A"}
                  </TableCell>

                  <TableCell className="text-[#0F172A]">
                    {job?.title || "N/A"}
                  </TableCell>

                  <TableCell className="text-[#64748B]">
                    {job?.createdAt?.split("T")[0] || "N/A"}
                  </TableCell>

                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors">
                          <MoreHorizontal className="h-5 w-5 text-[#64748B] hover:text-[#2563EB]" />
                        </button>
                      </PopoverTrigger>

                      <PopoverContent
                        className="w-48 p-1.5 rounded-xl border-[#E2E8F0]"
                        align="end"
                      >
                        <div
                          className="flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer transition-all duration-200 hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                          onClick={() =>
                            navigate(`/admin/jobs/${job._id}`)
                          }
                        >
                          <Edit2 size={16} />
                          <span className="text-sm font-medium">
                            Edit Job
                          </span>
                        </div>

                        <div
                          className="mt-1 flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:text-[#2563EB]"
                          onClick={() =>
                            navigate(
                              `/admin/jobs/${job._id}/applicants`
                            )
                          }
                        >
                          <Eye size={16} />
                          <span className="text-sm font-medium">
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
