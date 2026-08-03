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
    <div className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Hire<span className="text-primary">Hub</span>
          </h1>
        </Link>

        <div className="flex items-center gap-10">
          <ul className="hidden md:flex font-medium items-center gap-8 text-muted-foreground text-sm">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link to="/" className="hover:text-primary transition-colors duration-200">Companies</Link>
                </li>
                <li>
                  <Link to="/admin/jobs" className="hover:text-primary transition-colors duration-200">Jobs</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className="hover:text-primary transition-colors duration-200">Home</Link>
                </li>
                <li>
                  <Link to="/jobs" className="hover:text-primary transition-colors duration-200">Jobs</Link>
                </li>
                <li>
                  <Link to="/browse" className="hover:text-primary transition-colors duration-200">Browse</Link>
                </li>
              </>
            )}
          </ul>

          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted hover:text-primary transition-all duration-300"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  Sign Up
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer ring-2 ring-transparent hover:ring-primary/50 transition-all duration-300 shadow-sm">
                  <AvatarImage src={user?.profile?.profilePhoto} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {user?.fullName?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-80 border-border shadow-xl rounded-xl">
                <div className="flex gap-4 pb-4 border-b border-border items-center">
                  <Avatar className="h-12 w-12 shadow-sm">
                    <AvatarImage src={user?.profile?.profilePhoto} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                      {user?.fullName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-foreground leading-tight">{user?.fullName}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                      {user?.profile?.bio || "No bio added"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  {user && user.role === "student" && (
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer group">
                      <User2 size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      <Link to="/profile" className="flex-1">
                        <Button variant="link" className="p-0 h-auto text-foreground font-medium text-sm group-hover:text-primary transition-colors">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  )}
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer group">
                    <LogOut size={18} className="text-destructive group-hover:text-destructive transition-colors" />
                    <Button
                      variant="link"
                      onClick={logoutHandler}
                      className="p-0 h-auto text-destructive font-medium text-sm group-hover:text-destructive transition-colors flex-1 text-left"
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
