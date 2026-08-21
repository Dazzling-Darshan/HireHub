import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal, Globe, MapPin, Plus, ExternalLink } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Pagination from "../shared/Pagination";

const CompaniesTable = ({ page, onPageChange }) => {
  const { companies, companiesPagination } = useSelector((store) => store.company);
  const { total = 0, totalPages = 1, limit = 10 } = companiesPagination || {};
  const navigate = useNavigate();

  return (
    <div>
      <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-bold text-muted-foreground w-16">Logo</TableHead>
              <TableHead className="font-bold text-muted-foreground">Company Name</TableHead>
              <TableHead className="font-bold text-muted-foreground hidden sm:table-cell">Location</TableHead>
              <TableHead className="font-bold text-muted-foreground hidden md:table-cell">Website</TableHead>
              <TableHead className="font-bold text-muted-foreground hidden lg:table-cell">Registered</TableHead>
              <TableHead className="text-right font-bold text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!companies || companies.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-16 font-medium"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-base font-bold text-foreground">No companies found</p>
                    <p className="text-xs text-muted-foreground">
                      Try searching with different keywords or register your first company.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow
                  key={company._id}
                  className="hover:bg-muted/30 transition-colors border-border"
                >
                  <TableCell>
                    <Avatar className="h-11 w-11 border border-border rounded-xl shadow-xs bg-white p-1 flex items-center justify-center overflow-hidden shrink-0">
                      <AvatarImage
                        src={company?.logo}
                        alt={company?.name || "Company"}
                        className="object-contain w-full h-full"
                      />
                      <AvatarFallback className="font-bold text-xs bg-primary/10 text-primary rounded-xl">
                        {(company?.name || "CO").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell>
                    <span className="font-bold text-foreground text-sm block">
                      {company?.name}
                    </span>
                    {company?.description && (
                      <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                        {company.description}
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                    {company?.location ? (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate max-w-[150px]">{company.location}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/60">Not specified</span>
                    )}
                  </TableCell>

                  <TableCell className="hidden md:table-cell text-sm">
                    {company?.website ? (
                      <a
                        href={
                          company.website.startsWith("http")
                            ? company.website
                            : `https://${company.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium inline-flex items-center gap-1 text-xs"
                      >
                        <Globe className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="truncate max-w-[140px]">{company.website.replace(/^https?:\/\//, "")}</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground/60">—</span>
                    )}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell text-muted-foreground font-medium text-xs">
                    {company?.createdAt ? new Date(company.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </TableCell>

                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="p-2 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border">
                          <MoreHorizontal className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-primary transition-colors" />
                        </button>
                      </PopoverTrigger>

                      <PopoverContent className="w-44 p-1.5 rounded-2xl border-border bg-card shadow-xl" align="end">
                        <div
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors text-xs font-bold"
                          onClick={() => navigate(`/admin/companies/${company._id}`)}
                        >
                          <Edit2 size={14} className="text-primary" />
                          <span>Edit Company</span>
                        </div>
                        <div
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors text-xs font-bold"
                          onClick={() => navigate(`/admin/jobs/create?companyId=${company._id}`)}
                        >
                          <Plus size={14} className="text-emerald-500" />
                          <span>Post Job Opening</span>
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
