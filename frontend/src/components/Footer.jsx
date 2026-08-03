import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { useSelector } from "react-redux";

const Footer = () => {
  const { user } = useSelector((store) => store.auth);
  const isRecruiter = user?.role === "recruiter";

  return (
    <footer className="bg-muted border-t border-border mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Top Section */}
        <div className={`grid grid-cols-1 gap-8 ${isRecruiter ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>

          {/* Brand */}
          <div>
            <Link to="/">
              <h1 className="text-2xl font-bold text-foreground">
                Hire<span className="text-primary">Hub</span>
              </h1>
            </Link>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Your gateway to career success. Connect with top employers and discover opportunities that match your skills and aspirations.
            </p>
          </div>

          {/* Links (only for non-recruiters) */}
          {!isRecruiter && (
            <div>
              <h2 className="font-semibold text-foreground mb-3">Quick Links</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-primary transition-colors duration-200">Home</Link>
                </li>
                <li>
                  <Link to="/jobs" className="hover:text-primary transition-colors duration-200">Jobs</Link>
                </li>
                <li>
                  <Link to="/browse" className="hover:text-primary transition-colors duration-200">Browse</Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-primary transition-colors duration-200">Contact</Link>
                </li>
              </ul>
            </div>
          )}

          {/* Resources */}
          <div>
            <h2 className="font-semibold text-foreground mb-3">Resources</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/help" className="hover:text-primary transition-colors duration-200">Help Center</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors duration-200">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors duration-200">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-primary transition-colors duration-200">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h2 className="font-semibold text-foreground mb-3">Follow Us</h2>
            <div className="flex gap-4">
              <a href="#" className="p-2.5 bg-card rounded-full shadow-sm hover:shadow hover:bg-primary/10 hover:-translate-y-1 transition-all group">
                <FaFacebookF className="text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a href="#" className="p-2.5 bg-card rounded-full shadow-sm hover:shadow hover:bg-primary/10 hover:-translate-y-1 transition-all group">
                <FaTwitter className="text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a href="#" className="p-2.5 bg-card rounded-full shadow-sm hover:shadow hover:bg-primary/10 hover:-translate-y-1 transition-all group">
                <FaLinkedinIn className="text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a href="#" className="p-2.5 bg-card rounded-full shadow-sm hover:shadow hover:bg-primary/10 hover:-translate-y-1 transition-all group">
                <FaGithub className="text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HireHub. All rights reserved.
          </p>

          <div className="flex gap-4 mt-3 md:mt-0 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary transition-colors duration-200">Privacy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors duration-200">Terms</Link>
            <span className="hover:text-primary cursor-pointer transition-colors duration-200">Cookies</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;