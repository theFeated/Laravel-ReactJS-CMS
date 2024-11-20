import { useState, useRef, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import InstructionModal from "../../../Components/InstructionModal";
import NotificationManager from "../../../Components/Notification/NotificationManager";
import NotificationHistoryManager from "../../../Components/Notification/NotificationHistoryManager";

export default function EnableStandardLogin({
    initialIsManualLoginEnabled,
    userId,
}) {
    const [isStandardLoginEnabled, setIsStandardLoginEnabled] = useState(
        initialIsManualLoginEnabled
    );
    const [showInstructions, setShowInstructions] = useState(false);
    const notificationManagerRef = useRef(null);
    const notificationHistoryManagerRef = useRef(null);

    const { setData, processing } = useForm({
        is_standard_login_enabled: initialIsManualLoginEnabled,
    });

    useEffect(() => {
        const savedState = localStorage.getItem("isStandardLoginEnabled");
        if (savedState !== null) {
            setIsStandardLoginEnabled(JSON.parse(savedState));
        }
    }, []);
    useEffect(() => {
        localStorage.setItem(
            "isStandardLoginEnabled",
            JSON.stringify(isStandardLoginEnabled)
        );
    }, [isStandardLoginEnabled]);

    const instructionSteps = [
        {
            title: "What is Standard Login?",
            description:
                "Standard Login allows you to sign in using your email and password directly on the platform.",
        },
        {
            title: "Benefits",
            description:
                "Provides a traditional login method alongside other authentication options.",
        },
        {
            title: "When to Use",
            description:
                "Useful when you prefer using your account credentials or when alternative login methods are unavailable.",
        },
        {
            title: "Security Considerations",
            description:
                "Ensure you use a strong, unique password and enable two-factor authentication for added security.",
        },
        {
            title: "Flexibility",
            description:
                "You can toggle this setting on or off based on your security preferences.",
        },
    ];

    const toggleManualLogin = async () => {
        const newState = !isStandardLoginEnabled;
        setData("is_standard_login_enabled", newState);

        try {
            await axios.post("/api/settings", {
                is_standard_login_enabled: newState,
            });

            setIsStandardLoginEnabled(newState);
            const message = newState
                ? "Standard Login has been enabled successfully."
                : "Standard Login has been disabled successfully.";

            // Show success notification
            notificationManagerRef.current.addNotification(message, "success");

            // Save notification to history
            if (notificationHistoryManagerRef.current) {
                await notificationHistoryManagerRef.current.saveNotification(
                    message,
                    "success"
                );
            }
        } catch (error) {
            console.error("Settings update error:", error);
            let errorMessage =
                "Failed to update Standard Login settings. Please try again.";

            // Check if the error response contains a specific message
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                errorMessage = error.response.data.message;
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
            }
        }
    };

    return (
        <div className="dark:bg-gray-900 p-4 sm:p-6">
            <NotificationManager ref={notificationManagerRef} />
            <NotificationHistoryManager
                ref={notificationHistoryManagerRef}
                userId={userId}
            />

            <div className="mt-6 space-y-4 xl:mt-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between max-w-2xl px-4 sm:px-8 py-4 mx-auto border rounded-xl dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 flex-shrink-0"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                            />
                        </svg>
                        <div className="flex flex-col mx-3 sm:mx-5 space-y-1">
                            <h2 className="text-lg font-medium text-gray-700 sm:text-2xl dark:text-gray-200">
                                Standard Login
                            </h2>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2 py-1 text-xs text-blue-500 bg-blue-50 rounded-full dark:bg-blue-900/30">
                                    Account Access
                                </span>
                                <button
                                    onClick={() => setShowInstructions(true)}
                                    className="px-3 py-1 text-sm text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800 transition"
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto">
                        <span className="mr-3 text-sm text-gray-600 dark:text-gray-300">
                            {isStandardLoginEnabled ? "Enabled" : "Disabled"}
                        </span>
                        <label
                            htmlFor="manual-login-toggle"
                            className="relative inline-flex items-center cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                id="manual-login-toggle"
                                className="sr-only peer"
                                checked={isStandardLoginEnabled}
                                onChange={toggleManualLogin}
                                disabled={processing}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                    </div>
                </div>
            </div>

            <InstructionModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Standard Login Guide"
                icon={<svg className="w-6 h-6 text-blue-500" />}
                steps={instructionSteps}
            />
        </div>
    );
}
