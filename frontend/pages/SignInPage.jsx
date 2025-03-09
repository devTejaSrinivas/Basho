import React from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SignInPage = () => {
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passRef.current.value;

    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.message === "Login successful" && data.token) {
        localStorage.setItem("role", data.role);
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("token", data.token);
        toast.success("Logged In");

        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate a delay

        nav("/user/dashboard", { replace: true });
      } else {
        toast.error("Login failed: " + (data.message || "Invalid credentials"));
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#081A42] pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-[#081A42] via-[#0F3A68] to-transparent"></div>
        <div className="absolute -right-48 top-48 w-96 h-96 bg-[#328AB0]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -left-48 bottom-48 w-96 h-96 bg-[#42A4E0]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-96 h-96 bg-[#1D78A0]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#328AB0]/20">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#42A4E0] to-[#1D78A0] text-transparent bg-clip-text">
              Welcome Back
            </h2>
            <p className="mt-2 text-[#081A42]">Log in to your account</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="email"
                  name="mail"
                  ref={emailRef}
                  placeholder="Email"
                  className="w-full px-5 py-4 rounded-2xl bg-[#F9FAFB] border-2 border-[#328AB0]/20 text-[#081A42] placeholder-[#A1C6D2] focus:outline-none focus:border-[#42A4E0] transition-all duration-300 group-hover:border-[#42A4E0]/50"
                  required
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#42A4E0]/20 to-[#1D78A0]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur"></div>
              </div>

              <div className="relative group">
                <input
                  type="password"
                  name="pass"
                  ref={passRef}
                  placeholder="Password"
                  className="w-full px-5 py-4 rounded-2xl bg-[#F9FAFB] border-2 border-[#328AB0]/20 text-[#081A42] placeholder-[#A1C6D2] focus:outline-none focus:border-[#42A4E0] transition-all duration-300 group-hover:border-[#42A4E0]/50"
                  required
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#42A4E0]/20 to-[#1D78A0]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur"></div>
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-[#42A4E0] text-white py-4 rounded-2xl hover:bg-[#1D78A0] focus:outline-none transition-colors duration-300"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>

          <p className="mt-8 text-center text-[#A1C6D2]">
            Don't have an account?{' '}
            <a href="/user/signup" className="text-[#42A4E0] hover:text-[#1D78A0] font-medium transition-colors">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;