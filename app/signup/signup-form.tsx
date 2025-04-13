"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
const SignupForm = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<SignupFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });
  const handleSignup = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const { error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        image: "",
        callbackURL: "/dashboard",
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      router.push("/dashboard");
    },
  });

  const onSubmit = (data: SignupFormData) => {
    handleSignup.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full max-w-md mx-auto mt-10"
    >
      <h1 className="text-2xl font-bold text-center">Signup</h1>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="name">First Name</Label>
            <Input
              className="border border-gray-300 rounded-md p-2 w-full"
              type="text"
              {...register("firstName", { required: true })}
              disabled={handleSignup.isPending}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="last-name">Last Name</Label>
            <Input
              className="border border-gray-300 rounded-md p-2 w-full"
              type="text"
              {...register("lastName", { required: true })}
              disabled={handleSignup.isPending}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            className="border border-gray-300 rounded-md p-2"
            type="text"
            {...register("email", { required: true })}
            disabled={handleSignup.isPending}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            className="border border-gray-300 rounded-md p-2"
            type="password"
            {...register("password", { required: true })}
            disabled={handleSignup.isPending}
          />
        </div>
      </div>
      <Button type="submit" disabled={handleSignup.isPending}>
        {handleSignup.isPending ? "Signing up..." : "Signup"}
      </Button>
      <p className="text-sm text-gray-500">
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </form>
  );
};

export default SignupForm;
