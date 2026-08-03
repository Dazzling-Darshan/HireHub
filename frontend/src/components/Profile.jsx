import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import Footer from './Footer'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, Bookmark, FileText } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import SavedJobsTable from './SavedJobsTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const Profile = () => {
    const [appliedPage, setAppliedPage] = useState(1)
    const [savedPage, setSavedPage] = useState(1)
    useGetAppliedJobs(appliedPage)
    const { user } = useSelector(store => store.auth)
    const { savedJobs } = useSelector(store => store.job)
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('applied')
    const isResume = !!user?.profile?.resume

    return (
        <div className="bg-background min-h-screen">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8">
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
                        <div className="flex items-center gap-3 text-sm">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            {isResume ? (
                                <a
                                    target="_blank"
                                    href={user?.profile?.resume}
                                    className="text-primary hover:underline font-bold truncate"
                                >
                                    {user?.profile?.resumeOriginalName}
                                </a>
                            ) : (
                                <span className="text-muted-foreground font-medium">No resume uploaded</span>
                            )}
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="mt-8">
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Skills</p>
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
