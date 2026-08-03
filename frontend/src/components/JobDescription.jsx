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
            <div className="bg-background min-h-screen flex items-center justify-center">
                <Navbar />
                <div className="flex flex-col items-center justify-center mt-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-muted-foreground">Loading job details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen">
            <Navbar />
            <div className="max-w-5xl mx-auto my-10 px-6 py-8 bg-card shadow-xl rounded-3xl border border-border">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-border pb-8 gap-4">
                    <div>
                        <h1 className="font-extrabold text-3xl text-foreground">
                            {singleJob?.title}
                        </h1>

                        <div className="flex items-center flex-wrap gap-3 mt-4">
                            <Badge
                                className="text-primary font-bold bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20"
                                variant="ghost"
                            >
                                {singleJob?.position} Positions
                            </Badge>

                            <Badge
                                className="text-orange-600 font-bold bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20"
                                variant="ghost"
                            >
                                {singleJob?.jobType}
                            </Badge>

                            <Badge
                                className="text-emerald-600 font-bold bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20"
                                variant="ghost"
                            >
                                {singleJob?.salary} LPA
                            </Badge>
                        </div>
                    </div>

                    <Button
                        onClick={isApplied ? undefined : applyJobHandler}
                        disabled={isApplied || applying}
                        className={`rounded-2xl px-8 py-6 font-bold text-base transition-all duration-300 w-full md:w-auto shadow-md hover:shadow-lg ${
                            isApplied
                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-1'
                        }`}
                    >
                        {applying ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Applying...</> : isApplied ? 'Already Applied' : 'Apply Now'}
                    </Button>
                </div>

                <div className="border-b border-border mt-8 pb-6">
                    <h2 className="text-xl font-bold text-foreground mb-4">Job Description</h2>
                    <p className="text-base text-muted-foreground leading-relaxed">
                        {singleJob?.description}
                    </p>
                </div>

                <div className="my-8">
                    <h2 className="text-xl font-bold text-foreground mb-6">Job Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/30 p-6 rounded-2xl border border-border">
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold text-foreground">Role</span>
                            <span className="text-muted-foreground">{singleJob?.title}</span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="font-semibold text-foreground">Location</span>
                            <span className="text-muted-foreground">{singleJob?.location}</span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="font-semibold text-foreground">Experience</span>
                            <span className="text-muted-foreground">{singleJob?.experience} yrs</span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="font-semibold text-foreground">Salary</span>
                            <span className="text-muted-foreground">{singleJob?.salary} LPA</span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="font-semibold text-foreground">Total Applicants</span>
                            <span className="text-muted-foreground">{singleJob?.applications?.length || 0}</span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="font-semibold text-foreground">Posted Date</span>
                            <span className="text-muted-foreground">{singleJob?.createdAt?.split("T")[0]}</span>
                        </div>

                        {singleJob?.expiryDate && (
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold text-foreground">Expiry Date</span>
                                <span className="text-muted-foreground">{new Date(singleJob.expiryDate).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default JobDescription;
