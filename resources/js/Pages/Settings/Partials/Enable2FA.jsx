import { useState, useRef, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import InstructionModal from "@/Components/InstructionModal";
import NotificationManager from "@/Components/Notification/NotificationManager";
import NotificationHistoryManager from "@/Components/Notification/NotificationHistoryManager";
import SliderCaptcha from "@/Components/SliderCaptcha";

export default function Enable2FA({
    initialIs2FAEnabled,
    userId,
}) {
    const [is2FAEnabled, setIs2FAEnabled] = useState(initialIs2FAEnabled);
    const [showInstructions, setShowInstructions] = useState(false);
    const [error, setError] = useState("");
    const notificationManagerRef = useRef(null);
    const notificationHistoryManagerRef = useRef(null);
    const [sliderCaptchaOpen, setSliderCaptchaOpen] = useState(false);
    const [isCaptchaEnabled, setIsCaptchaEnabled] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [lastClickTime, setLastClickTime] = useState(Date.now());

    const { setData, processing } = useForm({
        is_2fa_enabled: initialIs2FAEnabled,
    });

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

    useEffect(() => {
        checkUserSettings();
    }, []);

    const toggle2FA = () => {
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
            if (clickCount >= 3) { // Show captcha if clicked more than 3 times
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
        const message = "Spam detected! Please complete the captcha verification.";
        notificationManagerRef.current.addNotification(message, "warning");
        if (notificationHistoryManagerRef.current) {
            notificationHistoryManagerRef.current.saveNotification(message, "warning");
        } else {
            console.error("notificationHistoryManagerRef is not available");
        }
    };

    const handleCaptchaSuccess = async () => {
        setSliderCaptchaOpen(false);
        try {
            const newState = !is2FAEnabled;
            setData("is_2fa_enabled", newState);

            const response = await axios.post("/api/settings", {
                is_2fa_enabled: newState,
            });

            setIs2FAEnabled(newState);
            setError("");

            const message = newState
                ? "TOTP has been enabled successfully."
                : "TOTP has been disabled successfully.";

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
            setError("Failed to update EOTP settings. Please try again.");
            console.error("Settings update error:", error);

            const errorMessage =
                "Failed to update TOTP settings. Please try again.";

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
        }
    };

    const instructionSteps = [
        {
            title: "What is Email OTP?",
            description:
                "Email OTP (One-Time Password) is a secure verification method where a unique code is sent to your registered email address to authenticate your identity.",
        },
        {
            title: "Why Use It?",
            description:
                "It provides an additional layer of security by ensuring that only users with access to the registered email can complete the authentication process.",
        },
        {
            title: "How to Set Up",
            description:
                "Ensure your email address is correctly registered with your account. No additional setup is required for receiving OTPs via email.",
        },
        {
            title: "How it Works",
            description:
                "When you attempt to sign in, a unique OTP will be sent to your email. Enter this code to verify your identity and complete the sign-in process.",
        },
        {
            title: "Important Note",
            description:
                "Keep your email account secure, as access to it is crucial for receiving your OTP. If you lose access to your email, you may have difficulty logging in.",
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
                            className="w-5 h-5 text-gray-400 sm:h-9 sm:w-9 flex-shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>

                        <div className="flex flex-col mx-3 sm:mx-5 space-y-1">
                            <h2 className="text-lg font-medium text-gray-700 sm:text-2xl dark:text-gray-200">
                                Email OTP
                            </h2>
                            <div className="flex flex-wrap items-center space-x-2">
                                <span className="px-2 py-1 text-xs text-blue-500 bg-blue-50 rounded-full dark:bg-blue-900/30">
                                    Enhanced Security
                                </span>
                                <button
                                    onClick={() => setShowInstructions(true)}
                                    className="px-3 py-1 mt-2 sm:mt-0 text-sm text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800 transition"
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0">
                        <span className="mr-3 text-sm text-gray-600 dark:text-gray-300">
                            {is2FAEnabled ? "Enabled" : "Disabled"}
                        </span>
                        <label
                            htmlFor="2fa-toggle"
                            className="relative inline-flex items-center cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                id="2fa-toggle"
                                className="sr-only peer"
                                checked={is2FAEnabled}
                                onChange={toggle2FA}
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
                title="Email OTP Guide"
                icon={<svg className="w-6 h-6 text-blue-500" />}
                steps={instructionSteps}
            />
        </div>
    );
}
