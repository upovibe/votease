"use client";

import { signupUser, signInWithGoogle } from "@/lib/auth";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSignup = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signupUser(email, password);
      toast.success("Signup successful!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
    }
  }, [email, password]);

  const handleGoogleSignup = useCallback(async () => {
    try {
      await signInWithGoogle();
      toast.success("Google Signup successful!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Error: ${errorMessage}`);
    }
  }, []);

  return (
    <form
      onSubmit={handleSignup}
      className="space-y-4 p-6 border rounded-lg shadow-md bg-white"
    >
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

      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
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
  );
};

export default SignupForm;
