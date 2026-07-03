import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { useSelector } from "react-redux";

const Footer = () => {
  const { user } = useSelector((store) => store.auth);
  const isRecruiter = user?.role === "recruiter";

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Top Section */}
        <div className={`grid grid-cols-1 gap-8 ${isRecruiter ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>

          {/* Brand */}
          <div>
            <Link to="/">
              <h1 className="text-2xl font-bold text-gray-800">
                Hire<span className="text-blue-600">Hub</span>
              </h1>
            </Link>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              Your gateway to career success. Connect with top employers and discover opportunities that match your skills and aspirations.
            </p>
          </div>

          {/* Links (only for non-recruiters) */}
          {!isRecruiter && (
            <div>
              <h2 className="font-semibold text-gray-700 mb-3">Quick Links</h2>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link to="/" className="hover:text-blue-600 transition">Home</Link>
                </li>
                <li>
                  <Link to="/jobs" className="hover:text-blue-600 transition">Jobs</Link>
                </li>
                <li>
                  <Link to="/browse" className="hover:text-blue-600 transition">Browse</Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
                </li>
              </ul>
            </div>
          )}

          {/* Resources */}
          <div>
            <h2 className="font-semibold text-gray-700 mb-3">Resources</h2>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link to="/help" className="hover:text-blue-600 transition">Help Center</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-600 transition">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-blue-600 transition">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h2 className="font-semibold text-gray-700 mb-3">Follow Us</h2>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white rounded-full shadow hover:bg-blue-50 transition">
                <FaFacebookF className="text-blue-600" />
              </a>
              <a href="#" className="p-2 bg-white rounded-full shadow hover:bg-blue-50 transition">
                <FaTwitter className="text-blue-500" />
              </a>
              <a href="#" className="p-2 bg-white rounded-full shadow hover:bg-blue-50 transition">
                <FaLinkedinIn className="text-blue-700" />
              </a>
              <a href="#" className="p-2 bg-white rounded-full shadow hover:bg-blue-50 transition">
                <FaGithub className="text-gray-800" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} HireHub. All rights reserved.
          </p>

          <div className="flex gap-4 mt-3 md:mt-0 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-blue-600 transition">Privacy</Link>
            <Link to="/terms" className="hover:text-blue-600 transition">Terms</Link>
            <span className="hover:text-blue-600 cursor-pointer transition">Cookies</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;