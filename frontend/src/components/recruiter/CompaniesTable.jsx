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
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableCaption className="py-4 text-muted-foreground">
            A list of your registered companies
          </TableCaption>

          <TableHeader className="bg-muted/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-bold text-muted-foreground">Logo</TableHead>
              <TableHead className="font-bold text-muted-foreground">Name</TableHead>
              <TableHead className="font-bold text-muted-foreground">Registered Date</TableHead>
              <TableHead className="text-right font-bold text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!companies || companies.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-12 font-medium"
                >
                  You haven't registered any company yet
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow key={company._id} className="hover:bg-muted/30 transition-colors border-border">
                  <TableCell>
                    <Avatar className="h-12 w-12 border border-border rounded-xl shadow-sm">
                      <AvatarImage
                        src={
                          company?.logo ||
                          "https://img.freepik.com/premium-psd/best-company-logo-transparent-background_1101614-58913.jpg"
                        }
                      />
                    </Avatar>
                  </TableCell>

                  <TableCell className="font-bold text-foreground">
                    {company?.name}
                  </TableCell>

                  <TableCell className="text-muted-foreground font-medium">
                    {company?.createdAt?.split("T")[0]}
                  </TableCell>

                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="p-2.5 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border">
                          <MoreHorizontal className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-primary transition-colors" />
                        </button>
                      </PopoverTrigger>

                      <PopoverContent className="w-40 p-2 rounded-xl border-border bg-card shadow-lg">
                        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors" onClick={()=> navigate(`/admin/companies/${company._id}`)}>
                          <Edit2 size={16} className="text-primary" />
                          <span className="text-sm font-bold">Edit Company</span>
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
