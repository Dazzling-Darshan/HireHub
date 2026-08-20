import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search, Sparkles, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (customQuery) => {
    const searchText = typeof customQuery === "string" ? customQuery : query;
    if (searchText.trim()) {
      dispatch(setSearchedQuery(searchText.trim()));
      navigate("/browse");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") searchJobHandler();
  };

  const popularTags = ["React", "Fullstack", "Frontend", "Backend", "AI / ML", "Remote"];

  return (
    <div className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
      
      {/* Dynamic Animated Ambient Gradient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] md:w-[850px] md:h-[500px] bg-gradient-to-tr from-primary/25 via-violet-500/20 to-pink-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulseGlow" />
      <div className="absolute top-12 left-10 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-float" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-float-delayed" />

      <div className="flex flex-col items-center text-center px-4 sm:px-6 max-w-5xl mx-auto">

        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-border shadow-sm backdrop-blur-md mb-8 hover:scale-105 transition-transform">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs sm:text-sm font-semibold text-foreground tracking-wide">
            Over 25,000+ Top Tech Jobs Live Today
          </span>
        </div>

        {/* Giant Hero Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.08] tracking-tight text-foreground max-w-4xl">
          Find, Match &amp; Land Your{" "}
          <span className="bg-gradient-to-r from-primary via-violet-500 to-indigo-400 bg-clip-text text-transparent animate-gradient">
            Dream Job
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-muted-foreground max-w-2xl font-normal leading-relaxed">
          AI-powered skill matching connects top candidates directly with world-class engineering &amp; product teams.
        </p>

        {/* Elevated Search Bar */}
        <div className="mt-10 w-full max-w-2xl p-2 rounded-2xl sm:rounded-full bg-card/90 border border-border/80 shadow-2xl backdrop-blur-xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-0.5">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center w-full px-4 py-1.5 gap-3">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Job title, tech stack, or company..."
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base font-medium"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button
              onClick={() => searchJobHandler()}
              className="w-full sm:w-auto px-8 py-6 rounded-xl sm:rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/25 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              Search Jobs
            </Button>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5 text-xs">
          <span className="text-muted-foreground font-medium mr-1">Popular:</span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => searchJobHandler(tag)}
              className="px-3 py-1 rounded-full bg-muted/60 hover:bg-primary/15 hover:text-primary border border-border/60 text-muted-foreground transition-all duration-200 cursor-pointer font-medium"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 mt-14 pt-10 border-t border-border/60 w-full max-w-3xl">
          <div className="p-4 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-sm">
            <p className="text-2xl sm:text-4xl font-black text-foreground">24+</p>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Active Tech Roles</p>
          </div>
          <div className="p-4 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-sm">
            <p className="text-2xl sm:text-4xl font-black text-foreground">8+</p>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Tier-1 Companies</p>
          </div>
          <div className="col-span-2 md:col-span-1 p-4 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-sm">
            <p className="text-2xl sm:text-4xl font-black text-emerald-500">92%</p>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Skill Match Rate</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;