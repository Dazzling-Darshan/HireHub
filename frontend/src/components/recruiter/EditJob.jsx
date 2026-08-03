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

      <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto animate-in zoom-in-95 duration-500">
          <div className="bg-card rounded-3xl shadow-xl border border-border p-10">
            <div className="flex items-center gap-6 mb-10 pb-8 border-b border-border">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 border-border hover:bg-muted rounded-xl px-5 transition-all"
                onClick={() => navigate("/admin/jobs")}
              >
                <ArrowLeft size={18} />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                  Edit Job
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                  Update the job details.
                </p>
              </div>
            </div>

            {/* No Company Warning */}
            {companies.length === 0 && (
              <div className="mb-8 rounded-xl border border-destructive/30 bg-destructive/10 p-5 shadow-sm">
                <p className="text-sm font-bold text-destructive">
                  Please register a company first before editing a job.
                </p>
              </div>
            )}

            <form
              onSubmit={submitHandler}
              className="grid md:grid-cols-2 gap-8"
            >
              <div className="space-y-3">
                <Label className="font-bold text-foreground">
                  Job Title
                  <span className="text-xs text-muted-foreground ml-2 font-normal">
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
                  className={`h-14 rounded-xl bg-muted/50 transition-all ${errors.title ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
                />
                {errors.title && (
                  <p className="text-sm font-bold text-destructive mt-1.5">
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="font-bold text-foreground">Salary (LPA)</Label>
                <Input
                  type="number"
                  name="salary"
                  value={input.salary}
                  onChange={changeEventHandler}
                  placeholder="5"
                  step="0.5"
                  className={`h-14 rounded-xl bg-muted/50 transition-all ${errors.salary ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
                />
                {errors.salary && (
                  <p className="text-sm font-bold text-destructive mt-1.5">
                    {errors.salary}
                  </p>
                )}
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label className="font-bold text-foreground">
                  Description
                  <span className="text-xs text-muted-foreground ml-2 font-normal">
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
                  className={`w-full rounded-xl px-4 py-3 border transition-all ${errors.description ? 'border-destructive focus:ring-2 focus:ring-destructive/20 focus:border-destructive outline-none bg-muted/50' : 'border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-muted/50'}`}
                />
                {errors.description && (
                  <p className="text-sm font-bold text-destructive mt-1.5">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label className="font-bold text-foreground">
                  Requirements
                  <span className="text-xs text-muted-foreground ml-2 font-normal">
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
                  className={`w-full rounded-xl px-4 py-3 border transition-all ${errors.requirements ? 'border-destructive focus:ring-2 focus:ring-destructive/20 focus:border-destructive outline-none bg-muted/50' : 'border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-muted/50'}`}
                />
                {errors.requirements && (
                  <p className="text-sm font-bold text-destructive mt-1.5">
                    {errors.requirements}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="font-bold text-foreground">
                  Location
                  <span className="text-xs text-muted-foreground ml-2 font-normal">
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
                  className={`h-14 rounded-xl bg-muted/50 transition-all ${errors.location ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
                />
                {errors.location && (
                  <p className="text-sm font-bold text-destructive mt-1.5">
                    {errors.location}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="font-bold text-foreground">Job Type</Label>
                <Input
                  type="text"
                  name="jobType"
                  value={input.jobType}
                  onChange={changeEventHandler}
                  placeholder="Full Time"
                  className={`h-14 rounded-xl bg-muted/50 transition-all ${errors.jobType ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
                />
                {errors.jobType && (
                  <p className="text-sm font-bold text-destructive mt-1.5">
                    {errors.jobType}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="font-bold text-foreground">Experience Level (Years)</Label>
                <Input
                  type="number"
                  name="experience"
                  value={input.experience}
                  onChange={changeEventHandler}
                  placeholder="2"
                  className={`h-14 rounded-xl bg-muted/50 transition-all ${errors.experience ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
                />
                {errors.experience && (
                  <p className="text-sm font-bold text-destructive mt-1.5">
                    {errors.experience}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="font-bold text-foreground">Number of Positions</Label>
                <Input
                  type="number"
                  name="position"
                  value={input.position}
                  onChange={changeEventHandler}
                  placeholder="5"
                  className={`h-14 rounded-xl bg-muted/50 transition-all ${errors.position ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
                />
                {errors.position && (
                  <p className="text-sm font-bold text-destructive mt-1.5">
                    {errors.position}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="font-bold text-foreground">Expiry Date</Label>
                <Input
                  type="date"
                  name="expiryDate"
                  value={input.expiryDate}
                  onChange={changeEventHandler}
                  min={new Date().toISOString().split('T')[0]}
                  className={`h-14 rounded-xl bg-muted/50 transition-all ${errors.expiryDate ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
                />
                {errors.expiryDate && (
                  <p className="text-sm font-bold text-destructive mt-1.5">
                    {errors.expiryDate}
                  </p>
                )}
                <p className="text-xs text-muted-foreground font-medium">Leave empty to keep current expiry date</p>
              </div>

              {/* Company Select (Disabled) */}
              <div className="md:col-span-2 space-y-3">
                <Label className="font-bold text-foreground">Company</Label>
                <Select
                  value={input.companyId}
                  disabled
                >
                  <SelectTrigger className="h-14 w-full rounded-xl border-border cursor-not-allowed bg-muted opacity-70">
                    <SelectValue placeholder="Company" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-card rounded-xl shadow-lg">
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem key={company._id} value={company._id} className="cursor-pointer hover:bg-muted transition-colors rounded-lg">
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground font-medium">
                  Company cannot be changed after job creation.
                </p>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 pt-8 mt-4 border-t border-border flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/jobs")}
                  className="border-border hover:bg-muted rounded-xl px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || companies.length === 0}
                  className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 px-8"
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
