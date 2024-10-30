import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import NotificationManager from "../../../Components/Notification/NotificationManager";
import InstructionModal from "../../../Components/InstructionModal";
import NotificationHistoryModal from "../../../Components/Notification/NotificationHistoryModal";
import NotificationHistoryManager from "../../../Components/Notification/NotificationHistoryManager";

const NotificationSettings = ({userId}) => {
    const [settings, setSettings] = useState({
        is_notification_enabled: true,
        display_duration: 3000,
        progress_step: 3,
        max_notifications: 3,
    });

    const [showInstructions, setShowInstructions] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [error, setError] = useState("");
    const notificationManagerRef = useRef(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const notificationHistoryManagerRef = useRef(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get("/api/notification-settings");
            setSettings(response.data);
        } catch (error) {
            console.error("Failed to fetch notification settings:", error);
            
            const message = "Failed to fetch notification settings.";
            notificationManagerRef.current.addNotification(message, "error");
    
            // Try to save to history, but don't block execution
            try {
                if (notificationHistoryManagerRef.current) {
                    await notificationHistoryManagerRef.current.saveNotification(message, "error");
                }
            } catch (historyError) {
                console.error("Error saving to notification history:", historyError);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleToggle = async (e) => {
        const { checked } = e.target;
        // Optimistically update the local state
        setSettings((prev) => ({
            ...prev,
            is_notification_enabled: checked,
        }));

        try {
            // Send update to server
            await axios.put("/api/notification-settings", {
                ...settings,
                is_notification_enabled: checked,
            });
            const message = `Notifications ${checked ? "enabled" : "disabled"} successfully.`;
            notificationManagerRef.current.addNotification(message, "success");
    
            // Try to save to history, but don't block execution
            try {
                if (notificationHistoryManagerRef.current) {
                    await notificationHistoryManagerRef.current.saveNotification(message, "success");
                }
            } catch (historyError) {
                console.error("Error saving to notification history:", historyError);
            }
        } catch (error) {
            // Revert the state if the API call fails
            setSettings((prev) => ({
                ...prev,
                is_notification_enabled: !checked,
            }));
            console.error("Failed to update notification status:", error);
        
            const message = "Failed to update notification status.";
            notificationManagerRef.current.addNotification(message, "error");
    
            // Try to save to history, but don't block execution
            try {
                if (notificationHistoryManagerRef.current) {
                    await notificationHistoryManagerRef.current.saveNotification(message, "error");
                }
            } catch (historyError) {
                console.error("Error saving to notification history:", historyError);
            }
        }
    };

    const handleSubmit = async () => {
        try {
            await axios.put("/api/notification-settings", settings);
            const message = "Settings updated successfully.";
            notificationManagerRef.current.addNotification(message, "success");
    
            // Try to save to history, but don't block execution
            try {
                if (notificationHistoryManagerRef.current) {
                    await notificationHistoryManagerRef.current.saveNotification(message, "success");
                }
            } catch (historyError) {
                console.error("Error saving to notification history:", historyError);
            }
            setShowSettingsModal(false);
        } catch (error) {
            console.error("Failed to update settings:", error);
        
            const message = "Failed to update settings.";
            notificationManagerRef.current.addNotification(message, "error");

            // Try to save to history, but don't block execution
            try {
                if (notificationHistoryManagerRef.current) {
                    await notificationHistoryManagerRef.current.saveNotification(message, "error");
                }
            } catch (historyError) {
                console.error("Error saving to notification history:", historyError);
            }
        }
    };

    const instructionSteps = [
        {
            title: "Notification Settings",
            description:
                "Configure your notification preferences, including how long notifications are displayed, how they progress visually, and the maximum number of notifications shown at once.",
        },
        {
            title: "Display Duration",
            description:
                "Set the duration (in milliseconds) for which notifications will be displayed on the screen. A good practice is to set this between 3000 ms (3 seconds) and 5000 ms (5 seconds) for optimal visibility without overwhelming the user. For smoother animations, 3000 ms is recommended.",
        },
        {
            title: "Progress Step",
            description:
                "Define the progress step (in percentage) for the notification progress bar. This determines how quickly the progress bar fills up during the display duration. For example, if you set the display duration to 3000 ms, a progress step of 3.33% means the bar will fill completely in 30 steps, creating a smooth visual experience. Adjust the progress step proportionally if you change the display duration.",
        },
        {
            title: "Max Notifications",
            description:
                "Set the maximum number of notifications that can be displayed at once. This helps prevent clutter on the screen. A recommended value is between 3 and 5 notifications, depending on the importance of the messages being displayed.",
        },
    ];

    const SettingsModal = ({ isOpen, onClose }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
                    <h3 className="text-lg font-medium mb-4 dark:text-white">
                        Adjust Settings
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium dark:text-gray-300">
                                Display Duration (ms)
                            </label>
                            <input
                                type="number"
                                name="display_duration"
                                value={settings.display_duration}
                                onChange={handleChange}
                                min="1000"
                                className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium dark:text-gray-300">
                                Progress Step (%)
                            </label>
                            <input
                                type="number"
                                name="progress_step"
                                value={settings.progress_step}
                                onChange={handleChange}
                                min="1"
                                max="100"
                                className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium dark:text-gray-300">
                                Max Notifications
                            </label>
                            <input
                                type="number"
                                name="max_notifications"
                                value={settings.max_notifications}
                                onChange={handleChange}
                                min="1"
                                className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleSubmit();
                                    onClose();
                                }}
                                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="dark:bg-gray-900">
            <div>
                <NotificationManager ref={notificationManagerRef} />
                <NotificationHistoryManager ref={notificationHistoryManagerRef} userId={userId} />
            </div>
            <div className="mt-6 space-y-4 xl:mt-12">
                <div className="flex items-center justify-between max-w-2xl px-8 py-4 mx-auto border rounded-xl dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <div className="flex items-center">
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
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <div className="flex flex-col mx-5 space-y-1">
                            <h2 className="text-lg font-medium text-gray-700 sm:text-2xl dark:text-gray-200">
                                Notification Settings
                            </h2>
                            <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 text-xs text-blue-500 bg-blue-50 rounded-full dark:bg-blue-900/30">
                                    Notifications
                                </span>
                                <button
                                    onClick={() => setShowInstructions(true)}
                                    className="px-3 py-1 ml-2 text-sm text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800 transition"
                                >
                                    Learn More
                                </button>
                                <button
                                    onClick={() => setShowSettingsModal(true)}
                                    className="px-3 py-1 ml-2 text-sm text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800 transition"
                                >
                                    Set
                                </button>
                                <button
                                    onClick={() => setIsHistoryModalOpen(true)}
                                    className="px-3 py-1 ml-2 text-sm text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800 transition"
                                >
                                    History
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <span className="mr-3 text-sm text-gray-600 dark:text-gray-300">
                            {settings.is_notification_enabled
                                ? "Enabled"
                                : "Disabled"}
                        </span>
                        <label
                            htmlFor="notification-toggle"
                            className="relative inline-flex items-center cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                id="notification-toggle"
                                className="sr-only peer"
                                name="is_notification_enabled"
                                checked={settings.is_notification_enabled}
                                onChange={handleToggle}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                    </div>
                </div>

                {error && (
                    <div className="max-w-2xl mx-auto px-8">
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                )}
            </div>

            <SettingsModal
                isOpen={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
            />

            <InstructionModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Notification Settings Guide"
                icon={<svg className="w-6 h-6 text-blue-500" />}
                steps={instructionSteps}
            />

            <NotificationHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
            />
        </div>
    );
};

export default NotificationSettings;
