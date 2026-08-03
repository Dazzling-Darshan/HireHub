import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Briefcase } from "lucide-react";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
      onClick={() => navigate(`/description/${job?._id}`)}
    >
      {/* Company row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-200">
            {job?.company?.name}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">India</span>
          </div>
        </div>
        <span className="text-xs text-emerald-600 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          {job?.salary} LPA
        </span>
      </div>

      {/* Job title */}
      <h3 className="font-bold text-lg text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">{job?.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-5">
        {job?.description}
      </p>

      {/* Tags */}
      <div className="flex items-center flex-wrap gap-2">
        <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
          {job?.position} Positions
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20 font-semibold">
          {job?.jobType}
        </span>
      </div>
    </div>
  );
};

export default LatestJobCards;
