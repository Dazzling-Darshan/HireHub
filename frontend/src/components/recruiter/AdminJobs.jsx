import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import Footer from "../Footer";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchJobByText } from "@/redux/jobSlice";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";

const AdminJobs = () => {
  const [page, setPage] = useState(1);
  const [input, setInput] = useState("");
  const [keyword, setKeyword] = useState("");

  useGetAllAdminJobs(page, 10, keyword);
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
        <div className="mb-8">
          <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
            Recruiters Portal
          </p>
          <h2 className="text-4xl font-extrabold text-foreground tracking-tight">
            Jobs Management
          </h2>
          <p className="text-muted-foreground mt-2 text-base">
            Manage your posted jobs, view applicants, and create new openings.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <Input
            className="max-w-sm bg-muted/50 border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all rounded-xl"
            placeholder="Search jobs by title or role..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-md hover:shadow-lg rounded-xl font-bold hover:-translate-y-0.5"
            onClick={() => navigate("/admin/jobs/create")}
          >
            + New Job
          </Button>
        </div>

        <AdminJobsTable page={page} onPageChange={setPage} />
      </div>
      <Footer />
    </div>
  );
};

export default AdminJobs;
