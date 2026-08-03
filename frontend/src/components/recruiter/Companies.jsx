import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import Footer from "../Footer";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice";

const Companies = () => {
  const [page, setPage] = useState(1);
  const [input, setInput] = useState("");
  const [keyword, setKeyword] = useState("");

  useGetAllCompanies(page, 10, keyword);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
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
            Company Management
          </h2>
          <p className="text-muted-foreground mt-2 text-base">
            Manage your registered companies and organization details.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <Input
            className="max-w-sm bg-muted/50 border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all rounded-xl"
            placeholder="Search company by name..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-md hover:shadow-lg rounded-xl font-bold hover:-translate-y-0.5"
            onClick={() => navigate("/admin/companies/create")}
          >
            + New Company
          </Button>
        </div>

        <CompaniesTable page={page} onPageChange={setPage} />
      </div>
      <Footer />
    </div>
  );
};

export default Companies;
