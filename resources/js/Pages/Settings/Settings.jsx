import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import EnableGoogleAuth from './Partials/EnableGoogleAuth';
import Enable2FA from './Partials/Enable2FA';
import WebIconAndName from './Partials/WebIconAndName';

export default function Settings({ isGoogleAuthEnabled, is2FAEnabled, webIcon, webName }) {
    return (
        <AuthenticatedLayout>
            <Head title="Settings" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <div className="max-w-xl">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Settings</h1>
                            
                            <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900 rounded-lg">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Enable Google Authentication</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Enable Google Authentication to add an extra layer of security to your account.
                                </p>
                                <EnableGoogleAuth initialIsGoogleAuthEnabled={isGoogleAuthEnabled} />
                            </div>

                            <div className="mb-8 p-6 bg-green-50 dark:bg-green-900 rounded-lg">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Enable Two-Factor Authentication</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Enable Two-Factor Authentication (2FA) to further secure your account by requiring a second form of verification.
                                </p>
                                <Enable2FA initialIs2FAEnabled={is2FAEnabled} />
                            </div>

                            <WebIconAndName initialWebIcon={webIcon} initialWebName={webName} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}