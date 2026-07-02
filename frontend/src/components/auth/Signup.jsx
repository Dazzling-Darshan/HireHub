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
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex items-center justify-center px-4">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8 my-10"
        >
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Create Account
          </h1>

          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input
                type="text"
                name="fullName"
                value={input.fullName}
                onChange={changeEventHandler}
                className={errors.fullName ? 'border-red-500 focus:ring-red-200' : ''}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                className={errors.email ? 'border-red-500 focus:ring-red-200' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label>Phone Number</Label>
              <Input
                type="text"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className={errors.phoneNumber ? 'border-red-500 focus:ring-red-200' : ''}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                className={errors.password ? 'border-red-500 focus:ring-red-200' : ''}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
            <RadioGroup className="flex gap-6">
              <div className="flex items-center gap-2">
                <Input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                />
                <Label>Student</Label>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                />
                <Label>Recruiter</Label>
              </div>
            </RadioGroup>
          </div>
          {errors.role && (
            <p className="text-red-500 text-sm mt-2">{errors.role}</p>
          )}
          <div className="flex flex-col md:flex-row justify-between mt-4 gap-4">
            {/* File Upload */}
            <div className="flex items-center gap-3 w-full">
              <Label>Profile</Label>

              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between border rounded-md px-3 py-2 bg-white">
                  <span className="text-sm text-gray-500 truncate">
                    {input.file ? input.file.name : "Choose file"}
                  </span>
                  <span className="text-blue-600 text-sm">Browse</span>
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
            loading? <Button className={'w-full my-4'}> <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait</Button>:
            <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 transition-all shadow-md">
            Sign Up
          </Button>
          }

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;