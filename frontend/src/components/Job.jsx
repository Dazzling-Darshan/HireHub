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
    <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#2563EB] hover:shadow-md transition-all duration-200 group">

      {/* Top row */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-[#64748B] font-medium">
          {daysAgo === 0 ? "Posted today" : `${daysAgo}d ago`}
        </span>
        <button
          onClick={handleSaveToggle}
          className={`p-1.5 rounded-lg transition-all duration-200 ${
            isSaved
              ? "bg-blue-50 text-[#2563EB]"
              : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#2563EB]"
          }`}
          title={isSaved ? "Remove from saved" : "Save for later"}
        >
          {isSaved ? (
            <BookmarkCheck className="w-4 h-4" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Company */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-10 h-10 border border-[#E2E8F0] rounded-lg shrink-0">
          <AvatarImage src={job?.company?.logo} className="object-contain" />
        </Avatar>
        <div>
          <p className="font-semibold text-[#0F172A] text-sm leading-tight">{job?.company?.name}</p>
          <p className="text-xs text-[#64748B]">India</p>
        </div>
      </div>

      {/* Job title & description */}
      <div className="mb-4">
        <h3 className="font-semibold text-base text-[#0F172A] mb-1 group-hover:text-[#2563EB] transition-colors duration-200">
          {job?.title}
        </h3>
        <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
          {job?.description}
        </p>
      </div>

      {/* Badges */}
      <div className="flex items-center flex-wrap gap-1.5 mb-4">
        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-[#2563EB] font-medium border border-blue-100">
          {job?.position} Positions
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 font-medium border border-orange-100">
          {job?.jobType}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-[#10B981] font-medium border border-emerald-100">
          {job?.salary} LPA
        </span>
        {job?.expiryDate && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 font-medium border border-purple-100">
            Expires: {new Date(job.expiryDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-3 border-t border-[#E2E8F0]">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#2563EB] hover:text-[#2563EB] transition-all duration-200"
          onClick={() => navigate(`/description/${job._id}`)}
        >
          View Details
        </Button>
        <Button
          size="sm"
          className={`flex-1 text-xs transition-all duration-200 ${
            isSaved
              ? "bg-blue-50 text-[#2563EB] border border-blue-200 hover:bg-blue-100"
              : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm"
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