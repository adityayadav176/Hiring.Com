
    import { useState } from "react";
    import { NavLink } from "react-router-dom";
    import { Building2, User, ArrowRight } from "lucide-react";
    import { useAuth } from "../../hooks/Hook";
    import GoogleButton from "./GoogleButton";

    function SignupForm() {
        const [role, setRole] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [name, setName] = useState("");
        const [phoneNo, setPhoneNo] = useState("");
        const [loading, setLoading] = useState(false);

        const { handleSignup } = useAuth();

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (loading || !role) return;

            try {
                setLoading(true);
                await handleSignup({
                    role,
                    email,
                    password,
                    name,
                    phoneNo,
                });
            } finally {
                setLoading(false);
            }
        };

        const inputClass =
            "mt-1 h-[38px] w-full rounded-lg border border-[#E8E3F2] bg-white px-3 text-[12px] font-medium text-[#29233D] outline-none transition-all placeholder:text-[#AAA4B9] focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-slate-50";

        const labelClass = "text-[11px] font-semibold text-[#514A68]";

        const roleClass = (selected) =>
            `flex h-[54px] items-center gap-2.5 rounded-lg border px-3 text-left transition-all ${
                selected
                    ? "border-violet-400 bg-violet-50"
                    : "border-[#EAE6F2] bg-white hover:border-violet-300"
            }`;

        return (
            <form onSubmit={handleSubmit} className="mx-auto w-full max-w-[420px] min-w-0">

                {/* Tabs */}
                <div className="flex gap-7 border-b border-[#EDE9F5]">
                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            `relative pb-2.5 text-[13px] font-semibold ${
                                isActive
                                    ? "text-violet-700 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-violet-600"
                                    : "text-[#817B95] hover:text-violet-600"
                            }`
                        }
                    >
                        Log in
                    </NavLink>

                    <NavLink
                        to="/signup"
                        className={({ isActive }) =>
                            `relative pb-2.5 text-[13px] font-semibold ${
                                isActive
                                    ? "text-violet-700 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-violet-600"
                                    : "text-[#817B95] hover:text-violet-600"
                            }`
                        }
                    >
                        Create account
                    </NavLink>
                </div>

                {/* Heading */}
                <div className="mt-4 mb-3">
                    <h1 className="text-[21px] font-bold tracking-[-0.6px] text-[#17152F]">
                        Join Peer.Hiring
                    </h1>
                    <p className="mt-1 text-[12px] text-[#77718F]">
                        Choose how you'll use Peer.Hiring.
                    </p>
                </div>

                {/* Role Selection */}
                <div className="grid grid-cols-2 gap-2.5">

                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => setRole("User")}
                        className={roleClass(role === "User")}
                    >
                        <User
                            size={18}
                            className={role === "User" ? "text-violet-600" : "text-slate-500"}
                        />
                        <div>
                            <p className="text-[11px] font-bold text-[#28233D]">
                                Job seeker
                            </p>
                            <p className="mt-0.5 text-[9px] text-[#858096]">
                                Find opportunities
                            </p>
                        </div>
                    </button>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => setRole("recruiter")}
                        className={roleClass(role === "recruiter")}
                    >
                        <Building2
                            size={18}
                            className={role === "recruiter" ? "text-violet-600" : "text-slate-500"}
                        />
                        <div>
                            <p className="text-[11px] font-bold text-[#28233D]">
                                Recruiter
                            </p>
                            <p className="mt-0.5 text-[9px] text-[#858096]">
                                Build your team
                            </p>
                        </div>
                    </button>

                </div>

                {/* Form Fields */}
                <div className="mt-3.5 grid grid-cols-2 gap-x-3 gap-y-2.5">

                    <div className="col-span-2">
                        <label className={labelClass}>Work email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            placeholder="you@company.com"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Phone number</label>
                        <input
                            type="tel"
                            value={phoneNo}
                            onChange={(e) => setPhoneNo(e.target.value)}
                            required
                            disabled={loading}
                            placeholder="Phone number"
                            maxLength={10}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Full name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading}
                            placeholder="John Doe"
                            className={inputClass}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className={labelClass}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            placeholder="Create a password"
                            className={inputClass}
                        />
                    </div>

                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={!role || loading}
                    className={`mt-3.5 flex h-[42px] w-full items-center justify-center gap-2 rounded-lg text-[12px] font-semibold text-white transition-all duration-200 ${
                        !role || loading
                            ? "cursor-not-allowed bg-violet-300"
                            : "bg-gradient-to-r from-[#A879F5] via-[#812FEA] to-[#6020DF] shadow-[0_4px_14px_rgba(112,37,220,0.20)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-300/40 active:translate-y-0"
                    }`}
                >
                    {loading ? (
                        <>
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            Creating account...
                        </>
                    ) : (
                        <>
                            {role === "User"
                                ? "Create Job Seeker Account"
                                : role === "recruiter"
                                ? "Create Recruiter Account"
                                : "Select a role to continue"}
                            {role && <ArrowRight size={14} />}
                        </>
                    )}
                </button>

                {/* Divider */}
                <div className="my-3 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#EAE6F2]" />
                    <span className="text-[10px] text-[#9690A7]">
                        or continue with
                    </span>
                    <div className="h-px flex-1 bg-[#EAE6F2]" />
                </div>

                {/* Google */}
                {role ? (
                    <GoogleButton
                        role={role}
                        onError={(message) => console.error(message)}
                    />
                ) : (
                    <button
                        type="button"
                        disabled
                        className="flex h-[38px] w-full items-center justify-center gap-2 rounded-lg border border-[#EAE6F2] bg-[#FAF9FC] text-[11px] font-medium text-[#AAA4B9]"
                    >
                        <span className="text-base font-bold">G</span>
                        Select a role to continue with Google
                    </button>
                )}

                {/* Terms */}
                <p className="mt-3 text-center text-[9px] text-[#898399]">
                    By continuing, you agree to our{" "}
                    <NavLink to="/terms" className="font-semibold text-violet-600 hover:underline">
                        Terms
                    </NavLink>
                    {" "}and{" "}
                    <NavLink to="/privacy" className="font-semibold text-violet-600 hover:underline">
                        Privacy Policy
                    </NavLink>.
                </p>

            </form>
        );
    }

    export default SignupForm;
