"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

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
      <h1 className="text-2xl font-bold">Signup</h1>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between gap-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="name">First Name</label>
            <input
              className="border border-gray-300 rounded-md p-2 w-full"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="last-name">Last Name</label>
            <input
              className="border border-gray-300 rounded-md p-2 w-full"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            className="border border-gray-300 rounded-md p-2"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            className="border border-gray-300 rounded-md p-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <button
        className="bg-blue-500 text-white rounded-md p-2 cursor-pointer hover:bg-blue-600"
        onClick={handleSignup}
      >
        Signup
      </button>
      <p className="text-sm text-gray-500">
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignupForm;
