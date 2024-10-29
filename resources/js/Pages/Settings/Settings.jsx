import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import EnableGoogleAuth from './Partials/EnableGoogleAuth';
import Enable2FA from './Partials/Enable2FA';
import WebIconAndName from './Partials/WebIconAndName';
import UploadLogo from './Partials/UploadLogo';
import Google2FAToggle from '../Google2FA/Partials/Google2FAToggle';
import NotificationSettings from './Partials/NotificationSettings';
import EnableDarkMode from './Partials/EnableDarkMode'; // Import the new component

export default function Settings({ isGoogleAuthEnabled, is2FAEnabled, webIcon, webName, logo, isGoogle2FAEnabled, isDarkModeEnabled }) {
    const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'google-auth');

    useEffect(() => {
        localStorage.setItem('activeTab', activeTab);

        return () => {
            localStorage.removeItem('activeTab');
        };
    }, [activeTab]);

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'google-auth':
                return <EnableGoogleAuth initialIsGoogleAuthEnabled={isGoogleAuthEnabled} />;
            case '2fa':
                return <Enable2FA initialIs2FAEnabled={is2FAEnabled} />;
            case 'google2fa':
                return <Google2FAToggle initialIsGoogle2FAEnabled={isGoogle2FAEnabled} />;
            case 'web-icon-name':
                return <WebIconAndName initialWebIcon={webIcon} initialWebName={webName} />;
            case 'upload-logo':
                return <UploadLogo initialLogo={logo} />;
            case 'notification-settings':
                return <NotificationSettings />;
            case 'dark-mode': // Add case for dark mode
                return <EnableDarkMode initialIsDarkModeEnabled={isDarkModeEnabled} />;
            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Settings" />
            <div className="main flex flex-col m-5">
                <div className="tabs flex justify-around mb-4 border-b border-gray-200 dark:border-gray-700">
                    <button
                        className={`tab px-4 py-2 focus:outline-none ${activeTab === 'google-auth' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-600 hover:text-blue-600 hover:border-blue-600'}`}
                        onClick={() => setActiveTab('google-auth')}
                    >
                        Google Authentication
                    </button>
                    <button
                        className={`tab px-4 py-2 focus:outline-none ${activeTab === '2fa' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-600 hover:text-blue-600 hover:border-blue-600'}`}
                        onClick={() => setActiveTab('2fa')}
                    >
                        EOTP
                    </button>
                    <button
                        className={`tab px-4 py-2 focus:outline-none ${activeTab === 'google2fa' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-600 hover:text-blue-600 hover:border-blue-600'}`}
                        onClick={() => setActiveTab('google2fa')}
                    >
                        TOTP
                    </button>
                    <button
                        className={`tab px-4 py-2 focus:outline-none ${activeTab === 'web-icon-name' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-600 hover:text-blue-600 hover:border-blue-600'}`}
                        onClick={() => setActiveTab('web-icon-name')}
                    >
                        Web Icon & Name
                    </button>
                    <button
                        className={`tab px-4 py-2 focus:outline-none ${activeTab === 'upload-logo' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-600 hover:text-blue-600 hover:border-blue-600'}`}
                        onClick={() => setActiveTab('upload-logo')}
                    >
                        Upload Logo
                    </button>
                    <button
                        className={`tab px-4 py-2 focus:outline-none ${activeTab === 'notification-settings' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-600 hover:text-blue-600 hover:border-blue-600'}`}
                        onClick={() => setActiveTab('notification-settings')}
                    >
                        Notification Settings
                    </button>
                    <button
                        className={`tab px-4 py-2 focus:outline-none ${activeTab === 'dark-mode' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-600 hover:text-blue-600 hover:border-blue-600'}`}
                        onClick={() => setActiveTab('dark-mode')}
                    >
                        Dark Mode
                    </button>
                </div>
                <div className="content">
                    {renderActiveTab()}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}