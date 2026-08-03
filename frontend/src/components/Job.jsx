import { Bookmark, BookmarkCheck } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSaveJob } from "@/redux/jobSlice";
import { toast } from "sonner";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { savedJobs } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const isSaved = Array.isArray(savedJobs) && savedJobs.some((j) => j._id === job?._id);

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  const handleSaveToggle = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to save jobs");
      return;
    }
    if (job) dispatch(toggleSaveJob(job));
  };

  const daysAgo = daysAgoFunction(job?.createdAt);

  return (
    <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">

      {/* Top row */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-muted-foreground font-medium">
          {daysAgo === 0 ? "Posted today" : `${daysAgo}d ago`}
        </span>
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

      {/* Company */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-12 h-12 border border-border rounded-xl shrink-0 shadow-sm">
          <AvatarImage src={job?.company?.logo} className="object-contain" />
        </Avatar>
        <div>
          <p className="font-semibold text-foreground text-base leading-tight group-hover:text-primary transition-colors">{job?.company?.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">India</p>
        </div>
      </div>

      {/* Job title & description */}
      <div className="mb-5">
        <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {job?.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {job?.description}
        </p>
      </div>

      {/* Badges */}
      <div className="flex items-center flex-wrap gap-2 mb-5">
        <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
          {job?.position} Positions
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 font-semibold border border-orange-500/20">
          {job?.jobType}
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold border border-emerald-500/20">
          {job?.salary} LPA
        </span>
        {job?.expiryDate && (
          <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 font-semibold border border-purple-500/20">
            Expires: {new Date(job.expiryDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-4 border-t border-border">
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