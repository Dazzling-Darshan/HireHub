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
    <div className="text-center px-4 pt-16 pb-24 bg-gradient-to-b from-background to-muted/50">
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">

        {/* Badge */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="px-5 py-2 mx-auto rounded-full bg-primary/10 text-primary font-semibold text-sm border border-primary/20 shadow-sm backdrop-blur-sm">
            🚀 Your Career Journey Starts Here
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-foreground tracking-tight animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
          Search, Apply &amp; <br />
          Get Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">
            Dream Job
          </span>
        </h1>

        {/* Description */}
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          Connect with thousands of employers and discover opportunities that match your skills. Build your career with HireHub's intelligent job matching platform.
        </p>

        {/* Search Bar */}
        <div className="flex w-full sm:w-[80%] md:w-[70%] shadow-xl border border-border px-3 py-3 rounded-full items-center gap-3 mx-auto bg-card hover:shadow-2xl hover:border-primary/50 transition-all duration-500 transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
          <input
            type="text"
            placeholder="Job title, company, or keyword..."
            className="outline-none border-none w-full text-foreground placeholder:text-muted-foreground bg-transparent text-base px-4"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 px-6 py-6 shadow-md hover:shadow-lg"
            onClick={searchJobHandler}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-10 mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          <div className="text-center group">
            <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">50K+</p>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Active Jobs</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center group">
            <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">10K+</p>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Companies</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center group">
            <p className="text-3xl font-bold text-emerald-500 group-hover:text-emerald-600 transition-colors">2M+</p>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Hired Candidates</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;