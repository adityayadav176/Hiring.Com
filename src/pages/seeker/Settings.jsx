import { ArrowUpRight, ChevronDown, ChevronRight, CircleCheck, Laptop, LockKeyhole, LogOut, Monitor, Recycle, ShieldCheck, Smartphone, Trash2, TriangleAlert, X } from 'lucide-react'
import React, { useState } from 'react'

function DeviceIcon({type}) {
    if(type == "mobile") {
        return <Smartphone size={18} strokeWidth={1.8}/>
    }

    if(type == "laptop") {
        return <Laptop size={18} strokeWidth={1.8}/>
    }

    return <Monitor size={18} strokeWidth={1.8}/>
}

function StatusPill({children, tone = "neutral"}) {
    const style = {
        success: "border-emerald-200 bg-emerald-50 text-emerald-700",
        warning: "border-amber-200 bg-amber-50 text-amber-700",
        danger: "border-red-200 bg-red-50 text-red-700",
        neutral: "border-slate-200 bg-slate-50 text-slate-600"
    }

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${style[tone]}`}>
            {children}
        </span>
    )
}

function SectionHeading({title, description}) {
    return(
        <div className='mb-3 px-1'>
            <h2 className='text-[14px] font-bold tracking-[-0.01em] text-slate-900'>{title}</h2>
            <p className='mt-1 text-[12px] leading-5 text-slate-400'>{description}</p>
        </div>
    )
}

function SettingRow({icon, title, description, right, children, border = true}) {
    return(
        <div className={`bg-white px-5 py-[18px] ${border ? "border-b border-slate-100" : ""}`}>
            <div className='flex items-center gap-4'>
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-[0_1px_2px_rgba(15,23,42,0.03)]'>
                    {icon}
                </div>

                <div className='min-w-0 flex-1'>
                    <h3 className='text-[14px] font-semibold tracking-[-0.01em] text-slate-900'>{title}</h3>
                    {description && <p className='mt-1 max-w-[720px] text-[12px] leading-5 text-slate-500'>{description}</p>}
                    {children}
                </div>

                {right && (
                    <div className='shrink-0'>
                        {right}
                    </div>
                )}
            </div>
        </div>
    )
}

function ConfirmModal({open, icon, title, description, confirmText, onClose, onConfirm, danger = false}) {
    if(!open) return null;

    return (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-[3px]'>
            <div className='w-full max-w-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]'>
                <div className='flex justify-between items-start px-6 pt-6'>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${danger ? "bg-red-50 text-red-600" : "bg-violet-50 text-violet-600"}`}>
                        {icon}
                    </div>
                    <button className='rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700' onClick={onClose} type='button'>
                        <X size={18}/>
                    </button>
                </div>

                <div className='px-6 pb-6 pt-4'>
                    <h2 className='text-[17px] font-bold tracking-[-0.02em] text-slate-900'>{title}</h2>
                    <p className='mt-2 text-[13px] leading-5 text-slate-500'>{description}</p>
                </div>

                <div className='flex justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4'>
                    <button onClick={onClose} type='button' className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50'>Cancel</button>
                    <button onClick={onConfirm} type='button' className={`rounded-xl px-4 py-2 text-[12px] font-semibold text-white transition ${danger ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 hover:bg-slate-800"}`}>{confirmText}</button>
                </div>
            </div>
        </div>
    )
}

function SessionsPanel({sessions, onLogoutSession, onLogoutAll}) {
    return (
        <div className='border-t border-slate-100 bg-slate-50/40'>
            <div className='flex flex-col gap-3 border-b border-slate-100 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                    <p className='text-[12px] font-semibold text-slate-800'>Active sessions</p>
                    <p className='mt-0.5 text-[11px] text-slate-400'>{sessions.length} devices currently signed in</p>
                </div>
                <button onClick={onLogoutAll} type='button' className='inline-flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50'>
                    <LogOut size={14}/>
                    Sign out others
                </button>
            </div>

            <div className='divide-y divide-slate-100'>
                {sessions.map((session) => (
                    <div key={session.id} className='flex items-center gap-3 px-5 py-3.5'>
                        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500'>
                            <DeviceIcon type={session.type}/>
                        </div>

                        <div className='min-w-0 flex-1'>
                            <div className='flex flex-wrap items-center gap-2 '>
                                <p className='text-[13px] font-semibold text-slate-800'>{session.device}</p>

                                {session.current && (
                                    <StatusPill tone='success'>
                                        <span className='h-1.5 w-1.5 rounded-full bg-emerald-500'/>
                                        Current
                                    </StatusPill>
                                )}
                            </div>
                            <p className='mt-0.5 text-[11px] text-slate-400'>{session.browser} · {session.location} ·{" "} {session.lastActive}</p>
                        </div>

                        {!session.current && (
                            <button type='button' onClick={() => onLogoutSession(session)} className='rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600'>
                                Sign out
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

function Settings() {
    const [sessions, setSessions] = useState([
        {
            id: 1,
            type: "laptop",
            device: "Windows PC",
            browser: "Chrome",
            location: "India",
            lastActive: "Active now",
            current: true
        },
        {
            id: 2,
            type: "mobile",
            device: "Android device",
            browser: "Chrome Mobile",
            location: "India",
            lastActive: "2 hours ago",
            current: false
        }
    ]);

    const [showSessions, setShowSessions] = useState(false);
    const [show2FA, setShow2FA] = useState(false);

    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [accountVerified, setAccountVerified] = useState(false);

    const [modal, setModal] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);

    const closeModal = () => {
        setModal(null);
        setSelectedSession(null);
    }

    const openLogoutSession = (session) => {
        setModal("session");
        setSelectedSession(session);
    }

    const handleLogoutSession = () => {
        if(!selectedSession) return;

        setSessions((prev) => prev.filter((session) => session.id !== selectedSession.id));
        console.log("logout successfully", selectedSession);

        closeModal();
    }

    const handleLogoutAll = () => {
        setSessions((prev) => prev.filter((session) => session.current));
        console.log("logout ALL");

        closeModal();
    }

    const handleLogoutCurrent = () => {
        console.log("logout");
        closeModal();
    }

    const handleDeleteAccount = () => {
        console.log("account delete");
        closeModal();
    }

    return (
    <>
        <div className='min-h-full bg-[#F7F8FC]'>
            <div className='w-full px-5 py-7 sm:px-7 lg:px-9 xl:px-10'>
                <div className='w-full max-w-[1180px]'>
                    <header className='mb-8'>
                        <h1 className='text-[25px] font-bold tracking-[-0.035em] text-slate-900 sm:text-[27px]'>Settings</h1>
                        <p className='mt-1.5 max-w-2xl text-[13px] leading-5 text-slate-500'>Manage your account, security preferences and active
                        sessions.</p>
                    </header>

                    <section>
                        <SectionHeading title="Account" description="Manage your Peer.Hiring account and trust settings."/>

                        <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.025)]'>
                            <div className='border-b border-slate-100'>
                                <SettingRow 
                                    icon={<ShieldCheck size={18} strokeWidth={1.8}/>}
                                    title="Account verification"
                                    description={accountVerified ? "Your account is verified and displays a trusted status." : "Verify your account to build trust with recruiters and candidates."}
                                    right={
                                        <div className='flex items-center gap-2'>
                                            <StatusPill tone={accountVerified ? "success" : "warning" }>
                                                {accountVerified ? (
                                                    <>
                                                        <CircleCheck size={12}/>
                                                        Verified                                                
                                                    </>
                                                ) : (
                                                    <>
                                                        <TriangleAlert size={12}/>
                                                        Not Verified
                                                    </>
                                                )}
                                            </StatusPill>
                                            <button type="button" onClick={() => setAccountVerified(!accountVerified)} className='hidden items-center gap-1 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-violet-600 transition hover:bg-violet-50 sm:flex'>
                                                {accountVerified ? "View" : "Verify"}
                                                <ChevronRight size={14}/>
                                            </button>
                                        </div>
                                    }
                                />

                                {!accountVerified && (
                                    <div className='mx-5 mb-4 flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/60 px-3.5 py-3'>
                                        <TriangleAlert size={16} className='mt-0.5 shrink-0 text-amber-600'/>

                                        <div className='min-w-0 flex-1'>
                                            <p className='text-[12px] font-semibold text-amber-900'>Verify your account</p>
                                            <p className='mt-0.5 text-[11px] leading-4 text-amber-700'>Complete verification to strengthen your
                                            profile and improve trust across Peer.Hiring.</p>
                                        </div>

                                        <button className='shrink-0 rounded-lg bg-white px-3 py-1.5 text-[11px] font-semibold text-amber-800 shadow-sm ring-1 ring-amber-200 transition hover:bg-amber-100' onClick={() => setAccountVerified(true)} type="button">Verify account</button>
                                    </div>
                                )}
                            </div>
                            <SettingRow
                                icon={<Recycle size={18} strokeWidth={1.8}/>}
                                title="Recycle bin"
                                description="Recover recently deleted items before they are permanently removed."
                                border={false}
                                right={
                                    <button type="button" className='inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50'>
                                        Open
                                        <ChevronRight size={14}/>
                                    </button>
                                }
                            />
                        </div>
                    </section>

                    <section className='mt-9'>
                        <SectionHeading title="Security" description="Protect your account and control where you're signed in."/>

                        <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.025)]'>
                            <div className='border border-slate-100'>
                                <SettingRow 
                                    icon={<LockKeyhole size={18} strokeWidth={1.8}/>}
                                    title="Two-factor authentication"
                                    description={twoFactorEnabled ? "Your account has an additional layer of sign-in protection." : "Add an authenticator app to protect your account."}
                                    right={
                                        <div className='flex items-center gap-2'>
                                            <StatusPill tone={twoFactorEnabled ? "success" : "warning"}>
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
                                            <button type="button" onClick={() => setShow2FA(!show2FA)} className='inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-50'>
                                                Manage
                                                <ChevronDown size={14} className={`transition-transform ${show2FA ? "rotate-180" : ""}`}/>
                                            </button>
                                        </div>
                                    }
                                />

                                {show2FA && (
                                    <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-[12px] font-semibold text-slate-800">
                                                    Authenticator app
                                                </p>

                                                <p className="mt-0.5 text-[11px] leading-4 text-slate-400">
                                                    Use a verification code from your
                                                    authenticator app when signing in.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setTwoFactorEnabled(
                                                        !twoFactorEnabled
                                                    )
                                                }
                                                className={`rounded-xl px-3.5 py-2 text-[12px] font-semibold transition ${
                                                    twoFactorEnabled
                                                        ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                                        : "bg-violet-600 text-white hover:bg-violet-700"
                                                }`}
                                            >
                                                {twoFactorEnabled
                                                    ? "Disable 2FA"
                                                    : "Enable 2FA"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <SettingRow 
                                    icon={<Monitor size={18} strokeWidth={1.8}/>}
                                    title="Active sessions"
                                    description="Review the devices currently signed in to your account."
                                    border={!showSessions}
                                    right={
                                        <button onClick={() => setShowSessions(!showSessions)} className='inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-50'>
                                            {showSessions ? "Hide" : "Manage"}
                                            <ChevronDown size={14} className={`transition-transform ${showSessions ? "rotate-180" : ""}`}/>
                                        </button>
                                    }
                                />

                                {showSessions && (<SessionsPanel 
                                    sessions={sessions}
                                    onLogoutSession={openLogoutSession}
                                    onLogoutAll={() => setModal("allSessions")}
                                />)}
                            </div>
                        </div>
                    </section>  

                    <section className='mt-7'>
                        <div className='flex items-start gap-4 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 via-white to-white px-5 py-5'>
                            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm ring-1 ring-violet-100'>
                                {<ShieldCheck size={20}/>}
                            </div>

                            <div className='min-w-0 flex-1'>
                                <p className='text-[13px] font-semibold text-slate-900'>Keep your account secure</p>
                                <p className='mt-1 max-w-2xl text-[12px] leading-5 text-slate-500'>Review your active sessions regularly and remove
                                devices you no longer recognize.</p>
                                <button type="button" onClick={() => setShowSessions(true)} className='mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-violet-700 transition hover:text-violet-800'>
                                    Review security
                                    <ArrowUpRight size={14} />
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="mt-9">
                        <SectionHeading
                            title="Session"
                            description="Sign out from this device or end other active sessions."
                        />
            
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.025)]">
                            <SettingRow
                                icon={<LogOut size={18} strokeWidth={1.8} />}
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

                    <section className='mt-9 pb-12'>
                        <div>
                            <p className='text-[11px] font-bold uppercase tracking-[0.12em] text-red-600'>Danger zone</p>
                            <p className='mt-1 text-[12px] text-slate-400'>Irreversible account actions.</p>
                        </div>

                        <div className='overflow-hidden rounded-2xl border border-red-200/80 bg-white'>
                            <SettingRow
                                icon={<Trash2 size={18} strokeWidth={1.8} />}
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
                            <div className="border-t border-red-100 bg-red-50/50 px-5 py-3">
                                <div className="flex items-start gap-2">
                                    <TriangleAlert
                                        size={14}
                                        className="mt-0.5 shrink-0 text-red-500"
                                    />
                
                                    <p className="text-[11px] leading-4 text-red-700">
                                        Account deletion is permanent. Make sure you've
                                        backed up anything you need before continuing.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>

        <ConfirmModal
            open={modal === "logout"}
            icon={<LogOut size={19} />}
            title="Sign out of Peer.Hiring?"
            description="You'll be signed out from this device. You'll need to sign in again to access your account."
            confirmText="Sign out"
            onClose={closeModal}
            onConfirm={handleLogoutCurrent}
        />

        <ConfirmModal
            open={modal === "session"}
            icon={<Monitor size={19} />}
            title={`Sign out ${
                selectedSession?.device || "this device"
            }?`}
            description="This device will lose access to your Peer.Hiring account. You can sign in again later."
            confirmText="Sign out device"
            onClose={closeModal}
            onConfirm={handleLogoutSession}
        />

        <ConfirmModal
            open={modal === "allSessions"}
            icon={<LogOut size={19} />}
            title="Sign out all other devices?"
            description="Every other active session will be signed out. Your current device will remain signed in."
            confirmText="Sign out others"
            onClose={closeModal}
            onConfirm={handleLogoutAll}
        />

        <ConfirmModal
            open={modal === "delete"}
            icon={<Trash2 size={19} />}
            title="Delete your Peer.Hiring account?"
            description="This action permanently removes your account and associated data. This cannot be undone."
            confirmText="Delete account"
            danger
            onClose={closeModal}
            onConfirm={handleDeleteAccount}
        />
    </>
  )
}

export default Settings