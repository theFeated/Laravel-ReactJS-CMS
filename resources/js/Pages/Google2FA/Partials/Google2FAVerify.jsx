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
        <div className="relative font-inter antialiased">
            <main className="relative min-h-screen flex flex-col justify-center bg-slate-50 overflow-hidden">
                <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
                    <div className="flex justify-center">
                        <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
                            <header className="mb-8">
                                <h1 className="text-2xl font-bold mb-1">Authenticator App Verification</h1>
                                <p className="text-[15px] text-slate-500">Enter the 6-digit verification code from your Authenticator App.</p>
                            </header>
                            <form id="otp-form" onSubmit={handleSubmit}>
                                <div className="flex items-center justify-center gap-3">
                                    {[...Array(6)].map((_, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                            pattern="\d*"
                                            maxLength="1"
                                            value={data.code[index] || ''}
                                            onChange={(e) => {
                                                const newCode = data.code.split('');
                                                newCode[index] = e.target.value;
                                                setData('code', newCode.join(''));

                                                // Move to the next input box
                                                if (e.target.value && index < 5) {
                                                    document.getElementById(`otp-${index + 1}`).focus();
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                                                    document.getElementById(`otp-${index - 1}`).focus();
                                                }
                                            }}
                                            id={`otp-${index}`}
                                        />
                                    ))}
                                </div>
                                {errors.code && <div className="text-red-500 text-sm mt-2">{errors.code}</div>}
                                <div className="max-w-[260px] mx-auto mt-4">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
                                        disabled={processing}
                                    >
                                        {processing ? 'Verifying...' : 'Verify Account'}
                                    </button>
                                </div>
                            </form>
                            <div className="text-sm text-slate-500 mt-4">Too Lazy? <a className="font-medium text-indigo-500 hover:text-indigo-600" href="#0">Disable in Settings</a></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}