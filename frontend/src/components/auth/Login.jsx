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
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex items-center justify-center px-4 mt-10">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md bg-card shadow-xl rounded-3xl p-8 border border-border animate-in zoom-in-95 duration-500"
        >
          <h1 className="text-3xl font-extrabold text-foreground mb-6 text-center">
            Welcome Back
          </h1>

          <div className="space-y-5">
            <div>
              <Label className="text-foreground font-semibold">Email</Label>
              <Input
                type="email"
                placeholder="darshan@gmail.com"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                className={`mt-1.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 rounded-xl bg-muted/50 ${errors.email ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border'}`}
              />
              {errors.email && (
                <p className="text-destructive text-sm mt-1.5 font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <Label className="text-foreground font-semibold">Password</Label>
              <Input
                type="password"
                placeholder="********"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                className={`mt-1.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 rounded-xl bg-muted/50 ${errors.password ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border'}`}
              />
              {errors.password && (
                <p className="text-destructive text-sm mt-1.5 font-medium">{errors.password}</p>
              )}
            </div>
          </div>

          <RadioGroup className="flex gap-6 mt-6">
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
          {errors.role && (
            <p className="text-destructive text-sm mt-1.5 font-medium">{errors.role}</p>
          )}

          {
            loading ? <Button className={'w-full my-6 rounded-xl py-6 font-bold text-base shadow-md'} disabled> <Loader2 className="mr-2 h-5 w-5 animate-spin"/>Please wait</Button>:
            <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-md hover:shadow-lg rounded-xl py-6 font-bold text-base hover:-translate-y-0.5">
              Login
            </Button>
          }
          <p className="text-center text-sm text-muted-foreground mt-5">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-bold hover:underline transition-all">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;