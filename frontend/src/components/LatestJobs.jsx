import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";

const LatestJobs = () => {
  const { allJobs } = useSelector(store => store.job);

  return (
    <div className="bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3">Fresh Opportunities</p>
          <h2 className="text-4xl font-extrabold text-foreground tracking-tight">
            Latest Job Openings
          </h2>
          <p className="text-muted-foreground mt-3 text-base">Handpicked roles added in the last 24 hours</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          {allJobs.length <= 0
            ? <div className="col-span-full flex justify-center py-12"><p className="text-muted-foreground bg-muted/50 px-6 py-4 rounded-xl border border-border">No jobs available right now.</p></div>
            : allJobs.slice(0, 6).map((job) => (
                <LatestJobCards key={job._id} job={job} />
              ))
          }
        </div>
      </div>
    </div>
  );
};

export default LatestJobs;
