"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/ui/Logo";
import { Avatar } from "@/components/ui/avatar";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SignupForm from "@/components/form/SignupForm";
import LoginForm from "@/components/form/LoginForm";
import Loading from "@/components/ui/Loading";

const Navbar: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <nav className="text-gray-800 dark:text-gray-100 p-4 flex justify-between items-center fixed top-0 w-full h-14 backdrop-blur-md z-[999]">
      {/* Logo and User Info */}
      <div className="flex items-center space-x-4">
        <Logo />
        <div className="hidden lg:inline-block h-5 w-[1px] bg-gray-300 dark:bg-gray-600"></div>
        {!user && <span className="text-lg font-bold">VotEase</span>}
        {user && (
          <Link href={"/dashboard/polls"}>
            <div className="hidden lg:flex items-center space-x-2">
              <Avatar
                size="xs"
                name="avatar"
                src={user?.avatar}
                className="size-6"
              />
              <span className="text-sm font-semibold capitalize">
                {user?.name || user?.displayName}&apos;s <span className="lowercase">polls</span>
              </span>
            </div>
          </Link>
        )}
      </div>

      {/* User Session Display */}
      <div>
        {user ? (
          <DropdownMenu />
        ) : (
          <div className="flex items-center space-x-4">
            {/* Login Dialog */}
            <DialogRoot placement="center">
              <DialogBackdrop />
              <DialogTrigger asChild>
                <Button variant="outline">Login</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{""}</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <LoginForm />
                </DialogBody>
                <DialogCloseTrigger />
              </DialogContent>
            </DialogRoot>

            {/* Signup Dialog */}
            <DialogRoot placement={"center"}>
              <DialogBackdrop />
              <DialogTrigger asChild>
                <Button
                  variant="solid"
                  className="px-2 h-8 bg-gray-800 hover:bg-gray-900 text-white"
                >
                  Signup
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{""}</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <SignupForm />
                </DialogBody>
                <DialogCloseTrigger />
              </DialogContent>
            </DialogRoot>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
