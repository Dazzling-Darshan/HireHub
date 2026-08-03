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
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <Table>
                <TableCaption className="pb-4 text-muted-foreground">A list of candidates who applied for this job</TableCaption>
                <TableHeader className="bg-muted/50">
                    <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="font-bold text-muted-foreground">Full Name</TableHead>
                        <TableHead className="font-bold text-muted-foreground">Email</TableHead>
                        <TableHead className="font-bold text-muted-foreground">Contact</TableHead>
                        <TableHead className="font-bold text-muted-foreground">Resume</TableHead>
                        <TableHead className="font-bold text-muted-foreground">Date Applied</TableHead>
                        <TableHead className="font-bold text-muted-foreground">Status</TableHead>
                        <TableHead className="text-right font-bold text-muted-foreground">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applications.length === 0 ? (
                        <TableRow className="hover:bg-transparent border-border">
                            <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <span className="text-lg font-bold text-foreground">No applicants yet</span>
                                    <span className="text-sm text-muted-foreground font-medium">As soon as candidates apply, their profiles will appear here.</span>
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
                                <TableRow key={app._id} className="hover:bg-muted/30 transition-colors border-border">
                                    <TableCell className="font-bold text-foreground">{candidate?.fullName || "N/A"}</TableCell>
                                    <TableCell className="text-muted-foreground font-medium">{candidate?.email || "N/A"}</TableCell>
                                    <TableCell className="text-muted-foreground font-medium">{candidate?.phoneNumber || "N/A"}</TableCell>
                                    <TableCell>
                                        {candidate?.profile?.resume ? (
                                            <a 
                                                href={candidate.profile.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline font-bold transition-colors inline-flex items-center gap-1.5"
                                            >
                                                <FileText className="h-4 w-4" />
                                                <span className="max-w-[150px] truncate">
                                                    {candidate.profile.resumeOriginalName || "View Resume"}
                                                </span>
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground text-sm font-medium">No resume uploaded</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground font-medium">{formattedDate}</TableCell>
                                    <TableCell>
                                        {app?.status === "accepted" && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-600 border border-green-500/20 shadow-sm">
                                                Shortlisted
                                            </span>
                                        )}
                                        {app?.status === "rejected" && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-destructive/10 text-destructive border border-destructive/20 shadow-sm">
                                                Rejected
                                            </span>
                                        )}
                                        {app?.status === "pending" && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600 border border-orange-500/20 shadow-sm">
                                                Pending
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="p-2 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border text-muted-foreground hover:text-primary">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-36 p-2 rounded-xl border-border bg-card shadow-lg" align="end">
                                                <div 
                                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-green-600 cursor-pointer hover:bg-green-500/10 transition-colors"
                                                    onClick={() => statusHandler("accepted", app._id)}
                                                >
                                                    Shortlist
                                                </div>
                                                <div 
                                                    className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-destructive cursor-pointer hover:bg-destructive/10 transition-colors"
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