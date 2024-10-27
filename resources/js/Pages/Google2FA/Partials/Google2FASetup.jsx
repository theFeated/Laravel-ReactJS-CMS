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
        <section className="body-font bg-gray-100 pt-10 text-gray-600 py-6">
            <div className="container mx-auto mt-10 flex max-w-3xl flex-wrap justify-center rounded-lg bg-white px-5 py-24">
                <div className="flex-wrap md:flex">
                    <div className="mx-auto">
                        <div className="mx-auto mt-12 h-52 w-52 rounded-lg border p-2 md:mt-0 flex items-center justify-center" style={{ background: 'white', padding: '16px' }}>
                            {qrCodeSvg ? (
                                <div 
                                    className="w-full h-full flex items-center justify-center" 
                                    dangerouslySetInnerHTML={{ __html: qrCodeSvg }} 
                                    style={{ maxWidth: '100%', maxHeight: '100%', overflow: 'hidden' }} 
                                />
                            ) : (
                                <p>Loading QR code...</p>
                            )}
                        </div>
                        <div>
                            <h1 className="font-laonoto mt-4 text-center text-xl font-bold">Scan the QR Code</h1>
                            <p className="mt-2 text-center font-semibold text-gray-600">{email}</p>
                            <div className="mt-2 text-center">
                                <div className="inline-block overflow-x-auto whitespace-nowrap">
                                    <span className="font-medium text-red-500">{secret}</span>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mt-3">Enter the code from Authenticator</label>
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
                                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                disabled={processing}
                            >
                                {processing ? 'Verifying...' : 'Verify Setup'}
                            </button>
                        </form>
                    </div>
                    <div className="mt-8 max-w-sm md:mt-0 md:ml-10 md:w-2/3">
                        <div className="relative flex pb-12">
                            <div className="absolute inset-0 flex h-full w-10 items-center justify-center">
                                <div className="pointer-events-none h-full w-1 bg-gray-200"></div>
                            </div>
                            <div className="relative z-10 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-5 w-5" viewBox="0 0 24 24">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                            </div>
                            <div className="flex-grow pl-4">
                                <h2 className="title-font mb-1 text-sm font-medium tracking-wider text-gray-900">STEP 1</h2>
                                <p className="font-laonoto leading-relaxed">
                                    Scan the QR code with your Google Authenticator app.
                                </p>
                            </div>
                        </div>
                        <div className="relative flex pb-12">
                            <div className="absolute inset-0 flex h-full w-10 items-center justify-center">
                                <div className="pointer-events-none h-full w-1 bg-gray-200"></div>
                            </div>
                            <div className="relative z-10 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                                <svg fill=" none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-5 w-5" viewBox="0 0 24 24">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                </svg>
                            </div>
                            <div className="flex-grow pl-4">
                                <h2 className="title-font mb-1 text-sm font-medium tracking-wider text-gray-900">STEP 2</h2>
                                <p className="font-laonoto leading-relaxed">
                                    Enter the 6-digit code from the Authenticator app.
                                </p>
                            </div>
                        </div>
                        <div className="relative flex pb-12">
                            <div className="relative z-10 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-5 w-5" viewBox="0 0 24 24">
                                    <circle cx="12" cy="5" r="3"></circle>
                                    <path d="M12 22V8M5 12H2a10 10 0 0020 0h-3"></path>
                                </svg>
                            </div>
                            <div className="flex-grow pl-4">
                                <h2 className="title-font mb-1 text-sm font-medium tracking-wider text-gray-900">STEP 3</h2>
                                <p className="font-laonoto leading-relaxed">
                                    Complete the setup by verifying the code.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}