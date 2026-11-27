
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/Hook";

function SendPasswordResetOtpForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { handlePasswordResetOtp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      await handlePasswordResetOtp({ email: email.trim() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">

      {/* Heading */}
      <div className="mb-7">
        <h1 className="text-[27px] font-bold tracking-tight text-[#17152D]">
          Find your account
        </h1>

        <p className="mt-2 text-[13px] leading-5 text-[#77728F]">
          Enter your registered email address. We'll send you a verification code to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Email */}
        <div className="mb-6">
          <label className="mb-2 block text-[13px] font-semibold text-[#40385D]">
            Email address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            className="
              w-full rounded-xl border border-violet-100
              bg-[#F7F5FC] px-4 py-3.5
              text-[13px] text-[#30205D]
              outline-none transition
              placeholder:text-[#AAA4BC]
              focus:border-[#8B5CF6]
              focus:bg-white
              focus:ring-2 focus:ring-violet-100
            "
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="
            flex w-full items-center justify-center gap-2
            rounded-xl
            bg-gradient-to-r from-[#A276F5] to-[#6721D9]
            px-4 py-3.5
            text-[14px] font-semibold text-white
            shadow-lg shadow-violet-500/20
            transition duration-200
            hover:brightness-105
            active:scale-[0.99]
            disabled:cursor-not-allowed disabled:opacity-60
          "
        >
          {loading ? "Sending..." : "Send verification code"}
          {!loading && <span>→</span>}
        </button>

      </form>

      {/* Back to Login */}
      <div className="mt-7 border-t border-violet-100 pt-5 text-center">
        <NavLink
          to="/login"
          className="
            text-[12px] font-semibold text-[#7029DF]
            transition hover:text-[#4F16B8]
          "
        >
          ← Back to login
        </NavLink>
      </div>

    </div>
  );
}

export default SendPasswordResetOtpForm;
