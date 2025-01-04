"use client";

import { signinUser, signInWithGoogle } from "@/lib/auth";
import { useState } from "react";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Handle login with email and password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset any previous errors

    try {
      toast.loading("Logging in...");
      await signinUser(email, password);
      toast.success("Login successful!");
      // Redirect the user if needed
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

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      toast.loading("Logging in with Google...");
      await signInWithGoogle();
      toast.success("Google Login successful!");
      // Redirect the user if needed
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="space-y-4 p-6 border rounded-lg shadow-md bg-white"
    >
      <h2 className="text-center text-xl font-semibold">Login</h2>

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

      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Log In
      </button>

      <div className="text-center mt-4">OR</div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Log In with Google
      </button>
    </form>
  );
};

export default LoginForm;
