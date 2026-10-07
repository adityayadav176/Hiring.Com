import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/Hook";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [twoFactorRequired, setTwoFactorRequired] = useState(false);
    const [twoFactorUserId, setTwoFactorUserId] = useState("");
    const [token, setToken] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const {
        handleLogin,
        handleLoginWith2FA,
    } = useAuth();

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await handleLogin({
                email,
                password,
            });

            // 2FA required
            if (result?.requires2FA) {
                setTwoFactorRequired(true);
                setTwoFactorUserId(result.userId);
                return;
            }

        } catch (error) {
            console.error("Login error:", error);

            setError(
                error?.message || "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerify2FA = async () => {
        if (token.length !== 6) {
            setError(
                "Please enter the 6-digit authentication code."
            );
            return;
        }

        try {
            setLoading(true);
            setError("");

            await handleLoginWith2FA({
                userId: twoFactorUserId,
                token,
            });

        } catch (error) {
            console.error("2FA verification error:", error);

            setError(
                error?.message ||
                "Invalid authentication code."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white max-w-sm rounded-xl border border-slate-200 p-6 h-[560px] mt-2 mb-2">

            {/* Tabs */}
            <div className="flex gap-6 border-b border-slate-200">

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

            <div className="mt-4">

                {/* Header */}
                <h1 className="text-2xl font-bold">
                    {twoFactorRequired
                        ? "Verify your identity"
                        : "Welcome back"}
                </h1>

                <p className="text-slate-500 font-medium text-xs mt-2 mb-4">
                    {twoFactorRequired
                        ? "Enter the 6-digit code from your Authenticator app."
                        : "Enter your details to continue your search."}
                </p>

                {/* ============================= */}
                {/* NORMAL LOGIN */}
                {/* ============================= */}

                {!twoFactorRequired && (
                    <>
                        <span className="text-slate-600 font-medium text-xs">
                            Work email
                        </span>

                        <input
                            required
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            value={email}
                            className="text-slate-500 outline-none font-medium mt-3 text-[12px] p-2.5 border-gray-200 focus:border-blue-500 border rounded-xl max-w-md w-full"
                            type="email"
                            placeholder="you@company.com"
                        />

                        <span className="text-slate-600 font-medium text-xs block mt-3">
                            Password
                        </span>

                        <input
                            required
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            value={password}
                            className="text-slate-500 outline-none font-medium mt-3 text-[12px] p-2.5 border-gray-200 focus:border-blue-500 border rounded-xl max-w-md w-full"
                            type="password"
                            placeholder="....."
                        />

                        <div className="flex items-center justify-between mt-4">

                            <div className="flex items-center mb-2 gap-2">
                                <input
                                    type="checkbox"
                                    className="cursor-pointer"
                                />

                                <span className="text-slate-400 font-medium text-[10px]">
                                    Remember me
                                </span>
                            </div>

                            <NavLink
                                className="font-medium text-[8px] flex justify-end text-blue-600 hover:text-blue-800"
                                to="/sendPasswordResetOpt"
                            >
                                Forget Password?
                            </NavLink>

                        </div>

                        {error && (
                            <p className="text-red-500 text-[10px] mt-2">
                                {error}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="text-white mt-2 bg-blue-600 p-2.5 text-[12px] rounded-xl max-w-md w-full flex items-center justify-center cursor-pointer disabled:opacity-50"
                        >
                            {loading
                                ? "Logging in..."
                                : "Log in"}
                        </button>
                    </>
                )}

                {/* ============================= */}
                {/* 2FA LOGIN */}
                {/* ============================= */}

                {twoFactorRequired && (
                    <div className="mt-6">

                        <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">

                            <p className="text-violet-700 text-xs font-semibold">
                                Two-factor authentication
                            </p>

                            <p className="text-slate-500 text-[10px] mt-1 leading-4">
                                Open your Authenticator app and enter
                                the 6-digit security code.
                            </p>

                        </div>

                        <label className="block text-slate-600 font-medium text-xs mt-5">
                            Authentication code
                        </label>

                        <input
                            autoFocus
                            autoComplete="one-time-code"
                            inputMode="numeric"
                            type="text"
                            maxLength={6}
                            value={token}
                            onChange={(e) =>
                                setToken(
                                    e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 6)
                                )
                            }
                            placeholder="000000"
                            className="text-slate-700 outline-none font-semibold tracking-[0.4em] text-center mt-3 text-lg p-3 border border-gray-200 focus:border-violet-500 rounded-xl w-full"
                        />

                        {error && (
                            <p className="text-red-500 text-[10px] mt-2">
                                {error}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={handleVerify2FA}
                            disabled={
                                loading ||
                                token.length !== 6
                            }
                            className="text-white mt-4 bg-violet-600 p-2.5 text-[12px] rounded-xl w-full flex items-center justify-center cursor-pointer disabled:opacity-50"
                        >
                            {loading
                                ? "Verifying..."
                                : "Verify & Login"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setTwoFactorRequired(false);
                                setTwoFactorUserId("");
                                setToken("");
                                setError("");
                            }}
                            className="text-slate-500 hover:text-slate-700 text-[10px] font-medium mt-3 w-full"
                        >
                            ← Back to login
                        </button>

                    </div>
                )}

            </div>

            {/* Social login only on normal login */}
            {!twoFactorRequired && (
                <>
                    <div className="flex items-center gap-3 mt-5 mb-5">

                        <div className="flex-1 border-t border-slate-200" />

                        <span className="text-slate-400 font-medium text-[9px] whitespace-nowrap">
                            or continue with
                        </span>

                        <div className="flex-1 border-t border-slate-200" />

                    </div>

                    <button
                        type="button"
                        className="w-full cursor-pointer max-w-md flex items-center justify-center gap-2 p-2.5 mt-4 mb-4 border border-gray-200 rounded-xl text-slate-500 font-medium text-[12px] transition-all duration-200 hover:bg-slate-50"
                    >
                        <span className="text-violet-600 text-xl leading-none">
                            G
                        </span>

                        <span>
                            Continue with Google
                        </span>
                    </button>

                    <p className="text-slate-500 flex justify-center gap-0.5 font-medium text-[8px]">
                        By continuing, you agree to our{" "}
                        <NavLink
                            className="text-blue-500"
                            to=""
                        >
                            Terms
                        </NavLink>{" "}
                        and{" "}
                        <NavLink
                            className="text-blue-500"
                            to=""
                        >
                            Privacy Policy.
                        </NavLink>
                    </p>
                </>
            )}

        </div>
    );
}

export default LoginForm;