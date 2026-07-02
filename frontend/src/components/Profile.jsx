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
    useGetAppliedJobs(appliedPage)
    const { user } = useSelector(store => store.auth)
    const { savedJobs } = useSelector(store => store.job)
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('applied')
    const isResume = !!user?.profile?.resume

    return (
        <div className="bg-[#F8FAFC] min-h-screen">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Profile Card */}
                <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20 border-2 border-[#E2E8F0] rounded-xl">
                                <AvatarImage
                                    src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600w-2174926871.jpg"}
                                    className="object-cover"
                                />
                            </Avatar>
                            <div>
                                <h1 className="text-lg font-semibold text-[#0F172A]">{user?.fullName}</h1>
                                <p className="text-sm text-[#64748B] mt-0.5 max-w-sm leading-relaxed">
                                    {user?.profile?.bio || "No bio added yet"}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1.5 border-[#E2E8F0] text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-blue-50 transition-all"
                            onClick={() => setOpen(true)}
                        >
                            <Pen className="w-3.5 h-3.5" />
                            Edit Profile
                        </Button>
                    </div>

                    {/* Contact + Resume row */}
                    <div className="mt-5 pt-5 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-[#64748B]" />
                            <span className="text-[#64748B]">{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Contact className="w-4 h-4 text-[#64748B]" />
                            <span className="text-[#64748B]">{user?.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-[#64748B]" />
                            {isResume ? (
                                <a
                                    target="_blank"
                                    href={user?.profile?.resume}
                                    className="text-[#2563EB] hover:underline font-medium truncate"
                                >
                                    {user?.profile?.resumeOriginalName}
                                </a>
                            ) : (
                                <span className="text-[#64748B]">No resume uploaded</span>
                            )}
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="mt-5">
                        <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Skills</p>
                        <div className="flex flex-wrap gap-2">
                            {user?.profile?.skills?.length > 0
                                ? user.profile.skills.map((item, index) => (
                                    <span
                                        key={index}
                                        className="text-xs px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100 font-medium"
                                    >
                                        {item}
                                    </span>
                                ))
                                : <span className="text-sm text-[#64748B]">No skills added</span>
                            }
                        </div>
                    </div>
                </div>

                {/* Jobs section with tabs */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                    {/* Tab bar */}
                    <div className="flex border-b border-[#E2E8F0]">
                        <button
                            onClick={() => setActiveTab('applied')}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${activeTab === 'applied' ? 'text-[#2563EB] border-b-2 border-[#2563EB] bg-blue-50/50' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'}`}
                        >
                            Applied Jobs
                        </button>
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${activeTab === 'saved' ? 'text-[#2563EB] border-b-2 border-[#2563EB] bg-blue-50/50' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'}`}
                        >
                            <Bookmark className="w-3.5 h-3.5" />
                            Saved Jobs
                            {Array.isArray(savedJobs) && savedJobs.length > 0 && (
                                <span className="bg-[#2563EB] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                                    {savedJobs.length}
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'applied'
                            ? <AppliedJobTable page={appliedPage} onPageChange={setAppliedPage} />
                            : <SavedJobsTable />}
                    </div>
                </div>

                <UpdateProfileDialog open={open} setOpen={setOpen} />
            </div>
            <Footer />
        </div>
    )
}

export default Profile
