import { useState, useRef } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import InstructionModal from "../../../Components/InstructionModal";
import NotificationManager from "../../../Components/Notification/NotificationManager";
import NotificationHistoryManager from "../../../Components/Notification/NotificationHistoryManager";

export default function EnableCaptchaSlider({
    initialIsCaptchaSliderEnabled,
    userId,
}) {
    const [isCaptchaSliderEnabled, setIsCaptchaSliderEnabled] = useState(
        initialIsCaptchaSliderEnabled
    );
    const [showInstructions, setShowInstructions] = useState(false);
    const [error, setError] = useState("");
    const notificationManagerRef = useRef(null);
    const notificationHistoryManagerRef = useRef(null);

    const { setData, processing } = useForm({
        is_captcha_slider_enabled: initialIsCaptchaSliderEnabled,
    });

    const toggleCaptchaSlider = async () => {
        try {
            const newState = !isCaptchaSliderEnabled;
            setData("is_captcha_slider_enabled", newState);

            const response = await axios.post("/api/settings", {
                is_captcha_slider_enabled: newState,
            });

            setIsCaptchaSliderEnabled(newState);
            setError("");

            const message = newState
                ? "Captcha slider has been enabled successfully."
                : "Captcha slider has been disabled successfully.";

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
            setError(
                "Failed to update captcha slider settings. Please try again."
            );
            console.error("Settings update error:", error);

            const errorMessage =
                "Failed to update captcha slider settings. Please try again.";

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
            title: "What is the Captcha Slider?",
            description:
                "The captcha slider is a verification tool that helps prevent automated submissions by requiring users to slide a bar to complete a puzzle.",
        },
        {
            title: "Why Use It?",
            description:
                "Using a captcha slider helps protect your application from spam and abuse by ensuring that real users are interacting with your forms.",
        },
        {
            title: "How to Set Up",
            description:
                "Simply toggle the switch to enable or disable the captcha slider. Your preference will be saved and applied across the application.",
        },
        {
            title: "How it Works",
            description:
                "When the captcha slider is enabled, users will be required to complete the slider verification before submitting forms.",
        },
        {
            title: "Important Note",
            description:
                "While the captcha slider adds an extra layer of security, it may also affect user experience. Choose the setting that works best for your application.",
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
                            viewBox="0 0 220 210" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <path
                                fill="#1C3AA9"
                                d="M211.3 84.966a87 87 0 0 0-.087-3.653V12.251l-19.092 19.093C176.494 12.217 152.723 0 126.096 0C98.387 0 73.77 13.226 58.21 33.71l31.295 31.624a41.46 41.46 0 0 1 12.677-14.224c5.464-4.263 13.205-7.75 23.914-7.75c1.294 0 2.293.152 3.026.436c13.269 1.048 24.77 8.37 31.541 18.998L138.51 84.946c28.059-.11 59.756-.174 72.788.015"
                            />
                            <path
                                fill="#4285F4"
                                d="M125.599.003a87 87 0 0 0-3.653.087H52.884l19.093 19.093C52.85 34.809 40.633 58.581 40.633 85.207c0 27.71 13.226 52.327 33.71 67.888l31.624-31.295a41.46 41.46 0 0 1-14.224-12.678c-4.263-5.463-7.75-13.205-7.75-23.914c0-1.293.152-2.292.436-3.026c1.048-13.268 8.37-24.769 18.998-31.54l22.152 22.152c-.11-28.06-.175-59.757.015-72.789"
                            />
                            <path
                                fill="#ABABAB"
                                d="M40.636 85.205q.005 1.835.087 3.653v69.062l19.093-19.093c15.626 19.127 39.398 31.344 66.024 31.344c27.71 0 52.327-13.226 67.888-33.71l-31.295-31.624a41.46 41.46 0 0 1-12.678 14.224c-5.463 4.263-13.205 7.75-23.914 7.75c-1.293 0-2.292-.152-3.026-.437c-13.268-1.047-24.769-8.37-31.54-18.997l22.152-22.153c-28.06.11-59.757.175-72.789-.014"
                            />
                        </svg>

                        <div className="flex flex-col mx-3 sm:mx-5 space-y-1">
                            <h2 className="text-lg font-medium text-gray-700 sm:text-2xl dark:text-gray-200">
                                Captcha Slider
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
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0">
                        <span className="mr-3 text-sm text-gray-600 dark:text-gray-300">
                            {isCaptchaSliderEnabled ? "Enabled" : "Disabled"}
                        </span>
                        <label
                            htmlFor="captcha-slider-toggle"
                            className="relative inline-flex items-center cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                id="captcha-slider-toggle"
                                className="sr-only peer"
                                checked={isCaptchaSliderEnabled}
                                onChange={toggleCaptchaSlider}
                                disabled={processing}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 transition-colors duration-300">
                                <div
                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                                        isCaptchaSliderEnabled
                                            ? "translate-x-5"
                                            : ""
                                    }`}
                                ></div>
                            </div>
                        </label>
                    </div>
                </div>

                {error && (
                    <div className="max-w-2xl mx-auto px-4 sm:px-8">
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                )}
            </div>

            <InstructionModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Captcha Slider Guide"
                icon={<svg className="w-6 h-6 text-blue-500" />}
                steps={instructionSteps}
            />
        </div>
    );
}
