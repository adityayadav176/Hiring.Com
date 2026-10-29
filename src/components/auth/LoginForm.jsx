
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
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

    const { handleLogin, handleLoginWith2FA } = useAuth();

    const handleSubmit = async (e) => {
        e?.preventDefault();

        try {
            setLoading(true);
            setError("");

            const result = await handleLogin({
                email: email.trim(),
                password,
            });

            // Support common response shapes returned by AuthContext.
            const responseData =
                result?.data?.data ??
                result?.data ??
                result;

            const requires2FA =
                responseData?.requires2FA ??
                responseData?.requires2FA;

            if (requires2FA) {
                const temporaryToken =
                    responseData?.twoFactorToken ??
                    responseData?.data?.twoFactorToken;

                if (!temporaryToken) {
                    setError(
                        "Your backend did not return a temporary 2FA token. Please check handleLogin in AuthContext.jsx."
                    );
                    return;
                }

                setTwoFactorToken(temporaryToken);
                setTwoFactorRequired(true);
                setToken("");
                return;
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err?.message || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

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

    const LoadingSpinner = () => (
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
    );

    const handleBackToLogin = () => {
        setTwoFactorRequired(false);
        setTwoFactorToken("");
        setToken("");
        setError("");
    };

    return (
        <div className="bg-white max-w-sm rounded-xl border border-slate-200 p-6 min-h-[560px] mt-2 mb-2">
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

                {!twoFactorRequired && (
                    <>
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-3"
                        >
                            <label
                                htmlFor="login-email"
                                className="text-slate-600 font-medium text-xs block"
                            >
                                Work email
                            </label>

                            <input
                                id="login-email"
                                required
                                disabled={loading}
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="text-slate-700 outline-none font-medium text-xs p-2.5 border border-gray-200 focus:border-blue-500 rounded-xl w-full disabled:bg-slate-50"
                                type="email"
                                autoComplete="email"
                                placeholder="you@company.com"
                            />

                            <label
                                htmlFor="login-password"
                                className="text-slate-600 font-medium text-xs block"
                            >
                                Password
                            </label>

                            <input
                                id="login-password"
                                required
                                disabled={loading}
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                className="text-slate-700 outline-none font-medium text-xs p-2.5 border border-gray-200 focus:border-blue-500 rounded-xl w-full disabled:bg-slate-50"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                            />

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-slate-400 text-[10px]">
                                    <input
                                        type="checkbox"
                                        disabled={loading}
                                        className="cursor-pointer"
                                    />
                                    Remember me
                                </label>

                                <NavLink
                                    className="font-medium text-[10px] text-blue-600 hover:text-blue-800"
                                    to="/sendPasswordResetOpt"
                                >
                                    Forgot Password?
                                </NavLink>
                            </div>

                            {error && (
                                <p role="alert" className="text-red-500 text-xs">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="text-white bg-blue-600 hover:bg-blue-700 p-2.5 text-xs rounded-xl w-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <LoadingSpinner />
                                        <span>Logging in...</span>
                                    </>
                                ) : (
                                    "Log in"
                                )}
                            </button>
                        </form>
                    </>
                )}

                {twoFactorRequired && (
                    <div className="mt-6">
                        <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
                            <p className="text-violet-700 text-xs font-semibold">
                                Two-factor authentication
                            </p>
                            <p className="text-slate-500 text-[10px] mt-1 leading-4">
                                Open your Authenticator app and enter the
                                6-digit security code.
                            </p>
                        </div>

                        <label
                            htmlFor="two-factor-code"
                            className="block text-slate-600 font-medium text-xs mt-5"
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
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && token.length === 6) {
                                    handleVerify2FA();
                                }
                            }}
                            placeholder="000000"
                            className="text-slate-700 outline-none font-semibold tracking-[0.4em] text-center mt-3 text-lg p-3 border border-gray-200 focus:border-violet-500 rounded-xl w-full disabled:bg-slate-50"
                        />

                        {error && (
                            <p role="alert" className="text-red-500 text-xs mt-2">
                                {error}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={handleVerify2FA}
                            disabled={loading || token.length !== 6}
                            className="text-white mt-4 bg-violet-600 hover:bg-violet-700 p-2.5 text-xs rounded-xl w-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner />
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                "Verify & Login"
                            )}
                        </button>

                        <button
                            type="button"
                            disabled={loading}
                            onClick={handleBackToLogin}
                            className="text-slate-500 hover:text-slate-700 text-xs font-medium mt-3 w-full disabled:opacity-50"
                        >
                            ← Back to login
                        </button>
                    </div>
                )}
            </div>

            {!twoFactorRequired && (
                <>
                    <div className="flex items-center gap-3 mt-5 mb-5">
                        <div className="flex-1 border-t border-slate-200" />
                        <span className="text-slate-400 font-medium text-[9px] whitespace-nowrap">
                            or continue with
                        </span>
                        <div className="flex-1 border-t border-slate-200" />
                    </div>

                    <GoogleButton onError={(message) => setError(message)} />

                    <p className="text-slate-500 flex justify-center gap-1 font-medium text-[8px] mt-4">
                        By continuing, you agree to our{" "}
                        <NavLink
                            className="text-blue-500 hover:underline"
                            to="/terms"
                        >
                            Terms
                        </NavLink>{" "}
                        and{" "}
                        <NavLink
                            className="text-blue-500 hover:underline"
                            to="/privacy"
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
