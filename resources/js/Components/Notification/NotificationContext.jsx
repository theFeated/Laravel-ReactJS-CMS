import React, { createContext, useContext, useRef } from 'react';
import NotificationManager from './NotificationManager';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const notificationManagerRef = useRef(null);

    const addNotification = (message, type) => {
        if (notificationManagerRef.current) {
            notificationManagerRef.current.addNotification(message, type);
        }
    };

    return (
        <NotificationContext.Provider value={addNotification}>
            <NotificationManager ref={notificationManagerRef} />
            {children}
        </NotificationContext.Provider>
    );
    //add to your app.jsx or any global component
    //import { NotificationProvider } from './Components/Notification/NotificationContext';
    // root.render(
    //     <NotificationProvider>
    //         <App {...props} />
    //     </NotificationProvider>
    // );

    //sample usage 
    //import { useNotification } from '../../../Components/Notification/NotificationContext';

    //const notify = useNotification();

    // notify(
    //     'Failed to update settings. Please try again.',
    //     'error'
    // );
};