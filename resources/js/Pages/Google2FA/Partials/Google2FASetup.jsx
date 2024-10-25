import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Google2FASetup({ secret, email, qrCodeSvg }) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/verify-2fa', {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Two-factor authentication enabled successfully.');
            },
            onError: (errors) => {
                console.error('Error verifying 2FA code:', errors);
            },
        });
    };

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Set up Google Authenticator</h2>
                <p className="mb-4">Please scan the barcode below. Alternatively, you can use the code <strong>{secret}</strong></p>
                <div className="mb-4" style={{ background: 'white', padding: '16px' }}>
                    {qrCodeSvg ? (
                        <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
                    ) : (
                        <p>Loading QR code...</p>
                    )}
                </div>
                <p className="mb-4">You need to set up your Google Authenticator app before continuing. You will be unable to login otherwise.</p>
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
                        {processing ? 'Verifying...' : 'Verify and Complete Setup'}
                    </button>
                </form>
            </div>
        </div>
    );
}