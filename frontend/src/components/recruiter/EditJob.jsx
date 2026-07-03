import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import Navbar from "../shared/Navbar";
import Footer from "../Footer";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { JOB_API_ENDPOINT } from "@/utils/constant";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import useGetJobById from "@/hooks/useGetJobById";

const EditJob = () => {
  const navigate = useNavigate();
  const params = useParams();

  useGetAllCompanies(1, 10, "", true);
  const { companies = [] } = useSelector((store) => store.company);
  const { singleJob } = useSelector((store) => store.job);
  
  useGetJobById(params.id);

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: "",
    companyId: "",
    expiryDate: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Populate input when singleJob changes
  useEffect(() => {
    if (singleJob) {
      setInput({
        title: singleJob.title || "",
        description: singleJob.description || "",
        requirements: singleJob.requirements?.join(", ") || "",
        salary: singleJob.salary || "",
        location: singleJob.location || "",
        jobType: singleJob.jobType || "",
        experience: singleJob.experience || "",
        position: singleJob.position || "",
        companyId: singleJob.company?._id || "",
        expiryDate: singleJob.expiryDate ? new Date(singleJob.expiryDate).toISOString().split('T')[0] : "",
      });
    }
  }, [singleJob]);

  const validate = () => {
    const newErrors = {};
    if (!input.title.trim()) {
      newErrors.title = "Job title is required";
    } else if (input.title.trim().length < 3) {
      newErrors.title = "Job title must be at least 3 characters";
    } else if (input.title.trim().length > 100) {
      newErrors.title = "Job title cannot exceed 100 characters";
    }
    if (!input.description.trim()) {
      newErrors.description = "Description is required";
    } else if (input.description.trim().length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    } else if (input.description.trim().length > 3000) {
      newErrors.description = "Description cannot exceed 3000 characters";
    }
    if (!input.requirements.trim()) {
      newErrors.requirements = "Requirements are required";
    } else if (input.requirements.trim().length < 10) {
      newErrors.requirements = "Requirements must be at least 10 characters";
    } else if (input.requirements.trim().length > 200) {
      newErrors.requirements = "Requirements cannot exceed 200 characters";
    }
    if (!input.salary.trim()) {
      newErrors.salary = "Salary is required (in LPA)";
    } else if (Number(input.salary) <= 0) {
      newErrors.salary = "Salary must be a positive number (in LPA)";
    }
    if (!input.location.trim()) {
      newErrors.location = "Location is required";
    } else if (input.location.trim().length < 2) {
      newErrors.location = "Location must be at least 2 characters";
    } else if (input.location.trim().length > 200) {
      newErrors.location = "Location cannot exceed 200 characters";
    }
    if (!input.jobType.trim()) {
      newErrors.jobType = "Job type is required";
    } else if (!/^[a-zA-Z\s]+$/.test(input.jobType.trim())) {
      newErrors.jobType = "Job type can only contain letters and spaces";
    }
    if (!input.experience || String(input.experience).trim() === "") {
      newErrors.experience = "Experience level is required (in years)";
    } else if (!/^\d+$/.test(String(input.experience).trim())) {
      newErrors.experience = "Experience level must be a number (in years)";
    } else if (Number(input.experience) < 0) {
      newErrors.experience = "Experience level cannot be negative";
    }
    if (!input.position || String(input.position).trim() === "") {
      newErrors.position = "Number of positions is required";
    } else if (!/^\d+$/.test(String(input.position).trim())) {
      newErrors.position = "Number of positions must be a number";
    } else if (Number(input.position) <= 0) {
      newErrors.position = "Number of positions must be at least 1";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    if (errors[name]) {
      const tempErrors = { ...errors };
      delete tempErrors[name];
      setErrors(tempErrors);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        ...input,
        position: Number(input.position),
        experience: Number(input.experience),
      };

      const res = await axios.put(
        `${JOB_API_ENDPOINT}/update/${params.id}`,
        payload,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Job updated successfully!");
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update job");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-8">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E2E8F0]">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 border-[#E2E8F0] hover:bg-[#F8FAFC]"
                onClick={() => navigate("/admin/jobs")}
              >
                <ArrowLeft size={18} />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-[#0F172A]">
                  Edit Job
                </h1>
                <p className="text-[#64748B] mt-1">
                  Update the job details.
                </p>
              </div>
            </div>

            {/* No Company Warning */}
            {companies.length === 0 && (
              <div className="mb-6 rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/5 p-4">
                <p className="text-sm font-medium text-[#EF4444]">
                  Please register a company first before editing a job.
                </p>
              </div>
            )}

            <form
              onSubmit={submitHandler}
              className="grid md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <Label className="text-[#0F172A]">
                  Job Title
                  <span className="text-sm text-[#64748B] ml-1">
                    ({input.title.length}/100)
                  </span>
                </Label>
                <Input
                  type="text"
                  name="title"
                  value={input.title}
                  onChange={changeEventHandler}
                  placeholder="Frontend Developer"
                  maxLength={100}
                  className={`${errors.title ? 'border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]' : 'border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]'}`}
                />
                {errors.title && (
                  <p className="text-sm font-medium text-[#EF4444]">
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[#0F172A]">Salary (LPA)</Label>
                <Input
                  type="number"
                  name="salary"
                  value={input.salary}
                  onChange={changeEventHandler}
                  placeholder="5"
                  step="0.5"
                  className={`${errors.salary ? 'border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]' : 'border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]'}`}
                />
                {errors.salary && (
                  <p className="text-sm font-medium text-[#EF4444]">
                    {errors.salary}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-[#0F172A]">
                  Description
                  <span className="text-sm text-[#64748B] ml-1">
                    ({input.description.length}/3000)
                  </span>
                </Label>
                <textarea
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Enter job description"
                  maxLength={3000}
                  rows={4}
                  className={`w-full rounded-md px-3 py-2 border ${errors.description ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20 focus:border-[#EF4444] outline-none' : 'border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none'} bg-white`}
                />
                {errors.description && (
                  <p className="text-sm font-medium text-[#EF4444]">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-[#0F172A]">
                  Requirements
                  <span className="text-sm text-[#64748B] ml-1">
                    ({input.requirements.length}/200)
                  </span>
                </Label>
                <textarea
                  name="requirements"
                  value={input.requirements}
                  onChange={changeEventHandler}
                  placeholder="React, Node.js, MongoDB"
                  maxLength={200}
                  rows={3}
                  className={`w-full rounded-md px-3 py-2 border ${errors.requirements ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20 focus:border-[#EF4444] outline-none' : 'border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none'} bg-white`}
                />
                {errors.requirements && (
                  <p className="text-sm font-medium text-[#EF4444]">
                    {errors.requirements}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[#0F172A]">
                  Location
                  <span className="text-sm text-[#64748B] ml-1">
                    ({input.location.length}/200)
                  </span>
                </Label>
                <Input
                  type="text"
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  placeholder="Ahmedabad"
                  maxLength={200}
                  className={`${errors.location ? 'border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]' : 'border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]'}`}
                />
                {errors.location && (
                  <p className="text-sm font-medium text-[#EF4444]">
                    {errors.location}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[#0F172A]">Job Type</Label>
                <Input
                  type="text"
                  name="jobType"
                  value={input.jobType}
                  onChange={changeEventHandler}
                  placeholder="Full Time"
                  className={`${errors.jobType ? 'border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]' : 'border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]'}`}
                />
                {errors.jobType && (
                  <p className="text-sm font-medium text-[#EF4444]">
                    {errors.jobType}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[#0F172A]">Experience Level (Years)</Label>
                <Input
                  type="number"
                  name="experience"
                  value={input.experience}
                  onChange={changeEventHandler}
                  placeholder="2"
                  className={`${errors.experience ? 'border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]' : 'border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]'}`}
                />
                {errors.experience && (
                  <p className="text-sm font-medium text-[#EF4444]">
                    {errors.experience}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[#0F172A]">Number of Positions</Label>
                <Input
                  type="number"
                  name="position"
                  value={input.position}
                  onChange={changeEventHandler}
                  placeholder="5"
                  className={`${errors.position ? 'border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]' : 'border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]'}`}
                />
                {errors.position && (
                  <p className="text-sm font-medium text-[#EF4444]">
                    {errors.position}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[#0F172A]">Expiry Date</Label>
                <Input
                  type="date"
                  name="expiryDate"
                  value={input.expiryDate}
                  onChange={changeEventHandler}
                  min={new Date().toISOString().split('T')[0]}
                  className={`${errors.expiryDate ? 'border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]' : 'border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]'}`}
                />
                {errors.expiryDate && (
                  <p className="text-sm font-medium text-[#EF4444]">
                    {errors.expiryDate}
                  </p>
                )}
                <p className="text-xs text-[#64748B]">Leave empty to keep current expiry date</p>
              </div>

              {/* Company Select (Disabled) */}
              <div className="md:col-span-2 space-y-2">
                <Label className="text-[#0F172A]">Company</Label>
                <Select
                  value={input.companyId}
                  disabled
                >
                  <SelectTrigger className="w-full border-[#E2E8F0] cursor-not-allowed bg-gray-50">
                    <SelectValue placeholder="Company" />
                  </SelectTrigger>
                  <SelectContent className="border-[#E2E8F0]">
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem key={company._id} value={company._id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-sm text-[#64748B]">
                  Company cannot be changed after job creation.
                </p>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 pt-4 border-t border-[#E2E8F0] flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/jobs")}
                  className="border-[#E2E8F0] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || companies.length === 0}
                  className="h-11 bg-[#2563EB] hover:bg-[#1D4ED8] transition-all duration-200 shadow-sm"
                >
                  {loading ? "Updating Job..." : "Update Job"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditJob;
