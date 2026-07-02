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
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider mb-2">
            Recruiters Portal
          </p>
          <h2 className="text-3xl font-bold text-[#0F172A]">
            Jobs Management
          </h2>
          <p className="text-[#64748B] mt-2 text-sm">
            Manage your posted jobs, view applicants, and create new openings.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <Input
            className="max-w-sm bg-white border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
            placeholder="Search jobs by title or role..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <Button
            className="bg-[#2563EB] hover:bg-[#1D4ED8] transition-all duration-200 shadow-sm"
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
