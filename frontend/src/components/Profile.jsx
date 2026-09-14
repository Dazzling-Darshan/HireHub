import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import Footer from './Footer'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, Bookmark, FileText, ArrowLeft, Sparkles, Loader2, Briefcase, GraduationCap, FolderGit2 } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import SavedJobsTable from './SavedJobsTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '@/redux/authSlice'
import { AI_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import { toast } from 'sonner'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [appliedPage, setAppliedPage] = useState(1)
    const [savedPage, setSavedPage] = useState(1)
    const [extracting, setExtracting] = useState(false)
    useGetAppliedJobs(appliedPage)
    const { user } = useSelector(store => store.auth)
    const { savedJobs } = useSelector(store => store.job)
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('applied')
    const isResume = !!user?.profile?.resume

    const handleExtractResume = async () => {
        if (!isResume) {
            toast.error("Please upload a resume first.");
            return;
        }
        setExtracting(true);
        try {
            const res = await axios.post(
                `${AI_API_ENDPOINT}/parse-resume`,
                {},
                { withCredentials: true }
            );
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success("Resume parsed & profile enriched with Gemini AI!");
            }
        } catch (error) {
            console.error("Error extracting resume:", error);
            toast.error(error.response?.data?.message || "Failed to extract profile details from resume.");
        } finally {
            setExtracting(false);
        }
    };


    return (
        <div className="bg-background min-h-screen">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 mb-6 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
                >
                    <div className="p-2 rounded-xl bg-card border border-border group-hover:border-primary/50 group-hover:bg-muted transition-all shadow-sm">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    <span>Back</span>
                </button>

                {/* Profile Card */}
                <div className="bg-card border border-border rounded-2xl shadow-md p-8 mb-8">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-24 w-24 border-4 border-muted rounded-2xl shadow-sm">
                                <AvatarImage
                                    src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600w-2174926871.jpg"}
                                    className="object-cover"
                                />
                            </Avatar>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">{user?.fullName}</h1>
                                <p className="text-sm text-muted-foreground mt-1 max-w-sm leading-relaxed">
                                    {user?.profile?.bio || "No bio added yet"}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 border-border text-foreground hover:border-primary hover:text-primary hover:bg-primary/10 transition-all rounded-xl shadow-sm"
                            onClick={() => setOpen(true)}
                        >
                            <Pen className="w-3.5 h-3.5" />
                            Edit Profile
                        </Button>
                    </div>

                    {/* Contact + Resume row */}
                    <div className="mt-8 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="w-5 h-5 text-muted-foreground" />
                            <span className="text-muted-foreground font-medium">{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Contact className="w-5 h-5 text-muted-foreground" />
                            <span className="text-muted-foreground font-medium">{user?.phoneNumber}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                                {isResume ? (
                                    <a
                                        target="_blank"
                                        href={user?.profile?.resume}
                                        className="text-primary hover:underline font-bold truncate max-w-[180px]"
                                    >
                                        {user?.profile?.resumeOriginalName || "View Resume PDF"}
                                    </a>
                                ) : (
                                    <span className="text-muted-foreground font-medium">No resume uploaded</span>
                                )}
                            </div>
                            {isResume && (
                                <button
                                    onClick={handleExtractResume}
                                    disabled={extracting}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-primary/15 to-violet-500/15 text-primary border border-primary/30 hover:bg-primary/25 transition-all shadow-xs disabled:opacity-60 cursor-pointer w-fit"
                                >
                                    {extracting ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                                    )}
                                    <span>{extracting ? "Extracting with AI..." : "AI Auto-Extract"}</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Skills</p>
                            {user?.profile?.parsedResume?.extractedAt && (
                                <span className="text-[11px] text-primary/80 font-medium flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> Enriched by Gemini AI
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {user?.profile?.skills?.length > 0
                                ? user.profile.skills.map((item, index) => (
                                    <span
                                        key={index}
                                        className="text-sm px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold shadow-sm"
                                    >
                                        {item}
                                    </span>
                                ))
                                : <span className="text-sm text-muted-foreground">No skills added</span>
                            }
                        </div>
                    </div>

                    {/* AI-Extracted Profile Details (Experience, Projects, Education) */}
                    {user?.profile?.parsedResume && (
                        <div className="mt-8 pt-6 border-t border-border space-y-6 animate-in fade-in duration-300">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                                    AI-Parsed Career Highlights
                                </h3>
                            </div>

                            {/* Experience */}
                            {user.profile.parsedResume.experience?.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                        <Briefcase className="w-3.5 h-3.5 text-primary" /> Experience
                                    </p>
                                    <div className="space-y-3">
                                        {user.profile.parsedResume.experience.map((exp, idx) => (
                                            <div key={idx} className="p-3.5 rounded-xl bg-muted/40 border border-border">
                                                <div className="flex justify-between items-start flex-wrap gap-1">
                                                    <span className="font-bold text-foreground text-sm">{exp.role}</span>
                                                    <span className="text-xs text-primary font-medium">{exp.duration}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground font-medium mt-0.5">{exp.company}</p>
                                                {exp.highlights?.length > 0 && (
                                                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                                                        {exp.highlights.slice(0, 2).map((h, hIdx) => (
                                                            <li key={hIdx} className="flex items-start gap-1.5">
                                                                <span className="text-primary">•</span>
                                                                <span>{h}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Projects */}
                            {user.profile.parsedResume.projects?.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                        <FolderGit2 className="w-3.5 h-3.5 text-primary" /> Projects
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {user.profile.parsedResume.projects.map((proj, idx) => (
                                            <div key={idx} className="p-3 rounded-xl bg-muted/30 border border-border">
                                                <span className="font-bold text-foreground text-xs">{proj.title}</span>
                                                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{proj.description}</p>
                                                {proj.techStack?.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {proj.techStack.map((t, tIdx) => (
                                                            <span key={tIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Education */}
                            {user.profile.parsedResume.education?.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <GraduationCap className="w-3.5 h-3.5 text-primary" /> Education
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {user.profile.parsedResume.education.map((edu, idx) => (
                                            <div key={idx} className="text-xs p-2.5 rounded-lg bg-muted/30 border border-border">
                                                <span className="font-bold text-foreground">{edu.degree}</span>
                                                <span className="text-muted-foreground"> • {edu.institution}</span>
                                                {edu.year && <span className="text-primary font-medium"> ({edu.year})</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Jobs section with tabs */}
                <div className="bg-card rounded-2xl border border-border shadow-md overflow-hidden">
                    {/* Tab bar */}
                    <div className="flex border-b border-border bg-muted/30">
                        <button
                            onClick={() => setActiveTab('applied')}
                            className={`flex-1 px-4 py-4 text-sm font-bold transition-colors duration-200 ${activeTab === 'applied' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                        >
                            Applied Jobs
                        </button>
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`flex-1 px-4 py-4 text-sm font-bold transition-colors duration-200 flex items-center justify-center gap-2 ${activeTab === 'saved' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                        >
                            <Bookmark className="w-4 h-4" />
                            Saved Jobs
                            {Array.isArray(savedJobs) && savedJobs.length > 0 && (
                                <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                                    {savedJobs.length}
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'applied'
                            ? <AppliedJobTable page={appliedPage} onPageChange={setAppliedPage} />
                            : <SavedJobsTable page={savedPage} onPageChange={setSavedPage} />}
                    </div>
                </div>

                <UpdateProfileDialog open={open} setOpen={setOpen} />
            </div>
            <Footer />
        </div>
    )
}

export default Profile
