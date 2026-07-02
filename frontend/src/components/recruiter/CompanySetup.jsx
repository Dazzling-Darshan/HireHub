import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import Footer from "../Footer";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import useGetCompanyById from "@/hooks/useGetCompanyById";

const CompanySetup = () => {
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  const [errors, setErrors] = useState({});
  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useGetCompanyById(params.id);

  const validate = () => {
    const newErrors = {};
    if (!input.name.trim()) {
      newErrors.name = "Company name is required";
    } else if (input.name.trim().length < 2) {
      newErrors.name = "Company name must be at least 2 characters";
    } else if (input.name.trim().length > 100) {
      newErrors.name = "Company name cannot exceed 100 characters";
    }
    if (!input.description.trim()) {
      newErrors.description = "Description is required";
    } else if (input.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    } else if (input.description.trim().length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters";
    }
    if (input.website.trim()) {
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
      if (!urlRegex.test(input.website.trim())) {
        newErrors.website = "Please enter a valid website URL";
      }
    }
    if (!input.location.trim()) {
      newErrors.location = "Location is required";
    } else if (input.location.trim().length < 2) {
      newErrors.location = "Location must be at least 2 characters";
    } else if (input.location.trim().length > 200) {
      newErrors.location = "Location cannot exceed 200 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      const tempErrors = { ...errors };
      delete tempErrors[name];
      setErrors(tempErrors);
    }
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput((prev) => ({ ...prev, file }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", input.name.trim());
      formData.append("description", input.description.trim());
      formData.append("website", input.website.trim());
      formData.append("location", input.location.trim());

      if (input.file) {
        formData.append("file", input.file);
      }

      const res = await axios.put(
        `${COMPANY_API_ENDPOINT}/update/${params.id}`,
        formData,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update company");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: null,
      });
    }
  }, [singleCompany]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="max-w-4xl mx-auto my-10">
        <form
          onSubmit={submitHandler}
          className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-8"
        >
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#E2E8F0]">
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2 border-[#E2E8F0] hover:bg-[#F8FAFC]"
              onClick={() => navigate("/admin/companies")}
            >
              <ArrowLeft size={18} />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">
                {singleCompany ? "Edit Company" : "Company Setup"}
              </h1>
              <p className="text-[#64748B] mt-1">Fill in your company details</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-medium text-[#0F172A]">
                Company Name
                <span className="text-sm text-[#64748B] ml-1">
                  ({input.name.length}/100)
                </span>
              </Label>
              <Input
                type="text"
                name="name"
                value={input.name}
                onChange={changeEventHandler}
                maxLength={100}
                className={`h-11 ${errors.name ? 'border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]' : 'border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]'}`}
              />
              {errors.name && (
                <p className="text-sm font-medium text-[#EF4444]">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-medium text-[#0F172A]">
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
                maxLength={200}
                className={`h-11 ${errors.location ? 'border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]' : 'border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]'}`}
              />
              {errors.location && (
                <p className="text-sm font-medium text-[#EF4444]">
                  {errors.location}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
                <Label className="font-medium text-[#0F172A]">
                  Description
                  <span className="text-sm text-[#64748B] ml-1">
                    ({input.description.length}/1000)
                  </span>
                </Label>
                <textarea
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  maxLength={1000}
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
              <Label className="font-medium text-[#0F172A]">
                Website
                <span className="text-sm text-[#64748B] ml-1">
                  (Optional)
                </span>
              </Label>
              <Input
                type="text"
                name="website"
                value={input.website}
                onChange={changeEventHandler}
                placeholder="https://example.com"
                className={`h-11 ${errors.website ? 'border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]' : 'border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]'}`}
              />
              {errors.website && (
                <p className="text-sm font-medium text-[#EF4444]">
                  {errors.website}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="font-medium text-[#0F172A]">
                Logo
                <span className="text-sm text-[#64748B] ml-1">
                  (Optional)
                </span>
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
                className="cursor-pointer border-[#E2E8F0]"
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/companies")}
              className="border-[#E2E8F0] hover:bg-[#F8FAFC]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] min-w-[120px] transition-all duration-200 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CompanySetup;
