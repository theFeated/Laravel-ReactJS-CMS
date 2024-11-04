import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCopy, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import NotificationManager from "@/Components/Notification/NotificationManager";
import NotificationHistoryManager from "@/Components/Notification/NotificationHistoryManager";

export default function RecoveryCodesModal({ isOpen, onClose, userId }) {
    const [code, setCode] = useState("");
    const [isCodeCopied, setIsCodeCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [recoveryCode, setRecoveryCode] = useState("");
    const [verificationError, setVerificationError] = useState("");
    const notificationManagerRef = useRef();
    const notificationHistoryManagerRef = useRef();

    const fetchCode = async () => {
        try {
            const response = await axios.get("/api/recovery-codes");
            setCode(response.data.code.code);
            setIsCodeCopied(response.data.code.is_code_copied);
            setError("");

            const message = "Recovery code fetched successfully.";
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
            const errorMessage =
                "Failed to fetch recovery code. Generate a new one.";
            setError(errorMessage);

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

    const generateCode = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/recovery-codes/generate");
            setCode(response.data.code);
            setIsCodeCopied(false);
            setError("");

            const message = "Recovery code generated successfully.";
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
            const errorMessage = "Failed to generate recovery code";
            setError(errorMessage);

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
        } finally {
            setLoading(false);
        }
    };

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setIsCodeCopied(true);

            // Update the server to mark the code as copied
            await axios.post("/api/recovery-codes/mark-copied", { code });

            const message = "Recovery code copied to clipboard.";
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
        } catch (err) {
            const errorMessage = "Failed to copy recovery code";
            console.error("Failed to copy code:", err);

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

    const verifyRecoveryCode = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/recovery-codes/verify", {
                recovery_code: recoveryCode,
            });
            if (response.data.success) {
                onClose();

                const message = "Recovery code verified successfully.";
                // Show success notification
                notificationManagerRef.current.addNotification(
                    message,
                    "success"
                );

                // Save notification to history
                if (notificationHistoryManagerRef.current) {
                    await notificationHistoryManagerRef.current.saveNotification(
                        message,
                        "success"
                    );
                } else {
                    console.error(
                        "notificationHistoryManagerRef is not available"
                    );
                }
            } else {
                const errorMessage = "Invalid recovery code";
                setVerificationError(errorMessage);

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
                    console.error(
                        "notificationHistoryManagerRef is not available"
                    );
                }
            }
        } catch (error) {
            const errorMessage = "Failed to verify recovery code";
            setVerificationError(errorMessage);

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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchCode();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div>
                <NotificationManager ref={notificationManagerRef} />
                <NotificationManager ref={notificationManagerRef} />
                <NotificationHistoryManager
                    ref={notificationHistoryManagerRef}
                    userId={userId}
                />
            </div>
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Recovery Code
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        aria-label="Close modal"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 text-red-500 text-sm">{error}</div>
                )}

                {!isCodeCopied ? (
                    <div className="mb-4">
                        <div className="flex justify-end space-x-4 mb-2">
                            <FontAwesomeIcon
                                icon={faCopy}
                                className={`text-gray-500 ${
                                    code
                                        ? "hover:text-blue-500 cursor-pointer"
                                        : "cursor-not-allowed"
                                }`}
                                onClick={code ? copyCode : null}
                                aria-label="Copy recovery code"
                            />
                            <FontAwesomeIcon
                                icon={faSyncAlt}
                                className="text-gray-500 hover:text-green-500 cursor-pointer transition-colors duration-200"
                                onClick={generateCode}
                                aria-label="Generate new recovery code"
                            />
                        </div>
                        <textarea
                            readOnly
                            value={code}
                            className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded font-mono text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            rows={4}
                            aria-label="Recovery code"
                        />
                    </div>
                ) : (
                    <div className="mb-4 text-gray-600 dark:text-gray-300">
                        The recovery code has been copied and will not be
                        displayed again.
                    </div>
                )}

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Copy and save this recovery code in a secure location. It
                    can only be used once.
                </p>

                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Enter the recovery code to verify your account
                    </p>

                    <input
                        type="text"
                        value={recoveryCode}
                        onChange={(e) => setRecoveryCode(e.target.value)}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        placeholder="Enter recovery code"
                        aria-label="Recovery code input"
                    />

                    {verificationError && (
                        <div className="text-red-500 text-sm">
                            {verificationError}
                        </div>
                    )}

                    <button
                        onClick={verifyRecoveryCode}
                        className="w-full p-2 bg-blue-500 hover:bg-blue-700 text-white rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                        Verify
                    </button>
                </div>
            </div>
        </div>
    );
}
