
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/Hook";
import GoogleButton from "./GoogleButton";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [twoFactorRequired, setTwoFactorRequired] = useState(false);
    const [twoFactorToken, setTwoFactorToken] = useState("");
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const { handleLogin, handleLoginWith2FA, getUser } = useAuth();

    // Restore existing session
    useEffect(() => {
        let active = true;

        const restoreSession = async () => {
            try {
                const account = await getUser();

                if (!active || !account) return;

                if (account.role === "recruiter") {
                    navigate("/recruiter", { replace: true });
                } else if (
                    account.role === "User" ||
                    account.role === "user"
                ) {
                    navigate("/dashboard", { replace: true });
                }
            } catch (err) {
                console.error("Session restoration failed:", err);
            }
        };

        restoreSession();

        return () => {
            active = false;
        };
    }, [getUser, navigate]);

    // Login
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        try {
            setLoading(true);
            setError("");

            const result = await handleLogin({
                email: email.trim(),
                password,
            });

            const responseData =
                result?.data?.data ??
                result?.data ??
                result;

            const requires2FA =
                responseData?.requires2FA ??
                responseData?.twoFactorRequired ??
                responseData?.data?.requires2FA ??
                responseData?.data?.twoFactorRequired;

            if (requires2FA) {
                const temporaryToken =
                    responseData?.twoFactorToken ??
                    responseData?.data?.twoFactorToken;

                if (!temporaryToken) {
                    setError(
                        "Two-factor authentication token was not received. Please try again."
                    );
                    return;
                }

                setTwoFactorToken(temporaryToken);
                setTwoFactorRequired(true);
                setToken("");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err?.message || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    // Verify 2FA
    const handleVerify2FA = async () => {
        if (!/^\d{6}$/.test(token)) {
            setError("Please enter the 6-digit authentication code.");
            return;
        }

        if (!twoFactorToken) {
            setError("Your verification session is missing. Please log in again.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await handleLoginWith2FA({
                twoFactorToken,
                token,
            });
        } catch (err) {
            console.error("2FA verification error:", err);
            setError(err?.message || "Invalid authentication code.");
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        setTwoFactorRequired(false);
        setTwoFactorToken("");
        setToken("");
        setError("");
    };

    const inputClass =
        "mt-1.5 h-[40px] w-full rounded-[9px] border border-[#E8E3F2] bg-white px-3 text-[12px] font-medium text-[#29233D] outline-none transition-all placeholder:text-[#AAA4B9] hover:border-violet-300 focus:border-violet-500 focus:ring-[3px] focus:ring-violet-100 disabled:bg-slate-50";

    const labelClass =
        "block text-[11px] font-semibold text-[#514A68]";

    const activeTab =
        "relative pb-2.5 text-[13px] font-semibold text-violet-700 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-violet-600";

    const inactiveTab =
        "pb-2.5 text-[13px] font-semibold text-[#817B95] transition-colors hover:text-violet-600";

    return (
        <div className="mx-auto w-full max-w-[360px] min-w-0">

            {/* Tabs */}
            <div className="flex items-center gap-7 border-b border-[#EDE9F5]">
                <NavLink
                    to="/login"
                    className={({ isActive }) =>
                        isActive ? activeTab : inactiveTab
                    }
                >
                    Log in
                </NavLink>

                <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                        isActive ? activeTab : inactiveTab
                    }
                >
                    Create account
                </NavLink>
            </div>

            {/* Heading */}
            <div className="mt-4 mb-4">
                <h1 className="text-[23px] font-bold tracking-[-0.8px] text-[#17152F]">
                    {twoFactorRequired
                        ? "Verify your identity"
                        : "Welcome back"}
                </h1>

                <p className="mt-1 text-[12px] leading-5 text-[#77718F]">
                    {twoFactorRequired
                        ? "Enter the 6-digit code from your Authenticator app."
                        : "Enter your details to continue your search."}
                </p>
            </div>

            {/* Login Form */}
            {!twoFactorRequired && (
                <form onSubmit={handleSubmit} className="space-y-3">

                    <div>
                        <label htmlFor="login-email" className={labelClass}>
                            Work email
                        </label>

                        <input
                            id="login-email"
                            type="email"
                            autoComplete="email"
                            required
                            disabled={loading}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="login-password" className={labelClass}>
                            Password
                        </label>

                        <input
                            id="login-password"
                            type="password"
                            autoComplete="current-password"
                            required
                            disabled={loading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className={inputClass}
                        />
                    </div>

                    {/* Remember / Forgot */}
                    <div className="flex items-center justify-between gap-2 pt-0.5">

                        <label className="flex cursor-pointer items-center gap-2 text-[10px] text-[#77718F]">
                            <input
                                type="checkbox"
                                disabled={loading}
                                className="h-3.5 w-3.5 accent-violet-600"
                            />
                            Remember me
                        </label>

                        <NavLink
                            to="/sendPasswordResetOpt"
                            className="text-[10px] font-semibold text-violet-600 transition-colors hover:text-violet-800"
                        >
                            Forgot Password?
                        </NavLink>
                    </div>

                    {error && (
                        <p
                            role="alert"
                            className="break-words rounded-lg bg-red-50 px-3 py-2 text-[11px] text-red-600"
                        >
                            {error}
                        </p>
                    )}

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            group flex h-[42px] w-full items-center
                            justify-center gap-2 rounded-[10px]
                            bg-gradient-to-r from-[#A879F5]
                            via-[#812FEA] to-[#6020DF]
                            text-[12px] font-semibold text-white
                            shadow-[0_5px_16px_rgba(112,37,220,0.20)]
                            transition-all duration-200
                            hover:-translate-y-[1px]
                            hover:shadow-[0_8px_22px_rgba(112,37,220,0.28)]
                            active:translate-y-0
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {loading ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                Logging in...
                            </>
                        ) : (
                            <>
                                Log in
                                <span className="transition-transform group-hover:translate-x-1">
                                    →
                                </span>
                            </>
                        )}
                    </button>

                </form>
            )}

            {/* Two Factor Authentication */}
            {twoFactorRequired && (
                <div className="space-y-3">

                    <div className="rounded-lg border border-violet-100 bg-violet-50/80 p-3">
                        <p className="text-[11px] font-semibold text-violet-700">
                            Two-factor authentication
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-[#77718F]">
                            Open your Authenticator app and enter your 6-digit security code.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="two-factor-code"
                            className={labelClass}
                        >
                            Authentication code
                        </label>

                        <input
                            id="two-factor-code"
                            autoFocus
                            autoComplete="one-time-code"
                            inputMode="numeric"
                            type="text"
                            maxLength={6}
                            disabled={loading}
                            value={token}
                            onChange={(e) =>
                                setToken(
                                    e.target.value.replace(/\D/g, "").slice(0, 6)
                                )
                            }
                            placeholder="000000"
                            className="
                                mt-1.5 h-[48px] w-full rounded-[9px]
                                border border-[#E8E3F2] bg-white
                                text-center text-[20px] font-semibold
                                tracking-[0.5em] text-[#29233D]
                                outline-none transition-all
                                focus:border-violet-500
                                focus:ring-[3px] focus:ring-violet-100
                            "
                        />
                    </div>

                    {error && (
                        <p role="alert" className="text-[11px] text-red-600">
                            {error}
                        </p>
                    )}

                    {/* Verify Button */}
                    <button
                        type="button"
                        onClick={handleVerify2FA}
                        disabled={loading || token.length !== 6}
                        className="
                            group flex h-[42px] w-full items-center
                            justify-center gap-2 rounded-[10px]
                            bg-gradient-to-r from-[#A879F5]
                            via-[#812FEA] to-[#6020DF]
                            text-[12px] font-semibold text-white
                            shadow-[0_5px_16px_rgba(112,37,220,0.20)]
                            transition-all duration-200
                            hover:-translate-y-[1px]
                            hover:shadow-[0_8px_22px_rgba(112,37,220,0.28)]
                            active:translate-y-0
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {loading ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                Verify & Login
                                <span className="transition-transform group-hover:translate-x-1">
                                    →
                                </span>
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleBackToLogin}
                        className="w-full pt-1 text-[11px] font-semibold text-[#77718F] transition-colors hover:text-violet-600 disabled:opacity-50"
                    >
                        ← Back to login
                    </button>
                </div>
            )}

            {/* Google and Terms */}
            {!twoFactorRequired && (
                <>
                    <div className="my-4 flex items-center gap-3">
                        <div className="h-px flex-1 bg-[#EAE6F2]" />

                        <span className="whitespace-nowrap text-[10px] text-[#9690A7]">
                            or continue with
                        </span>

                        <div className="h-px flex-1 bg-[#EAE6F2]" />
                    </div>

                    <GoogleButton
                        onError={(message) => setError(message)}
                    />

                    <p className="mt-3 text-center text-[9px] leading-4 text-[#898399]">
                        By continuing, you agree to our{" "}
                        <NavLink
                            to="/terms"
                            className="font-semibold text-violet-600 hover:underline"
                        >
                            Terms
                        </NavLink>
                        {" "}and{" "}
                        <NavLink
                            to="/privacy"
                            className="font-semibold text-violet-600 hover:underline"
                        >
                            Privacy Policy
                        </NavLink>.
                    </p>
                </>
            )}

        </div>
    );
}

export default LoginForm;
