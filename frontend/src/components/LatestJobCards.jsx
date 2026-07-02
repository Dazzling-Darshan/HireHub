import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Briefcase } from "lucide-react";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      className="p-5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#2563EB] hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={() => navigate(`/description/${job?._id}`)}
    >
      {/* Company row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-sm text-[#0F172A] group-hover:text-[#2563EB] transition-colors duration-200">
            {job?.company?.name}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-[#64748B]" />
            <span className="text-xs text-[#64748B]">India</span>
          </div>
        </div>
        <span className="text-xs text-[#10B981] font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
          {job?.salary} LPA
        </span>
      </div>

      {/* Job title */}
      <h3 className="font-bold text-base text-[#0F172A] mb-1">{job?.title}</h3>
      <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2 mb-3">
        {job?.description}
      </p>

      {/* Tags */}
      <div className="flex items-center flex-wrap gap-1.5">
        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100 font-medium">
          {job?.position} Positions
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100 font-medium">
          {job?.jobType}
        </span>
      </div>
    </div>
  );
};

export default LatestJobCards;
