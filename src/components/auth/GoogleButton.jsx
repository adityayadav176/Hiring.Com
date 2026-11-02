
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/Hook";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_ID;
const GOOGLE_SCRIPT_URL = "https://accounts.google.com/gsi/client";

// Shared across GoogleButton instances and React Strict Mode.
let googleScriptPromise = null;
let googleInitialized = false;
let googleCallbackHandler = null;

function loadGoogleScript() {
    if (window.google?.accounts?.id) {
        return Promise.resolve();
    }

    if (googleScriptPromise) {
        return googleScriptPromise;
    }

    googleScriptPromise = new Promise((resolve, reject) => {
        let script = document.querySelector(
            `script[src="${GOOGLE_SCRIPT_URL}"]`
        );

        if (script) {
            script.addEventListener("load", resolve, { once: true });
            script.addEventListener(
                "error",
                () => {
                    googleScriptPromise = null;
                    reject(new Error("Unable to load Google Sign-In."));
                },
                { once: true }
            );

            return;
        }

        script = document.createElement("script");
        script.src = GOOGLE_SCRIPT_URL;
        script.async = true;
        script.defer = true;

        script.onload = resolve;

        script.onerror = () => {
            googleScriptPromise = null;
            reject(new Error("Unable to load Google Sign-In."));
        };

        document.head.appendChild(script);
    });

    return googleScriptPromise;
}

function GoogleButton({ role = null, onError }) {
    const googleButtonRef = useRef(null);

    const roleRef = useRef(role);
    const onErrorRef = useRef(onError);
    const handleGoogleAuthRef = useRef(null);

    const { handleGoogleAuth } = useAuth();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        roleRef.current = role;
    }, [role]);

    useEffect(() => {
        onErrorRef.current = onError;
    }, [onError]);

    useEffect(() => {
        handleGoogleAuthRef.current = handleGoogleAuth;
    }, [handleGoogleAuth]);

    useEffect(() => {
        let isMounted = true;
        let resizeObserver = null;
        let hasRendered = false;

        const renderButton = () => {
            if (
                !isMounted ||
                hasRendered ||
                !window.google?.accounts?.id ||
                !googleButtonRef.current
            ) {
                return;
            }

            const container = googleButtonRef.current;

            const buttonWidth = Math.floor(
                Math.min(container.clientWidth, 400)
            );

            // Wait for a real width before rendering.
            if (buttonWidth <= 0) {
                return;
            }

            hasRendered = true;

            window.google.accounts.id.renderButton(container, {
                theme: "outline",
                size: "large",
                width: buttonWidth,
                text: "continue_with",
                shape: "rectangular",
            });

            // Disconnect immediately after successful rendering.
            resizeObserver?.disconnect();
            resizeObserver = null;
        };

        const initializeGoogle = async () => {
            try {
                if (!GOOGLE_CLIENT_ID) {
                    throw new Error(
                        "Google authentication is not configured."
                    );
                }

                await loadGoogleScript();

                if (!isMounted) return;

                // Latest mounted component handles the Google response.
                googleCallbackHandler = async (response) => {
                    if (!response?.credential) {
                        onErrorRef.current?.(
                            "Google authentication failed."
                        );
                        return;
                    }

                    try {
                        setLoading(true);

                        const payload = {
                            credential: response.credential,
                        };

                        if (roleRef.current) {
                            payload.role = roleRef.current;
                        }

                        await handleGoogleAuthRef.current?.(payload);
                    } catch (error) {
                        onErrorRef.current?.(
                            error?.message ||
                                "Google authentication failed."
                        );
                    } finally {
                        if (isMounted) {
                            setLoading(false);
                        }
                    }
                };

                // Initialize Google only once globally.
                if (!googleInitialized) {
                    window.google.accounts.id.initialize({
                        client_id: GOOGLE_CLIENT_ID,

                        callback: (response) => {
                            googleCallbackHandler?.(response);
                        },
                    });

                    googleInitialized = true;
                }

                renderButton();

                // Only wait for initial container sizing.
                if (!hasRendered && googleButtonRef.current) {
                    resizeObserver = new ResizeObserver(() => {
                        renderButton();
                    });

                    resizeObserver.observe(googleButtonRef.current);
                }
            } catch (error) {
                if (isMounted) {
                    onErrorRef.current?.(
                        error?.message ||
                            "Unable to load Google Sign-In."
                    );
                }
            }
        };

        initializeGoogle();

        return () => {
            isMounted = false;

            resizeObserver?.disconnect();

            googleCallbackHandler = null;
        };
    }, []);

    return (
        <div className="relative w-full min-w-0">
            <div
                ref={googleButtonRef}
                className="flex min-h-[44px] w-full min-w-0 justify-center overflow-hidden"
            />

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/60">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />
                </div>
            )}
        </div>
    );
}

export default GoogleButton;
