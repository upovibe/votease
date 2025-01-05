"use client";

import { Button, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { signinUser, signInWithGoogle } from "@/lib/auth";
import toast from "react-hot-toast";
import { Image } from "@chakra-ui/react";

interface FormValues {
  email: string;
  password: string;
}

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  // Handle form submission for email/password login
  const onSubmit = handleSubmit(async (data) => {
    try {
      await signinUser(data.email, data.password);
      toast.success("Login successful!");
      // Redirect the user if needed
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  });

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
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
      onSubmit={onSubmit}>
      <Stack className="flex gap-4">
        <Field
          label="Email"
          invalid={!!errors.email}
          errorText={errors.email?.message}
        >
          <Input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="px-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white transition-all duration-300 focus:ring-2 focus:ring-blue-500"
          />
        </Field>
        <Field
          label="Password"
          invalid={!!errors.password}
          errorText={errors.password?.message}
        >
          <Input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="px-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white transition-all duration-300 focus:ring-2 focus:ring-blue-500"
          />
        </Field>
        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          className="bg-blue-600 text-white transition-all duration-300 hover:bg-blue-700"
        >
          Log In
        </Button>
        <div className="flex items-center justify-center gap-4">
          <div className="w-full bg-black/50 dark:bg-white h-[1px]"></div>
          <span>OR</span>
          <div className="w-full bg-black/50 dark:bg-white h-[1px]"></div>
        </div>
        <Button
          type="button"
          onClick={handleGoogleLogin}
          colorScheme="red"
          width="full"
          className="dark:bg-red-600 dark:text-white hover:text-white transition-all duration-300 hover:bg-red-700 flex items-center justify-center gap-2"
        >
          <Image src="/icons/google.png" alt="Google Icon" className="w-5 h-5" />
          Log In with Google
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;