import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";

const LatestJobs = () => {
  const { allJobs } = useSelector(store => store.job);

  return (
    <div className="bg-[#F8FAFC] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-widest mb-2">Fresh Opportunities</p>
          <h2 className="text-3xl font-bold text-[#0F172A]">
            Latest Job Openings
          </h2>
          <p className="text-[#64748B] mt-2 text-sm">Handpicked roles added in the last 24 hours</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allJobs.length <= 0
            ? <div className="col-span-3 text-center py-12 text-[#64748B]">No jobs available right now.</div>
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
