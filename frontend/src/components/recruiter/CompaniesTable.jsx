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
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Pagination from "../shared/Pagination";

const CompaniesTable = ({ page, onPageChange }) => {
  const { companies, companiesPagination } = useSelector((store) => store.company);
  const { total = 0, totalPages = 1, limit = 10 } = companiesPagination || {};
  const navigate = useNavigate();

  return (
    <div>
      <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
        <Table>
          <TableCaption className="py-4 text-[#64748B]">
            A list of your registered companies
          </TableCaption>

          <TableHeader className="bg-[#F8FAFC]">
            <TableRow>
              <TableHead className="font-semibold text-[#0F172A]">Logo</TableHead>
              <TableHead className="font-semibold text-[#0F172A]">Name</TableHead>
              <TableHead className="font-semibold text-[#0F172A]">Registered Date</TableHead>
              <TableHead className="text-right font-semibold text-[#0F172A]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!companies || companies.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-[#64748B] py-12"
                >
                  You haven't registered any company yet
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow key={company._id} className="hover:bg-[#F8FAFC] transition-colors">
                  <TableCell>
                    <Avatar className="h-11 w-11 border border-[#E2E8F0] rounded-lg">
                      <AvatarImage
                        src={
                          company?.logo ||
                          "https://img.freepik.com/premium-psd/best-company-logo-transparent-background_1101614-58913.jpg"
                        }
                      />
                    </Avatar>
                  </TableCell>

                  <TableCell className="font-medium text-[#0F172A]">
                    {company?.name}
                  </TableCell>

                  <TableCell className="text-[#64748B]">
                    {company?.createdAt?.split("T")[0]}
                  </TableCell>

                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors">
                          <MoreHorizontal className="h-5 w-5 cursor-pointer text-[#64748B] hover:text-[#2563EB]" />
                        </button>
                      </PopoverTrigger>

                      <PopoverContent className="w-32 p-1.5 rounded-xl border-[#E2E8F0]">
                        <div className="flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer hover:bg-[#F8FAFC] hover:text-[#2563EB] transition-colors" onClick={()=> navigate(`/admin/companies/${company._id}`)}>
                          <Edit2 size={16} />
                          <span className="text-sm font-medium">Edit Company</span>
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

export default CompaniesTable;
