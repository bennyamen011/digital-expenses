"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  is_first: boolean;
  createdAt: Date;
}
export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [salary, setSalary] = useState("")
  const [salaryState, setSalaryState] = useState<boolean>(false)
  const router = useRouter()
  const handleLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (data.user) {
        const user: User = data.user;
        localStorage.setItem('user', JSON.stringify(user))
        if (user.is_first) {
          setSalaryState(true)
        } else {
          router.push("/overview")
        }
      }

    } catch (error) {
      console.error('error during login', error)
    }
  };

  const handleSalary = async () => {
    const user = localStorage.getItem("user");

    if (user) {
      const currentUser = JSON.parse(user);

      try {
        // Send request to update salary in DB
        const response = await fetch("/api/user/update_salary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.id, // Assuming user object has an 'id'
            salary: salary,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update salary");
        }

        // Update localStorage after a successful DB update
        currentUser.salary = salary;
        localStorage.setItem("user", JSON.stringify(currentUser));

        // Redirect
        router.push("/overview");
      } catch (error) {
        console.error("Error updating salary:", error);
      }
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500">
      {salaryState ? (
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold text-center mb-6">Monthly Salary</h2>
          <div className="space-y-4 text-black">
            <input
              type="number"
              placeholder="Enter your Monthly Salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full p-2 border rounded-md text-black"
              onKeyUp={e => {
                if (e.key === "Enter") {
                  handleSalary();
                }
              }}
            />
            {/* <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              login
            </button> */}
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          <div className="space-y-4 text-black">
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
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              login
            </button>
            <p className="text-xs text-black">new to Digital Expense <span className="underline cursor-pointer" onClick={() => router.push('/signup')}>signup</span></p>
          </div>
        </div>
      )}

    </div>
  );
}
