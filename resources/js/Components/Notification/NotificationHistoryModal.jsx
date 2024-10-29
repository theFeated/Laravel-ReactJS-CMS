import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationHistoryModal = ({ isOpen, onClose }) => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchHistory();
        }
    }, [isOpen]);

    const groupNotifications = (notifications) => {
        const grouped = [];
        let currentGroup = null;

        notifications.forEach((notification) => {
            if (!currentGroup || 
                notification.message !== currentGroup.message || 
                notification.type !== currentGroup.type ||
                (new Date(notification.created_at) - new Date(currentGroup.created_at)) > 60000) {
                currentGroup = {
                    ...notification,
                    notifications: [notification]
                };
                grouped.push(currentGroup);
            } else {
                currentGroup.notifications.push(notification);
            }
        });

        return grouped;
    };

    const fetchHistory = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get('/notification-history');
            const groupedHistory = groupNotifications(response.data.history);
            setHistory(groupedHistory);
        } catch (error) {
            setError('Failed to load notification history');
            console.error('Error fetching notification history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveNotification = async (id) => {
        try {
            await axios.delete(`/notification-history/${id}`);
            setHistory(history.filter(group => group.id !== id));
        } catch (error) {
            console.error('Error removing notification:', error);
        }
    };

    const getTypeStyle = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 text-green-700 border-green-100';
            case 'error':
                return 'bg-red-50 text-red-700 border-red-100';
            case 'warning':
                return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'info':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 24) {
            // Today - show time only
            return date.toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else if (diffInHours < 48) {
            // Yesterday
            return `Yesterday at ${date.toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })}`;
        } else {
            // Older - show full date
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    const typeIcons = {
        success: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
        ),
        warning: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
        )
    };

    const NotificationItem = ({ group }) => {
        const [isExpanded, setIsExpanded] = useState(false);
    
        return (
            <div 
                className={`p-4 rounded-lg ${getTypeStyle(group.type)} border transition-all duration-200 hover:shadow-sm`}
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-center">
                        {typeIcons[group.type]}
                        <span className="font-medium ml-2">{group.message}</span>
                    </div>
                    <button
                        onClick={() => handleRemoveNotification(group.id)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none ml-2"
                        aria-label="Remove notification"
                    >
                        <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
    
                {group.notifications.length > 1 ? (
                    <div className="mt-2">
                        <div 
                            className="flex items-center text-sm cursor-pointer hover:opacity-75"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <span className="opacity-75">
                                {formatDate(group.notifications[group.notifications.length - 1].created_at)}
                            </span>
                            <button 
                                className={`ml-2 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                            >
                                <svg 
                                    className="w-4 h-4" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                        </div>
                        
                        {isExpanded && (
                            <div className="mt-2 space-y-1 pl-4 border-l-2 border-opacity-50 border-current">
                                {group.notifications.slice(0, -1).reverse().map((notification, index) => (
                                    <div 
                                        key={index} 
                                        className="text-sm opacity-75"
                                    >
                                        {formatDate(notification.created_at)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mt-2 text-sm opacity-75">
                        {formatDate(group.created_at)}
                    </div>
                )}
    
                {/* <span className="text-sm mt-1 opacity-75 capitalize">
                    {group.type}
                </span> */}
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Notification History
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label="Close"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
    
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <svg className="animate-spin h-10 w-10 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-3 text-gray-600">Loading history...</p>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-red-600">
                                <svg className="h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p>{error}</p>
                            </div>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-gray-500">
                                <svg className="h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p>No notification history available</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((group) => (
                                <NotificationItem key={group.id} group={group} />
                            ))}
                        </div>
                    )}
                </div>
    
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-150 ease-in-out"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationHistoryModal;