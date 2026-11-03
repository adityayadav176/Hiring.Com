import {
    ArrowUpRight,
    ChevronDown,
    ChevronRight,
    CircleCheck,
    KeyRound,
    Laptop,
    LockKeyhole,
    LogOut,
    Monitor,
    Recycle,
    ShieldCheck,
    Smartphone,
    Trash2,
    TriangleAlert,
    X,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import { useAuth, useSession } from "../../hooks/Hook";
import TwoFactorModal from "./TwoFactorModal";

function DeviceIcon({ type }) {
    const normalizedType = String(type || "").toLowerCase();

    if (
        normalizedType.includes("mobile") ||
        normalizedType.includes("phone") ||
        normalizedType.includes("android") ||
        normalizedType.includes("iphone")
    ) {
        return <Smartphone size={18} strokeWidth={1.8} />;
    }

    if (
        normalizedType.includes("laptop") ||
        normalizedType.includes("desktop") ||
        normalizedType.includes("windows") ||
        normalizedType.includes("mac") ||
        normalizedType.includes("linux")
    ) {
        return <Laptop size={18} strokeWidth={1.8} />;
    }

    return <Monitor size={18} strokeWidth={1.8} />;
}

function DeleteAccountSecurityModal({
    open,
    password,
    setPassword,
    otp,
    setOtp,
    onClose,
    onSendOtp,
    onConfirm,
}) {
    const [sendingOtp, setSendingOtp] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    useEffect(() => {
        if (!open) {
            setSendingOtp(false);
            setDeleting(false);
            setOtpSent(false);
        }
    }, [open]);

    if (!open) return null;

    const handleSendOtp = async () => {
        if (sendingOtp || deleting) return;

        setSendingOtp(true);

        try {
            await onSendOtp();
            setOtpSent(true);
        } catch (error) {
            console.error("Failed to send delete account OTP:", error);
        } finally {
            setSendingOtp(false);
        }
    };

    const handleConfirm = async () => {
        if (!password.trim()) {
            alert("Please enter your password.");
            return;
        }

        if (!otp.trim()) {
            alert("Please enter the OTP.");
            return;
        }

        if (otp.trim().length !== 6) {
            alert("Please enter a valid 6-digit OTP.");
            return;
        }

        setDeleting(true);

        try {
            await onConfirm();
        } catch (error) {
            console.error("Account deletion failed:", error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-slate-950/40 px-3 py-4 backdrop-blur-[4px] sm:px-4 sm:py-6">
            <div className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-[440px] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.20)] sm:max-h-[90dvh]">
                <div className="flex items-start justify-between px-4 pt-5 sm:px-6 sm:pt-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <KeyRound size={20} strokeWidth={1.8} />
                    </div>

                    <button
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        onClick={onClose}
                        type="button"
                        disabled={deleting}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-4 pb-5 pt-4 sm:px-6">
                    <h2 className="text-[17px] font-bold tracking-[-0.02em] text-slate-900">
                        Confirm account deletion
                    </h2>

                    <p className="mt-2 text-[13px] leading-5 text-slate-500">
                        For your security, enter your password and the
                        verification code sent to your account.
                    </p>

                    <div className="mt-5 space-y-4">
                        <div>
                            <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                disabled={deleting}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:ring-2 focus:ring-red-100"
                            />
                        </div>

                        <div>
                            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                                <label className="text-[12px] font-semibold text-slate-700">
                                    Verification code
                                </label>

                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={sendingOtp || deleting}
                                    className="text-[11px] font-semibold text-violet-600 transition hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {sendingOtp
                                        ? "Sending..."
                                        : otpSent
                                          ? "Resend OTP"
                                          : "Send OTP"}
                                </button>
                            </div>

                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={otp}
                                onChange={(e) =>
                                    setOtp(
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 6)
                                    )
                                }
                                placeholder="Enter 6-digit OTP"
                                autoComplete="one-time-code"
                                disabled={deleting}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] tracking-[0.15em] text-slate-800 outline-none transition placeholder:tracking-normal placeholder:text-slate-400 focus:border-red-300 focus:ring-2 focus:ring-red-100"
                            />

                            {otpSent && (
                                <p className="mt-1.5 text-[11px] text-emerald-600">
                                    Verification code sent successfully.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50/70 px-3.5 py-3">
                        <TriangleAlert
                            size={15}
                            className="mt-0.5 shrink-0 text-red-500"
                        />

                        <p className="text-[11px] leading-4 text-red-700">
                            Account deletion is permanent. Your account and
                            associated data will be removed after successful
                            verification.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
                    <button
                        onClick={onClose}
                        type="button"
                        disabled={deleting}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 sm:py-2"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleConfirm}
                        type="button"
                        disabled={
                            deleting ||
                            !password.trim() ||
                            otp.trim().length !== 6
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300 sm:py-2"
                    >
                        {deleting ? "Deleting..." : "Delete account"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatusPill({ children, tone = "neutral" }) {
    const style = {
        success: "border-emerald-200 bg-emerald-50 text-emerald-700",
        warning: "border-amber-200 bg-amber-50 text-amber-700",
        danger: "border-red-200 bg-red-50 text-red-700",
        neutral: "border-slate-200 bg-slate-50 text-slate-600",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${style[tone]}`}
        >
            {children}
        </span>
    );
}

function SectionHeading({ title, description }) {
    return (
        <div className="mb-3 px-1">
            <h2 className="text-[14px] font-bold tracking-[-0.01em] text-slate-900">
                {title}
            </h2>

            <p className="mt-1 text-[12px] leading-5 text-slate-400">
                {description}
            </p>
        </div>
    );
}

function SettingRow({
    icon,
    title,
    description,
    right,
    children,
    border = true,
}) {
    return (
        <div
            className={`bg-white px-4 py-4 sm:px-5 sm:py-[18px] ${
                border ? "border-b border-slate-100" : ""
            }`}
        >
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex min-w-0 items-start gap-3 sm:contents">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                        {icon}
                    </div>

                    <div className="min-w-0 flex-1 sm:flex-none sm:min-w-0 sm:grow">
                        <h3 className="break-words text-[14px] font-semibold tracking-[-0.01em] text-slate-900">
                            {title}
                        </h3>

                        {description && (
                            <p className="mt-1 max-w-[720px] break-words text-[12px] leading-5 text-slate-500">
                                {description}
                            </p>
                        )}

                        {children}
                    </div>
                </div>

                {right && (
                    <div className="flex w-full min-w-0 flex-wrap items-center gap-2 pl-[52px] sm:w-auto sm:shrink-0 sm:pl-0">
                        {right}
                    </div>
                )}
            </div>
        </div>
    );
}

function ConfirmModal({
    open,
    icon,
    title,
    description,
    confirmText,
    onClose,
    onConfirm,
    danger = false,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/35 px-3 py-4 backdrop-blur-[3px] sm:px-4 sm:py-6">
            <div className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-[420px] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:max-h-[90dvh]">
                <div className="flex items-start justify-between px-4 pt-5 sm:px-6 sm:pt-6">
                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            danger
                                ? "bg-red-50 text-red-600"
                                : "bg-violet-50 text-violet-600"
                        }`}
                    >
                        {icon}
                    </div>

                    <button
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        onClick={onClose}
                        type="button"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-4 pb-6 pt-4 sm:px-6">
                    <h2 className="break-words text-[17px] font-bold tracking-[-0.02em] text-slate-900">
                        {title}
                    </h2>

                    <p className="mt-2 text-[13px] leading-5 text-slate-500">
                        {description}
                    </p>
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
                    <button
                        onClick={onClose}
                        type="button"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50 sm:py-2"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        type="button"
                        className={`rounded-xl px-4 py-2.5 text-[12px] font-semibold text-white transition sm:py-2 ${
                            danger
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-slate-900 hover:bg-slate-800"
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

function VerifyAccountModal({
    open,
    otp,
    setOtp,
    onClose,
    onSendOtp,
    onVerify,
}) {
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    useEffect(() => {
        if (!open) {
            setSendingOtp(false);
            setVerifying(false);
            setOtpSent(false);
        }
    }, [open]);

    if (!open) return null;

    const handleSendOtp = async () => {
        if (sendingOtp || verifying) return;

        setSendingOtp(true);

        try {
            await onSendOtp();
            setOtpSent(true);
        } catch (error) {
            console.error("Failed to send verification OTP:", error);
        } finally {
            setSendingOtp(false);
        }
    };

    const handleVerify = async () => {
        if (!otp.trim()) {
            alert("Please enter the verification code.");
            return;
        }

        if (otp.trim().length !== 6) {
            alert("Please enter a valid 6-digit OTP.");
            return;
        }

        setVerifying(true);

        try {
            await onVerify();
        } catch (error) {
            console.error("Account verification failed:", error);
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-slate-950/40 px-3 py-4 backdrop-blur-[4px] sm:px-4 sm:py-6">
            <div className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-[440px] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.20)] sm:max-h-[90dvh]">
                <div className="flex items-start justify-between px-4 pt-5 sm:px-6 sm:pt-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                        <ShieldCheck size={21} strokeWidth={1.8} />
                    </div>

                    <button
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        onClick={onClose}
                        type="button"
                        disabled={verifying}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-4 pb-6 pt-4 sm:px-6">
                    <h2 className="text-[17px] font-bold tracking-[-0.02em] text-slate-900">
                        Verify your account
                    </h2>

                    <p className="mt-2 text-[13px] leading-5 text-slate-500">
                        Verify your email address to add a trusted
                        verification status to your Peer.Hiring account.
                    </p>

                    <div className="mt-5 flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50/60 px-3.5 py-3">
                        <ShieldCheck
                            size={16}
                            className="mt-0.5 shrink-0 text-violet-600"
                        />

                        <div className="min-w-0">
                            <p className="text-[12px] font-semibold text-violet-900">
                                Email verification
                            </p>

                            <p className="mt-0.5 text-[11px] leading-4 text-violet-700">
                                We'll send a 6-digit verification code to your
                                registered email address.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                            <label className="text-[12px] font-semibold text-slate-700">
                                Verification code
                            </label>

                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={sendingOtp || verifying}
                                className="text-[11px] font-semibold text-violet-600 transition hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {sendingOtp
                                    ? "Sending..."
                                    : otpSent
                                      ? "Resend OTP"
                                      : "Send OTP"}
                            </button>
                        </div>

                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otp}
                            onChange={(e) =>
                                setOtp(
                                    e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 6)
                                )
                            }
                            placeholder="Enter 6-digit OTP"
                            autoComplete="one-time-code"
                            disabled={verifying}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] tracking-[0.15em] text-slate-800 outline-none transition placeholder:tracking-normal placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                        />

                        {otpSent && (
                            <p className="mt-1.5 text-[11px] text-emerald-600">
                                Verification code sent successfully.
                            </p>
                        )}
                    </div>

                    <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3.5 py-3">
                        <CircleCheck
                            size={15}
                            className="mt-0.5 shrink-0 text-emerald-600"
                        />

                        <p className="text-[11px] leading-4 text-emerald-700">
                            Once verified, your account will display a trusted
                            verification status.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
                    <button
                        onClick={onClose}
                        type="button"
                        disabled={verifying}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 sm:py-2"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleVerify}
                        type="button"
                        disabled={verifying || otp.trim().length !== 6}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300 sm:py-2"
                    >
                        {verifying ? "Verifying..." : "Verify account"}
                    </button>
                </div>
            </div>
        </div>
    );
}

const SessionsPanel = ({
    sessions,
    sessionsLoading,
    onLogoutSession,
    onLogoutAll,
}) => {
    const safeSessions = Array.isArray(sessions) ? sessions : [];

    const [showSkeleton, setShowSkeleton] = useState(false);

    useEffect(() => {
        let timer;

        if (sessionsLoading) {
            setShowSkeleton(true);
        } else {
            timer = setTimeout(() => {
                setShowSkeleton(false);
            }, 500);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [sessionsLoading]);

    if (showSkeleton && safeSessions.length === 0) {
        return (
            <div className="overflow-hidden rounded-2xl border border-[#E8E9F0] bg-white">
                <div className="flex flex-col gap-3 border-b border-[#E8E9F0] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <div>
                        <div className="h-4 w-32 animate-pulse rounded-md bg-slate-200" />
                        <div className="mt-2 h-3 w-56 max-w-full animate-pulse rounded-md bg-slate-100" />
                    </div>

                    <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-100" />
                </div>

                <div className="divide-y divide-[#F0F1F5]">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="flex flex-wrap items-start gap-3 px-4 py-4 sm:flex-nowrap sm:items-center sm:px-5"
                        >
                            <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-100" />

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="h-4 w-36 animate-pulse rounded-md bg-slate-200" />
                                    <div className="h-5 w-24 animate-pulse rounded-full bg-slate-100" />
                                </div>

                                <div className="mt-2 h-3 w-64 max-w-full animate-pulse rounded-md bg-slate-100" />
                            </div>

                            <div className="ml-auto h-8 w-16 animate-pulse rounded-lg bg-slate-100" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-[#E8E9F0] bg-white">
            <div className="flex flex-col gap-3 border-b border-[#E8E9F0] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900">
                        Active sessions
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                        Manage devices currently signed in to your account.
                    </p>
                </div>

                {safeSessions.length > 1 && (
                    <button
                        type="button"
                        onClick={onLogoutAll}
                        className="self-start rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100 sm:self-auto"
                    >
                        Sign out all
                    </button>
                )}
            </div>

            {safeSessions.length > 0 ? (
                <div className="divide-y divide-[#F0F1F5]">
                    {safeSessions.map((session) => {
                        const isCurrent = session.current === true;

                        const sessionKey =
                            session.sessionId ||
                            session._id ||
                            session.id;

                        return (
                            <div
                                key={sessionKey}
                                className={`flex flex-wrap items-start gap-3 px-4 py-4 transition sm:flex-nowrap sm:items-center sm:px-5 ${
                                    isCurrent
                                        ? "bg-emerald-50/40"
                                        : "hover:bg-slate-50/70"
                                }`}
                            >
                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                        isCurrent
                                            ? "bg-emerald-100 text-emerald-600"
                                            : "bg-[#F4F3FF] text-[#6D28D9]"
                                    }`}
                                >
                                    <DeviceIcon
                                        type={
                                            session.device ||
                                            session.deviceType
                                        }
                                    />
                                </div>

                                <div className="min-w-0 flex-1 basis-[calc(100%-3.25rem)] sm:basis-auto">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="max-w-full break-words text-sm font-semibold text-slate-900">
                                            {session.device ||
                                                session.deviceType ||
                                                "Unknown device"}
                                        </p>

                                        {isCurrent && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                                </span>

                                                Current session
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 flex flex-wrap gap-x-1.5 break-words text-[11px] text-slate-400">
                                        <span className="break-all">
                                            {session.browser || "Unknown browser"}
                                        </span>

                                        <span>·</span>

                                        <span className="break-all">
                                            {session.ipAddress || "Unknown IP"}
                                        </span>

                                        <span>·</span>

                                        <span className="break-words">
                                            {isCurrent
                                                ? "Active now"
                                                : session.lastActive ||
                                                  "Unknown activity"}
                                        </span>
                                    </p>
                                </div>

                                {isCurrent ? (
                                    <div className="ml-auto hidden items-center gap-1.5 text-xs font-semibold text-emerald-600 sm:flex">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        Active
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => onLogoutSession(session)}
                                        className="ml-auto rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:ml-0"
                                    >
                                        Sign out
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="px-4 py-10 text-center sm:px-5">
                    <p className="text-xs font-medium text-slate-500">
                        No active sessions found.
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                        Your active devices will appear here.
                    </p>
                </div>
            )}

            {safeSessions.length > 0 && (
                <div className="border-t border-[#E8E9F0] bg-slate-50/50 px-4 py-3 sm:px-5">
                    <div className="flex items-start gap-2">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#6D28D9]" />

                        <p className="text-[11px] leading-5 text-slate-500">
                            If you don't recognize a session, sign it out
                            immediately and consider changing your password.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

function Settings() {
    const {
        user,
        handleLogout,
        handleDeleteAccount,
        handleSendDeleteAccountOtp,
        handleEmailVerificationOtp,
        handleVerifyEmail,
        handleEnable2FA,
        handleVerify2fa,
    } = useAuth();

    const {
        sessions,
        sessionsLoading,
        handleGetAllSession,
        handleLogoutADevice,
        handleLogoutAllDevices,
    } = useSession();

    const [deletePassword, setDeletePassword] = useState("");
    const [deleteOtp, setDeleteOtp] = useState("");
    const [verifyOtp, setVerifyOtp] = useState("");

    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showSessions, setShowSessions] = useState(false);
    const [show2FA, setShow2FA] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);

    const [twoFactorEnabled, setTwoFactorEnabled] = useState(
        Boolean(user?.twoFactorEnabled)
    );

    const [accountVerified, setAccountVerified] = useState(
        Boolean(user?.isVerified)
    );

    const [modal, setModal] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);

    useEffect(() => {
        if (!showSessions) return;

        const fetchSessions = async () => {
            try {
                await handleGetAllSession();
            } catch (error) {
                console.error("Failed to fetch sessions:", error);
            }
        };

        fetchSessions();
    }, [showSessions]);

    useEffect(() => {
        setTwoFactorEnabled(Boolean(user?.twoFactorEnabled));
    }, [user?.twoFactorEnabled]);

    useEffect(() => {
        setAccountVerified(Boolean(user?.isVerified));
    }, [user?.isVerified]);

    const closeModal = () => {
        setModal(null);
        setSelectedSession(null);
    };

    const openVerifyAccount = () => {
        if (accountVerified) return;

        setVerifyOtp("");
        setShowVerifyModal(true);
    };

    const closeVerifyAccount = () => {
        setVerifyOtp("");
        setShowVerifyModal(false);
    };

    const handleSendVerificationOtp = async () => {
        try {
            await handleEmailVerificationOtp();
        } catch (error) {
            console.error("Failed to send verification OTP:", error);

            alert(
                error?.message ||
                    "Failed to send verification OTP."
            );

            throw error;
        }
    };

    const handleVerifyAccount = async () => {
        if (!verifyOtp.trim()) {
            alert("Please enter the verification code.");
            return;
        }

        if (verifyOtp.trim().length !== 6) {
            alert("Please enter a valid 6-digit OTP.");
            return;
        }

        try {
            await handleVerifyEmail({
                otp: verifyOtp.trim(),
            });

            setAccountVerified(true);
            closeVerifyAccount();
        } catch (error) {
            console.error("Account verification failed:", error);

            alert(
                error?.message ||
                    "Account verification failed."
            );

            throw error;
        }
    };

    const openLogoutSession = (session) => {
        setModal("session");
        setSelectedSession(session);
    };

    const handleLogoutSession = async () => {
        const sessionId =
            selectedSession?.sessionId ||
            selectedSession?._id ||
            selectedSession?.id;

        if (!sessionId) {
            alert("This session does not have a valid session ID.");
            return;
        }

        try {
            await handleLogoutADevice({
                sessionId,
            });

            await handleGetAllSession();

            closeModal();
        } catch (error) {
            console.error("Specific session logout failed:", error);

            alert(
                error?.message ||
                    "Failed to logout this device."
            );
        }
    };

    const handleLogoutAll = async () => {
        try {
            await handleLogoutAllDevices();

            await handleGetAllSession();

            closeModal();
        } catch (error) {
            console.error("Logout all devices failed:", error);

            alert(
                error?.message ||
                    "Failed to logout all devices."
            );
        }
    };

    const handleLogoutCurrent = async () => {
        try {
            await handleLogout();
            closeModal();
        } catch (error) {
            console.error("Current session logout failed:", error);

            alert(
                error?.message ||
                    "Failed to sign out."
            );
        }
    };

    const handleDeleteAccountC = async () => {
        if (!deletePassword.trim()) {
            alert("Please enter your password.");
            return;
        }

        if (!deleteOtp.trim()) {
            alert("Please enter the OTP.");
            return;
        }

        if (deleteOtp.trim().length !== 6) {
            alert("Please enter a valid 6-digit OTP.");
            return;
        }

        try {
            await handleDeleteAccount({
                otp: deleteOtp.trim(),
                password: deletePassword,
            });

            closeModal();
        } catch (error) {
            console.error("Account deletion failed:", error);

            alert(
                error?.message ||
                    "Account deletion failed."
            );

            throw error;
        }
    };

    return (
        <>
            <div className="min-h-full bg-[#F7F8FC]">
                <div className="w-full px-4 py-5 sm:px-7 sm:py-7 lg:px-9 xl:px-10">
                    <div className="mx-auto w-full max-w-[1180px]">
                        <header className="mb-7 sm:mb-8">
                            <h1 className="text-[25px] font-bold tracking-[-0.035em] text-slate-900 sm:text-[27px]">
                                Settings
                            </h1>

                            <p className="mt-1.5 max-w-2xl text-[13px] leading-5 text-slate-500">
                                Manage your account, security preferences and
                                active sessions.
                            </p>
                        </header>

                        {/* Account */}
                        <section>
                            <SectionHeading
                                title="Account"
                                description="Manage your Peer.Hiring account and trust settings."
                            />

                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.025)]">
                                <div className="border-b border-slate-100">
                                    <SettingRow
                                        icon={
                                            <ShieldCheck
                                                size={18}
                                                strokeWidth={1.8}
                                            />
                                        }
                                        title="Account verification"
                                        description={
                                            accountVerified
                                                ? "Your account is verified and displays a trusted status."
                                                : "Verify your account to build trust with recruiters and candidates."
                                        }
                                        right={
                                            <div className="flex flex-wrap items-center gap-2">
                                                <StatusPill
                                                    tone={
                                                        accountVerified
                                                            ? "success"
                                                            : "warning"
                                                    }
                                                >
                                                    {accountVerified ? (
                                                        <>
                                                            <CircleCheck size={12} />
                                                            Verified
                                                        </>
                                                    ) : (
                                                        <>
                                                            <TriangleAlert size={12} />
                                                            Not Verified
                                                        </>
                                                    )}
                                                </StatusPill>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        accountVerified
                                                            ? undefined
                                                            : openVerifyAccount
                                                    }
                                                    disabled={accountVerified}
                                                    className="hidden items-center gap-1 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-violet-600 transition hover:bg-violet-50 disabled:cursor-default disabled:opacity-100 sm:flex"
                                                >
                                                    {accountVerified
                                                        ? "Verified"
                                                        : "Verify"}

                                                    {!accountVerified && (
                                                        <ChevronRight size={14} />
                                                    )}
                                                </button>
                                            </div>
                                        }
                                    />

                                    {!accountVerified && (
                                        <div className="mx-4 mb-4 flex flex-col items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/60 px-3.5 py-3 sm:mx-5 sm:flex-row sm:items-start">
                                            <TriangleAlert
                                                size={16}
                                                className="mt-0.5 shrink-0 text-amber-600"
                                            />

                                            <div className="min-w-0 flex-1">
                                                <p className="text-[12px] font-semibold text-amber-900">
                                                    Verify your account
                                                </p>

                                                <p className="mt-0.5 text-[11px] leading-4 text-amber-700">
                                                    Complete verification to
                                                    strengthen your profile and
                                                    improve trust across
                                                    Peer.Hiring.
                                                </p>
                                            </div>

                                            <button
                                                className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-[11px] font-semibold text-amber-800 shadow-sm ring-1 ring-amber-200 transition hover:bg-amber-100"
                                                onClick={openVerifyAccount}
                                                type="button"
                                            >
                                                Verify account
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <SettingRow
                                    icon={
                                        <Recycle
                                            size={18}
                                            strokeWidth={1.8}
                                        />
                                    }
                                    title="Recycle bin"
                                    description="Recover recently deleted items before they are permanently removed."
                                    border={false}
                                    right={
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                                        >
                                            Open
                                            <ChevronRight size={14} />
                                        </button>
                                    }
                                />
                            </div>
                        </section>

                        {/* Security */}
                        <section className="mt-7 sm:mt-9">
                            <SectionHeading
                                title="Security"
                                description="Protect your account and control where you're signed in."
                            />

                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.025)]">
                                <div className="border border-slate-100">
                                    <SettingRow
                                        icon={
                                            <LockKeyhole
                                                size={18}
                                                strokeWidth={1.8}
                                            />
                                        }
                                        title="Two-factor authentication"
                                        description={
                                            twoFactorEnabled
                                                ? "Your account has an additional layer of sign-in protection."
                                                : "Add an authenticator app to protect your account."
                                        }
                                        right={
                                            <div className="flex flex-wrap items-center gap-2">
                                                <StatusPill
                                                    tone={
                                                        twoFactorEnabled
                                                            ? "success"
                                                            : "warning"
                                                    }
                                                >
                                                    {twoFactorEnabled ? (
                                                        <>
                                                            <CircleCheck size={12} />
                                                            Enabled
                                                        </>
                                                    ) : (
                                                        <>
                                                            <TriangleAlert size={12} />
                                                            Disabled
                                                        </>
                                                    )}
                                                </StatusPill>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShow2FA(!show2FA)
                                                    }
                                                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-50"
                                                >
                                                    {!show2FA ? "Manage" : "Hide"}

                                                    <ChevronDown
                                                        size={14}
                                                        className={`transition-transform ${
                                                            show2FA
                                                                ? "rotate-180"
                                                                : ""
                                                        }`}
                                                    />
                                                </button>
                                            </div>
                                        }
                                    />

                                    {show2FA && (
                                        <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-4 sm:px-5">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="min-w-0">
                                                    <p className="text-[12px] font-semibold text-slate-800">
                                                        Authenticator app
                                                    </p>

                                                    <p className="mt-0.5 text-[11px] leading-4 text-slate-400">
                                                        Use a verification code
                                                        from your authenticator
                                                        app when signing in.
                                                    </p>
                                                </div>

                                                {!twoFactorEnabled && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShow2FAModal(true)
                                                        }
                                                        className="self-start rounded-xl bg-violet-600 px-3.5 py-2 text-[12px] font-semibold text-white transition hover:bg-violet-700"
                                                    >
                                                        Enable 2FA
                                                    </button>
                                                )}

                                                {twoFactorEnabled && (
                                                    <span className="text-[12px] font-semibold text-emerald-600">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <SettingRow
                                        icon={
                                            <Monitor
                                                size={18}
                                                strokeWidth={1.8}
                                            />
                                        }
                                        title="Active sessions"
                                        description="Review the devices currently signed in to your account."
                                        border={!showSessions}
                                        right={
                                            <button
                                                onClick={() =>
                                                    setShowSessions(
                                                        (previous) => !previous
                                                    )
                                                }
                                                type="button"
                                                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-50"
                                            >
                                                {showSessions
                                                    ? "Hide"
                                                    : "Manage"}

                                                <ChevronDown
                                                    size={14}
                                                    className={`transition-transform ${
                                                        showSessions
                                                            ? "rotate-180"
                                                            : ""
                                                    }`}
                                                />
                                            </button>
                                        }
                                    />

                                    {showSessions && (
                                        <SessionsPanel
                                            sessions={
                                                Array.isArray(sessions)
                                                    ? sessions
                                                    : []
                                            }
                                            sessionsLoading={sessionsLoading}
                                            onLogoutSession={openLogoutSession}
                                            onLogoutAll={() =>
                                                setModal("allSessions")
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Security banner */}
                        <section className="mt-6 sm:mt-7">
                            <div className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 via-white to-white px-4 py-4 sm:gap-4 sm:px-5 sm:py-5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm ring-1 ring-violet-100">
                                    <ShieldCheck size={20} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-[13px] font-semibold text-slate-900">
                                        Keep your account secure
                                    </p>

                                    <p className="mt-1 max-w-2xl text-[12px] leading-5 text-slate-500">
                                        Review your active sessions regularly
                                        and remove devices you no longer
                                        recognize.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => setShowSessions(true)}
                                        className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-violet-700 transition hover:text-violet-800"
                                    >
                                        Review security
                                        <ArrowUpRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Session */}
                        <section className="mt-7 sm:mt-9">
                            <SectionHeading
                                title="Session"
                                description="Sign out from this device or end other active sessions."
                            />

                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.025)]">
                                <SettingRow
                                    icon={
                                        <LogOut
                                            size={18}
                                            strokeWidth={1.8}
                                        />
                                    }
                                    title="Sign out"
                                    description="Sign out from your current Peer.Hiring session."
                                    border={false}
                                    right={
                                        <button
                                            type="button"
                                            onClick={() => setModal("logout")}
                                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[12px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                                        >
                                            <LogOut size={14} />
                                            Sign out
                                        </button>
                                    }
                                />
                            </div>
                        </section>

                        {/* Danger zone */}
                        <section className="mt-7 pb-8 sm:mt-9 sm:pb-12">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-red-600">
                                    Danger zone
                                </p>

                                <p className="mt-1 text-[12px] text-slate-400">
                                    Irreversible account actions.
                                </p>
                            </div>

                            <div className="mt-3 overflow-hidden rounded-2xl border border-red-200/80 bg-white">
                                <SettingRow
                                    icon={
                                        <Trash2
                                            size={18}
                                            strokeWidth={1.8}
                                        />
                                    }
                                    title="Delete account"
                                    description="Permanently delete your Peer.Hiring account and associated data."
                                    border={false}
                                    right={
                                        <button
                                            type="button"
                                            onClick={() => setModal("delete")}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-[12px] font-semibold text-red-600 transition hover:bg-red-50"
                                        >
                                            Delete account
                                            <ChevronRight size={14} />
                                        </button>
                                    }
                                />

                                <div className="border-t border-red-100 bg-red-50/50 px-4 py-3 sm:px-5">
                                    <div className="flex items-start gap-2">
                                        <TriangleAlert
                                            size={14}
                                            className="mt-0.5 shrink-0 text-red-500"
                                        />

                                        <p className="text-[11px] leading-4 text-red-700">
                                            Account deletion is permanent.
                                            Make sure you've backed up
                                            anything you need before
                                            continuing.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Logout current session */}
            <ConfirmModal
                open={modal === "logout"}
                icon={<LogOut size={19} />}
                title="Sign out of Peer.Hiring?"
                description="You'll be signed out from this device. You'll need to sign in again to access your account."
                confirmText="Sign out"
                onClose={closeModal}
                onConfirm={handleLogoutCurrent}
            />

            {/* Logout selected session */}
            <ConfirmModal
                open={modal === "session"}
                icon={<Monitor size={19} />}
                title={`Sign out ${
                    selectedSession?.device ||
                    selectedSession?.deviceName ||
                    selectedSession?.browser ||
                    "this device"
                }?`}
                description="This device will lose access to your Peer.Hiring account. You can sign in again later."
                confirmText="Sign out device"
                onClose={closeModal}
                onConfirm={handleLogoutSession}
            />

            {/* Logout all other sessions */}
            <ConfirmModal
                open={modal === "allSessions"}
                icon={<LogOut size={19} />}
                title="Sign out all other devices?"
                description="Every other active session will be signed out. Your current device will remain signed in."
                confirmText="Sign out others"
                onClose={closeModal}
                onConfirm={handleLogoutAll}
            />

            {/* Delete account confirmation */}
            <ConfirmModal
                open={modal === "delete"}
                icon={<Trash2 size={19} />}
                title="Delete your Peer.Hiring account?"
                description="This action permanently removes your account and associated data. This cannot be undone."
                confirmText="Continue"
                danger
                onClose={closeModal}
                onConfirm={() => {
                    setDeletePassword("");
                    setDeleteOtp("");
                    setModal("delete-security");
                }}
            />

            {/* Delete account security verification */}
            <DeleteAccountSecurityModal
                open={modal === "delete-security"}
                password={deletePassword}
                setPassword={setDeletePassword}
                otp={deleteOtp}
                setOtp={setDeleteOtp}
                onClose={closeModal}
                onSendOtp={handleSendDeleteAccountOtp}
                onConfirm={handleDeleteAccountC}
            />

            {/* Account verification */}
            <VerifyAccountModal
                open={showVerifyModal}
                otp={verifyOtp}
                setOtp={setVerifyOtp}
                onClose={closeVerifyAccount}
                onSendOtp={handleSendVerificationOtp}
                onVerify={handleVerifyAccount}
            />

            {/* Two-factor authentication */}
            <TwoFactorModal
                open={show2FAModal}
                onClose={() => setShow2FAModal(false)}
                onEnabled={() => {
                    setTwoFactorEnabled(true);
                }}
                enable2FA={handleEnable2FA}
                verify2FASetup={handleVerify2fa}
            />
        </>
    );
}

export default Settings;