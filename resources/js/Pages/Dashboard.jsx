import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Notification from '@/Components/Notification';

export default function Dashboard() {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="flex">
                {flash.notification && (
                    <div className="absolute top-4 right-4 z-50">
                        <Notification 
                            message={flash.notification.message} 
                            type={flash.notification.type} 
                        />
                    </div>
                )}
                <div className="flex-1 py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">You're logged in!</div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}