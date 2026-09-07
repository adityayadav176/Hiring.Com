import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Building2, User } from "lucide-react";

function SignupForm() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/v1/auth/register", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({role, email, password, name, phoneNo})
    });

    const data = await response.json();
    console.log(data);

  if(!response.ok) {
    throw new Error(data.message || "Signup failed");
  }

  alert(`Hello: ${data.data.name} your account has been created! Welcome to my application`);
  navigate("/dashboard")
    } catch (error) {
      console.log(error);
      console.log("signup failed");
    }
  }
  

  return (
    <div className="bg-white w-full max-w-sm rounded-xl border border-slate-200 p-5 sm:p-6 mt-2 mb-2">

      {/* Tabs */}
      <div className="flex gap-8 border-b border-slate-200">

        <NavLink
          to="/login"
          className={({ isActive }) =>
            `pb-4 text-xs font-medium transition-colors ${
              isActive
                ? "text-violet-600 border-b-2 border-violet-600"
                : "text-slate-500 hover:text-violet-500"
            }`
          }
        >
          Log in
        </NavLink>

        <NavLink
          to="/signup"
          className={({ isActive }) =>
            `pb-4 text-xs font-medium transition-colors ${
              isActive
                ? "text-violet-600 border-b-2 border-violet-600"
                : "text-slate-500 hover:text-violet-500"
            }`
          }
        >
          Create account
        </NavLink>

      </div>

      {/* Content */}
      <div className="mt-4">

        {/* Heading */}
        <h1 className="text-2xl font-bold text-slate-950">
          Join Peer Hiring
        </h1>

        <p className="text-slate-500 font-medium text-xs mt-2 mb-4">
          Choose how you’ll use Peer Hiring.
        </p>

        {/* Job Seeker */}
        <button
          type="button"
          onClick={() => setRole("User")}
          className={`outline-none cursor-pointer mt-3 p-3 border rounded-xl w-full flex items-center gap-4 text-left transition-all duration-200 ${
            role === "User"
              ? "border-violet-500 bg-violet-50"
              : "border-slate-200 hover:border-violet-300"
          }`}
        >
          <User
            className={`w-5 h-5 shrink-0 ${
              role === "User"
                ? "text-violet-600"
                : "text-slate-500"
            }`}
          />

          <div>
            <p
              className={`font-semibold text-xs ${
                role === "User"
                  ? "text-violet-700"
                  : "text-slate-900"
              }`}
            >
              Job seeker
            </p>

            <p className="text-[10px] text-slate-500 mt-1">
              Find your next opportunity
            </p>
          </div>
        </button>

        {/* Recruiter */}
        <button
          type="button"
          onClick={() => setRole("recruiter")}
          className={`outline-none cursor-pointer mt-3 p-3 border rounded-xl w-full flex items-center gap-4 text-left transition-all duration-200 ${
            role === "recruiter"
              ? "border-violet-500 bg-violet-50"
              : "border-slate-200 hover:border-violet-300"
          }`}
        >
          <Building2
            className={`w-5 h-5 shrink-0 ${
              role === "recruiter"
                ? "text-violet-600"
                : "text-slate-500"
            }`}
          />

          <div>
            <p
              className={`font-semibold text-xs ${
                role === "recruiter"
                  ? "text-violet-700"
                  : "text-slate-900"
              }`}
            >
              Recruiter
            </p>

            <p className="text-[10px] text-slate-500 mt-1">
              Build your next great team
            </p>
          </div>
        </button>

        {/* Work Email */}
        <div className="mt-5">
          <label className="text-slate-600 font-medium text-xs">
            Work email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            placeholder="you@company.com"
            className="text-slate-700 outline-none mt-1 w-full font-medium text-[12px] p-2.5 border border-slate-200 focus:border-violet-500 rounded-xl"
          />
        </div>
        <div className="mt-5">
          <label className="text-slate-600 font-medium text-xs">
            Phone No
          </label>

          <input
            type="Number"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            required
            placeholder="0000000000"
            maxLength={10}
            className="text-slate-700 outline-none mt-1 w-full font-medium text-[12px] p-2.5 border border-slate-200 focus:border-violet-500 rounded-xl"
          />
        </div>

         <div className="mt-5">
          <label className="text-slate-600 font-medium text-xs">
            Full Name
          </label>

          <input
            type="text"
            placeholder="John Doe"
            required
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="text-slate-700 outline-none mt-1 w-full font-medium text-[12px] p-2.5 border border-slate-200 focus:border-violet-500 rounded-xl"
          />
        </div>

        {/* Password */}
        <div className="mt-3">
          <label className="text-slate-600 font-medium text-xs">
            Password
          </label>

          <input
            type="password"
            onChange={(e)=>setPassword(e.target.value)}
            value={password}
            required
            placeholder="••••••••"
            className="text-slate-700 outline-none mt-1 w-full font-medium text-[12px] p-2.5 border border-slate-200 focus:border-violet-500 rounded-xl"
          />
        </div>

        {/* Create Account */}
        <button
          type="submit"
          onClick={handleSignup}
          className="text-white mt-4 bg-violet-600 cursor-pointer hover:bg-violet-700 transition-colors p-2.5 text-[12px] rounded-xl w-full flex items-center justify-center"
        >
          Create Account
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mt-5 mb-5">

          <div className="flex-1 border-t border-slate-200"></div>

          <span className="text-slate-400 font-medium text-[9px] whitespace-nowrap">
            or continue with
          </span>

          <div className="flex-1 border-t border-slate-200"></div>

        </div>

        {/* Google */}
        <button
          type="button"
          className="w-full cursor-pointer flex items-center justify-center gap-2 p-2.5 border border-slate-200 rounded-xl text-slate-500 font-medium text-[12px] transition-all duration-200 hover:bg-slate-50"
        >
          <span className="text-violet-600 text-xl leading-none">
            G
          </span>

          <span>
            Continue with Google
          </span>
        </button>

        {/* Terms */}
        <p className="text-slate-500 flex justify-center flex-wrap gap-0.5 font-medium text-[8px] mt-4 text-center">
          <span>By continuing, you agree to our</span>

          <NavLink
            className="text-blue-500 hover:underline"
            to="/terms"
          >
            Terms
          </NavLink>

          <span>and</span>

          <NavLink
            className="text-blue-500 hover:underline"
            to="/privacy"
          >
            Privacy Policy.
          </NavLink>
        </p>

      </div>
    </div>
  );
}

export default SignupForm;