import React, { useMemo, useState } from "react";
import {
    Search,
    MoreVertical,
    Eye,
    Ban,
    CheckCircle,
    Trash2,
    Users,
    UserCheck,
    UserX,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

function AdminUsers() {
    const [users, setUsers] = useState([
        {
            _id: "USR001",
            name: "Rahul Sharma",
            email: "rahul.sharma@gmail.com",
            phoneNo: "9876543210",
            role: "user",
            status: "active",
            joined: "Sep 18, 2026",
        },
        {
            _id: "USR002",
            name: "Priya Singh",
            email: "priya.singh@gmail.com",
            phoneNo: "9123456780",
            role: "user",
            status: "active",
            joined: "Sep 17, 2026",
        },
        {
            _id: "USR003",
            name: "Aman Verma",
            email: "aman.verma@gmail.com",
            phoneNo: "9988776655",
            role: "user",
            status: "blocked",
            joined: "Sep 15, 2026",
        },
        {
            _id: "USR004",
            name: "Sneha Gupta",
            email: "sneha.gupta@gmail.com",
            phoneNo: "9876123456",
            role: "user",
            status: "active",
            joined: "Sep 14, 2026",
        },
        {
            _id: "USR005",
            name: "Arjun Mehta",
            email: "arjun.mehta@gmail.com",
            phoneNo: "9012345678",
            role: "user",
            status: "active",
            joined: "Sep 12, 2026",
        },
        {
            _id: "USR006",
            name: "Kavya Yadav",
            email: "kavya.yadav@gmail.com",
            phoneNo: "8765432109",
            role: "user",
            status: "blocked",
            joined: "Sep 10, 2026",
        },
        {
            _id: "USR007",
            name: "Rohan Kumar",
            email: "rohan.kumar@gmail.com",
            phoneNo: "9988112233",
            role: "user",
            status: "active",
            joined: "Sep 08, 2026",
        },
        {
            _id: "USR008",
            name: "Ananya Verma",
            email: "ananya.verma@gmail.com",
            phoneNo: "8877665544",
            role: "user",
            status: "active",
            joined: "Sep 05, 2026",
        },
    ]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showMenu, setShowMenu] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                user.name.toLowerCase().includes(searchText) ||
                user.email.toLowerCase().includes(searchText) ||
                user.phoneNo.includes(searchText);

            const matchesStatus =
                statusFilter === "all" ||
                user.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [users, search, statusFilter]);

    const totalUsers = users.length;

    const activeUsers = users.filter(
        (user) => user.status === "active"
    ).length;

    const blockedUsers = users.filter(
        (user) => user.status === "blocked"
    ).length;

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    const toggleStatus = (id) => {
        setUsers((prev) =>
            prev.map((user) =>
                user._id === id
                    ? {
                          ...user,
                          status:
                              user.status === "active"
                                  ? "blocked"
                                  : "active",
                      }
                    : user
            )
        );

        setShowMenu(null);
    };

    const deleteUser = (id) => {
        setUsers((prev) =>
            prev.filter((user) => user._id !== id)
        );

        setShowMenu(null);
    };

    return (
        <div className="w-full min-h-full bg-[#F7F8FC] p-6">

            {/* ================= HEADER ================= */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Users
                        </h1>

                        <span className="px-2.5 py-1 rounded-full bg-[#EEF0FF] text-[#5950E6] text-xs font-semibold">
                            {totalUsers}
                        </span>
                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                        Manage all registered users on Peer.Hiring
                    </p>
                </div>

            </div>


            {/* ================= STATS ================= */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

                {/* Total Users */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-slate-500">
                                Total Users
                            </p>

                            <h2 className="text-2xl font-bold text-slate-900 mt-1">
                                {totalUsers}
                            </h2>

                            <p className="text-xs text-slate-400 mt-1">
                                Registered accounts
                            </p>
                        </div>

                        <div className="w-11 h-11 rounded-xl bg-[#EEF0FF] flex items-center justify-center">
                            <Users className="w-5 h-5 text-[#5950E6]" />
                        </div>

                    </div>
                </div>


                {/* Active Users */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-slate-500">
                                Active Users
                            </p>

                            <h2 className="text-2xl font-bold text-slate-900 mt-1">
                                {activeUsers}
                            </h2>

                            <p className="text-xs text-green-500 mt-1">
                                Currently active
                            </p>
                        </div>

                        <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                            <UserCheck className="w-5 h-5 text-green-600" />
                        </div>

                    </div>
                </div>


                {/* Blocked Users */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-slate-500">
                                Blocked Users
                            </p>

                            <h2 className="text-2xl font-bold text-slate-900 mt-1">
                                {blockedUsers}
                            </h2>

                            <p className="text-xs text-red-500 mt-1">
                                Restricted accounts
                            </p>
                        </div>

                        <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                            <UserX className="w-5 h-5 text-red-500" />
                        </div>

                    </div>
                </div>

            </div>


            {/* ================= SEARCH / FILTER ================= */}

            <div className="bg-white border border-slate-200 rounded-2xl mt-6 p-4">

                <div className="flex flex-col md:flex-row gap-3">

                    <div className="relative flex-1">

                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search by name, email or phone..."
                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:bg-white focus:border-[#5950E6] text-sm transition"
                        />

                    </div>


                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                        className="h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-600 outline-none focus:border-[#5950E6]"
                    >
                        <option value="all">
                            All Users
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="blocked">
                            Blocked
                        </option>
                    </select>

                </div>

            </div>


            {/* ================= TABLE ================= */}

            <div className="bg-white border border-slate-200 rounded-2xl mt-4 overflow-hidden">

                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">

                    <div>
                        <h2 className="text-sm font-semibold text-slate-900">
                            All Users
                        </h2>

                        <p className="text-xs text-slate-400 mt-1">
                            {filteredUsers.length} users found
                        </p>
                    </div>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-slate-50">

                            <tr>

                                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                                    User
                                </th>

                                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                                    Email
                                </th>

                                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                                    Role
                                </th>

                                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                                    Joined
                                </th>

                                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                                    Status
                                </th>

                                <th className="text-right px-6 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredUsers.map((user) => (

                                <tr
                                    key={user._id}
                                    className="border-t border-slate-100 hover:bg-slate-50/70 transition"
                                >

                                    {/* User */}

                                    <td className="px-6 py-4">

                                        <div className="flex items-center gap-3">

                                            <div className="w-10 h-10 rounded-xl bg-[#EEF0FF] text-[#5950E6] flex items-center justify-center text-xs font-bold shrink-0">
                                                {getInitials(user.name)}
                                            </div>

                                            <div className="min-w-0">

                                                <p className="text-sm font-semibold text-slate-900 truncate">
                                                    {user.name}
                                                </p>

                                                <p className="text-[11px] text-slate-400 mt-0.5">
                                                    {user._id}
                                                </p>

                                            </div>

                                        </div>

                                    </td>


                                    {/* Email */}

                                    <td className="px-6 py-4">

                                        <p className="text-sm text-slate-600">
                                            {user.email}
                                        </p>

                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {user.phoneNo}
                                        </p>

                                    </td>


                                    {/* Role */}

                                    <td className="px-6 py-4">

                                        <span className="inline-flex px-2.5 py-1 rounded-lg bg-violet-50 text-[#5950E6] text-xs font-medium">
                                            {user.role}
                                        </span>

                                    </td>


                                    {/* Joined */}

                                    <td className="px-6 py-4">

                                        <span className="text-sm text-slate-500">
                                            {user.joined}
                                        </span>

                                    </td>


                                    {/* Status */}

                                    <td className="px-6 py-4">

                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                                                user.status === "active"
                                                    ? "bg-green-50 text-green-600"
                                                    : "bg-red-50 text-red-600"
                                            }`}
                                        >

                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${
                                                    user.status === "active"
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                }`}
                                            />

                                            {user.status === "active"
                                                ? "Active"
                                                : "Blocked"}

                                        </span>

                                    </td>


                                    {/* Action */}

                                    <td className="px-6 py-4">

                                        <div className="relative flex justify-end">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowMenu(
                                                        showMenu === user._id
                                                            ? null
                                                            : user._id
                                                    )
                                                }
                                                className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition"
                                            >
                                                <MoreVertical className="w-4 h-4 text-slate-500" />
                                            </button>


                                            {showMenu === user._id && (

                                                <div className="absolute right-0 top-10 z-30 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5">

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowMenu(null);
                                                        }}
                                                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View User
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleStatus(
                                                                user._id
                                                            )
                                                        }
                                                        className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg ${
                                                            user.status ===
                                                            "active"
                                                                ? "text-orange-600 hover:bg-orange-50"
                                                                : "text-green-600 hover:bg-green-50"
                                                        }`}
                                                    >

                                                        {user.status ===
                                                        "active" ? (
                                                            <Ban className="w-4 h-4" />
                                                        ) : (
                                                            <CheckCircle className="w-4 h-4" />
                                                        )}

                                                        {user.status ===
                                                        "active"
                                                            ? "Block User"
                                                            : "Unblock User"}

                                                    </button>


                                                    <div className="h-px bg-slate-100 my-1" />


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteUser(
                                                                user._id
                                                            )
                                                        }
                                                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete User
                                                    </button>

                                                </div>

                                            )}

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>


                {/* ================= PAGINATION ================= */}

                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">

                    <p className="text-xs text-slate-400">
                        Showing{" "}
                        <span className="font-semibold text-slate-600">
                            1
                        </span>{" "}
                        -{" "}
                        <span className="font-semibold text-slate-600">
                            {filteredUsers.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-slate-600">
                            {filteredUsers.length}
                        </span>
                    </p>

                    <div className="flex items-center gap-1">

                        <button
                            type="button"
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <button
                            type="button"
                            className="w-8 h-8 rounded-lg bg-[#5950E6] text-white text-xs font-medium"
                        >
                            1
                        </button>

                        <button
                            type="button"
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>

                    </div>

                </div>

            </div>


            {/* ================= USER DETAILS MODAL ================= */}

            {selectedUser && (

                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">

                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

                        {/* Header */}

                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    User Details
                                </h2>

                                <p className="text-xs text-slate-400 mt-1">
                                    User account information
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedUser(null)
                                }
                                className="text-slate-400 w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>

                        </div>


                        {/* User */}

                        <div className="p-6">

                            <div className="flex items-center gap-4">

                                <div className="w-16 h-16 rounded-2xl bg-[#EEF0FF] text-[#5950E6] flex items-center justify-center text-xl font-bold">
                                    {getInitials(selectedUser.name)}
                                </div>

                                <div>

                                    <h3 className="text-lg font-bold text-slate-900">
                                        {selectedUser.name}
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-0.5">
                                        {selectedUser.email}
                                    </p>

                                </div>

                            </div>


                            <div className="grid grid-cols-2 gap-3 mt-6">

                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-400">
                                        Role
                                    </p>

                                    <p className="text-sm font-semibold text-slate-800 mt-1">
                                        {selectedUser.role}
                                    </p>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-400">
                                        Status
                                    </p>

                                    <p className="text-sm font-semibold text-slate-800 mt-1 capitalize">
                                        {selectedUser.status}
                                    </p>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-400">
                                        Phone
                                    </p>

                                    <p className="text-sm font-semibold text-slate-800 mt-1">
                                        {selectedUser.phoneNo}
                                    </p>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-400">
                                        Joined
                                    </p>

                                    <p className="text-sm font-semibold text-slate-800 mt-1">
                                        {selectedUser.joined}
                                    </p>
                                </div>

                            </div>


                            <div className="mt-3 bg-slate-50 rounded-xl p-4">

                                <p className="text-xs text-slate-400">
                                    User ID
                                </p>

                                <p className="text-sm font-semibold text-slate-800 mt-1">
                                    {selectedUser._id}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminUsers;