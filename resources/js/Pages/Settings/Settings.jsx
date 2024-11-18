import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import EnableGoogleAuth from './Partials/EnableGoogleAuth';
import Enable2FA from './Partials/Enable2FA';
import WebIconAndName from './Partials/WebIconAndName';
import UploadLogo from './Partials/UploadLogo';
import Google2FAToggle from '../Google2FA/Partials/Google2FAToggle';
import NotificationSettings from './Partials/NotificationSettings';
import EnableDarkMode from './Partials/EnableDarkMode';
import EnableCaptchaSlider from './Partials/EnableCaptchaSlider';

export default function Settings({ isGoogleAuthEnabled, is2FAEnabled, webIcon, webName, logo, isGoogle2FAEnabled, isDarkModeEnabled, isCaptchaSliderEnabled }) {
    const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'google-auth');
    const { auth } = usePage().props;

    useEffect(() => {
        localStorage.setItem('activeTab', activeTab);
        return () => localStorage.removeItem('activeTab');
    }, [activeTab]);

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'google-auth': return <EnableGoogleAuth initialIsGoogleAuthEnabled={isGoogleAuthEnabled} userId={auth.user.id} />;
            case '2fa': return <Enable2FA initialIs2FAEnabled={is2FAEnabled} userId={auth.user.id} />;
            case 'google2fa': return <Google2FAToggle initialIsGoogle2FAEnabled={isGoogle2FAEnabled} userId={auth.user.id} />;
            case 'web-icon-name': return <WebIconAndName initialWebIcon={webIcon} initialWebName={webName} userId={auth.user.id} />;
            case 'upload-logo': return <UploadLogo initialLogo={logo} userId={auth.user.id} />;
            case 'notification-settings': return <NotificationSettings userId={auth.user.id} />;
            case 'dark-mode': return <EnableDarkMode initialIsDarkModeEnabled={isDarkModeEnabled} userId={auth.user.id} />;
            case 'captcha-slider': return <EnableCaptchaSlider initialIsCaptchaSliderEnabled={isCaptchaSliderEnabled} userId={auth.user.id} />;
            default: return null;
        }
    };
    
    return (
        <AuthenticatedLayout userId={auth.user.id}>
            <Head title="Settings" />
            <div className="main flex flex-col m-5">
                {/* Tab container with better spacing */}
                <div className="overflow-x-auto">
                    <div className="flex flex-nowrap mb-4 border-b border-gray-200 dark:border-gray-700">
                        {/* Container for centered tabs */}
                        <div className="flex justify-between w-full max-w-7xl mx-auto">
                            <button
                                className={`tab flex-1 px-4 py-2 text-center focus:outline-none transition-all duration-200 
                                    ${activeTab === 'google-auth' 
                                        ? 'text-blue-600 border-b-4 border-blue-600' 
                                        : 'text-gray-600 hover:text-blue-600 hover:border-b-4 hover:border-blue-600'
                                    }`}
                                onClick={() => setActiveTab('google-auth')}
                            >
                                Google Auth
                            </button>
                            <button
                                className={`tab flex-1 px-4 py-2 text-center focus:outline-none transition-all duration-200
                                    ${activeTab === '2fa' 
                                        ? 'text-blue-600 border-b-4 border-blue-600' 
                                        : 'text-gray-600 hover:text-blue-600 hover:border-b-4 hover:border-blue-600'
                                    }`}
                                onClick={() => setActiveTab('2fa')}
                            >
                                EOTP
                            </button>
                            <button
                                className={`tab flex-1 px-4 py-2 text-center focus:outline-none transition-all duration-200
                                    ${activeTab === 'google2fa' 
                                        ? 'text-blue-600 border-b-4 border-blue-600' 
                                        : 'text-gray-600 hover:text-blue-600 hover:border-b-4 hover:border-blue-600'
                                    }`}
                                onClick={() => setActiveTab('google2fa')}
                            >
                                TOTP
                            </button>
                            <button
                                className={`tab flex-1 px-4 py-2 text-center focus:outline-none transition-all duration-200
                                    ${activeTab === 'notification-settings' 
                                        ? 'text-blue-600 border-b-4 border-blue-600' 
                                        : 'text-gray-600 hover:text-blue-600 hover:border-b-4 hover:border-blue-600'
                                    }`}
                                onClick={() => setActiveTab('notification-settings')}
                            >
                                Notifications
                            </button>
                            <button
                                className={`tab flex-1 px-4 py-2 text-center focus:outline-none transition-all duration-200
                                    ${activeTab === 'dark-mode' 
                                        ? 'text-blue-600 border-b-4 border-blue-600' 
                                        : 'text-gray-600 hover:text-blue-600 hover:border-b-4 hover:border-blue-600'
                                    }`}
                                onClick={() => setActiveTab('dark-mode')}
                            >
                                Dark Mode
                            </button>
                            <button
                                className={`tab flex-1 px-4 py-2 text-center focus:outline-none transition-all duration-200
                                    ${activeTab === 'web-icon-name' 
                                        ? 'text-blue-600 border-b-4 border-blue-600' 
                                        : 'text-gray-600 hover:text-blue-600 hover:border-b-4 hover:border-blue-600'
                                    }`}
                                onClick={() => setActiveTab('web-icon-name')}
                            >
                                Web Icon
                            </button>
                            <button
                                className={`tab flex-1 px-4 py-2 text-center focus:outline-none transition-all duration-200
                                    ${activeTab === 'upload-logo' 
                                        ? 'text-blue-600 border-b-4 border-blue-600' 
                                        : 'text-gray-600 hover:text-blue-600 hover:border-b-4 hover:border-blue-600'
                                    }`}
                                onClick={() => setActiveTab('upload-logo')}
                            >
                                Logo
                            </button>
                            {/* <button
                                className={`tab flex-1 px-4 py-2 text-center focus:outline-none transition-all duration-200
                                    ${activeTab === 'captcha-slider' 
                                        ? 'text-blue-600 border-b-4 border-blue-600' 
                                        : 'text-gray-600 hover:text-blue-600 hover:border-b-4 hover:border-blue-600'
                                    }`}
                                onClick={() => setActiveTab('captcha-slider')}
                            >
                                Captcha Slider
                            </button> */}
                        </div>
                    </div>
                </div>
                <div className="content">
                    {renderActiveTab()}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}