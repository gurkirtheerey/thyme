"use client";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      router.push("/dashboard");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    handleLogin.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full max-w-md mx-auto mt-10"
    >
      <h1 className="text-2xl font-bold text-center">Login</h1>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          {...register("email", { required: true })}
          className="border border-gray-300 rounded-md p-2"
          type="text"
          disabled={handleLogin.isPending}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          className="border border-gray-300 rounded-md p-2"
          type="password"
          {...register("password", { required: true })}
          disabled={handleLogin.isPending}
        />
      </div>
      <Button type="submit" disabled={handleLogin.isPending}>
        {handleLogin.isPending ? "Logging in..." : "Login"}
      </Button>
      <p className="text-sm text-gray-500">
        Don&apos;t have an account? <Link href="/signup">Signup</Link>
      </p>
    </form>
  );
};

export default LoginForm;
