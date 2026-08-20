import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Briefcase, Sparkles, User as UserIcon, Calendar } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useSelector } from "react-redux";
import { calculateSkillMatch } from "@/utils/skillMatcher";

export const formatSalary = (salary) => {
  if (!salary && salary !== 0) return "Not Disclosed";
  const num = Number(salary);
  if (isNaN(num)) return `${salary} LPA`;
  if (num >= 100000) {
    return `${(num / 100000).toFixed(num % 100000 === 0 ? 0 : 1)} LPA`;
  }
  return `${num} LPA`;
};

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const skillMatch = user?.role === "student"
    ? calculateSkillMatch(user, job?.requirements, job)
    : null;

  const formatDeadline = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div
      className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 flex flex-col justify-between h-full min-h-[290px]"
      onClick={() => navigate(`/description/${job?._id}`)}
    >
      {/* Top row: Company Logo & Details */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="w-11 h-11 border border-border rounded-xl shrink-0 shadow-sm bg-muted/40 p-1">
              <AvatarImage
                src={job?.company?.logo}
                alt={job?.company?.name}
                className="object-contain w-full h-full"
              />
              <AvatarFallback className="rounded-xl font-bold text-sm bg-primary/10 text-primary">
                {job?.company?.name?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                {job?.company?.name || "Company"}
              </p>
              <div className="flex items-center gap-1 mt-0.5 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs font-medium truncate text-foreground/80">
                  {job?.location || "India"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className="text-xs text-emerald-600 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 whitespace-nowrap">
              {formatSalary(job?.salary)}
            </span>
            {skillMatch && skillMatch.percentage > 0 && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border flex items-center gap-1 ${skillMatch.colorClass}`}>
                <Sparkles className="w-2.5 h-2.5" />
                {skillMatch.percentage}% Match
              </span>
            )}
          </div>
        </div>

        {/* Job title & description */}
        <h3 className="font-bold text-lg text-foreground mb-1.5 leading-snug group-hover:text-primary transition-colors line-clamp-1">
          {job?.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          {job?.description}
        </p>

        {/* Recruiter & Expiry Sub-bar */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-3 flex-wrap gap-1">
          <span className="flex items-center gap-1 font-medium truncate">
            <UserIcon className="w-3 h-3 text-muted-foreground shrink-0" />
            {job?.createdBy?.fullName ? `By ${job.createdBy.fullName}` : "Hiring Team"}
          </span>
          {job?.expiryDate && (
            <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
              <Calendar className="w-3 h-3 shrink-0" />
              Deadline: {formatDeadline(job.expiryDate)}
            </span>
          )}
        </div>
      </div>

      {/* Badges footer */}
      <div className="flex items-center flex-wrap gap-2 pt-3 border-t border-border/60">
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
          {job?.position || 1} Openings
        </span>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20 font-semibold">
          {job?.jobType}
        </span>
        {job?.experience !== undefined && (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 font-medium">
            {job.experience === 0 ? "Fresher" : `${job.experience}+ yrs`}
          </span>
        )}
      </div>
    </div>
  );
};

export default LatestJobCards;
