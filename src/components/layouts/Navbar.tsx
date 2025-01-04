"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { Avatar } from "@/components/ui/avatar";
import DropdownMenu from "@/components/ui/DropdownMenu";

const Navbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-900 text-gray-800 dark:text-gray-100 p-4 flex justify-between items-center shadow-sm">
      {/* Logo and User Info */}
      <div className="flex items-center space-x-4">
        <Logo />
        <div className="hideen lg:inlineblock h-5 w-[1px] bg-gray-300 dark:bg-gray-600"></div>
        {!user && <span className="text-lg font-bold">VotEase</span>}
        {user && (
          <div className="hideen lg:flex items-center space-x-2">
            <Avatar
              size="xs"
              name="avatar"
              src={user?.avatar}
              className="size-6"
            />
            <span className="text-sm font-semibold uppercase">
              {user?.name}
            </span>
          </div>
        )}
      </div>

      {/* User Session Display */}
      <div>
        {user ? (
          <DropdownMenu />
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="bg-gray-800 hover:bg-gray-900 text-white py-1 px-4 rounded shadow transition-all duration-300 ease-linear"
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
