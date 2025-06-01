"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState(""); // This will now always be a string

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

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
        // This case might be less common with axios as it throws on non-2xx by default
        console.error(
          "🚨 Unexpected response format (non-200 or missing token):",
          response
        );
        // Try to get a string error message
        let errorMessage = "Login failed or token missing.";
        if (response.data?.error && typeof response.data.error === "string") {
          errorMessage = response.data.error;
        } else if (
          response.data?.message &&
          typeof response.data.message === "string"
        ) {
          errorMessage = response.data.message;
        }
        setError(errorMessage);
      }
    } catch (err: any) {
      // This catch block handles network errors and HTTP errors (4xx, 5xx) from axios
      console.error(
        "🔥 Login Error (from catch):",
        err.response?.data || err.message
      );

      let errorMessage = "An unexpected error occurred. Please try again."; // Default message
      if (err.response?.data) {
        // Check if response.data exists (for HTTP errors)
        if (typeof err.response.data.error === "string") {
          errorMessage = err.response.data.error;
        } else if (typeof err.response.data.message === "string") {
          // For errors like { code: "502", message: "..." }
          errorMessage = err.response.data.message;
        } else if (
          err.response.data.error &&
          typeof err.response.data.error.message === "string"
        ) {
          // If the error is an object like { error: { message: "Details..." } }
          errorMessage = err.response.data.error.message;
        }
      } else if (typeof err.message === "string") {
        // For network errors where err.response might be undefined
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-white text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}{" "}
        {/* This will now render a string */}
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
