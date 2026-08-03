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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-500">
        {/* Back Button and Header */}
        <div className="flex flex-col gap-4 mb-8">
          <button 
            onClick={() => navigate('/admin/jobs')}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit text-sm font-bold cursor-pointer bg-transparent border-none"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
                Applicants Manager
              </h1>
              <p className="text-muted-foreground mt-2 font-medium">
                {applicants?.title ? (
                  <>Managing applications for <span className="font-bold text-foreground">{applicants.title}</span> at <span className="font-bold text-foreground">{applicants?.company?.name || "Company"}</span></>
                ) : (
                  "Manage candidates who applied for this role."
                )}
              </p>
            </div>
            
            <div className="bg-primary/10 text-primary font-bold px-5 py-2.5 rounded-full text-sm border border-primary/20 w-fit shadow-sm">
              Total: {totalApplicants}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Card 1: Total */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Applied</p>
                <h3 className="text-3xl font-extrabold text-foreground mt-2">{totalApplicants}</h3>
              </div>
              <div className="p-3.5 bg-primary/10 rounded-xl text-primary shadow-inner">
                <Users className="h-7 w-7" />
              </div>
            </div>
          </div>

          {/* Card 2: Shortlisted */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Shortlisted</p>
                <h3 className="text-3xl font-extrabold text-green-600 mt-2">{acceptedApplicants}</h3>
              </div>
              <div className="p-3.5 bg-green-500/10 rounded-xl text-green-600 shadow-inner">
                <UserCheck className="h-7 w-7" />
              </div>
            </div>
          </div>

          {/* Card 3: Pending */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pending Review</p>
                <h3 className="text-3xl font-extrabold text-orange-500 mt-2">{pendingApplicants}</h3>
              </div>
              <div className="p-3.5 bg-orange-500/10 rounded-xl text-orange-500 shadow-inner">
                <Clock className="h-7 w-7" />
              </div>
            </div>
          </div>

          {/* Card 4: Rejected */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Rejected</p>
                <h3 className="text-3xl font-extrabold text-destructive mt-2">{rejectedApplicants}</h3>
              </div>
              <div className="p-3.5 bg-destructive/10 rounded-xl text-destructive shadow-inner">
                <UserX className="h-7 w-7" />
              </div>
            </div>
          </div>
        </div>

        {/* Applicants Table Section */}
        <div className="bg-card rounded-3xl border border-border shadow-xl p-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
            <div>
              <h2 className="text-2xl font-extrabold text-foreground">Candidates List</h2>
              <p className="text-base text-muted-foreground mt-1 font-medium">Review profiles, resumes, and update decision status.</p>
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
