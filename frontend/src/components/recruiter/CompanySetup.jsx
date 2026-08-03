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
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto my-10 animate-in zoom-in-95 duration-500">
        <form
          onSubmit={submitHandler}
          className="bg-card border border-border rounded-3xl shadow-xl p-10"
        >
          <div className="flex items-center gap-6 mb-10 pb-8 border-b border-border">
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2 border-border hover:bg-muted rounded-xl px-5 transition-all"
              onClick={() => navigate("/admin/companies")}
            >
              <ArrowLeft size={18} />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                {singleCompany ? "Edit Company" : "Company Setup"}
              </h1>
              <p className="text-muted-foreground mt-2 font-medium">Fill in your company details</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="font-bold text-foreground">
                Company Name
                <span className="text-xs text-muted-foreground ml-2 font-normal">
                  ({input.name.length}/100)
                </span>
              </Label>
              <Input
                type="text"
                name="name"
                value={input.name}
                onChange={changeEventHandler}
                maxLength={100}
                className={`h-14 rounded-xl bg-muted/50 transition-all ${errors.name ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
              />
              {errors.name && (
                <p className="text-sm font-bold text-destructive mt-1.5">
                  {errors.name}
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
                maxLength={200}
                className={`h-14 rounded-xl bg-muted/50 transition-all ${errors.location ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
              />
              {errors.location && (
                <p className="text-sm font-bold text-destructive mt-1.5">
                  {errors.location}
                </p>
              )}
            </div>

            <div className="space-y-3 md:col-span-2">
                <Label className="font-bold text-foreground">
                  Description
                  <span className="text-xs text-muted-foreground ml-2 font-normal">
                    ({input.description.length}/1000)
                  </span>
                </Label>
                <textarea
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  maxLength={1000}
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
                Website
                <span className="text-xs text-muted-foreground ml-2 font-normal">
                  (Optional)
                </span>
              </Label>
              <Input
                type="text"
                name="website"
                value={input.website}
                onChange={changeEventHandler}
                placeholder="https://example.com"
                className={`h-14 rounded-xl bg-muted/50 transition-all ${errors.website ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
              />
              {errors.website && (
                <p className="text-sm font-bold text-destructive mt-1.5">
                  {errors.website}
                </p>
              )}
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label className="font-bold text-foreground">
                Logo
                <span className="text-xs text-muted-foreground ml-2 font-normal">
                  (Optional)
                </span>
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
                className="h-14 cursor-pointer border-border rounded-xl px-4 py-3 bg-muted/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-border flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/companies")}
              className="border-border hover:bg-muted rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 px-8 min-w-[140px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
