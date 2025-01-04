"use client";

import { Button, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { signinUser, signInWithGoogle } from "@/lib/auth";
import toast from "react-hot-toast";
import { Image } from "@chakra-ui/react"
import googleIcon from "@/public/icons/google.svg"

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
    <form onSubmit={onSubmit}>
      <Stack gap="4" align="flex-start" maxW="sm">
        <Field
          label="Email"
          invalid={!!errors.email}
          errorText={errors.email?.message}
        >
          <Input
            type="email"
            {...register("email", { required: "Email is required" })}
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
          />
        </Field>
        <Button type="submit" colorScheme="blue" width="full">
          Log In
        </Button>
        <Button
          type="button"
          onClick={handleGoogleLogin}
          colorScheme="red"
          width="full"
        >
          <Image src={googleIcon} alt="Dan Abramov" className="size-5"/>Log In with Google
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;
