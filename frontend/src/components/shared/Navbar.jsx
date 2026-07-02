import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_ENDPOINT } from "@/utils/constant";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_ENDPOINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
        <Link to="/">
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Job<span className="text-[#2563EB]">Portal</span>
          </h1>
        </Link>

        <div className="flex items-center gap-10">
          <ul className="flex font-medium items-center gap-6 text-[#64748B] text-sm">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link to="/" className="hover:text-[#2563EB] transition-colors duration-200">Companies</Link>
                </li>
                <li>
                  <Link to="/admin/jobs" className="hover:text-[#2563EB] transition-colors duration-200">Jobs</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className="hover:text-[#2563EB] transition-colors duration-200">Home</Link>
                </li>
                <li>
                  <Link to="/jobs" className="hover:text-[#2563EB] transition-colors duration-200">Jobs</Link>
                </li>
                <li>
                  <Link to="/browse" className="hover:text-[#2563EB] transition-colors duration-200">Browse</Link>
                </li>
              </>
            )}
          </ul>

          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#2563EB] hover:text-[#2563EB] transition-all duration-200"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-all duration-200 shadow-sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer ring-2 ring-[#E2E8F0] hover:ring-[#2563EB] transition-all duration-200">
                  <AvatarImage src={user?.profile?.profilePhoto} />
                  <AvatarFallback className="bg-[#2563EB] text-white font-semibold">
                    {user?.fullName?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-80 border-[#E2E8F0] shadow-lg">
                <div className="flex gap-3 pb-4 border-b border-[#E2E8F0]">
                  <Avatar>
                    <AvatarImage src={user?.profile?.profilePhoto} />
                    <AvatarFallback className="bg-[#2563EB] text-white font-semibold">
                      {user?.fullName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-[#0F172A]">{user?.fullName}</h4>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {user?.profile?.bio || "No bio added"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-3">
                  {user && user.role === "student" && (
                    <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[#F8FAFC] transition cursor-pointer">
                      <User2 size={16} className="text-[#64748B]" />
                      <Link to="/profile">
                        <Button variant="link" className="p-0 h-auto text-[#0F172A] font-medium text-sm">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-red-50 transition cursor-pointer">
                    <LogOut size={16} className="text-[#EF4444]" />
                    <Button
                      variant="link"
                      onClick={logoutHandler}
                      className="p-0 h-auto text-[#EF4444] font-medium text-sm"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
