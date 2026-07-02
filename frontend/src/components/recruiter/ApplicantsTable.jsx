import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MoreHorizontal, FileText } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { updateApplicantStatus } from '@/redux/applicationSlice'
import { APPLICATION_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import { toast } from 'sonner'
import Pagination from '../shared/Pagination'

const ApplicantsTable = ({ page, onPageChange }) => {
    const { applicants, applicantsPagination } = useSelector((store) => store.application);
    const { total = 0, totalPages = 1, limit = 10 } = applicantsPagination || {};
    const dispatch = useDispatch();

    const statusHandler = async (status, id) => {
        try {
            const res = await axios.post(`${APPLICATION_API_ENDPOINT}/status/${id}/update`, { status }, { withCredentials: true });
            if (res.data.success) {
                dispatch(updateApplicantStatus({ id, status }));
                toast.success(res.data.message || `Status updated to ${status}`);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const applications = applicants?.applications || [];

    return (
        <div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-sm">
            <Table>
                <TableCaption className="pb-4 text-[#64748B]">A list of candidates who applied for this job</TableCaption>
                <TableHeader className="bg-[#F8FAFC]">
                    <TableRow>
                        <TableHead className="font-semibold text-[#0F172A]">Full Name</TableHead>
                        <TableHead className="font-semibold text-[#0F172A]">Email</TableHead>
                        <TableHead className="font-semibold text-[#0F172A]">Contact</TableHead>
                        <TableHead className="font-semibold text-[#0F172A]">Resume</TableHead>
                        <TableHead className="font-semibold text-[#0F172A]">Date Applied</TableHead>
                        <TableHead className="font-semibold text-[#0F172A]">Status</TableHead>
                        <TableHead className="text-right font-semibold text-[#0F172A]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applications.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-12 text-[#64748B]">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <span className="text-lg font-semibold text-[#0F172A]">No applicants yet</span>
                                    <span className="text-sm text-[#64748B]">As soon as candidates apply, their profiles will appear here.</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        applications.map((app) => {
                            const candidate = app?.applicant;
                            const formattedDate = app?.createdAt ? new Date(app.createdAt).toLocaleDateString("en-US", {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            }) : "N/A";

                            return (
                                <TableRow key={app._id} className="hover:bg-[#F8FAFC] transition-colors">
                                    <TableCell className="font-medium text-[#0F172A]">{candidate?.fullName || "N/A"}</TableCell>
                                    <TableCell className="text-[#64748B]">{candidate?.email || "N/A"}</TableCell>
                                    <TableCell className="text-[#64748B]">{candidate?.phoneNumber || "N/A"}</TableCell>
                                    <TableCell>
                                        {candidate?.profile?.resume ? (
                                            <a 
                                                href={candidate.profile.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#2563EB] hover:underline font-medium hover:text-[#1D4ED8] transition-colors inline-flex items-center gap-1.5"
                                            >
                                                <FileText className="h-4 w-4" />
                                                <span className="max-w-[150px] truncate">
                                                    {candidate.profile.resumeOriginalName || "View Resume"}
                                                </span>
                                            </a>
                                        ) : (
                                            <span className="text-[#64748B] text-sm">No resume uploaded</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-[#64748B]">{formattedDate}</TableCell>
                                    <TableCell>
                                        {app?.status === "accepted" && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                                                Shortlisted
                                            </span>
                                        )}
                                        {app?.status === "rejected" && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
                                                Rejected
                                            </span>
                                        )}
                                        {app?.status === "pending" && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
                                                Pending
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="p-1.5 rounded-lg hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-36 p-1.5 rounded-xl border-[#E2E8F0]" align="end">
                                                <div 
                                                    className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium text-[#10B981] cursor-pointer hover:bg-[#10B981]/10 transition-colors"
                                                    onClick={() => statusHandler("accepted", app._id)}
                                                >
                                                    Shortlist
                                                </div>
                                                <div 
                                                    className="mt-0.5 flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium text-[#EF4444] cursor-pointer hover:bg-[#EF4444]/10 transition-colors"
                                                    onClick={() => statusHandler("rejected", app._id)}
                                                >
                                                    Reject
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
        <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={onPageChange}
        />
        </div>
    );
};

export default ApplicantsTable