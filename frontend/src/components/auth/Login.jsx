import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector(store => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!input.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(input.email.trim())) {
      newErrors.email = "Please enter a valid email";
    }
    
    // Password validation
    if (!input.password.trim()) {
      newErrors.password = "Password is required";
    }
    
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
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_ENDPOINT}/login`,input,{
        withCredentials:true
      });

      if(res.data.success){
        dispatch(setUser(res.data.user))
        navigate("/");
        toast.success(res.data.message);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally{
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex items-center justify-center px-4">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 my-10 border border-gray-100"
        >
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Welcome Back
          </h1>

          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="darshan@gmail.com"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                className={`mt-1 focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500 focus:ring-red-200' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="********"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                className={`mt-1 focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500 focus:ring-red-200' : ''}`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <RadioGroup className="flex gap-6 mt-5">
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
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          )}
          {
            loading? <Button className={'w-full my-4'}> <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait</Button>:
            <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 transition-all shadow-md">
            Login
          </Button>
          }
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;