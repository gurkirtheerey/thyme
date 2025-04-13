"use client";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      router.push("/dashboard");
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      toast.error(
        `Login failed: ${
          error instanceof Error ? error.message : "An unknown error occurred"
        }`
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center">Login</h1>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          className="border border-gray-300 rounded-md p-2"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          className="border border-gray-300 rounded-md p-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button onClick={handleLogin}>Login</Button>
      <p className="text-sm text-gray-500">
        Don&apos;t have an account? <Link href="/signup">Signup</Link>
      </p>
    </div>
  );
};

export default LoginForm;
