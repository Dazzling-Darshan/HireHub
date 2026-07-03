import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") searchJobHandler();
  };

  return (
    <div className="text-center px-4 bg-[#F8FAFC]">
      <div className="flex flex-col gap-6 my-16 max-w-4xl mx-auto">

        {/* Badge */}
        <span className="px-5 py-2 mx-auto rounded-full bg-blue-50 text-[#2563EB] font-semibold text-sm border border-blue-100 shadow-sm">
          🚀 Your Career Journey Starts Here
        </span>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-[#0F172A]">
          Search, Apply &amp; <br />
          Get Your{" "}
          <span className="text-[#2563EB]">
            Dream Job
          </span>
        </h1>

        {/* Description */}
        <p className="text-[#64748B] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Connect with thousands of employers and discover opportunities that match your skills. Build your career with HireHub's intelligent job matching platform.
        </p>

        {/* Search Bar */}
        <div className="flex w-full sm:w-[70%] md:w-[60%] lg:w-[50%] shadow-md border border-[#E2E8F0] px-4 py-2 rounded-full items-center gap-3 mx-auto bg-white hover:shadow-lg hover:border-[#2563EB] transition-all duration-300">
          <input
            type="text"
            placeholder="Job title, company, or keyword..."
            className="outline-none border-none w-full text-[#0F172A] placeholder-[#64748B] bg-transparent text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] transition-all duration-200 px-4 py-2 shadow-sm"
            onClick={searchJobHandler}
          >
            <Search className="h-4 w-4 text-white" />
          </Button>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-8 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#0F172A]">50K+</p>
            <p className="text-xs text-[#64748B] mt-0.5">Active Jobs</p>
          </div>
          <div className="w-px h-8 bg-[#E2E8F0]" />
          <div className="text-center">
            <p className="text-2xl font-bold text-[#0F172A]">10K+</p>
            <p className="text-xs text-[#64748B] mt-0.5">Companies</p>
          </div>
          <div className="w-px h-8 bg-[#E2E8F0]" />
          <div className="text-center">
            <p className="text-2xl font-bold text-[#10B981]">2M+</p>
            <p className="text-xs text-[#64748B] mt-0.5">Hired Candidates</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;