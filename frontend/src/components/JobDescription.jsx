import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import Footer from './Footer';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_ENDPOINT, JOB_API_ENDPOINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const JobDescription = () => {
    const params = useParams();
    const jobId = params.id;

    const { user } = useSelector(store => store.auth);
    const { singleJob } = useSelector(store => store.job);

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

    const isApplied = singleJob?.applications?.some(
        application => application?.applicant?._id === user?._id
    );

    const applyJobHandler = async () => {
        if (!user) {
            toast.error("Please login to apply for jobs");
            return;
        }
        setApplying(true);
        try {
            const res = await axios.post(
                `${APPLICATION_API_ENDPOINT}/apply/${jobId}`,
                {},
                { withCredentials: true }
            );

            if (res.data.success) {
                const updatedJob = await axios.get(
                    `${JOB_API_ENDPOINT}/get/${jobId}`,
                    { withCredentials: true }
                );

                if (updatedJob.data.success) {
                    dispatch(setSingleJob(updatedJob.data.job));
                }

                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to apply"
            );
        } finally {
            setApplying(false);
        }
    };

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `${JOB_API_ENDPOINT}/get/${jobId}`,
                    { withCredentials: true }
                );

                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                }
            } catch (error) {
                // Error fetching job
            } finally {
                setLoading(false);
            }
        };

        fetchSingleJob();
    }, [jobId, dispatch]);

    if (loading) {
        return (
            <div className="bg-[#F8FAFC] min-h-screen flex items-center justify-center">
                <Navbar />
                <div className="flex flex-col items-center justify-center mt-20">
                    <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
                    <p className="mt-2 text-[#64748B]">Loading job details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F8FAFC] min-h-screen">
            <Navbar />
            <div className="max-w-5xl mx-auto my-10 px-6 py-8 bg-white shadow-xl rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between border-b pb-6">
                    <div>
                        <h1 className="font-bold text-2xl text-gray-800">
                            {singleJob?.title}
                        </h1>

                        <div className="flex items-center gap-3 mt-4">
                            <Badge
                                className="text-blue-700 font-semibold bg-blue-50 px-3 py-1 rounded-full"
                                variant="ghost"
                            >
                                {singleJob?.position} Positions
                            </Badge>

                            <Badge
                                className="text-[#F83002] font-semibold bg-orange-50 px-3 py-1 rounded-full"
                                variant="ghost"
                            >
                                {singleJob?.jobType}
                            </Badge>

                            <Badge
                                className="text-[#7209b7] font-semibold bg-purple-50 px-3 py-1 rounded-full"
                                variant="ghost"
                            >
                                {singleJob?.salary} LPA
                            </Badge>
                        </div>
                    </div>

                    <Button
                        onClick={isApplied ? undefined : applyJobHandler}
                        disabled={isApplied || applying}
                        className={`rounded-xl px-6 py-2 font-medium transition-all duration-300 ${
                            isApplied
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-[#7209b7] text-white hover:bg-[#5a078f] shadow-md hover:shadow-lg'
                        }`}
                    >
                        {applying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Applying...</> : isApplied ? 'Already Applied' : 'Apply Now'}
                    </Button>
                </div>

                <h1 className="border-b mt-8 text-lg font-semibold text-gray-700 pb-3">
                    {singleJob?.description}
                </h1>

                <div className="my-6 space-y-3 text-sm">
                    <h1 className="font-semibold text-gray-800">
                        Role:
                        <span className="pl-3 font-normal text-gray-600">
                            {singleJob?.title}
                        </span>
                    </h1>

                    <h1 className="font-semibold text-gray-800">
                        Location:
                        <span className="pl-3 font-normal text-gray-600">
                            {singleJob?.location}
                        </span>
                    </h1>

                    <h1 className="font-semibold text-gray-800">
                        Description:
                        <span className="pl-3 font-normal text-gray-600">
                            {singleJob?.description}
                        </span>
                    </h1>

                    <h1 className="font-semibold text-gray-800">
                        Experience:
                        <span className="pl-3 font-normal text-gray-600">
                            {singleJob?.experience} yrs
                        </span>
                    </h1>

                    <h1 className="font-semibold text-gray-800">
                        Salary:
                        <span className="pl-3 font-normal text-gray-600">
                            {singleJob?.salary} LPA
                        </span>
                    </h1>

                    <h1 className="font-semibold text-gray-800">
                        Total Applicants:
                        <span className="pl-3 font-normal text-gray-600">
                            {singleJob?.applications?.length || 0}
                        </span>
                    </h1>

                    <h1 className="font-semibold text-gray-800">
                        Posted Date:
                        <span className="pl-3 font-normal text-gray-600">
                            {singleJob?.createdAt?.split("T")[0]}
                        </span>
                    </h1>

                    {singleJob?.expiryDate && (
                        <h1 className="font-semibold text-gray-800">
                            Expiry Date:
                            <span className="pl-3 font-normal text-gray-600">
                                {new Date(singleJob.expiryDate).toLocaleDateString()}
                            </span>
                        </h1>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default JobDescription;
