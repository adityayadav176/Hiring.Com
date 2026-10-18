
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  UserRound,
  Mail,
  Camera,
  Upload,
  RefreshCw,
  CalendarDays,
  Clock3,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  LockKeyhole,
  ImagePlus,
  ChevronRight,
  LoaderCircle,
  ShieldAlert,
  Copy,
  Check,
} from "lucide-react";

import { useAdmin } from "../../hooks/Hook";

function AdminProfilePage() {
  const {
    adminProfile,
    loading,
    avatarLoading,
    error,
    fetchAdminProfile,
    updateAdminAvatar,
  } = useAdmin();

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Fetch existing admin profile.
  const loadProfile = useCallback(async () => {
    try {
      await fetchAdminProfile();
    } catch {
      // The context handles the fetch error.
    }
  }, [fetchAdminProfile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Create and clean up the selected image preview.
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    // Allow selecting the same file again later.
    event.target.value = "";

    if (!file) return;

    setUploadError("");
    setSuccessMessage("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Choose a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be 5 MB or less.");
      return;
    }

    setSelectedFile(file);
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a profile picture first.");
      return;
    }

    setUploadError("");
    setSuccessMessage("");

    try {
      await updateAdminAvatar(selectedFile);

      setSelectedFile(null);
      setSuccessMessage(
        "Your admin profile picture was updated successfully."
      );
    } catch (err) {
      setUploadError(
        err?.message || "Unable to update your profile picture."
      );
    }
  };

  const handleCancelSelection = () => {
    setSelectedFile(null);
    setUploadError("");
    setSuccessMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopyId = async () => {
    if (!adminProfile?._id) return;

    try {
      await navigator.clipboard.writeText(adminProfile._id);
      setCopied(true);

      // Reset the copy indicator after a short delay.
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setUploadError("Unable to copy the admin ID.");
    }
  };

  if (loading && !adminProfile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <LoaderCircle className="h-5 w-5 animate-spin text-violet-600" />
          Loading admin profile...
        </div>
      </div>
    );
  }

  if (!adminProfile) {
    return (
      <div className="min-h-full bg-slate-50 p-5 sm:p-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            Unable to load admin profile
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error || "We couldn't retrieve your account information."}
          </p>

          <button
            type="button"
            onClick={loadProfile}
            disabled={loading}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Try again
          </button>
        </div>
      </div>
    );
  }

  const adminName = adminProfile.name || "Admin";
  const adminEmail = adminProfile.email || "No email available";
  const adminAvatar =
    previewUrl || adminProfile.avatar?.url || "";
  const isActive = adminProfile.isActive === true;

  const initials = adminName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-full bg-slate-50/80 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Page heading */}
        
{/* Page heading — matching AdminJobs */}
<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
      <ShieldCheck size={15} />
      Administration
    </div>

    <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
      Admin Profile
    </h1>

    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
      Manage your owner account, profile photo, and administrator information.
    </p>
  </div>

  <button
    type="button"
    onClick={loadProfile}
    disabled={loading || avatarLoading}
    className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:self-center"
  >
    <RefreshCw
      size={16}
      className={loading ? "animate-spin" : ""}
    />
    {loading ? "Refreshing..." : "Refresh profile"}
  </button>
</div>


        {/* Global success / error messages */}
        {successMessage && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{successMessage}</p>
          </div>
        )}

        {(uploadError || error) && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{uploadError || error}</p>
          </div>
        )}

        {/* Profile hero */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-2 bg-violet-600" />

          <div className="p-5 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {/* Avatar and upload controls */}
              <div className="relative w-fit shrink-0">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-violet-50 text-3xl font-bold text-violet-700 shadow-md ring-1 ring-slate-200 sm:h-32 sm:w-32">
                  {adminAvatar ? (
                    <img
                      src={adminAvatar}
                      alt={`${adminName}'s profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarLoading}
                  aria-label="Choose a profile picture"
                  title="Choose a profile picture"
                  className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-violet-600 text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-60"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    {adminName}
                  </h2>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-inset ring-violet-100">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Owner
                  </span>
                </div>

                <p className="mt-2 break-all text-sm text-slate-500">
                  {adminEmail}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isActive ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    />
                    {isActive ? "Active account" : "Inactive account"}
                  </span>

                  <span className="text-xs text-slate-400">
                    Peer.Hiring Administration
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Manage your profile photo and review your account details.
                </p>
              </div>
            </div>

            {/* Image selection / preview actions */}
            <div className="mt-7 border-t border-slate-100 pt-5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                    <ImagePlus className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Profile picture
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      JPG, PNG, or WebP. Maximum file size: 5 MB.
                    </p>

                    {selectedFile && (
                      <p className="mt-1 max-w-full break-all text-xs font-medium text-violet-700">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleCancelSelection}
                      disabled={avatarLoading}
                      className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                  >
                    <Camera className="h-4 w-4" />
                    Choose image
                  </button>

                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleAvatarUpload}
                      disabled={avatarLoading}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {avatarLoading ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}

                      {avatarLoading ? "Uploading..." : "Save picture"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Account information */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <UserRound className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                Account information
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Details associated with your admin account.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
            <InfoItem
              icon={UserRound}
              label="Full name"
              value={adminName}
            />

            <InfoItem
              icon={Mail}
              label="Email address"
              value={adminEmail}
            />

            <InfoItem
              icon={ShieldCheck}
              label="Account type"
              value="Owner / Administrator"
            />

            <InfoItem
              icon={CheckCircle2}
              label="Account status"
              value={isActive ? "Active" : "Inactive"}
              valueClassName={isActive ? "text-emerald-700" : "text-red-600"}
            />
          </div>
        </section>

        {/* Account metadata */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Fingerprint className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                Account activity & metadata
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                System-managed account information.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div className="flex items-center gap-3">
                <Fingerprint className="h-5 w-5 shrink-0 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Admin ID
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Unique database identifier
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <code className="max-w-[220px] break-all rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600">
                  {adminProfile._id || "Not available"}
                </code>

                {adminProfile._id && (
                  <button
                    type="button"
                    onClick={handleCopyId}
                    title="Copy admin ID"
                    aria-label="Copy admin ID"
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <MetadataItem
              icon={LockKeyhole}
              label="Owner key"
              value={adminProfile.singletonKey || "Not available"}
            />

            <MetadataItem
              icon={CalendarDays}
              label="Account created"
              value={formatDate(adminProfile.createdAt)}
            />

            <MetadataItem
              icon={Clock3}
              label="Last updated"
              value={formatDate(adminProfile.updatedAt)}
            />

            <MetadataItem
              icon={Clock3}
              label="Last successful login"
              value={formatDate(adminProfile.lastLoginAt)}
            />
          </div>
        </section>

        {/* Security information */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <ShieldAlert className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900">
                Account security
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Protect your owner account with a strong password and keep
                your login credentials private.
              </p>

              <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Password protection
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your password is not displayed on this page. Use your
                    authenticated password-change flow to update it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <p className="pb-2 text-center text-xs text-slate-400">
          Peer.Hiring · Owner Account
        </p>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  valueClassName = "",
}) {
  return (
    <div className="flex items-start gap-3 px-5 py-5 sm:px-7">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className={`mt-1.5 break-words text-sm font-semibold ${valueClassName || "text-slate-800"}`}>
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
}

function MetadataItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 px-5 py-4 sm:items-center sm:px-7">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400 sm:mt-0" />

      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="break-words text-sm font-medium text-slate-800 sm:text-right">
          {value || "Not available"}
        </span>
      </div>
    </div>
  );
}

export default AdminProfilePage;
