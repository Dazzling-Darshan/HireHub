import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../Footer'
import ApplicantsTable from './ApplicantsTable'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetApplicants from '@/hooks/useGetApplicants'
import { ArrowLeft, Users, UserCheck, UserX, Clock } from 'lucide-react'

const Applicants = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  
  useGetApplicants(id, page)
  
  const { applicants, applicantStats } = useSelector((store) => store.application)
  
  const totalApplicants = applicantStats?.total || 0
  const acceptedApplicants = applicantStats?.accepted || 0
  const rejectedApplicants = applicantStats?.rejected || 0
  const pendingApplicants = applicantStats?.pending || 0

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Button and Header */}
        <div className="flex flex-col gap-4 mb-8">
          <button 
            onClick={() => navigate('/admin/jobs')}
            className="flex items-center gap-2 text-[#64748B] hover:text-[#2563EB] transition-colors w-fit text-sm font-medium cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">
                Applicants Manager
              </h1>
              <p className="text-[#64748B] mt-1">
                {applicants?.title ? (
                  <>Managing applications for <span className="font-semibold text-[#0F172A]">{applicants.title}</span> at <span className="font-semibold text-[#0F172A]">{applicants?.company?.name || "Company"}</span></>
                ) : (
                  "Manage candidates who applied for this role."
                )}
              </p>
            </div>
            
            <div className="bg-[#2563EB]/10 text-[#2563EB] font-semibold px-4 py-2 rounded-full text-sm border border-[#2563EB]/20 w-fit">
              Total: {totalApplicants}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Total */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Total Applied</p>
                <h3 className="text-2xl font-bold text-[#0F172A] mt-1">{totalApplicants}</h3>
              </div>
              <div className="p-3 bg-[#2563EB]/10 rounded-lg text-[#2563EB]">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Card 2: Shortlisted */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Shortlisted</p>
                <h3 className="text-2xl font-bold text-[#10B981] mt-1">{acceptedApplicants}</h3>
              </div>
              <div className="p-3 bg-[#10B981]/10 rounded-lg text-[#10B981]">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Card 3: Pending */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Pending Review</p>
                <h3 className="text-2xl font-bold text-[#F59E0B] mt-1">{pendingApplicants}</h3>
              </div>
              <div className="p-3 bg-[#F59E0B]/10 rounded-lg text-[#F59E0B]">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Card 4: Rejected */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Rejected</p>
                <h3 className="text-2xl font-bold text-[#EF4444] mt-1">{rejectedApplicants}</h3>
              </div>
              <div className="p-3 bg-[#EF4444]/10 rounded-lg text-[#EF4444]">
                <UserX className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Applicants Table Section */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">Candidates List</h2>
              <p className="text-sm text-[#64748B] mt-0.5">Review profiles, resumes, and update decision status.</p>
            </div>
          </div>
          <ApplicantsTable page={page} onPageChange={setPage} />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Applicants
