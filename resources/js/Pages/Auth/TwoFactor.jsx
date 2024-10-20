import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function TwoFactor() {
    const { data, setData, post, processing, errors } = useForm({
        two_factor_code: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('twofactor.verify'), {
            onSuccess: () => {
                console.log('Two-factor authentication successful');
            },
            onError: () => {
                console.error('There was an error verifying the two-factor authentication code');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Two-Factor Authentication" />
            <div className="flex items-center justify-center min-h-screen py-12">
                <div className="max-w-md w-full space-y-6">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <div className="max-w-xl mx-auto">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Two-Factor Authentication</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="two_factor_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Two-Factor Code
                                    </label>
                                    <input
                                        type="text"
                                        id="two_factor_code"
                                        name="two_factor_code"
                                        value={data.two_factor_code}
                                        onChange={(e) => setData('two_factor_code', e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    {errors.two_factor_code && (
                                        <div className="text-red-500 text-sm mt-2">{errors.two_factor_code}</div>
                                    )}
                                </div>
                                <div className="flex items-center justify-end">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:outline-none focus:border-indigo-700 focus:ring focus:ring-indigo-200 active:bg-indigo-600 disabled:opacity-25 transition"
                                        disabled={processing}
                                    >
                                        Verify
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}