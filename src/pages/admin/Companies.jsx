import {
    Ban,
    Building2,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Eye,
    MoreVertical,
    Search,
    ShieldCheck,
    Trash2,
    UserRound,
    Users,
    X,
    XCircle
} from "lucide-react";

import React, { useEffect, useMemo, useState } from "react";

function Companies() {

    // Replace these with your actual context handlers
    const {
        handleGetAllCompanies,
        handleGetCompanyById,
        handleVerifyCompany,
        handleRejectCompany,
        handleBlockCompany
    } = {}; // use your Company/Admin context here


    const [companies, setCompanies] = useState([
        {
            _id: "6aa5b97b8d69b5c78a66b4db",
            name: "aditya&CCO",
            slug: "adityaandcco-1",
            description: "sadfasdfhasdkfhljasdhfjashjfhsekjh",
            industry: "IT",
            companySize: "1-10",
            foundedYear: 2023,
            recruiters: [
                {
                    recruiterId: {
                        _id: "6a9fd08d457e425d037112f9",
                        name: "shardha khapra",
                        email: "aditya12345@gmail.com",
                        phoneNo: "9923928112"
                    },
                    joinedAt: "2026-09-12T20:43:39.623Z"
                }
            ],
            isVerified: false,
            deletedAt: null,
            isDeleted: false,
            createdAt: "2026-09-12T20:43:39.630Z",
            updatedAt: "2026-09-12T20:43:39.630Z"
        },
        {
            _id: "6a9bdfa828d845370d29f53f",
            name: "aditya&CCO",
            slug: "adityaandcco",
            description: "sadfasdfhasdkfhljasdhfjashjfhsekjh",
            industry: "IT",
            companySize: "1-10",
            foundedYear: 2023,
            recruiters: [
                {
                    recruiterId: null,
                    joinedAt: "2026-09-05T09:23:52.679Z"
                }
            ],
            isVerified: false,
            deletedAt: "2026-09-05T09:56:23.254Z",
            isDeleted: true,
            createdAt: "2026-09-05T09:23:52.688Z",
            updatedAt: "2026-09-05T09:56:23.254Z"
        }
    ]);


    const [showMenu, setShowMenu] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [loading, setLoading] = useState(false);


    // --------------------------------------------------
    // GET ALL COMPANIES
    // --------------------------------------------------

    useEffect(() => {

        const fetchCompanies = async () => {

            try {

                setLoading(true);

                if (handleGetAllCompanies) {

                    const response = await handleGetAllCompanies();

                    if (response?.data?.companies) {
                        setCompanies(response.data.companies);
                    }

                }

            } catch (error) {

                console.log("Get companies error:", error);

            } finally {

                setLoading(false);

            }

        };

        fetchCompanies();

    }, []);


    // --------------------------------------------------
    // STATUS
    // --------------------------------------------------

    const getStatus = (company) => {

        if (company.isDeleted) {
            return "deleted";
        }

        if (company.isVerified) {
            return "verified";
        }

        return "pending";

    };


    const statusConfig = {

        verified: {
            label: "Verified",
            className: "bg-green-50 text-green-700 border-green-100",
            dot: "bg-green-500"
        },

        pending: {
            label: "Pending",
            className: "bg-amber-50 text-amber-700 border-amber-100",
            dot: "bg-amber-500"
        },

        deleted: {
            label: "Deleted",
            className: "bg-red-50 text-red-700 border-red-100",
            dot: "bg-red-500"
        }

    };


    // --------------------------------------------------
    // FILTER
    // --------------------------------------------------

    const filteredCompanies = useMemo(() => {

        return companies.filter((company) => {

            const matchesSearch =
                company.name?.toLowerCase().includes(search.toLowerCase()) ||
                company.email?.toLowerCase().includes(search.toLowerCase()) ||
                company.industry?.toLowerCase().includes(search.toLowerCase()) ||
                company.slug?.toLowerCase().includes(search.toLowerCase());


            const status = getStatus(company);

            const matchesStatus =
                statusFilter === "all" ||
                status === statusFilter;


            return matchesSearch && matchesStatus;

        });

    }, [companies, search, statusFilter]);


    // --------------------------------------------------
    // STATS
    // --------------------------------------------------

    const totalCompanies = companies.length;

    const verifiedCompanies =
        companies.filter(company => company.isVerified && !company.isDeleted).length;

    const pendingCompanies =
        companies.filter(company => !company.isVerified && !company.isDeleted).length;

    const deletedCompanies =
        companies.filter(company => company.isDeleted).length;


    // --------------------------------------------------
    // DATE
    // --------------------------------------------------

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });

    };


    // --------------------------------------------------
    // VIEW COMPANY
    // --------------------------------------------------

    const handleViewCompany = async (companyId) => {

        try {

            setShowMenu(null);

            if (handleGetCompanyById) {

                const response = await handleGetCompanyById(companyId);

                if (response?.data) {
                    setSelectedCompany(response.data);
                } else {
                    setSelectedCompany(
                        companies.find(company => company._id === companyId)
                    );
                }

            } else {

                setSelectedCompany(
                    companies.find(company => company._id === companyId)
                );

            }

        } catch (error) {

            console.log("Get company error:", error);

        }

    };


    // --------------------------------------------------
    // VERIFY
    // --------------------------------------------------

    const handleVerify = async (companyId) => {

        try {

            setShowMenu(null);

            if (handleVerifyCompany) {
                await handleVerifyCompany(companyId);
            }

            setCompanies(prev =>
                prev.map(company =>
                    company._id === companyId
                        ? {
                            ...company,
                            isVerified: true
                        }
                        : company
                )
            );

        } catch (error) {

            console.log("Verify company error:", error);

        }

    };


    // --------------------------------------------------
    // REJECT
    // --------------------------------------------------

    const handleReject = async (companyId) => {

        try {

            setShowMenu(null);

            if (handleRejectCompany) {
                await handleRejectCompany(companyId);
            }

        } catch (error) {

            console.log("Reject company error:", error);

        }

    };


    // --------------------------------------------------
    // BLOCK
    // --------------------------------------------------

    const handleBlock = async (companyId) => {

        try {

            setShowMenu(null);

            if (handleBlockCompany) {
                await handleBlockCompany(companyId);
            }

        } catch (error) {

            console.log("Block company error:", error);

        }

    };


    return (

        <div className="w-full min-h-full bg-[#F7F8FC] p-6">

            {/* =========================================
                HEADER
            ========================================== */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <div>

                    <div className="flex items-center gap-2">

                        <h1 className="text-slate-900 font-bold text-2xl">
                            Companies
                        </h1>

                        <span className="bg-[#EEF0FF] text-[#5950E6] text-xs font-semibold px-2.5 py-1 rounded-full">
                            {totalCompanies}
                        </span>

                    </div>

                    <p className="text-slate-500 text-sm mt-1">
                        Manage, verify and monitor registered companies
                    </p>

                </div>

            </div>


            {/* =========================================
                STATS
            ========================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">


                {/* TOTAL */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-slate-500 text-sm">
                                Total Companies
                            </p>

                            <h2 className="mt-1 text-slate-900 font-bold text-2xl">
                                {totalCompanies}
                            </h2>

                            <p className="text-xs text-slate-400 mt-1">
                                Registered companies
                            </p>

                        </div>

                        <div className="w-11 h-11 rounded-xl bg-[#EEF0FF] flex items-center justify-center">

                            <Building2 className="w-5 h-5 text-[#5950E6]" />

                        </div>

                    </div>

                </div>


                {/* VERIFIED */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-slate-500 text-sm">
                                Verified
                            </p>

                            <h2 className="mt-1 text-slate-900 font-bold text-2xl">
                                {verifiedCompanies}
                            </h2>

                            <p className="text-xs text-green-600 mt-1">
                                Verified companies
                            </p>

                        </div>

                        <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">

                            <ShieldCheck className="w-5 h-5 text-green-600" />

                        </div>

                    </div>

                </div>


                {/* PENDING */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-slate-500 text-sm">
                                Pending
                            </p>

                            <h2 className="mt-1 text-slate-900 font-bold text-2xl">
                                {pendingCompanies}
                            </h2>

                            <p className="text-xs text-amber-600 mt-1">
                                Awaiting verification
                            </p>

                        </div>

                        <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">

                            <Clock3 className="w-5 h-5 text-amber-600" />

                        </div>

                    </div>

                </div>


                {/* DELETED */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-slate-500 text-sm">
                                Deleted
                            </p>

                            <h2 className="mt-1 text-slate-900 font-bold text-2xl">
                                {deletedCompanies}
                            </h2>

                            <p className="text-xs text-red-500 mt-1">
                                Removed companies
                            </p>

                        </div>

                        <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">

                            <Trash2 className="w-5 h-5 text-red-500" />

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================================
                SEARCH / FILTER
            ========================================== */}

            <div className="bg-white border border-slate-200 rounded-2xl mt-6 p-4">

                <div className="flex flex-col md:flex-row gap-3">

                    <div className="relative flex-1">

                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search company name, industry or slug..."
                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:bg-white focus:border-[#5950E6] transition"
                        />

                    </div>


                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-600 outline-none focus:border-[#5950E6]"
                    >

                        <option value="all">
                            All Companies
                        </option>

                        <option value="verified">
                            Verified
                        </option>

                        <option value="pending">
                            Pending
                        </option>

                        <option value="deleted">
                            Deleted
                        </option>

                    </select>

                </div>

            </div>


            {/* =========================================
                COMPANY TABLE
            ========================================== */}

            <div className="bg-white border border-slate-200 rounded-2xl mt-4 overflow-hidden">

                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">

                    <div>

                        <h2 className="text-sm font-semibold text-slate-900">
                            All Companies
                        </h2>

                        <p className="text-xs text-slate-400 mt-1">
                            {filteredCompanies.length} companies found
                        </p>

                    </div>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full min-w-[900px]">

                        <thead className="bg-slate-50">

                            <tr>

                                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                                    Company
                                </th>

                                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                                    Industry
                                </th>

                                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                                    Size
                                </th>

                                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                                    Recruiters
                                </th>

                                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                                    Founded
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

                            {filteredCompanies.map((company) => {

                                const status = getStatus(company);
                                const config = statusConfig[status];

                                return (

                                    <tr
                                        key={company._id}
                                        className="border-t border-slate-100 hover:bg-slate-50/60 transition"
                                    >

                                        {/* COMPANY */}

                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#EEF0FF] to-[#E4E7FF] text-[#5950E6] flex items-center justify-center shrink-0">

                                                    <Building2 className="w-5 h-5" />

                                                </div>

                                                <div className="min-w-0">

                                                    <p className="text-sm font-semibold text-slate-900 truncate max-w-[180px]">
                                                        {company.name}
                                                    </p>

                                                    <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[180px]">
                                                        {company.slug}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* INDUSTRY */}

                                        <td className="px-6 py-4">

                                            <span className="inline-flex px-2.5 py-1 rounded-lg bg-violet-50 text-[#5950E6] text-xs font-medium">
                                                {company.industry}
                                            </span>

                                        </td>


                                        {/* SIZE */}

                                        <td className="px-6 py-4">

                                            <span className="text-sm text-slate-600">
                                                {company.companySize}
                                            </span>

                                        </td>


                                        {/* RECRUITERS */}

                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-2">

                                                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">

                                                    <Users className="w-3.5 h-3.5 text-slate-500" />

                                                </div>

                                                <span className="text-sm text-slate-600">
                                                    {company.recruiters?.filter(
                                                        recruiter => recruiter.recruiterId
                                                    ).length || 0}
                                                </span>

                                            </div>

                                        </td>


                                        {/* FOUNDED */}

                                        <td className="px-6 py-4">

                                            <span className="text-sm text-slate-500">
                                                {company.foundedYear}
                                            </span>

                                        </td>


                                        {/* STATUS */}

                                        <td className="px-6 py-4">

                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border ${config.className}`}
                                            >

                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
                                                />

                                                {config.label}

                                            </span>

                                        </td>


                                        {/* ACTION */}

                                        <td className="px-6 py-4">

                                            <div className="relative flex justify-end">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowMenu(
                                                            showMenu === company._id
                                                                ? null
                                                                : company._id
                                                        )
                                                    }
                                                    className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition"
                                                >

                                                    <MoreVertical className="w-4 h-4 text-slate-500" />

                                                </button>


                                                {showMenu === company._id && (

                                                    <div className="absolute right-0 top-10 z-30 w-52 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5">

                                                        {/* VIEW */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleViewCompany(company._id)
                                                            }
                                                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
                                                        >

                                                            <Eye className="w-4 h-4" />

                                                            View Company

                                                        </button>


                                                        {/* VERIFY */}

                                                        {!company.isVerified &&
                                                            !company.isDeleted && (

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleVerify(company._id)
                                                                    }
                                                                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-green-600 hover:bg-green-50 rounded-lg"
                                                                >

                                                                    <CheckCircle className="w-4 h-4" />

                                                                    Verify Company

                                                                </button>

                                                            )}


                                                        {/* REJECT */}

                                                        {!company.isVerified &&
                                                            !company.isDeleted && (

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleReject(company._id)
                                                                    }
                                                                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-orange-600 hover:bg-orange-50 rounded-lg"
                                                                >

                                                                    <XCircle className="w-4 h-4" />

                                                                    Reject Company

                                                                </button>

                                                            )}


                                                        <div className="h-px bg-slate-100 my-1" />


                                                        {/* BLOCK */}

                                                        {!company.isDeleted && (

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleBlock(company._id)
                                                                }
                                                                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                                                            >

                                                                <Ban className="w-4 h-4" />

                                                                Block Company

                                                            </button>

                                                        )}

                                                    </div>

                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                );

                            })}


                            {/* EMPTY */}

                            {!loading && filteredCompanies.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="px-6 py-16 text-center"
                                    >

                                        <div className="flex flex-col items-center">

                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">

                                                <Building2 className="w-5 h-5 text-slate-400" />

                                            </div>

                                            <p className="text-sm font-semibold text-slate-700 mt-3">
                                                No companies found
                                            </p>

                                            <p className="text-xs text-slate-400 mt-1">
                                                Try changing your search or filter.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


                {/* =========================================
                    PAGINATION
                ========================================== */}

                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">

                    <p className="text-xs text-slate-400">

                        Showing{" "}

                        <span className="font-semibold text-slate-600">
                            {filteredCompanies.length}
                        </span>{" "}

                        of{" "}

                        <span className="font-semibold text-slate-600">
                            {totalCompanies}
                        </span>

                    </p>


                    <div className="flex items-center gap-1">

                        <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50">

                            <ChevronLeft className="w-4 h-4" />

                        </button>


                        <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-white bg-[#5950E6] text-sm">

                            1

                        </button>


                        <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50">

                            <ChevronRight className="w-4 h-4" />

                        </button>

                    </div>

                </div>

            </div>


            {/* =========================================
                COMPANY DETAILS MODAL
            ========================================== */}

            {selectedCompany && (

                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">

                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">


                        {/* HEADER */}

                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

                            <div>

                                <h2 className="font-bold text-slate-900 text-lg">
                                    Company Details
                                </h2>

                                <p className="text-xs text-slate-400 mt-1">
                                    Complete company information
                                </p>

                            </div>


                            <button
                                onClick={() => setSelectedCompany(null)}
                                className="text-slate-400 w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center"
                            >

                                <X className="w-5 h-5" />

                            </button>

                        </div>


                        <div className="p-6">


                            {/* COMPANY PROFILE */}

                            <div className="flex items-center gap-4">

                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EEF0FF] to-[#E4E7FF] text-[#5950E6] flex items-center justify-center">

                                    <Building2 className="w-7 h-7" />

                                </div>


                                <div className="min-w-0">

                                    <h3 className="text-xl font-bold text-slate-900">
                                        {selectedCompany.name}
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-0.5">
                                        {selectedCompany.industry} · {selectedCompany.companySize} employees
                                    </p>

                                    <p className="text-xs text-slate-400 mt-1">
                                        Founded {selectedCompany.foundedYear}
                                    </p>

                                </div>

                            </div>


                            {/* INFO CARDS */}

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">


                                <div className="bg-slate-50 rounded-xl p-4">

                                    <p className="text-xs text-slate-400">
                                        Status
                                    </p>

                                    <p className="text-sm font-semibold text-slate-800 mt-1">

                                        {statusConfig[
                                            getStatus(selectedCompany)
                                        ].label}

                                    </p>

                                </div>


                                <div className="bg-slate-50 rounded-xl p-4">

                                    <p className="text-xs text-slate-400">
                                        Recruiters
                                    </p>

                                    <p className="text-sm font-semibold text-slate-800 mt-1">

                                        {selectedCompany.recruiters?.filter(
                                            recruiter => recruiter.recruiterId
                                        ).length || 0}

                                    </p>

                                </div>


                                <div className="bg-slate-50 rounded-xl p-4">

                                    <p className="text-xs text-slate-400">
                                        Founded
                                    </p>

                                    <p className="text-sm font-semibold text-slate-800 mt-1">
                                        {selectedCompany.foundedYear}
                                    </p>

                                </div>

                            </div>


                            {/* DESCRIPTION */}

                            <div className="mt-5">

                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    Description
                                </p>

                                <div className="mt-2 bg-slate-50 rounded-xl p-4">

                                    <p className="text-sm text-slate-600 leading-6">
                                        {selectedCompany.description || "No description provided."}
                                    </p>

                                </div>

                            </div>


                            {/* RECRUITERS */}

                            <div className="mt-5">

                                <div className="flex items-center justify-between">

                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        Recruiters
                                    </p>

                                    <span className="text-xs text-slate-400">
                                        {selectedCompany.recruiters?.filter(
                                            recruiter => recruiter.recruiterId
                                        ).length || 0}{" "}
                                        connected
                                    </span>

                                </div>


                                <div className="mt-2 space-y-2">

                                    {selectedCompany.recruiters
                                        ?.filter(
                                            recruiter => recruiter.recruiterId
                                        )
                                        .map((recruiter) => (

                                            <div
                                                key={recruiter.recruiterId._id}
                                                className="flex items-center gap-3 bg-slate-50 rounded-xl p-4"
                                            >

                                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">

                                                    <UserRound className="w-4 h-4 text-slate-500" />

                                                </div>


                                                <div className="min-w-0 flex-1">

                                                    <p className="text-sm font-semibold text-slate-800">
                                                        {recruiter.recruiterId.name}
                                                    </p>

                                                    <p className="text-xs text-slate-400 truncate">
                                                        {recruiter.recruiterId.email}
                                                    </p>

                                                </div>


                                                <div className="hidden sm:block text-right">

                                                    <p className="text-xs text-slate-400">
                                                        Joined
                                                    </p>

                                                    <p className="text-xs font-medium text-slate-600">
                                                        {formatDate(recruiter.joinedAt)}
                                                    </p>

                                                </div>

                                            </div>

                                        ))}


                                    {(!selectedCompany.recruiters ||
                                        selectedCompany.recruiters.filter(
                                            recruiter => recruiter.recruiterId
                                        ).length === 0) && (

                                            <div className="bg-slate-50 rounded-xl p-4 text-center">

                                                <p className="text-xs text-slate-400">
                                                    No active recruiter connected
                                                </p>

                                            </div>

                                        )}

                                </div>

                            </div>


                            {/* METADATA */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">

                                <div className="bg-slate-50 rounded-xl p-4">

                                    <p className="text-xs text-slate-400">
                                        Company ID
                                    </p>

                                    <p className="text-xs font-semibold text-slate-700 mt-1 break-all">
                                        {selectedCompany._id}
                                    </p>

                                </div>


                                <div className="bg-slate-50 rounded-xl p-4">

                                    <p className="text-xs text-slate-400">
                                        Created
                                    </p>

                                    <p className="text-sm font-semibold text-slate-700 mt-1">
                                        {formatDate(selectedCompany.createdAt)}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default Companies;