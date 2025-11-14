import React, { useState } from "react";
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

const BrandNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-[#18216D] via-[#2E186A] to-[#18216D] shadow-xl px-4 py-2">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo/Brand */}

        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div
            className={`hidden md:flex items-center bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 transition-all duration-300 ${
              searchFocus ? "ring-2 ring-[#FF825C] w-72" : "w-64"
            }`}
          >
            <Search className="w-4 h-4 text-[#EDEFF5]" />
            <input
              type="text"
              placeholder="Search anything..."
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              className="bg-transparent border-none outline-none text-white placeholder-[#CDD1D4] ml-2 w-full text-sm"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-white/10 rounded-full transition-colors group">
            <Bell className="w-5 h-5 text-[#EDEFF5] group-hover:text-white transition-colors" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF825C] rounded-full animate-pulse"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:bg-white/10 rounded-full pl-1 pr-3 py-1 transition-all duration-200 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#2E186A] to-[#FF825C] rounded-full flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="hidden md:block text-white font-medium text-sm">
                John Doe
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#CDD1D4] transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#EDEFF5] z-50">
                <div className="bg-gradient-to-r from-[#18216D] to-[#2E186A] p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <User className="w-7 h-7 text-[#2E186A]" />
                    </div>
                    <div>
                      <p className="text-white font-bold">John Doe</p>
                      <p className="text-[#EDEFF5] text-sm">Premium Member</p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <button className="w-full px-4 py-3 hover:bg-[#F1F2F3] flex items-center gap-3 transition-colors group">
                    <User className="w-5 h-5 text-[#CDD1D4] group-hover:text-[#2E186A] transition-colors" />
                    <span className="text-gray-700 group-hover:text-[#18216D] font-medium">
                      My Profile
                    </span>
                  </button>

                  <button className="w-full px-4 py-3 hover:bg-[#F1F2F3] flex items-center gap-3 transition-colors group">
                    <Settings className="w-5 h-5 text-[#CDD1D4] group-hover:text-[#2E186A] transition-colors" />
                    <span className="text-gray-700 group-hover:text-[#18216D] font-medium">
                      Settings
                    </span>
                  </button>

                  <button className="w-full px-4 py-3 hover:bg-[#F1F2F3] flex items-center gap-3 transition-colors group">
                    <HelpCircle className="w-5 h-5 text-[#CDD1D4] group-hover:text-[#2E186A] transition-colors" />
                    <span className="text-gray-700 group-hover:text-[#18216D] font-medium">
                      Help & Support
                    </span>
                  </button>

                  <div className="border-t border-[#EDEFF5] mt-2 pt-2">
                    <button className="w-full px-4 py-3 hover:bg-red-50 flex items-center gap-3 transition-colors group">
                      <LogOut className="w-5 h-5 text-[#CDD1D4] group-hover:text-red-600 transition-colors" />
                      <span className="text-gray-700 group-hover:text-red-600 font-medium">
                        Sign Out
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BrandNavbar;
