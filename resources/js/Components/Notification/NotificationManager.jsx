import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import axios from 'axios';
import Notification from './Notification';

const NotificationManager = forwardRef((props, ref) => {
    const [notifications, setNotifications] = useState([]);
    const [settings, setSettings] = useState({
        is_notification_enabled: true,
        display_duration: 3000,
        progress_step: 3,
        max_notifications: 3,
    });
    const [isLoading, setIsLoading] = useState(true);

    // Fetch notification settings when component mounts
    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get('/api/notification-settings');
            setSettings(response.data);
            setIsLoading(false);
            console.log('Fetched settings:', response.data);
        } catch (error) {
            console.error('Failed to fetch notification settings:', error);
            setIsLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        addNotification(message, type) {
            // Early return if notifications are disabled
            if (!settings.is_notification_enabled) {
                console.log('Notifications are disabled.');
                return;
            }

            // Check if we've reached the maximum number of notifications
            if (notifications.length >= settings.max_notifications) {
                // Remove the oldest notification
                setNotifications(prev => prev.slice(1));
            }

            const id = new Date().getTime();
            setNotifications(prev => [
                ...prev,
                { id, message, type }
            ]);
            console.log('Added notification:', { id, message, type });
        },

        // Expose method to update settings
        async updateSettings(newSettings) {
            try {
                const response = await axios.post('/api/notification-settings', newSettings);
                setSettings(response.data.settings);
                return response.data;
            } catch (error) {
                console.error('Failed to update notification settings:', error);
                throw error;
            }
        }
    }));

    const removeNotification = (id) => {
        setNotifications(prev => 
            prev.filter(notification => notification.id !== id)
        );
        console.log('Removed notification:', id);
    };

    // Don't render anything if still loading
    if (isLoading) {
        console.log('Loading settings...');
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-50">
            {notifications.map((notification, index) => (
                <div
                    key={notification.id}
                    className="transition-all duration-300 ease-in-out"
                    style={{
                        position: 'relative',
                        transform: `translateY(${index * 1.5}rem)`,
                        marginBottom: '0.5rem',
                        zIndex: 9999 - index,
                    }}
                >
                    <Notification
                        id={notification.id}
                        message={notification.message}
                        type={notification.type}
                        onClose={removeNotification}
                        displayDuration={settings.display_duration}
                        progressStep={settings.progress_step}
                    />
                </div>
            ))}
        </div>
    );
});

NotificationManager.displayName = 'NotificationManager';

export default NotificationManager;

//sample usage
//import { useRef } from 'react';

//import NotificationManager from './NotificationManager';

//const notificationManagerRef = useRef();

// notificationManagerRef.current.addNotification(
//     'Recovery code fetched successfully.',
//     'success'
// );

//      <div>
//     <NotificationManager ref={notificationManagerRef} />
//     </div>