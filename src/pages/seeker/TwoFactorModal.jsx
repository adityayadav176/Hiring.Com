import { ArrowLeft, Check, CheckCircle2, Copy, KeyRound, Loader2, QrCode, ShieldAlert, Smartphone, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'

function TwoFactorModal({open, onClose, onEnabled, enable2FA, verify2FASetup}) {
    const [step, setStep] = useState("intro");
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [secret, setSecret] = useState("");
    const [token, setToken] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const handleVerify = async() => {
        const cleanToken = token.replace(/\D/g, "");

        if(cleanToken.length !== 6) {
            setError("Enter the 6-digit authentication code.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await verify2FASetup({token: cleanToken});
            onEnabled?.();
            setStep("success");
        } catch (error) {
            setError(error?.message || "Invalid authentication code.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(!open) {
            setStep("intro");
            setQrCodeUrl("");
            setToken("");
            setLoading(false);
            setError("");
            setCopied(false);
        }
    }, [open])

    const handleClose = () => {
        if(loading) return;
        onClose();
    }

    const handleStartSetup = async() => {
        try {
            setLoading(true);
            setError("");
            const response = await enable2FA();
            console.log(response);
            const qr = response.data.qrCodeUrl;
            const setupSecret = response?.data.secret;

            if(!qr) {
                throw new Error("QR code could not be generated");
            }

            setQrCodeUrl(qr);
            setSecret(setupSecret || "");
            setStep("setup");
        } catch (error) {
            setError(error?.message || "Unable to start 2FA setup");
        } finally {
            setLoading(false);
        }
    }

    const handleCopySecret = async() => {
        if(!secret) return;

        try {
            await navigator.clipboard.writeText(secret);
            setCopied(true);
            
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            setError("Unable to copy the setup key");
        }
    }

    const handleBack = () => {
        setError("");

        if(step === "setup") {
            setStep("intro");
            return;
        }

        if(step === "verify") {
            setStep("setup");
            return;
        }
    };

    if(!open) return null;

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm'>
      <div className='relative flex max-h-[90vh] w-full max-w-[520px] flex-col overflow-hidden rounded-3xl border border-[#E8E9F0] bg-white shadow-2xl'> 
            <div className='flex items-center justify-between border-b border-[#EEEFF4] px-6 py-5'>
                <div className='flex items-center gap-3'>
                    {step !== "intro" && step !== "success" && (
                        <button onClick={handleBack} className='flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#52525B] transition hover:bg-[#F7F7FA] disabled:cursor-not-allowed disabled:opacity-50'>
                            <ArrowLeft size={18}/>
                        </button>
                    )}

                    <div>
                        <p className='text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6D28D9]'>Account security</p>
                        <h2 className='mt-0.5 text-lg font-bold text-[#18181B]'>Two-factor authentication</h2>
                    </div>
                </div>
                <button onClick={handleClose} type="button" className='flex h-9 w-9 items-center justify-center rounded-xl text-[#71717A] transition hover:bg-[#F4F4F5] hover:text-[#18181B] disabled:cursor-not-allowed disabled:opacity-50'>
                    <X size={19}/>
                </button>
            </div>

            <div className='overflow-y-auto px-6 py-7'>
                {step === "intro" && (
                    <div>
                        <div className='mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-[#EEF0FF]'>
                        <ShieldAlert size={32} strokeWidth={1.8} className='text-[#6D28D9]'/>
                    </div>
                    <div className='mt-5 text-center'>
                        <h3 className='text-xl font-bold text-[#18181B]'>Secure your account</h3>
                        <p className='mx-auto mt-2 max-w-[400px] text-sm leading-6 text-[#71717A]'>Add an extra layer of security to your Peer.Hiring account
                  using an authenticator app.</p>
                    </div>

                    <div className='mt-6 space-y-3'>
                        <div className='flex gap-3 rounded-2xl border border-[#E8E9F0] bg-[#FAFAFC] p-4'>
                            <div className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#EEF0FF]'>
                                <Smartphone size={18} className='text-[#6D28D9]'/>
                            </div>
                            <div>
                                <p className='text-sm font-semibold text-[#27272A]'>Use an authenticator app</p>
                                <p className='mt-1 text-xs leading-5 text-[#71717A]'> Google Authenticator, Microsoft Authenticator, or another
                      compatible app.</p>
                            </div>
                        </div>

                        <div className='flex border rounded-2xl gap-3 border-[#E8E9F0] bg-[#FAFAFC] p-4'>
                            <div className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF0FF]'>
                                <KeyRound size={18} className='text-[#6D28D9]'/>
                            </div>
                            <div>
                                <p className='text-sm font-semibold text-[#27272A]'>Enter a 6-digit code</p>
                                <p className='mt-1 text-xs leading-5 text-[#71717A]'>Your authenticator generates a new security code roughly
                      every 30 seconds.</p>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className='mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>{error}</div>
                    )}

                    <div className='mt-7 flex gap-3'>
                        <button onClick={handleClose} disabled={loading} className='flex-1 rounded-xl border border-[#E4E4E7] px-4 py-3 text-sm font-semibold text-[#52525B] transition hover:bg-[#F7F7F8]' type="button">
                            Cancel
                        </button>
                        <button className='flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5B21B6] disabled:cursor-not-allowed disabled:opacity-60' type="button" onClick={handleStartSetup} disabled={loading} >
                            {loading && (
                                <Loader2 size={17} className='animate-spin'/>
                            )}
                            {loading ? "Generating..." : "Continue"}
                        </button>
                    </div>
                    </div>
                )}
                
                {step === "setup" && (
                    <div>
                        <div className='text-center'>
                            <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF0FF]'>
                                <QrCode size={27} className='text-[#6D28D9]'/>
                            </div>
                            <h3 className='mt-4 text-xl font-bold text-[#18181B]'>Set up your authenticator</h3>
                            <p className='mt-2 text-sm leading-6 text-[#71717A]'>Open your authenticator app and scan the QR code below.</p>
                        </div>
                        <div className='mt-6 flex justify-center'>
                            <div className='rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm'>
                                {qrCodeUrl ? (
                                    <img src={qrCodeUrl} alt="2FA setup QR code" className="h-[210px] w-[210px]"/>
                                ) : (
                                    <div className='flex h-[210px] w-[210px] items-center justify-center'>
                                        <Loader2 size={28} className="animate-spin text-[#6D28D9]"/>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='mt-6 rounded-2xl bg-[#F7F7FA] p-4'>
                            <p className='text-xs font-semibold text-[#27272A]'>Can't scan the QR code?</p>
                            <p className='mt-1 text-xs leading-5 text-[#71717A]'>Use the manual setup key in your authenticator app.</p>

                            {secret && (
                                <div className='mt-3 flex items-center gap-2 rounded-xl border border-[#E4E4E7] bg-white p-2'>
                                    <code className='min-w-0 flex-1 break-all px-2 text-xs font-medium tracking-wider text-[#3F3F46]'>{secret}</code>
                                    <button type="button" onClick={handleCopySecret} className='shrink-0 flex items-center gap-1.5 rounded-lg bg-[#EEF0FF] px-3 py-2 text-xs font-semibold text-[#6D28D9] transition hover:bg-[#E4E7FF]'>
                                        {copied ? (
                                            <>
                                                <Check size={14}/>
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={14}/>
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                        {error && (
                            <div className='mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
                                {error}
                            </div>
                        )}

                        <button type="button" className='mt-6 w-full rounded-xl bg-[#6D28D9] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5B21B6]' onClick={() => {setError(""); setStep("verify")}}>
                            I've scanned the code
                        </button>
                    </div>
                )}

                {step === "verify" && (
                    <div>
                        <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF0FF]'>
                            <KeyRound size={27} className="text-[#6D28D9]" />
                        </div>

                        <div className='mt-5 items-center'>
                            <h3 className="text-xl font-bold text-[#18181B]">
                  Verify your setup
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#71717A]">
                  Enter the 6-digit code currently shown in your authenticator
                  app.
                </p>
                    </div>
                        <div className='mt-7'>
                            <label htmlFor="twoFactorToken" className='mb-2 block text-sm font-semibold text-[#27272A]'>Authentication code</label>
                            <input type="text" placeholder='000000' className="w-full rounded-2xl border border-[#D4D4D8] bg-white px-4 py-4 text-center text-2xl font-bold tracking-[0.45em] text-[#18181B] outline-none transition placeholder:text-[#D4D4D8] focus:border-[#6D28D9] focus:ring-4 focus:ring-[#6D28D9]/10" id='twoFactorToken' inputMode="numeric"  autoComplete="one-time-code"  maxLength={6} value={token} onChange={(e) => {setError(""); setToken(e.target.value.replace(/\D/g, ""))}} onKeyDown={(e) => {if(e.key === "Enter") {handleVerify()}}}/>
                            <p className='mt-3 text-center text-sm text-[#71717A]'>The code changes every 30 seconds.</p>
                        </div>

                        {error && (
                           <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
                        )}

                        <button type="button" onClick={handleVerify} disabled={loading || token.length !== 6} className='mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold bg-[#6D28D9] text-white transition hover:bg-[#5B21B6] disabled:cursor-not-allowed disabled:opacity-50'>
                            {loading && <Loader2 size={17} className="animate-spin"/>}
                            {loading ? "Verifying..." : "Verify & Enable"}
                        </button>
                    </div>
                )}

                {step === "success" && (
                    <div className='py-5 text-center'>
                        <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50'>
                            <CheckCircle2 size={36} strokeWidth={1.8} className='text-emerald-600'/>
                        </div>  
                        <h3 className='mt-5 text-xl font-bold text-[#18181B]'>2FA is enabled</h3>
                        <p className='mx-auto mt-2 max-w-[380px] text-sm leading-6 text-[#71717A]'>Your account is now protected with two-factor authentication.
                You'll need a verification code from your authenticator when
                signing in.</p>

                <button className='mt-7 w-full rounded-xl bg-[#6D28D9] px-4 py-3  text-sm font-semibold text-white transition hover:bg-[#5B21B6]' type="button" onClick={onClose}>
                    Done
                </button>
                    </div>
                )}
            </div>
      </div>
    </div>
  )
}

export default TwoFactorModal
