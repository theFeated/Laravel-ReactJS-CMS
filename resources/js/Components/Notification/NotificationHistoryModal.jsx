import React, { useState, useEffect } from "react";
import axios from "axios";

const NotificationHistoryModal = ({
    isOpen,
    onClose,
    unreadCount,
    onNotificationsRead,
}) => {
    const [history, setHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all");
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [isPerPageDropdownOpen, setIsPerPageDropdownOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchHistory(currentPage);
        }
    }, [isOpen, currentPage]);

    useEffect(() => {
        filterNotifications();
    }, [history, filter]);

    const filterNotifications = () => {
        if (filter === "all") {
            setFilteredHistory(history);
        } else {
            setFilteredHistory(
                history.filter((group) => group.type === filter)
            );
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post("/mark-all-notifications-as-read");
            setHistory(
                history.map((group) => ({
                    ...group,
                    notifications: group.notifications.map((n) => ({
                        ...n,
                        read_at: new Date().toISOString(),
                    })),
                }))
            );
            if (onNotificationsRead) {
                onNotificationsRead();
            }
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.post(`/mark-notification-as-read/${id}`);
            setHistory(
                history.map((group) => {
                    if (group.id === id) {
                        return {
                            ...group,
                            notifications: group.notifications.map((n) => ({
                                ...n,
                                read_at: new Date().toISOString(),
                            })),
                        };
                    }
                    return group;
                })
            );
            if (onNotificationsRead) {
                onNotificationsRead();
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const groupNotifications = (notifications) => {
        const grouped = [];
        let currentGroup = null;

        notifications.forEach((notification) => {
            if (
                !currentGroup ||
                notification.message !== currentGroup.message ||
                notification.type !== currentGroup.type ||
                new Date(notification.created_at) -
                    new Date(currentGroup.created_at) >
                    60000
            ) {
                currentGroup = {
                    ...notification,
                    notifications: [notification],
                };
                grouped.push(currentGroup);
            } else {
                currentGroup.notifications.push(notification);
            }
        });

        return grouped;
    };

    const fetchHistory = async (page = 1, perPage = 10) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await axios.get(
                `/notification-history?page=${page}&per_page=${perPage}`
            );
            const groupedHistory = groupNotifications(response.data.history);

            setHistory(groupedHistory);
            setCurrentPage(response.data.current_page);
            setTotalPages(response.data.last_page);
        } catch (error) {
            setError("Failed to load notification history");
            console.error("Error fetching notification history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleRemoveNotification = async (id) => {
        try {
            await axios.delete(`/notification-history/${id}`);
            setHistory(history.filter((group) => group.id !== id));
        } catch (error) {
            console.error("Error removing notification:", error);
        }
    };

    const handleRemoveAllNotifications = async () => {
        try {
            await axios.delete("/notification-history");
            setHistory([]);
            if (onNotificationsRead) {
                onNotificationsRead();
            }
        } catch (error) {
            console.error("Error removing all notifications:", error);
        }
    };

    const getTypeStyle = (type) => {
        switch (type) {
            case "success":
                return "bg-green-100 text-green-800";
            case "error":
                return "bg-red-100 text-red-800";
            case "warning":
                return "bg-yellow-100 text-yellow-800";
            case "info":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            // Today - show time only
            return date.toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            });
        } else if (diffInHours < 48) {
            // Yesterday
            return `Yesterday at ${date.toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            })}`;
        } else {
            // Older - show full date
            return date.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        }
    };

    const typeIcons = {
        success: (
            <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                />
            </svg>
        ),
        error: (
            <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                />
            </svg>
        ),
        warning: (
            <svg
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                />
            </svg>
        ),
        info: (
            <svg
                className="w-5 h-5 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                />
            </svg>
        ),
        all: (
            <svg
                className="w-5 h-5 text-white-500"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm7 2a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            </svg>
        ),
    };

    const NotificationItem = ({ group }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        return (
            <div
                className={`p-4 rounded-lg shadow-md mb-2 relative ${getTypeStyle(
                    group.type
                )}`}
            >
                <button
                    onClick={() => handleRemoveNotification(group.id)}
                    className="absolute top-2 right-2 opacity-70 hover:opacity-100"
                    aria-label="Remove notification group"
                >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>

                <div className="flex items-start">
                    {typeIcons[group.type]}
                    <div className="ml-3">
                        <p className="font-medium">{group.message}</p>
                        <span className="text-xs text-gray-600">
                            {group.notifications.length > 1
                                ? `${
                                      group.notifications.length
                                  } notifications - ${formatDate(
                                      group.notifications[0].created_at
                                  )}`
                                : formatDate(group.created_at)}
                        </span>
                    </div>
                </div>

                {group.notifications.length > 1 && (
                    <div>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-xs text-blue-500 mt-2 focus:outline-none"
                        >
                            {isExpanded
                                ? "Show Less"
                                : `Show All (${group.notifications.length})`}
                        </button>

                        {isExpanded && (
                            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 ml-6">
                                {group.notifications
                                    .slice(1)
                                    .map((notification, index) => (
                                        <li key={index}>
                                            {formatDate(
                                                notification.created_at
                                            )}
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Notification History
                        {unreadCount > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                        aria-label="Close"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div className="px-6 py-2 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button
                                id="filter-button"
                                className="h-8 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 flex items-center"
                                onClick={() =>
                                    setIsFilterDropdownOpen(
                                        !isFilterDropdownOpen
                                    )
                                }
                            >
                                {typeIcons[filter]}
                                <svg
                                    className="w-4 h-4 ml-2 absolute top-1/2 right-2 transform -translate-y-1/2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {isFilterDropdownOpen && (
                                <div
                                    className="absolute z-10 mt-2 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="filter-button"
                                    tabIndex={-1}
                                >
                                    <ul>
                                        {Object.keys(typeIcons).map((type) => (
                                            <li
                                                key={type}
                                                onClick={() => {
                                                    setFilter(type);
                                                    setIsFilterDropdownOpen(
                                                        false
                                                    );
                                                }}
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                role="menuitem"
                                                tabIndex={-1}
                                            >
                                                {typeIcons[type]}{" "}
                                                {/* Only show the icon */}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                id="per-page-button"
                                onClick={() =>
                                    setIsPerPageDropdownOpen(
                                        !isPerPageDropdownOpen
                                    )
                                }
                                className="h-8 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 flex items-center"
                            >
                                {perPage}
                                <svg
                                    className="w-4 h-4 ml-2 absolute top-1/2 right-2 transform -translate-y-1/2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                            {isPerPageDropdownOpen && (
                                <div
                                    className="absolute z-10 mt-2 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="per-page-button"
                                    tabIndex={-1}
                                >
                                    <ul>
                                        {[10, 20, 50, 100].map((option) => (
                                            <li
                                                key={option}
                                                onClick={() => {
                                                    setPerPage(option);
                                                    setCurrentPage(1);
                                                    fetchHistory(1, option);
                                                    setIsPerPageDropdownOpen(
                                                        false
                                                    );
                                                }}
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                role="menuitem"
                                                tabIndex={-1}
                                            >
                                                {option}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-center space-x-2">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                            aria-label="Previous page"
                        >
                            <svg
                                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M15 10a1 1 0 01-1 1H6.414l3.293 3.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L6.414 9H14a1 1 0 011 1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                            aria-label="Next page"
                        >
                            <svg
                                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5 10a1 1 0 011-1h7.586l-3.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 11H6a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>

                    {filteredHistory.length > 0 && (
                        <button
                            onClick={handleRemoveAllNotifications}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                            aria-label="Remove all notifications"
                        >
                            <svg
                                className="w-5 h-5 text-red-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M6 2a1 1 0 00-1 1v1H3a1 1 0 100 2h1v10a2 2 0 002 2h8a2 2 0 002-2V6h1a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm3 3a1 1 0 112 0v1a1 1 0 11-2 0V5zm-2 4a1 1 0 012 0v5a1 1 0 11-2 0V9zm4 0a1 1 0 012 0v5a1 1 0 11-2 0V9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto p-6 u-custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <svg
                                className="animate-spin h-10 w-10 text-gray-500 dark:text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth={4}
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <p className="mt-3 text-gray-600 dark:text-gray-400">
                                Loading history...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-red-600 dark:text-red-400">
                                <svg
                                    className="h-12 w-12 mx-auto mb-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p>{error}</p>
                            </div>
                        </div>
                    ) : filteredHistory.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <svg
                                    className="h-12 w-12 mx-auto mb-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                    />
                                </svg>
                                <p>No notification history available</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredHistory.map((group) => (
                                <NotificationItem
                                    key={group.id}
                                    group={group}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition duration-150 ease-in-out"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationHistoryModal;
