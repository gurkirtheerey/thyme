"use client";
import Link from "next/link";
import { useState } from "react";
const SignupForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      <button className="bg-blue-500 text-white rounded-md p-2 cursor-pointer hover:bg-blue-600">
        Signup
      </button>
      <p className="text-sm text-gray-500">
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignupForm;
