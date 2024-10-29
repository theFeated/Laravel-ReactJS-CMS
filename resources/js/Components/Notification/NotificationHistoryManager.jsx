import React, { forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';

const NotificationHistoryManager = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        async saveNotification(message, type) {
            try {
                const response = await axios.post('/notifications', {
                    user_id: props.userId,
                    type: type,
                    message: message,
                });
                
                if (response.data && response.data.notification) {
                    return response.data.notification;
                }
                throw new Error('Invalid response format');
            } catch (error) {
                console.error('Failed to save notification:', error);
                if (error.response) {
                    console.error('Error response:', error.response.data);
                }
                throw error;
            }
        }
    }));

    return null;
});

NotificationHistoryManager.displayName = 'NotificationHistoryManager';

export default NotificationHistoryManager;