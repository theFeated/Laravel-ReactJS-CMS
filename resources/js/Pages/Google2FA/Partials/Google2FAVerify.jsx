import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Google2FAVerify() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/verify-2fa', {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Two-factor authentication verified successfully.');
            },
            onError: (errors) => {
                console.error('Error verifying 2FA code:', errors);
            },
        });
    };

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Verify Google Authenticator Code</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">Enter the code from Google Authenticator</label>
                        <input
                            type="text"
                            id="code"
                            name="code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                            maxLength={6}
                        />
                        {errors.code && <div className="text-red-500 text-sm mt-2">{errors.code}</div>}
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        disabled={processing}
                    >
                        {processing ? 'Verifying...' : 'Verify'}
                    </button>
                </form>
            </div>
        </div>
    );
}