// NotificationManager.jsx
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Notification from './Notification';

const NotificationManager = forwardRef((props, ref) => {
    const [notifications, setNotifications] = useState([]);

    useImperativeHandle(ref, () => ({
        addNotification(message, type) {
            const id = new Date().getTime();
            setNotifications((prevNotifications) => {
                const updatedNotifications = [...prevNotifications, { id, message, type }];
                if (updatedNotifications.length > 3) {
                    updatedNotifications.shift(); // Remove the oldest notification
                }
                return updatedNotifications;
            });
        },
    }));

    const removeNotification = (id) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.id !== id)
        );
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            {notifications.map((notification, index) => (
                <div
                    key={notification.id}
                    style={{
                        position: 'relative',
                        transform: `translateY(${index * 1.5}rem)`,
                        transition: 'transform 0.3s ease-in-out',
                        zIndex: 9999 - index,
                    }}
                >
                    <Notification
                        id={notification.id}
                        message={notification.message}
                        type={notification.type}
                        onClose={removeNotification}
                    />
                </div>
            ))}
        </div>
    );
});

export default NotificationManager;