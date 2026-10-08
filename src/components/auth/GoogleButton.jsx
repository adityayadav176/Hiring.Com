import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/Hook";

const GOOGLE_CLIENT_ID =
    "189267551336-5oo82iqoq18v5khigfi60ngei4lintnm.apps.googleusercontent.com";

function GoogleButton({ role = null, onError }) {
    const googleButtonRef = useRef(null);
    const roleRef = useRef(role);
    const onErrorRef = useRef(onError);

    const { handleGoogleAuth } = useAuth();

    const [loading, setLoading] = useState(false);

    // Keep latest role
    useEffect(() => {
        roleRef.current = role;
    }, [role]);

    // Keep latest error handler
    useEffect(() => {
        onErrorRef.current = onError;
    }, [onError]);

    useEffect(() => {
        let interval;

        const renderButton = () => {
            if (
                !window.google?.accounts?.id ||
                !googleButtonRef.current
            ) {
                console.log("Google is not ready");
                return;
            }

            console.log("Rendering Google button");

            googleButtonRef.current.innerHTML = "";

            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,

                callback: async (response) => {
                    console.log(
                        "Google credential received:",
                        response
                    );

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

                        // Signup sends role
                        if (roleRef.current) {
                            payload.role = roleRef.current;
                        }

                        console.log(
                            "Google payload:",
                            payload
                        );

                        await handleGoogleAuth(payload);
                    } catch (error) {
                        console.error(
                            "Google authentication error:",
                            error
                        );

                        onErrorRef.current?.(
                            error?.message ||
                                "Google authentication failed."
                        );
                    } finally {
                        setLoading(false);
                    }
                },
            });

            window.google.accounts.id.renderButton(
                googleButtonRef.current,
                {
                    theme: "outline",
                    size: "large",
                    width: 350,
                    text: "continue_with",
                    shape: "rectangular",
                }
            );

            console.log("Google button rendered");
        };

        // Google already loaded
        if (window.google?.accounts?.id) {
            renderButton();
            return;
        }

        // Find existing Google script
        let script = document.querySelector(
            'script[src="https://accounts.google.com/gsi/client"]'
        );

        // Script doesn't exist
        if (!script) {
            script = document.createElement("script");

            script.src =
                "https://accounts.google.com/gsi/client";

            script.async = true;
            script.defer = true;

            script.onload = () => {
                console.log("Google script loaded");
                renderButton();
            };

            script.onerror = () => {
                console.error(
                    "Google script failed to load"
                );

                onErrorRef.current?.(
                    "Unable to load Google Sign-In."
                );
            };

            document.head.appendChild(script);
        }

        // Script exists but Google hasn't initialized yet
        else {
            interval = setInterval(() => {
                if (window.google?.accounts?.id) {
                    clearInterval(interval);

                    renderButton();
                }
            }, 100);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, []);

    return (
        <div className="relative w-full">
            <div
                ref={googleButtonRef}
                className="flex min-h-[44px] w-full justify-center"
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