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
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-2xl mx-auto my-10 bg-card border border-border rounded-2xl shadow-xl p-10 animate-in zoom-in-95 duration-500">
        <div className="flex items-center gap-6 mb-10 pb-8 border-b border-border">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 border-border hover:bg-muted rounded-xl px-5"
            onClick={() => navigate("/admin/companies")}
          >
            <ArrowLeft size={18} />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">
              Register New Company
            </h1>
            <p className="text-muted-foreground mt-2 font-medium">
              Let's get your company set up.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="font-bold text-foreground">
            Company Name
            <span className="text-xs text-muted-foreground ml-2 font-normal">
              ({input.length}/100)
            </span>
          </Label>

          <Input
            type="text"
            placeholder="e.g. JobHunt, Microsoft, etc."
            className={`h-14 rounded-xl bg-muted/50 transition-all ${errors.companyName ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
            value={input}
            onChange={handleInputChange}
            maxLength={100}
          />
          {errors.companyName && (
            <p className="text-sm font-bold text-destructive mt-1.5">
              {errors.companyName}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-10 pt-8 border-t border-border">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/companies")}
            className="border-border hover:bg-muted rounded-xl px-6"
          >
            Cancel
          </Button>

          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 px-8"
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
