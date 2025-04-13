"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const SignupForm = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`,
        image: "",
        callbackURL: "/dashboard",
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
        `Signup failed: ${
          error instanceof Error ? error.message : "An unknown error occurred"
        }`
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center">Signup</h1>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="name">First Name</Label>
            <Input
              className="border border-gray-300 rounded-md p-2 w-full"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="last-name">Last Name</Label>
            <Input
              className="border border-gray-300 rounded-md p-2 w-full"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
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
      </div>
      <Button onClick={handleSignup}>Signup</Button>
      <p className="text-sm text-gray-500">
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignupForm;
