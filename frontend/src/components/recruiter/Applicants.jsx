import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import Footer from "../Footer";
import ApplicantsTable from "./ApplicantsTable";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetApplicants from "@/hooks/useGetApplicants";
import { ArrowLeft, Users, UserCheck, UserX, Clock, Search, X, Filter } from "lucide-react";
import { Input } from "../ui/input";

const Applicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useGetApplicants(id, page);

  const { applicants, applicantStats } = useSelector((store) => store.application);

  const totalApplicants = applicantStats?.total || 0;
  const acceptedApplicants = applicantStats?.accepted || 0;
  const rejectedApplicants = applicantStats?.rejected || 0;
  const pendingApplicants = applicantStats?.pending || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-500">
        {/* Back Button & Header */}
        <div className="flex flex-col gap-4 mb-8">
          <button
            onClick={() => navigate("/admin/jobs")}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit text-sm font-bold cursor-pointer bg-transparent border-none"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Applicants Manager
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base font-medium">
                {applicants?.title ? (
                  <>
                    Managing candidates for{" "}
                    <span className="font-bold text-foreground">
                      {applicants.title}
                    </span>{" "}
                    at{" "}
                    <span className="font-bold text-foreground">
                      {applicants?.company?.name || "Company"}
                    </span>
                  </>
                ) : (
                  "Screen, evaluate, and update hiring decision statuses for this job."
                )}
              </p>
            </div>

            <div className="bg-primary/10 text-primary font-bold px-5 py-2 rounded-full text-sm border border-primary/20 w-fit shadow-xs">
              Total Applicants: {totalApplicants}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Total */}
          <div
            onClick={() => setStatusFilter("all")}
            className={`bg-card rounded-2xl border p-5 shadow-xs cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
              statusFilter === "all"
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-primary/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Total Applied
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1.5">
                  {totalApplicants}
                </h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Shortlisted */}
          <div
            onClick={() => setStatusFilter("accepted")}
            className={`bg-card rounded-2xl border p-5 shadow-xs cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
              statusFilter === "accepted"
                ? "border-emerald-500 ring-2 ring-emerald-500/20"
                : "border-border hover:border-emerald-500/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Shortlisted
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1.5">
                  {acceptedApplicants}
                </h3>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div
            onClick={() => setStatusFilter("pending")}
            className={`bg-card rounded-2xl border p-5 shadow-xs cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
              statusFilter === "pending"
                ? "border-amber-500 ring-2 ring-amber-500/20"
                : "border-border hover:border-amber-500/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Pending Review
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-500 mt-1.5">
                  {pendingApplicants}
                </h3>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div
            onClick={() => setStatusFilter("rejected")}
            className={`bg-card rounded-2xl border p-5 shadow-xs cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
              statusFilter === "rejected"
                ? "border-destructive ring-2 ring-destructive/20"
                : "border-border hover:border-destructive/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Rejected
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-destructive mt-1.5">
                  {rejectedApplicants}
                </h3>
              </div>
              <div className="p-3 bg-destructive/10 rounded-xl text-destructive">
                <UserX className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-10 pr-9 bg-muted/40 border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all rounded-xl h-11 text-sm"
              placeholder="Search candidate by name, email, skills, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-xl border border-border self-start sm:self-auto">
            {["all", "accepted", "pending", "rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                  statusFilter === tab
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "all" ? "All Candidates" : tab === "accepted" ? "Shortlisted" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Applicants Table */}
        <div className="bg-card rounded-3xl border border-border shadow-xl p-6 sm:p-8">
          <ApplicantsTable
            page={page}
            onPageChange={setPage}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Applicants;
