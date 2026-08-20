import { Bookmark, BookmarkCheck, MapPin, Sparkles } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSaveJob } from "@/redux/jobSlice";
import { toast } from "sonner";
import { formatSalary } from "./LatestJobCards";
import { calculateSkillMatch } from "@/utils/skillMatcher";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { savedJobs } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const isSaved = Array.isArray(savedJobs) && savedJobs.some((j) => j._id === job?._id);

  const skillMatch = user?.role === "student"
    ? calculateSkillMatch(user?.profile?.skills, job?.requirements)
    : null;

  const daysAgoFunction = (mongodbTime) => {
    if (!mongodbTime) return "Recently";
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    const days = Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    return days === 0 ? "Posted today" : `${days}d ago`;
  };

  const handleSaveToggle = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to save jobs");
      return;
    }
    if (job) dispatch(toggleSaveJob(job));
  };

  return (
    <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between h-full min-h-[350px]">
      <div>
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-muted-foreground font-medium">
            {daysAgoFunction(job?.createdAt)}
          </span>

          <div className="flex items-center gap-2">
            {skillMatch && skillMatch.percentage > 0 && (
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1 ${skillMatch.colorClass}`}>
                <Sparkles className="w-3 h-3" />
                {skillMatch.percentage}% Match
              </span>
            )}
            <button
              onClick={handleSaveToggle}
              className={`p-1.5 rounded-full transition-all duration-300 ${
                isSaved
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-primary"
              }`}
              title={isSaved ? "Remove from saved" : "Save for later"}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Company Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-12 h-12 border border-border rounded-xl shrink-0 shadow-sm bg-muted/40 p-1">
            <AvatarImage src={job?.company?.logo} alt={job?.company?.name} className="object-contain w-full h-full" />
            <AvatarFallback className="rounded-xl font-bold text-base bg-primary/10 text-primary">
              {job?.company?.name?.charAt(0) || "C"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground text-base leading-tight group-hover:text-primary transition-colors truncate">
              {job?.company?.name || "Company"}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground font-medium truncate">
                {job?.location || "India"}
              </span>
            </div>
          </div>
        </div>

        {/* Job title & description */}
        <div className="mb-4">
          <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-1">
            {job?.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {job?.description}
          </p>
        </div>

        {/* Badges */}
        <div className="flex items-center flex-wrap gap-2 mb-4">
          <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
            {job?.position || 1} Position{Number(job?.position) > 1 ? "s" : ""}
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 font-semibold border border-orange-500/20">
            {job?.jobType}
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold border border-emerald-500/20">
            {formatSalary(job?.salary)}
          </span>
        </div>
      </div>

      {/* Action buttons pinned to bottom */}
      <div className="flex gap-3 pt-4 border-t border-border mt-auto">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs border-border text-foreground hover:bg-muted hover:text-primary transition-all duration-300 rounded-lg"
          onClick={() => navigate(`/description/${job._id}`)}
        >
          View Details
        </Button>
        <Button
          size="sm"
          className={`flex-1 text-xs transition-all duration-300 rounded-lg ${
            isSaved
              ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
              : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg"
          }`}
          onClick={handleSaveToggle}
        >
          {isSaved ? "✓ Saved" : "Save for Later"}
        </Button>
      </div>
    </div>
  );
};

export default Job;