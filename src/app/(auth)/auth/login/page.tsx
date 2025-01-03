"use client";

import { signupUser, signInWithGoogle } from "@/lib/auth";
import { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Handle signup with email and password
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset any previous errors

    try {
      // Show loading toast while the signup process happens
      toast.loading("Signing up...");

      // Call the signupUser function
      await signupUser(email, password);
      
      toast.success("Signup successful!");
      // You can redirect the user to a different page if needed
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
        toast.error(`Error: ${error.message}`);
      } else {
        setError("An unknown error occurred");
        toast.error("An unknown error occurred");
      }
    }
  };

  // Handle Google sign-in
  const handleGoogleSignup = async () => {
    try {
      toast.loading("Signing up with Google...");
      
      await signInWithGoogle();
      toast.success("Google Signup successful!");
      // You can redirect the user to a different page if needed
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSignup} className="space-y-4 p-6 border rounded-lg shadow-md bg-white">
          <h2 className="text-center text-xl font-semibold">Sign Up</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Sign Up
          </button>

          <div className="text-center mt-4">OR</div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Up with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
