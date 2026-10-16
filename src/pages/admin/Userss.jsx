
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Ban,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  LoaderCircle,
  MoreVertical,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";
import { useAdmin } from "../../hooks/Hook";

const PAGE_SIZE = 10;

const STATUS_STYLES = {
  active: "bg-green-50 text-green-700",
  blocked: "bg-red-50 text-red-700",
  deleted: "bg-slate-100 text-slate-600",
  unknown: "bg-slate-100 text-slate-600",
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback;

const formatDate = (date) => {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "") =>
  String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

const getUserStatus = (user) => {
  if (!user) return "unknown";

  if (
    user.lockUntil &&
    new Date(user.lockUntil).getTime() > Date.now()
  ) {
    return "blocked";
  }

  const status = String(
    user.accountStatus ?? user.status ?? "active"
  ).toLowerCase();

  return status === "active" ||
    status === "blocked" ||
    status === "deleted"
    ? status
    : "unknown";
};

function Userss() {
  const {
    users,
    usersPagination,
    selectedUser,
    setSelectedUser,
    handleGetAllUsers,
    handleGetUserById,
    handleBlockUser,
    handleUnblockUser,
    handleDeleteUser,
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showMenu, setShowMenu] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [actionModal, setActionModal] = useState({
    type: null,
    user: null,
  });
  const [blockReason, setBlockReason] = useState("");
  const [blockDuration, setBlockDuration] = useState("60");

  const userList = useMemo(
    () => (Array.isArray(users) ? users : []),
    [users]
  );

  const totalUsers =
    Number(usersPagination?.totalUsers) || userList.length;

  const totalPages =
    Number(usersPagination?.totalPages) ||
    Math.max(1, Math.ceil(totalUsers / PAGE_SIZE));

  const currentPage =
    Number(usersPagination?.currentPage) || page;

  const activeUsers = userList.filter(
    (user) => getUserStatus(user) === "active"
  ).length;

  const blockedUsers = userList.filter(
    (user) => getUserStatus(user) === "blocked"
  ).length;

  const deletedUsers = userList.filter(
    (user) => getUserStatus(user) === "deleted"
  ).length;

  const refreshUsers = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      await handleGetAllUsers({
        page,
        limit: PAGE_SIZE,
        search: search.trim(),
        accountStatus: statusFilter === "all" ? "" : statusFilter,
        role: roleFilter === "all" ? "" : roleFilter,
      });
    } catch (error) {
      setPageError(
        getErrorMessage(error, "Failed to fetch users.")
      );
    } finally {
      setLoading(false);
    }
  }, [
    handleGetAllUsers,
    page,
    search,
    statusFilter,
    roleFilter,
    refreshKey,
  ]);

  useEffect(() => {
    const timeout = setTimeout(
      fetchUsers,
      search.trim() ? 300 : 0
    );

    return () => clearTimeout(timeout);
  }, [fetchUsers, search]);

  const closeActionModal = useCallback(() => {
    setActionModal({ type: null, user: null });
    setBlockReason("");
    setPageError("");
  }, []);

  const openBlockModal = useCallback((user) => {
    if (!user?._id) {
      setPageError("User ID is missing.");
      return;
    }

    setShowMenu(null);
    setPageError("");
    setBlockReason("");
    setBlockDuration("60");
    setActionModal({ type: "block", user });
  }, []);

  const openDeleteModal = useCallback((user) => {
    if (!user?._id) {
      setPageError("User ID is missing.");
      return;
    }

    setShowMenu(null);
    setPageError("");
    setActionModal({ type: "delete", user });
  }, []);

  const handleViewUser = useCallback(
    async (userId) => {
      if (!userId) {
        setPageError("User ID is missing.");
        return;
      }

      setShowMenu(null);
      setPageError("");
      setActionLoading(userId);

      try {
        const result = await handleGetUserById(userId);
        const user =
          result?.user ??
          result?.data?.user ??
          result?.data ??
          result;

        if (user?._id) {
          setSelectedUser(user);
        } else {
          setPageError("User details could not be loaded.");
        }
      } catch (error) {
        setPageError(
          getErrorMessage(
            error,
            "Failed to fetch user details."
          )
        );
      } finally {
        setActionLoading(null);
      }
    },
    [handleGetUserById, setSelectedUser]
  );

  const handleConfirmBlock = useCallback(async () => {
    const userId = actionModal.user?._id;
    const duration = Number(blockDuration);
    const reason = blockReason.trim();

    if (!userId) {
      setPageError("User ID is missing.");
      return;
    }

    if (!reason) {
      setPageError("Please enter a reason for blocking this user.");
      return;
    }

    if (!Number.isFinite(duration) || duration <= 0) {
      setPageError("Please select a valid block duration.");
      return;
    }

    setPageError("");
    setActionLoading(userId);

    try {
      if (typeof handleBlockUser !== "function") {
        throw new Error("Block user handler is unavailable.");
      }

      await handleBlockUser({
        userId,
        duration,
      });

      const lockUntil = new Date(
        Date.now() + duration * 60 * 1000
      ).toISOString();

      if (selectedUser?._id === userId) {
        setSelectedUser({
          ...selectedUser,
          lockUntil,
        });
      }

      closeActionModal();
      refreshUsers();
    } catch (error) {
      setPageError(
        getErrorMessage(error, "Failed to block user.")
      );
    } finally {
      setActionLoading(null);
    }
  }, [
    actionModal,
    blockDuration,
    blockReason,
    handleBlockUser,
    selectedUser,
    setSelectedUser,
    closeActionModal,
    refreshUsers,
  ]);

  const handleUnblock = useCallback(
    async (user) => {
      const userId = user?._id;

      if (!userId) {
        setPageError("User ID is missing.");
        return;
      }

      setShowMenu(null);
      setPageError("");
      setActionLoading(userId);

      try {
        if (typeof handleUnblockUser !== "function") {
          throw new Error("Unblock user handler is unavailable.");
        }

        await handleUnblockUser(userId);

        if (selectedUser?._id === userId) {
          setSelectedUser({
            ...selectedUser,
            lockUntil: null,
          });
        }

        refreshUsers();
      } catch (error) {
        setPageError(
          getErrorMessage(error, "Failed to unblock user.")
        );
      } finally {
        setActionLoading(null);
      }
    },
    [
      handleUnblockUser,
      selectedUser,
      setSelectedUser,
      refreshUsers,
    ]
  );

  const handleConfirmDelete = useCallback(async () => {
    const userId = actionModal.user?._id;

    if (!userId) {
      setPageError("User ID is missing.");
      return;
    }

    setPageError("");
    setActionLoading(userId);

    try {
      if (typeof handleDeleteUser !== "function") {
        throw new Error("Delete user handler is unavailable.");
      }

      await handleDeleteUser(userId);

      if (selectedUser?._id === userId) {
        setSelectedUser(null);
      }

      closeActionModal();
      refreshUsers();
    } catch (error) {
      setPageError(
        getErrorMessage(error, "Failed to delete user.")
      );
    } finally {
      setActionLoading(null);
    }
  }, [
    actionModal,
    handleDeleteUser,
    selectedUser,
    setSelectedUser,
    closeActionModal,
    refreshUsers,
  ]);

  const statusStyle = (status) =>
    STATUS_STYLES[status] || STATUS_STYLES.unknown;

  const renderUserActions = (user) => {
    const status = getUserStatus(user);
    const isBusy = actionLoading === user?._id;

    return (
      <div className="relative flex justify-end">
        <button
          type="button"
          disabled={isBusy}
          aria-label={`Actions for ${user?.name || "user"}`}
          onClick={() =>
            setShowMenu((current) =>
              current === user._id ? null : user._id
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 disabled:opacity-50"
        >
          {isBusy ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <MoreVertical className="h-4 w-4 text-slate-500" />
          )}
        </button>

        {showMenu === user._id && (
          <div className="absolute right-0 top-10 z-30 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
            <button
              type="button"
              disabled={isBusy}
              onClick={() => handleViewUser(user._id)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              <Eye className="h-4 w-4" />
              View details
            </button>

            {status !== "deleted" && (
              <button
                type="button"
                disabled={isBusy}
                onClick={() =>
                  status === "blocked"
                    ? handleUnblock(user)
                    : openBlockModal(user)
                }
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm ${
                  status === "blocked"
                    ? "text-green-600 hover:bg-green-50"
                    : "text-orange-600 hover:bg-orange-50"
                }`}
              >
                {status === "blocked" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Ban className="h-4 w-4" />
                )}
                {status === "blocked" ? "Unblock user" : "Block user"}
              </button>
            )}

            <div className="my-1 h-px bg-slate-100" />

            <button
              type="button"
              disabled={isBusy}
              onClick={() => openDeleteModal(user)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete user
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="min-h-full w-full bg-[#F7F8FC] p-4 md:p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  Users
                </h1>
                <span className="rounded-full bg-[#EEF0FF] px-2.5 py-1 text-xs font-semibold text-[#5950E6]">
                  {totalUsers}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Manage registered users on Peer.Hiring.
              </p>
            </div>

            <button
              type="button"
              onClick={refreshUsers}
              disabled={loading}
              className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 sm:self-auto"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {pageError && (
            <div
              role="alert"
              className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <p>{pageError}</p>
              <button
                type="button"
                onClick={() => setPageError("")}
                aria-label="Dismiss error"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Users"
              count={totalUsers}
              description="Matching accounts"
              icon={<Users className="h-5 w-5 text-[#5950E6]" />}
              iconBg="bg-[#EEF0FF]"
            />
            <StatCard
              title="Active Users"
              count={activeUsers}
              description="Active on this page"
              icon={<UserCheck className="h-5 w-5 text-green-600" />}
              iconBg="bg-green-50"
            />
            <StatCard
              title="Blocked Users"
              count={blockedUsers}
              description="Blocked on this page"
              icon={<UserX className="h-5 w-5 text-red-500" />}
              iconBg="bg-red-50"
            />
            <StatCard
              title="Deleted Users"
              count={deletedUsers}
              description="Deleted on this page"
              icon={<Trash2 className="h-5 w-5 text-slate-500" />}
              iconBg="bg-slate-100"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by name or email..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm outline-none focus:border-[#5950E6] focus:bg-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-600 outline-none focus:border-[#5950E6]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
                <option value="deleted">Deleted</option>
              </select>

              <select
                value={roleFilter}
                onChange={(event) => {
                  setRoleFilter(event.target.value);
                  setPage(1);
                }}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-600 outline-none focus:border-[#5950E6]"
              >
                <option value="all">All roles</option>
                <option value="User">User</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 md:px-6">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  All Users
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {totalUsers} matching accounts
                </p>
              </div>
              {loading && (
                <LoaderCircle className="h-5 w-5 animate-spin text-[#5950E6]" />
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-slate-50">
                  <tr>
                    {[
                      "User",
                      "Email / Phone",
                      "Role",
                      "Joined",
                      "Status",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {loading && userList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-[#5950E6]" />
                        <p className="mt-3 text-sm text-slate-500">
                          Loading users...
                        </p>
                      </td>
                    </tr>
                  ) : userList.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-16 text-center text-sm text-slate-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    userList.map((user) => {
                      const status = getUserStatus(user);
                      const isBusy = actionLoading === user?._id;

                      return (
                        <tr
                          key={user._id}
                          className="border-t border-slate-100 hover:bg-slate-50/70"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF0FF] text-xs font-bold text-[#5950E6]">
                                {getInitials(user?.name)}
                              </div>
                              <div className="min-w-0">
                                <p className="max-w-[220px] truncate text-sm font-semibold text-slate-900">
                                  {user?.name || "Unnamed user"}
                                </p>
                                <p className="mt-0.5 max-w-[220px] truncate text-[11px] text-slate-400">
                                  {user?._id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-600">
                              {user?.email || "-"}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              {user?.phoneNo || "-"}
                            </p>
                          </td>

                          <td className="px-6 py-4">
                            <span className="inline-flex rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-medium capitalize text-[#5950E6]">
                              {user?.role || "-"}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-500">
                              {formatDate(user?.createdAt)}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${statusStyle(status)}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  status === "active"
                                    ? "bg-green-500"
                                    : status === "blocked"
                                      ? "bg-red-500"
                                      : "bg-slate-400"
                                }`}
                              />
                              {status.charAt(0).toUpperCase() +
                                status.slice(1)}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            {renderUserActions(user)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
              <p className="text-xs text-slate-400">
                Page{" "}
                <span className="font-semibold text-slate-600">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-600">
                  {totalPages}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() =>
                    setPage((current) => Math.max(1, current - 1))
                  }
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <button
                  type="button"
                  disabled={page >= totalPages || loading}
                  onClick={() =>
                    setPage((current) =>
                      Math.min(totalPages, current + 1)
                    )
                  }
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {selectedUser && (
          <div
  className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-[2px]"
  onClick={() => setSelectedUser(null)}
>
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="user-details-title"
    className="relative my-auto max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
    onClick={(event) => event.stopPropagation()}
  >
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <h2
                    id="user-details-title"
                    className="text-lg font-bold text-slate-900"
                  >
                    User Details
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Account information
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  aria-label="Close user details"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#EEF0FF] text-xl font-bold text-[#5950E6]">
                    {getInitials(selectedUser?.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-slate-900">
                      {selectedUser?.name || "Unnamed user"}
                    </h3>
                    <p className="mt-0.5 break-all text-sm text-slate-500">
                      {selectedUser?.email || "-"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <DetailCard label="Role" value={selectedUser?.role} />
                  <DetailCard
                    label="Status"
                    value={getUserStatus(selectedUser)}
                  />
                  <DetailCard
                    label="Phone"
                    value={selectedUser?.phoneNo}
                  />
                  <DetailCard
                    label="Joined"
                    value={formatDate(selectedUser?.createdAt)}
                  />
                  <DetailCard
                    label="Email verified"
                    value={
                      selectedUser?.isVerified === true
                        ? "Yes"
                        : selectedUser?.isVerified === false
                          ? "No"
                          : "-"
                    }
                  />
                  <DetailCard
                    label="Last updated"
                    value={formatDate(selectedUser?.updatedAt)}
                  />
                  <DetailCard
                    label="Blocked until"
                    value={
                      selectedUser?.lockUntil &&
                      new Date(selectedUser.lockUntil).getTime() >
                        Date.now()
                        ? formatDate(selectedUser.lockUntil)
                        : "-"
                    }
                  />
                </div>

                <div className="mt-3 rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-slate-400" />
                    <p className="text-xs text-slate-400">User ID</p>
                  </div>
                  <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                    {selectedUser?._id || "-"}
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  {getUserStatus(selectedUser) === "blocked" ? (
                    <button
                      type="button"
                      disabled={
                        actionLoading === selectedUser?._id
                      }
                      onClick={() => handleUnblock(selectedUser)}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-green-50 px-4 text-sm font-semibold text-green-700 hover:bg-green-100 disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Unblock user
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={
                        actionLoading === selectedUser?._id
                      }
                      onClick={() => openBlockModal(selectedUser)}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-orange-50 px-4 text-sm font-semibold text-orange-700 hover:bg-orange-100 disabled:opacity-50"
                    >
                      <Ban className="h-4 w-4" />
                      Block user
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={actionLoading === selectedUser?._id}
                    onClick={() => openDeleteModal(selectedUser)}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete user
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {actionModal.type && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
          onClick={closeActionModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="action-modal-title"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {actionModal.type === "block" ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <Ban className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3
                      id="action-modal-title"
                      className="text-base font-bold text-slate-900"
                    >
                      Block user
                    </h3>
                    <p className="mt-1 break-words text-sm text-slate-500">
                      Block{" "}
                      {actionModal.user?.name || "this user"} temporarily?
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeActionModal}
                    aria-label="Close modal"
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <label
                      htmlFor="block-reason"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Reason for blocking
                    </label>
                    <textarea
                      id="block-reason"
                      value={blockReason}
                      onChange={(event) =>
                        setBlockReason(event.target.value)
                      }
                      placeholder="Explain why this user should be blocked..."
                      rows={3}
                      maxLength={500}
                      className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#5950E6]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="block-duration"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Block duration
                    </label>
                    <select
                      id="block-duration"
                      value={blockDuration}
                      onChange={(event) =>
                        setBlockDuration(event.target.value)
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#5950E6]"
                    >
                      <option value="15">15 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="360">6 hours</option>
                      <option value="1440">24 hours</option>
                      <option value="10080">7 days</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeActionModal}
                    className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBlock}
                    disabled={
                      actionLoading === actionModal.user?._id
                    }
                    className="h-10 rounded-xl bg-orange-600 px-4 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
                  >
                    {actionLoading === actionModal.user?._id
                      ? "Blocking..."
                      : "Confirm block"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <Trash2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3
                      id="action-modal-title"
                      className="text-base font-bold text-slate-900"
                    >
                      Delete user
                    </h3>
                    <p className="mt-1 break-words text-sm text-slate-500">
                      Permanently delete{" "}
                      <span className="font-semibold text-slate-700">
                        {actionModal.user?.name || "this user"}
                      </span>
                      ?
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeActionModal}
                    aria-label="Close modal"
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                  This action cannot be undone. Associated data may
                  also be deleted by your backend.
                </p>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeActionModal}
                    className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    disabled={
                      actionLoading === actionModal.user?._id
                    }
                    className="h-10 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {actionLoading === actionModal.user?._id
                      ? "Deleting..."
                      : "Delete permanently"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function StatCard({ title, count, description, icon, iconBg }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            {count}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold capitalize text-slate-800">
        {value === true
          ? "Yes"
          : value === false
            ? "No"
            : value || "-"}
      </p>
    </div>
  );
}

export default Userss;
