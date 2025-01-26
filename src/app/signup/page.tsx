"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}
export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router =useRouter()
  const handleSignup = async () => {
    try{
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (data.user) {
        const user: User = data.user;
        router.push('/overview');
      }
    }catch(error){
      console.error('error during signup',error)
    }
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Signup</h2>
        <div className="space-y-4">
        <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded-md text-black"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md  text-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md  text-black"
          />
          <button
            onClick={handleSignup}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}
