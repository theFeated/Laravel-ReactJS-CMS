import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import Notification from '../Components/Notification/Notification';

export default function Guest({ children }) {
    const { flash } = usePage().props;

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 relative">
            {flash.notification && (
                <div className="absolute top-4 right-4 z-50">
                    <Notification 
                        message={flash.notification.message} 
                        type={flash.notification.type} 
                    />
                </div>
            )}
            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                <div className="flex justify-center mb-4">
                    <Link href="/">
                        <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                    </Link>
                </div>
                {children}
            </div>
        </div>
    );
}