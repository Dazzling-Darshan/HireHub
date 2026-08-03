import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_ENDPOINT } from "@/utils/constant";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });
  const [errors, setErrors] = useState({});
  const loading = useSelector(store => store.auth.loading);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const validate = () => {
    const newErrors = {};
    // Full Name validation: only letters and spaces
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!input.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    } else if (!nameRegex.test(input.fullName.trim())) {
      newErrors.fullName = "Full Name should only contain letters";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!input.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(input.email.trim())) {
      newErrors.email = "Please enter a valid email";
    }
    
    // Phone number validation
    if (!input.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone Number is required";
    }
    
    // Password validation: at least 8 characters
    if (!input.password.trim()) {
      newErrors.password = "Password is required";
    } else if (input.password.trim().length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    // Role validation
    if (!input.role) {
      newErrors.role = "Please select your role";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const formData = new FormData();
      dispatch(setLoading(true));
      formData.append("fullName", input.fullName);
      formData.append("email", input.email);
      formData.append("phoneNumber", input.phoneNumber);
      formData.append("password", input.password);
      formData.append("role", input.role);

      if (input.file) {
        formData.append("file", input.file);
      }

      const res = await axios.post(
        `${USER_API_ENDPOINT}/register`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }finally{
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex items-center justify-center px-4 mt-10">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-lg bg-card shadow-xl rounded-3xl p-8 border border-border animate-in zoom-in-95 duration-500"
        >
          <h1 className="text-3xl font-extrabold text-foreground mb-6 text-center">
            Create Account
          </h1>

          <div className="space-y-5">
            <div>
              <Label className="text-foreground font-semibold">Full Name</Label>
              <Input
                type="text"
                name="fullName"
                value={input.fullName}
                onChange={changeEventHandler}
                className={`mt-1.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 rounded-xl bg-muted/50 ${errors.fullName ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border'}`}
              />
              {errors.fullName && (
                <p className="text-destructive text-sm mt-1.5 font-medium">{errors.fullName}</p>
              )}
            </div>

            <div>
              <Label className="text-foreground font-semibold">Email</Label>
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                className={`mt-1.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 rounded-xl bg-muted/50 ${errors.email ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border'}`}
              />
              {errors.email && (
                <p className="text-destructive text-sm mt-1.5 font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <Label className="text-foreground font-semibold">Phone Number</Label>
              <Input
                type="text"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className={`mt-1.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 rounded-xl bg-muted/50 ${errors.phoneNumber ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border'}`}
              />
              {errors.phoneNumber && (
                <p className="text-destructive text-sm mt-1.5 font-medium">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <Label className="text-foreground font-semibold">Password</Label>
              <Input
                type="password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                className={`mt-1.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 rounded-xl bg-muted/50 ${errors.password ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border'}`}
              />
              {errors.password && (
                <p className="text-destructive text-sm mt-1.5 font-medium">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between mt-8 gap-4">
            <RadioGroup className="flex gap-6">
              <div className="flex items-center gap-2">
                <Input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  className="w-4 h-4 accent-primary cursor-pointer border-border"
                />
                <Label className="cursor-pointer text-foreground font-medium">Student</Label>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="w-4 h-4 accent-primary cursor-pointer border-border"
                />
                <Label className="cursor-pointer text-foreground font-medium">Recruiter</Label>
              </div>
            </RadioGroup>
          </div>
          {errors.role && (
            <p className="text-destructive text-sm mt-2 font-medium">{errors.role}</p>
          )}
          <div className="flex flex-col md:flex-row justify-between mt-4 gap-4">
            {/* File Upload */}
            <div className="flex items-center gap-3 w-full">
              <Label className="text-foreground font-semibold">Profile</Label>

              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between border border-border rounded-xl px-4 py-2 bg-muted/50 hover:bg-muted transition-colors">
                  <span className="text-sm text-muted-foreground truncate">
                    {input.file ? input.file.name : "Choose file"}
                  </span>
                  <span className="text-primary font-semibold text-sm">Browse</span>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={changeFileHandler}
                  className="hidden"
                />
              </label>
            </div>
          </div>

           {
            loading ? <Button className={'w-full my-6 rounded-xl py-6 font-bold text-base shadow-md'} disabled> <Loader2 className="mr-2 h-5 w-5 animate-spin"/>Please wait</Button>:
            <Button className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-md hover:shadow-lg rounded-xl py-6 font-bold text-base hover:-translate-y-0.5">
              Sign Up
            </Button>
          }

          <p className="text-center text-sm mt-5 text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-bold hover:underline transition-all">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;