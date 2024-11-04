import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useForm } from "@inertiajs/react";
import InstructionModal from "@/Components/InstructionModal";
import RecoveryCodesModal from "@/Components/RecoveryCodes/RecoveryCodesModal";
import NotificationManager from "@/Components/Notification/NotificationManager";
import NotificationHistoryManager from "@/Components/Notification/NotificationHistoryManager";
import SliderCaptcha from "@/Components/SliderCaptcha";

export default function Google2FAToggle({ initialIsGoogle2FAEnabled, userId }) {
    const [isGoogle2FAEnabled, setIsGoogle2FAEnabled] = useState(
        initialIsGoogle2FAEnabled || false
    );
    const [showInstructions, setShowInstructions] = useState(false);
    const [showRecoveryCodesModal, setShowRecoveryCodesModal] = useState(false);
    const [error, setError] = useState("");
    const notificationManagerRef = useRef(null);
    const notificationHistoryManagerRef = useRef(null);
    const [sliderCaptchaOpen, setSliderCaptchaOpen] = useState(false);
    const [isCaptchaEnabled, setIsCaptchaEnabled] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [lastClickTime, setLastClickTime] = useState(Date.now());

    const { setData, processing } = useForm({
        is_google2fa_enabled: initialIsGoogle2FAEnabled,
    });

    useEffect(() => {
        setIsGoogle2FAEnabled(initialIsGoogle2FAEnabled || false);
        checkUserSettings();
    }, [initialIsGoogle2FAEnabled]);

    const checkUserSettings = async () => {
        try {
            const response = await axios.get("/api/settings");
            const { is_captcha_slider_enabled } = response.data;
            setIsCaptchaEnabled(is_captcha_slider_enabled);
        } catch (error) {
            console.error("Error fetching user settings:", error);
            setIsCaptchaEnabled(false);
        }
    };

    const handleGoogle2FAToggle = () => {
        const currentTime = Date.now();
        const timeSinceLastClick = currentTime - lastClickTime;

        // Reset click count if more than 5 seconds have passed
        if (timeSinceLastClick > 5000) {
            setClickCount(0);
        }

        setLastClickTime(currentTime);
        setClickCount((prevCount) => prevCount + 1);

        // Check if the captcha should be shown
        if (isCaptchaEnabled) {
            if (clickCount >= 3) {
                // Show captcha if clicked more than 3 times
                notifySpamDetected(); // Notify the user about spam detection
                setSliderCaptchaOpen(true);
            } else {
                handleCaptchaSuccess();
            }
        } else {
            handleCaptchaSuccess();
        }
    };

    const notifySpamDetected = () => {
        const message =
            "Spam detected! Please complete the captcha verification.";
        notificationManagerRef.current.addNotification(message, "warning");
        if (notificationHistoryManagerRef.current) {
            notificationHistoryManagerRef.current.saveNotification(
                message,
                "warning"
            );
        } else {
            console.error("notificationHistoryManagerRef is not available");
        }
    };

    const handleCaptchaSuccess = async () => {
        setSliderCaptchaOpen(false);
        try {
            const newState = !isGoogle2FAEnabled;
            await axios.post("/api/settings", {
                is_google2fa_enabled: newState,
            });
    
            setIsGoogle2FAEnabled(newState);
            const message = "TOTP settings updated successfully.";
            
            // Show success notification
            notificationManagerRef.current.addNotification(message, "success");
    
            // Save notification to history
            if (notificationHistoryManagerRef.current) {
                await notificationHistoryManagerRef.current.saveNotification(
                    message,
                    "success"
                );
            } else {
                console.error("notificationHistoryManagerRef is not available");
            }
        } catch (error) {
            let errorMessage = "Failed to update TOTP settings. Please try again.";
            if (error.response && error.response.status === 401) {
                errorMessage = "You must generate and copy a recovery code before enabling TOTP.";
            }
    
            // Show error notification
            notificationManagerRef.current.addNotification(
                errorMessage,
                "error"
            );
    
            // Save error notification to history
            if (notificationHistoryManagerRef.current) {
                await notificationHistoryManagerRef.current.saveNotification(
                    errorMessage,
                    "error"
                );
            } else {
                console.error("notificationHistoryManagerRef is not available");
            }
            console.error("Settings update error:", error);
        }
    };

    const instructionSteps = [
        {
            title: "What is TOTP?",
            description:
                "Time-based One-Time Password (TOTP) is a secure method that generates time-sensitive verification codes on your mobile device using an authenticator app.",
        },
        {
            title: "Why Use It?",
            description:
                "Provides stronger security than SMS or email-based verification methods, reducing the risk of unauthorized access.",
        },
        {
            title: "How to Set Up",
            description:
                "Download an authenticator app (such as Google Authenticator or Authy), scan the QR code (enable TOTP to scan), and enter the verification code generated by the authenticator app.",
        },
        {
            title: "How it Works",
            description:
                "Each time you sign in, generate a new 6-digit TOTP code from your authenticator app. This code changes every 30 seconds for added security.",
        },
        {
            title: "Important Note",
            description:
                "Keep your device secure and back up your recovery codes in case you lose access to your authenticator app, as these codes are essential for account recovery.",
        },
        {
            title: "When to Use Recovery Code?",
            description:
                "Use your recovery code if you lose access to your authenticator app or if your device is lost or stolen. The recovery code allows you to regain access to your account and reset your authentication settings.",
        },
        {
            title: "Why Can't I Enable TOTP?",
            description:
                "If you receive an error when trying to enable TOTP, it is likely because you have not generated and copied a recovery code. Please generate a recovery code and copy it to a secure location before enabling TOTP.",
        },
    ];

    return (
        <div className="dark:bg-gray-900 p-4 sm:p-6">
            <div>
                <NotificationManager ref={notificationManagerRef} />
                <NotificationHistoryManager
                    ref={notificationHistoryManagerRef}
                    userId={userId}
                />
            </div>
            <div className="mt-6 space-y-4 xl:mt-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between max-w-2xl px-4 sm:px-8 py-4 mx-auto border rounded-xl dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-gray-400 sm:h-9 sm:w-9"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M3 3h18v18H3z" />
                            <path d="M8 8h8v8H8z" />
                            <path d="M3 12h18" />
                        </svg>

                        <div className="flex flex-col mx-3 sm:mx-5 space-y-1">
                            <h2 className="text-lg font-medium text-gray-700 sm:text-2xl dark:text-gray-200">
                                time-based OTP
                            </h2>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2 py-1 text-xs text-blue-500 bg-blue-50 rounded-full dark:bg-blue-900/30">
                                    Enhanced Security
                                </span>
                                <button
                                    onClick={() => setShowInstructions(true)}
                                    className="px-3 py-1 text-sm text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800 transition"
                                >
                                    Learn More
                                </button>
                                <button
                                    onClick={() =>
                                        setShowRecoveryCodesModal(true)
                                    }
                                    className="px-3 py-1 text-sm text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800 transition"
                                >
                                    Recovery Codes
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 self-end sm:self-auto">
                        <span className="mr-3 text-sm text-gray-600 dark:text-gray-300">
                            {isGoogle2FAEnabled ? "Enabled" : "Disabled"}
                        </span>
                        <label
                            htmlFor="google2fa-toggle"
                            className="relative inline-flex items-center cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                id="google2fa-toggle"
                                className="sr-only peer"
                                checked={isGoogle2FAEnabled}
                                onChange={handleGoogle2FAToggle}
                                disabled={processing}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                    </div>
                </div>

                {error && (
                    <div className="max-w-2xl mx-auto px-4 sm:px-8">
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                )}

                <SliderCaptcha
                    isOpen={sliderCaptchaOpen}
                    onClose={() => setSliderCaptchaOpen(false)}
                    onSuccess={handleCaptchaSuccess}
                />
            </div>

            <InstructionModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Time-based OTP Setup Guide"
                icon={<svg className="w-6 h-6 text-blue-500" />}
                steps={instructionSteps}
            />

            <RecoveryCodesModal
                isOpen={showRecoveryCodesModal}
                onClose={() => setShowRecoveryCodesModal(false)}
                userId={userId}
            />
        </div>
    );
}
