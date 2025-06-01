"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      console.log("🔍 Sending login request to /api/auth/login ...");
      const response = await axios.post("/api/auth/login", { email, password });
      console.log("✅ Server Response:", response.data);

      if (response.status === 200 && response.data.token) {
        console.log("🔒 Storing token...");
        localStorage.setItem("token", response.data.token);
        console.log("➡️ Redirecting to dashboard...");
        router.push("/dashboard");
      } else {
        console.error(
          "🚨 Unexpected response format (non-200 or missing token):",
          response
        );
        setError(response.data?.error || "Login failed or token missing.");
      }
    } catch (err: any) {
      console.error("🔥 Login Error:", err.response?.data || err.message); // Debugging log
      setError(
        err.response?.data?.error ||
          "Invalid email or password. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-white text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}{" "}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-400 text-white py-2 rounded transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-gray-300">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
