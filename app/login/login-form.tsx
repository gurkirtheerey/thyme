"use client";
import { useState } from "react";
import Link from "next/link";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    console.log(email, password);
  };
  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold">Login</h1>
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
      <button
        className="bg-blue-500 text-white rounded-md p-2 cursor-pointer hover:bg-blue-600"
        onClick={handleLogin}
      >
        Login
      </button>
      <p className="text-sm text-gray-500">
        Don&apos;t have an account? <Link href="/signup">Signup</Link>
      </p>
    </div>
  );
};

export default LoginForm;
