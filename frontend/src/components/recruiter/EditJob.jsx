import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft, Building2, Globe, MapPin, Loader2, CheckCircle2 } from "lucide-react";

import Navbar from "../shared/Navbar";
import Footer from "../Footer";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";

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

  useGetAllCompanies(1, 100, "", true);
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

  // Populate input when singleJob loads
  useEffect(() => {
    if (singleJob) {
      setInput({
        title: singleJob.title || "",
        description: singleJob.description || "",
        requirements: Array.isArray(singleJob.requirements)
          ? singleJob.requirements.join(", ")
          : singleJob.requirements || "",
        salary:
          singleJob.salary !== undefined && singleJob.salary !== null
            ? String(singleJob.salary)
            : "",
        location: singleJob.location || "",
        jobType: singleJob.jobType || "",
        experience:
          singleJob.experience !== undefined && singleJob.experience !== null
            ? String(singleJob.experience)
            : "",
        position:
          singleJob.position !== undefined && singleJob.position !== null
            ? String(singleJob.position)
            : "",
        companyId: singleJob.company?._id || singleJob.company || "",
        expiryDate: singleJob.expiryDate
          ? new Date(singleJob.expiryDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [singleJob]);

  // Selected company object for live display
  const selectedCompany =
    companies.find((c) => c._id === input.companyId) ||
    (singleJob?.company && typeof singleJob.company === "object"
      ? singleJob.company
      : null);

  const validate = () => {
    const newErrors = {};
    const titleVal = String(input.title || "").trim();
    const descVal = String(input.description || "").trim();
    const reqVal = String(input.requirements || "").trim();
    const salVal = String(input.salary || "").trim();
    const locVal = String(input.location || "").trim();
    const typeVal = String(input.jobType || "").trim();
    const expVal = String(input.experience || "").trim();
    const posVal = String(input.position || "").trim();

    if (!titleVal) {
      newErrors.title = "Job title is required";
    } else if (titleVal.length < 3) {
      newErrors.title = "Job title must be at least 3 characters";
    } else if (titleVal.length > 100) {
      newErrors.title = "Job title cannot exceed 100 characters";
    }

    if (!descVal) {
      newErrors.description = "Description is required";
    } else if (descVal.length < 30) {
      newErrors.description = "Description must be at least 30 characters";
    } else if (descVal.length > 4000) {
      newErrors.description = "Description cannot exceed 4000 characters";
    }

    if (!reqVal) {
      newErrors.requirements = "Requirements are required (comma separated)";
    } else if (reqVal.length < 5) {
      newErrors.requirements = "Requirements must be at least 5 characters";
    }

    if (!salVal) {
      newErrors.salary = "Salary is required (in LPA)";
    } else if (isNaN(Number(salVal)) || Number(salVal) <= 0) {
      newErrors.salary = "Salary must be a positive number in LPA";
    }

    if (!locVal) {
      newErrors.location = "Location is required";
    } else if (locVal.length < 2) {
      newErrors.location = "Location must be at least 2 characters";
    }

    if (!typeVal) {
      newErrors.jobType = "Job type is required (e.g. Full-Time, Remote, Part-Time)";
    }

    if (!expVal) {
      newErrors.experience = "Experience level is required (in years)";
    } else if (isNaN(Number(expVal)) || Number(expVal) < 0) {
      newErrors.experience = "Experience level must be 0 or greater (in years)";
    }

    if (!posVal) {
      newErrors.position = "Number of positions is required";
    } else if (isNaN(Number(posVal)) || Number(posVal) <= 0) {
      newErrors.position = "Number of positions must be at least 1";
    }

    if (!input.companyId) {
      newErrors.companyId = "Please select a company";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const selectChangeHandler = (value) => {
    setInput((prev) => ({ ...prev, companyId: value }));
    if (errors.companyId) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.companyId;
        return next;
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please resolve validation errors before submitting");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: String(input.title).trim(),
        description: String(input.description).trim(),
        requirements: String(input.requirements).trim(),
        salary: Number(input.salary),
        location: String(input.location).trim(),
        jobType: String(input.jobType).trim(),
        experience: Number(input.experience),
        position: Number(input.position),
        companyId: input.companyId,
        company: input.companyId,
        ...(input.expiryDate && { expiryDate: input.expiryDate }),
      };

      const res = await axios.put(
        `${JOB_API_ENDPOINT}/update/${params.id}`,
        payload,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Job updated successfully!");
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update job");
      console.error("[Update Job Error]", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto animate-in zoom-in-95 duration-500">
          <div className="bg-card rounded-3xl shadow-xl border border-border p-6 sm:p-10">
            {/* Header */}
            <div className="flex items-center gap-6 mb-8 pb-6 border-b border-border">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 border-border hover:bg-muted rounded-xl px-4 transition-all"
                onClick={() => navigate("/admin/jobs")}
              >
                <ArrowLeft size={18} />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                  Edit Job Opening
                </h1>
                <p className="text-muted-foreground mt-1 text-sm font-medium">
                  Update job requirements, salary, company association, and listing details.
                </p>
              </div>
            </div>

            {/* Live Linked Company Card */}
            {selectedCompany && (
              <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-primary/5 via-card to-card border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border border-border rounded-2xl shadow-sm bg-white">
                    <AvatarImage
                      src={
                        selectedCompany.logo ||
                        "https://img.freepik.com/premium-psd/best-company-logo-transparent-background_1101614-58913.jpg"
                      }
                    />
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-lg">
                        {selectedCompany.name}
                      </span>
                      <span className="text-[11px] font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                        Linked Company
                      </span>
                    </div>
                    <div className="flex items-center flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                      {selectedCompany.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          {selectedCompany.location}
                        </span>
                      )}
                      {selectedCompany.website && (
                        <span className="flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-indigo-500" />
                          {selectedCompany.website}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/companies/${selectedCompany._id}`)}
                  className="text-xs font-bold rounded-xl border-border hover:bg-muted"
                >
                  Edit Company Info
                </Button>
              </div>
            )}

            {/* Job Form */}
            <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div className="space-y-2">
                <Label className="font-bold text-foreground flex justify-between">
                  <span>Job Title *</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    ({String(input.title || "").length}/100)
                  </span>
                </Label>
                <Input
                  type="text"
                  name="title"
                  value={input.title}
                  onChange={changeEventHandler}
                  placeholder="e.g. Senior Full Stack Engineer"
                  maxLength={100}
                  className={`h-12 rounded-xl bg-muted/50 transition-all ${
                    errors.title
                      ? "border-destructive focus:ring-destructive/20"
                      : "border-border focus:ring-2 focus:ring-primary/20"
                  }`}
                />
                {errors.title && (
                  <p className="text-xs font-bold text-destructive">{errors.title}</p>
                )}
              </div>

              {/* Company Selector */}
              <div className="space-y-2">
                <Label className="font-bold text-foreground">Company *</Label>
                <Select
                  value={input.companyId}
                  onValueChange={selectChangeHandler}
                >
                  <SelectTrigger className="h-12 w-full rounded-xl border-border bg-muted/50">
                    <SelectValue placeholder="Select a registered company" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-card rounded-xl shadow-lg">
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company._id}
                          className="cursor-pointer hover:bg-muted transition-colors rounded-lg"
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.companyId && (
                  <p className="text-xs font-bold text-destructive">{errors.companyId}</p>
                )}
              </div>

              {/* Salary */}
              <div className="space-y-2">
                <Label className="font-bold text-foreground">Salary (LPA in ₹) *</Label>
                <Input
                  type="number"
                  name="salary"
                  value={input.salary}
                  onChange={changeEventHandler}
                  placeholder="e.g. 18"
                  min="0.1"
                  step="0.1"
                  className={`h-12 rounded-xl bg-muted/50 transition-all ${
                    errors.salary
                      ? "border-destructive focus:ring-destructive/20"
                      : "border-border focus:ring-2 focus:ring-primary/20"
                  }`}
                />
                {errors.salary && (
                  <p className="text-xs font-bold text-destructive">{errors.salary}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label className="font-bold text-foreground">Location *</Label>
                <Input
                  type="text"
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  placeholder="e.g. Bengaluru, Karnataka (or Remote)"
                  maxLength={100}
                  className={`h-12 rounded-xl bg-muted/50 transition-all ${
                    errors.location
                      ? "border-destructive focus:ring-destructive/20"
                      : "border-border focus:ring-2 focus:ring-primary/20"
                  }`}
                />
                {errors.location && (
                  <p className="text-xs font-bold text-destructive">{errors.location}</p>
                )}
              </div>

              {/* Job Type */}
              <div className="space-y-2">
                <Label className="font-bold text-foreground">Job Type *</Label>
                <Input
                  type="text"
                  name="jobType"
                  value={input.jobType}
                  onChange={changeEventHandler}
                  placeholder="e.g. Full-Time, Part-Time, Contract, Internship"
                  className={`h-12 rounded-xl bg-muted/50 transition-all ${
                    errors.jobType
                      ? "border-destructive focus:ring-destructive/20"
                      : "border-border focus:ring-2 focus:ring-primary/20"
                  }`}
                />
                {errors.jobType && (
                  <p className="text-xs font-bold text-destructive">{errors.jobType}</p>
                )}
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <Label className="font-bold text-foreground">Experience Required (Years) *</Label>
                <Input
                  type="number"
                  name="experience"
                  value={input.experience}
                  onChange={changeEventHandler}
                  placeholder="e.g. 2"
                  min="0"
                  className={`h-12 rounded-xl bg-muted/50 transition-all ${
                    errors.experience
                      ? "border-destructive focus:ring-destructive/20"
                      : "border-border focus:ring-2 focus:ring-primary/20"
                  }`}
                />
                {errors.experience && (
                  <p className="text-xs font-bold text-destructive">{errors.experience}</p>
                )}
              </div>

              {/* Number of Positions */}
              <div className="space-y-2">
                <Label className="font-bold text-foreground">Number of Positions *</Label>
                <Input
                  type="number"
                  name="position"
                  value={input.position}
                  onChange={changeEventHandler}
                  placeholder="e.g. 3"
                  min="1"
                  className={`h-12 rounded-xl bg-muted/50 transition-all ${
                    errors.position
                      ? "border-destructive focus:ring-destructive/20"
                      : "border-border focus:ring-2 focus:ring-primary/20"
                  }`}
                />
                {errors.position && (
                  <p className="text-xs font-bold text-destructive">{errors.position}</p>
                )}
              </div>

              {/* Expiry Date */}
              <div className="space-y-2">
                <Label className="font-bold text-foreground">Application Deadline</Label>
                <Input
                  type="date"
                  name="expiryDate"
                  value={input.expiryDate}
                  onChange={changeEventHandler}
                  className="h-12 rounded-xl bg-muted/50 border-border focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Requirements */}
              <div className="md:col-span-2 space-y-2">
                <Label className="font-bold text-foreground flex justify-between">
                  <span>Key Skill Requirements * (Comma separated)</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    e.g. React, Node.js, Express, MongoDB, Tailwind CSS
                  </span>
                </Label>
                <Input
                  type="text"
                  name="requirements"
                  value={input.requirements}
                  onChange={changeEventHandler}
                  placeholder="React, Node.js, Express, MongoDB, Redis, Docker"
                  className={`h-12 rounded-xl bg-muted/50 transition-all ${
                    errors.requirements
                      ? "border-destructive focus:ring-destructive/20"
                      : "border-border focus:ring-2 focus:ring-primary/20"
                  }`}
                />
                {errors.requirements && (
                  <p className="text-xs font-bold text-destructive">{errors.requirements}</p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-2">
                <Label className="font-bold text-foreground flex justify-between">
                  <span>Job Description *</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    ({String(input.description || "").length}/4000)
                  </span>
                </Label>
                <textarea
                  rows={6}
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Describe role responsibilities, team structure, qualifications, and day-to-day impact..."
                  className={`w-full p-4 rounded-xl bg-muted/50 text-foreground transition-all resize-y ${
                    errors.description
                      ? "border border-destructive focus:ring-destructive/20"
                      : "border border-border focus:ring-2 focus:ring-primary/20"
                  }`}
                />
                {errors.description && (
                  <p className="text-xs font-bold text-destructive">{errors.description}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="md:col-span-2 pt-6 mt-4 border-t border-border flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/jobs")}
                  className="border-border hover:bg-muted rounded-xl px-6 font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 px-8 gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Updating Job...
                    </>
                  ) : (
                    "Save & Update Job"
                  )}
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
