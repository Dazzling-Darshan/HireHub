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
import { Loader2, Sparkles, CheckCircle2, CircleDashed, Share2, Copy, Check } from 'lucide-react';
import { formatSalary } from './LatestJobCards';
import { calculateSkillMatch } from '@/utils/skillMatcher';

const JobDescription = () => {
    const params = useParams();
    const jobId = params.id;

    const { user } = useSelector(store => store.auth);
    const { singleJob } = useSelector(store => store.job);

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [copied, setCopied] = useState(false);

    const userApplication = singleJob?.applications?.find(
        application => application?.applicant?._id === user?._id || application?.applicant === user?._id
    );
    const isApplied = !!userApplication;

    const skillMatch = user?.role === 'student'
        ? calculateSkillMatch(user?.profile?.skills, singleJob?.requirements)
        : null;

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

                toast.success(res.data.message || "Job applied successfully!");
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to apply"
            );
        } finally {
            setApplying(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Job link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const shareUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(`Check out this role: ${singleJob?.title} at ${singleJob?.company?.name}`);

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
            <div className="max-w-5xl mx-auto my-10 px-4 sm:px-6">
                
                {/* Main Card */}
                <div className="bg-card shadow-xl rounded-3xl border border-border p-6 sm:p-10 mb-8">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-border pb-8 gap-6">
                        <div className="flex items-start gap-4 min-w-0">
                            <div className="w-16 h-16 rounded-2xl border border-border bg-muted/40 p-2 shrink-0 flex items-center justify-center shadow-sm">
                                {singleJob?.company?.logo ? (
                                    <img
                                        src={singleJob?.company?.logo}
                                        alt={singleJob?.company?.name}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <span className="font-bold text-2xl text-primary">
                                        {singleJob?.company?.name?.charAt(0) || "C"}
                                    </span>
                                )}
                            </div>
                            <div className="min-w-0">
                                <h1 className="font-extrabold text-2xl sm:text-3xl text-foreground leading-tight">
                                    {singleJob?.title}
                                </h1>
                                <p className="text-muted-foreground font-semibold text-base mt-1">
                                    {singleJob?.company?.name} · <span className="font-normal">{singleJob?.location}</span>
                                </p>

                                <div className="flex items-center flex-wrap gap-2.5 mt-4">
                                    <Badge
                                        className="text-primary font-bold bg-primary/10 px-3.5 py-1 rounded-full border border-primary/20 text-xs"
                                        variant="ghost"
                                    >
                                        {singleJob?.position || 1} Position{Number(singleJob?.position) > 1 ? "s" : ""}
                                    </Badge>

                                    <Badge
                                        className="text-orange-600 font-bold bg-orange-500/10 px-3.5 py-1 rounded-full border border-orange-500/20 text-xs"
                                        variant="ghost"
                                    >
                                        {singleJob?.jobType}
                                    </Badge>

                                    <Badge
                                        className="text-emerald-600 font-bold bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20 text-xs"
                                        variant="ghost"
                                    >
                                        {formatSalary(singleJob?.salary)}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
                            <Button
                                onClick={isApplied ? undefined : applyJobHandler}
                                disabled={isApplied || applying}
                                className={`rounded-2xl px-8 py-6 font-bold text-base transition-all duration-300 shadow-md hover:shadow-lg ${
                                    isApplied
                                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                        : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-1'
                                }`}
                            >
                                {applying ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Applying...</> : isApplied ? '✓ Applied' : 'Apply Now'}
                            </Button>
                        </div>
                    </div>

                    {/* Skill Match Analysis Card (for logged-in students) */}
                    {skillMatch && (
                        <div className="my-8 p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-card to-card border border-primary/20 shadow-sm animate-in fade-in duration-500">
                            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                                <div className="flex items-center gap-2.5">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                    <h3 className="font-bold text-lg text-foreground">Candidate Skill Match</h3>
                                </div>
                                <span className={`text-xs px-3.5 py-1 rounded-full font-bold border ${skillMatch.colorClass}`}>
                                    {skillMatch.percentage}% Match · {skillMatch.label}
                                </span>
                            </div>

                            <div className="w-full bg-muted rounded-full h-2.5 mb-6 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-primary to-emerald-500 h-2.5 rounded-full transition-all duration-700"
                                    style={{ width: `${Math.max(skillMatch.percentage, 5)}%` }}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-semibold text-emerald-600 mb-2 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4" /> Matched Skills ({skillMatch.matchedSkills.length})
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {skillMatch.matchedSkills.length > 0 ? (
                                            skillMatch.matchedSkills.map((s, i) => (
                                                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 font-medium border border-emerald-500/20">
                                                    ✓ {s}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-muted-foreground">No overlapping skills found in profile</span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="font-semibold text-amber-600 mb-2 flex items-center gap-1.5">
                                        <CircleDashed className="w-4 h-4" /> Skills to Learn ({skillMatch.missingSkills.length})
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {skillMatch.missingSkills.length > 0 ? (
                                            skillMatch.missingSkills.map((s, i) => (
                                                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 font-medium border border-amber-500/20">
                                                    + {s}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-emerald-600 font-medium">You meet 100% of the requirements!</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Job Description Body */}
                    <div className="border-b border-border py-6">
                        <h2 className="text-xl font-bold text-foreground mb-4">About the Role</h2>
                        <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                            {singleJob?.description}
                        </p>
                    </div>

                    {/* Requirements Tags */}
                    {singleJob?.requirements?.length > 0 && (
                        <div className="border-b border-border py-6">
                            <h2 className="text-xl font-bold text-foreground mb-4">Key Requirements & Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {singleJob.requirements.map((req, i) => (
                                    <span
                                        key={i}
                                        className="text-sm px-3.5 py-1.5 rounded-xl bg-muted/60 text-foreground font-semibold border border-border"
                                    >
                                        {req}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Job Details Grid */}
                    <div className="pt-8">
                        <h2 className="text-xl font-bold text-foreground mb-6">Job Overview</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-muted/30 p-6 rounded-2xl border border-border">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Role</span>
                                <span className="font-bold text-foreground">{singleJob?.title}</span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Location</span>
                                <span className="font-bold text-foreground">{singleJob?.location}</span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Experience</span>
                                <span className="font-bold text-foreground">{singleJob?.experience === 0 ? "Fresher / Entry" : `${singleJob?.experience}+ Years`}</span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Compensation</span>
                                <span className="font-bold text-emerald-600">{formatSalary(singleJob?.salary)}</span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Applicants</span>
                                <span className="font-bold text-foreground">{singleJob?.applications?.length || 0} candidate(s)</span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Posted Date</span>
                                <span className="font-bold text-foreground">{singleJob?.createdAt ? new Date(singleJob.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Social Share Bar */}
                    <div className="mt-8 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Share2 className="w-4 h-4" />
                            <span>Share this opening:</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/30 transition-all"
                            >
                                WhatsApp
                            </a>
                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/30 transition-all"
                            >
                                LinkedIn
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-sky-500/10 hover:text-sky-600 hover:border-sky-500/30 transition-all"
                            >
                                X (Twitter)
                            </a>
                            <button
                                onClick={handleCopyLink}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
                            >
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                {copied ? "Copied" : "Copy Link"}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default JobDescription;
