import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2, Sun, Moon, Menu, X, Briefcase, Building2, Search, Home as HomeIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_ENDPOINT } from "@/utils/constant";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import { clearUserJobData } from "@/redux/jobSlice";
import { setCompanies } from "@/redux/companySlice";
import { setApplicants } from "@/redux/applicationSlice";
import { useTheme } from "@/context/ThemeContext";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_ENDPOINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        dispatch(clearUserJobData());
        dispatch(setCompanies([]));
        dispatch(setApplicants(null));
        try {
          localStorage.removeItem("persist:root");
        } catch (e) {
          // ignore
        }
        toast.success(res.data.message || "Logged out successfully");
        setMobileMenuOpen(false);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      dispatch(setUser(null));
      dispatch(clearUserJobData());
      toast.error(error?.response?.data?.message || "Logged out");
      setMobileMenuOpen(false);
      navigate("/");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-background/85 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center text-white shadow-md shadow-primary/20 font-black text-lg">
            H
          </div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">
            Hire<span className="text-primary bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Hub</span>
          </h1>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm">
          {user && user.role === "recruiter" ? (
            <>
              <Link
                to="/admin/companies"
                className={`transition-colors duration-200 py-1 border-b-2 ${
                  isActive("/admin/companies")
                    ? "text-primary border-primary font-semibold"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                Companies
              </Link>
              <Link
                to="/admin/jobs"
                className={`transition-colors duration-200 py-1 border-b-2 ${
                  isActive("/admin/jobs")
                    ? "text-primary border-primary font-semibold"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                Jobs
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className={`transition-colors duration-200 py-1 border-b-2 ${
                  isActive("/")
                    ? "text-primary border-primary font-semibold"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                Home
              </Link>
              <Link
                to="/jobs"
                className={`transition-colors duration-200 py-1 border-b-2 ${
                  isActive("/jobs")
                    ? "text-primary border-primary font-semibold"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                Jobs
              </Link>
              <Link
                to="/browse"
                className={`transition-colors duration-200 py-1 border-b-2 ${
                  isActive("/browse")
                    ? "text-primary border-primary font-semibold"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                Browse
              </Link>
            </>
          )}
        </div>

        {/* Right Section: Theme Toggle + Auth / Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2.5 rounded-xl border border-border bg-card/80 hover:bg-muted text-foreground transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400 animate-in spin-in-180 duration-300" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-500 animate-in spin-in-180 duration-300" />
            )}
          </button>

          {!user ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted hover:text-primary transition-all duration-300 rounded-xl"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-md hover:shadow-lg rounded-xl hover:-translate-y-0.5">
                  Sign Up
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer ring-2 ring-primary/30 hover:ring-primary transition-all duration-300 shadow-sm h-9 w-9">
                  <AvatarImage src={user?.profile?.profilePhoto} />
                  <AvatarFallback className="bg-gradient-to-tr from-primary to-violet-600 text-white font-bold text-sm">
                    {user?.fullName?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-80 border-border shadow-2xl rounded-2xl p-4 bg-card/95 backdrop-blur-md">
                <div className="flex gap-3 pb-3 border-b border-border items-center">
                  <Avatar className="h-11 w-11 shadow-sm">
                    <AvatarImage src={user?.profile?.profilePhoto} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {user?.fullName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <h4 className="font-bold text-foreground truncate text-sm">{user?.fullName}</h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                    <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-primary/10 text-primary mt-1 w-fit">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-3">
                  {user && user.role === "student" && (
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted text-foreground transition-colors font-medium text-sm"
                    >
                      <User2 size={16} className="text-primary" />
                      <span>View Profile</span>
                    </Link>
                  )}
                  {user && user.role === "recruiter" && (
                    <>
                      <Link
                        to="/admin/companies"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted text-foreground transition-colors font-medium text-sm"
                      >
                        <Building2 size={16} className="text-primary" />
                        <span>Manage Companies</span>
                      </Link>
                      <Link
                        to="/admin/jobs"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted text-foreground transition-colors font-medium text-sm"
                      >
                        <Briefcase size={16} className="text-primary" />
                        <span>Posted Jobs</span>
                      </Link>
                    </>
                  )}
                  <button
                    onClick={logoutHandler}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-destructive/10 text-destructive transition-colors font-medium text-sm w-full text-left cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card/95 backdrop-blur-xl px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col gap-2 font-medium text-sm">
            {user && user.role === "recruiter" ? (
              <>
                <Link
                  to="/admin/companies"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-foreground"
                >
                  <Building2 size={18} className="text-primary" />
                  Companies
                </Link>
                <Link
                  to="/admin/jobs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-foreground"
                >
                  <Briefcase size={18} className="text-primary" />
                  Jobs
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-foreground"
                >
                  <HomeIcon size={18} className="text-primary" />
                  Home
                </Link>
                <Link
                  to="/jobs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-foreground"
                >
                  <Briefcase size={18} className="text-primary" />
                  Jobs
                </Link>
                <Link
                  to="/browse"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-foreground"
                >
                  <Search size={18} className="text-primary" />
                  Browse
                </Link>
              </>
            )}

            {!user ? (
              <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-border">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl border-border">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground rounded-xl">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-border">
                {user.role === "student" && (
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-foreground"
                  >
                    <User2 size={18} className="text-primary" />
                    My Profile
                  </Link>
                )}
                <button
                  onClick={logoutHandler}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-destructive/10 text-destructive text-left w-full cursor-pointer"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
