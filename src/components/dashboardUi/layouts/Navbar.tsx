"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { logoutUser } from "@/lib/auth";
import Image from "next/image";
import toast from "react-hot-toast";

const Navbar: React.FC = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      {/* Logo */}
      <div className="text-xl font-bold">
        <Link href="/">VoteEase</Link>
      </div>

      {/* User Session Display */}
      <div>
        {user ? (
          <div className="flex items-center space-x-4">
            {/* User Photo */}
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
              {user.photoURL ? (
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt="User Avatar"
            width={40}
            height={40}
            style={{ objectFit: 'cover' }}
          />
              ) : (
          <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
              )}
            </div>
            {/* User Greeting */}
            <span>Welcome, {user.name || user.email}</span>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <Link href="/auth/login" className="mr-4">
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;