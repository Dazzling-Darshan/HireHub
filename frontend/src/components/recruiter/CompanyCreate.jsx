import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import Footer from "../Footer";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const validate = () => {
    const newErrors = {};
    if (!input.trim()) {
      newErrors.companyName = "Company name is required";
    } else if (input.trim().length < 2) {
      newErrors.companyName = "Company name must be at least 2 characters";
    } else if (input.trim().length > 100) {
      newErrors.companyName = "Company name cannot exceed 100 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    // Clear error when user starts typing
    if (errors.companyName) {
      const tempErrors = { ...errors };
      delete tempErrors.companyName;
      setErrors(tempErrors);
    }
  };

  const registerNewCompany = async () => {
    if (!validate()) return;

    try {
      const res = await axios.post(`${COMPANY_API_ENDPOINT}/register`, 
        { companyName: input.trim() }, 
        { withCredentials: true }
      );

      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        navigate(`/admin/companies/${res.data.company._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create company");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="max-w-2xl mx-auto my-10 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-8">
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
            <h1 className="text-3xl font-bold text-[#0F172A]">
              Register New Company
            </h1>
            <p className="text-[#64748B] mt-1">
              Let's get your company set up.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-medium text-[#0F172A]">
            Company Name
            <span className="text-sm text-[#64748B] ml-1">
              ({input.length}/100)
            </span>
          </Label>

          <Input
            type="text"
            placeholder="e.g. JobHunt, Microsoft, etc."
            className={`h-11 ${errors.companyName ? 'border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]' : 'border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]'}`}
            value={input}
            onChange={handleInputChange}
            maxLength={100}
          />
          {errors.companyName && (
            <p className="text-sm font-medium text-[#EF4444] mt-1">
              {errors.companyName}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-[#E2E8F0]">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/companies")}
            className="border-[#E2E8F0] hover:bg-[#F8FAFC]"
          >
            Cancel
          </Button>

          <Button
            className="bg-[#2563EB] hover:bg-[#1D4ED8] transition-all duration-200 shadow-sm"
            onClick={registerNewCompany}
          >
            Continue to Setup
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyCreate;
