"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { logoutUser } from "@/lib/auth";
import toast from "react-hot-toast";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreatePoll from "@/components/form/CreatePoll";

const DropdownMenu: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <Avatar
        size="xs"
        name="avatar"
        src={user?.avatar}
        className="size-8 cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      />

      {/* Dropdown Menu */}
      <div
        className={`absolute w-max right-0 mt-2 p-3 border rounded-md shadow-lg transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        } bg-white dark:bg-black border-gray-200 dark:border-gray-900`}
        style={{ transformOrigin: "top right" }}
      >
        <div className="flex items-start flex-col">
          <div className="text-black dark:text-white">{user?.name}</div>
          <span className="text-gray-600 dark:text-gray-400">
            {user?.email}
          </span>
          <div className="w-full h-px my-2 bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="py-1 space-y-1">
          <Link
            href="/dashboard"
            className="block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Dashboard
          </Link>

          <DialogRoot scrollBehavior="inside" size="sm">
            <DialogTrigger asChild>
              <Link
                href="#"
                className="block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                New polls
              </Link>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold mb-6 text-center">
                  Create a Poll
                </DialogTitle>
              </DialogHeader>
              <DialogCloseTrigger />
              <DialogBody>
                <CreatePoll />
              </DialogBody>
            </DialogContent>
          </DialogRoot>
          <Link
            href="/#"
            className="block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Profile
          </Link>
          <Button
            onClick={handleLogout}
            className="block w-full text-left rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-red-500/20 font-semibold hover:bg-red-600 hover:text-white"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;
