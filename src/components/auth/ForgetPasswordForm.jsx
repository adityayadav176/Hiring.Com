import { useState } from "react";
import { useAuth } from "../../hooks/Hook";

function ForgetPasswordForm() {
  const { handleForgetPassword } = useAuth();

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("Please enter the complete 6-digit OTP.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await handleForgetPassword({
        password,
        confirmPassword,
        otp: otp.split(""),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">

      {/* Heading */}
      <div className="mb-7">
        <h1 className="text-[27px] font-bold tracking-tight text-[#17152D]">
          Reset your password
        </h1>

        <p className="mt-2 text-[13px] leading-5 text-[#77728F]">
          Enter the verification code sent to your email and create a new password.
        </p>
      </div>

      <form onSubmit={handleSubmit}>

        {/* OTP */}
        <div className="mb-6">
          <label className="mb-2 block text-[13px] font-semibold text-[#40385D]">
            6-digit verification code
          </label>

          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setOtp(value);
            }}
            placeholder="Enter your 6-digit OTP"
            required
            className="
              w-full rounded-xl border border-violet-100
              bg-[#F7F5FC] px-4 py-3.5
              text-center text-[19px] font-semibold
              tracking-[8px] text-[#30205D]
              outline-none transition
              placeholder:text-[12px] placeholder:font-normal
              placeholder:tracking-normal placeholder:text-[#AAA4BC]
              focus:border-[#8B5CF6]
              focus:bg-white
              focus:ring-2 focus:ring-violet-100
            "
          />

          <p className="mt-2 text-[11px] text-[#9992AB]">
            You can type or paste your complete OTP.
          </p>
        </div>

        {/* New Password */}
        <div className="mb-5">
          <label className="mb-2 block text-[13px] font-semibold text-[#40385D]">
            New password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            autoComplete="new-password"
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

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="mb-2 block text-[13px] font-semibold text-[#40385D]">
            Confirm password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            autoComplete="new-password"
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
          {loading ? "Resetting..." : "Reset password"}
          {!loading && <span>→</span>}
        </button>

      </form>
    </div>
  );
}

export default ForgetPasswordForm;
