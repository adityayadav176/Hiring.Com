import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/Hook";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_ID;

function GoogleButton({ role = null, onError }) {
    const googleButtonRef = useRef(null);
    const roleRef = useRef(role);
    const onErrorRef = useRef(onError);

    const { handleGoogleAuth } = useAuth();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        roleRef.current = role;
    }, [role]);

    useEffect(() => {
        onErrorRef.current = onError;
    }, [onError]);

    useEffect(() => {
        let isMounted = true;
        let resizeObserver;
        let script;

        const renderButton = () => {
            if (
                !isMounted ||
                !window.google?.accounts?.id ||
                !googleButtonRef.current
            ) {
                return;
            }

            const container = googleButtonRef.current;

            const buttonWidth = Math.floor(
                Math.min(container.clientWidth, 400)
            );

            if (buttonWidth <= 0) return;

            container.innerHTML = "";

            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,

                callback: async (response) => {
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

                        await handleGoogleAuth(payload);
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
                },
            });

            window.google.accounts.id.renderButton(
                container,
                {
                    theme: "outline",
                    size: "large",
                    width: buttonWidth,
                    text: "continue_with",
                    shape: "rectangular",
                }
            );
        };

        const initializeGoogle = () => {
            if (!isMounted) return;

            if (window.google?.accounts?.id) {
                renderButton();
                return;
            }

            const existingScript = document.querySelector(
                'script[src="https://accounts.google.com/gsi/client"]'
            );

            if (existingScript) {
                existingScript.addEventListener(
                    "load",
                    renderButton
                );

                existingScript.addEventListener(
                    "error",
                    handleScriptError
                );

                script = existingScript;
                return;
            }

            script = document.createElement("script");

            script.src =
                "https://accounts.google.com/gsi/client";

            script.async = true;
            script.defer = true;

            script.onload = renderButton;
            script.onerror = handleScriptError;

            document.head.appendChild(script);
        };

        const handleScriptError = () => {
            if (isMounted) {
                onErrorRef.current?.(
                    "Unable to load Google Sign-In."
                );
            }
        };

        initializeGoogle();

        if (googleButtonRef.current) {
            resizeObserver = new ResizeObserver(() => {
                renderButton();
            });

            resizeObserver.observe(googleButtonRef.current);
        }

        return () => {
            isMounted = false;

            resizeObserver?.disconnect();

            if (script) {
                script.removeEventListener("load", renderButton);
                script.removeEventListener("error", handleScriptError);
            }
        };
    }, [handleGoogleAuth]);

    return (
        <div className="relative w-full min-w-0">
            <div
                ref={googleButtonRef}
                className=" flex min-h-[44px] w-full min-w-0 justify-center overflow-hidden"/>

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/60">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />
                </div>
            )}
        </div>
    );
}

export default GoogleButton;