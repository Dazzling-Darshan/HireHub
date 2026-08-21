import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import Footer from "../Footer";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchJobByText } from "@/redux/jobSlice";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { Briefcase, Search, X, PlusCircle } from "lucide-react";

const AdminJobs = () => {
  const [page, setPage] = useState(1);
  const [input, setInput] = useState("");
  const [keyword, setKeyword] = useState("");

  useGetAllAdminJobs(page, 10, keyword);
  const { adminJobsPagination } = useSelector((store) => store.job);
  const total = adminJobsPagination?.total || 0;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(input);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [input]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20 uppercase tracking-wider">
                Recruiter Portal
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                {total} {total === 1 ? "Job" : "Jobs"} Active
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Job Openings Management
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Post new requisitions, edit active listings, track candidate applications, and update hiring statuses.
            </p>
          </div>

          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-md hover:shadow-lg rounded-xl font-bold hover:-translate-y-0.5 gap-2 px-6 h-11 self-start md:self-auto"
            onClick={() => navigate("/admin/jobs/create")}
          >
            <PlusCircle className="w-4 h-4" />
            Post New Job
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-10 pr-9 bg-muted/40 border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all rounded-xl h-11 text-sm"
              placeholder="Search by job title, location, type, or skills..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {input && (
              <button
                onClick={() => setInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <AdminJobsTable page={page} onPageChange={setPage} />
      </div>
      <Footer />
    </div>
  );
};

export default AdminJobs;
