import { useState, useRef, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function TwoFactor() {
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
    const [shouldSubmit, setShouldSubmit] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        two_factor_code: '',
    });

    const handleKeyDown = (e, index) => {
        if (!/^[0-9]{1}$/.test(e.key) && 
            e.key !== 'Backspace' && 
            e.key !== 'Delete' && 
            e.key !== 'Tab' && 
            e.key !== 'Enter' && 
            !e.metaKey) {
            e.preventDefault();
        }
        
        if (e.key === 'Enter') {
            e.preventDefault();
            const allFilled = otpValues.every(value => value !== '');
            if (allFilled && !processing) {
                handleSubmit(e);
            }
            return;
        }
        
        if ((e.key === 'Delete' || e.key === 'Backspace') && index > 0 && !otpValues[index]) {
            inputRefs[index - 1].current.focus();
            setOtpValues(prev => {
                const newValues = [...prev];
                newValues[index - 1] = '';
                return newValues;
            });
        }
    };

    const handleInput = (e, index) => {
        const value = e.target.value;
        if (value && !/^\d+$/.test(value)) return;

        setOtpValues(prev => {
            const newValues = [...prev];
            newValues[index] = value.slice(-1);
            return newValues;
        });

        if (value && index < inputRefs.length - 1) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text');
        if (!new RegExp(`^[0-9]{${inputRefs.length}}$`).test(text)) return;

        const digits = text.split('');
        setOtpValues(digits);
        inputRefs[inputRefs.length - 1].current.focus();
    };

    useEffect(() => {
        if (shouldSubmit && data.two_factor_code) {
            post(route('twofactor.verify'));
            setShouldSubmit(false);
        }
    }, [data.two_factor_code, shouldSubmit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const code = otpValues.join('');
        setData('two_factor_code', code);
        setShouldSubmit(true);
    };

    const handleResend = (e) => {
        e.preventDefault();
        
        if (resendDisabled) return;

        setResendDisabled(true);
        setCountdown(60);

        post(route('twofactor.resend'), {
            preserveScroll: true,
            onSuccess: () => {
                setOtpValues(['', '', '', '', '', '']);
                inputRefs[0].current.focus();
                
                const timer = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            setResendDisabled(false);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            },
            onError: () => {
                setResendDisabled(false);
                setCountdown(0);
            }
        });
    };

    return (
        <main className="relative min-h-screen flex flex-col justify-center bg-slate-50 overflow-hidden">
            <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
                <div className="flex justify-center">
                    <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
                        <header className="mb-8">
                            <h1 className="text-2xl font-bold mb-1">Email Verification</h1>
                            <p className="text-[15px] text-slate-500">
                                Enter the 6-digit verification code that was sent to your email.
                            </p>
                        </header>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center justify-center gap-2">
                                {otpValues.map((value, index) => (
                                    <input
                                        key={index}
                                        ref={inputRefs[index]}
                                        type="text"
                                        value={value}
                                        onChange={(e) => handleInput(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onPaste={handlePaste}
                                        maxLength={1}
                                        className="w-12 h-12 text-center text-xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-2 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                    />
                                ))}
                            </div>
                            {errors.two_factor_code && (
                                <div className="text-red-500 text-sm mt-2">{errors.two_factor_code}</div>
                            )}
                            <div className="max-w-[260px] mx-auto mt-4">
                                <button
                                    type="submit"
                                    disabled={processing || otpValues.some(v => !v)}
                                    className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150 disabled:opacity-50"
                                >
                                    Verify Account
                                </button>
                            </div>
                        </form>
                        
                        <div className="text-sm text-slate-500 mt-4">
                            Didn't receive code? 
                            {countdown > 0 ? (
                                <span className="text-slate-400 ml-1">
                                    Resend available in {countdown}s
                                </span>
                            ) : (
                                <button
                                    onClick={handleResend}
                                    disabled={resendDisabled || processing}
                                    className="font-medium text-indigo-500 hover:text-indigo-600 ml-1 disabled:opacity-50 disabled:hover:text-indigo-500"
                                >
                                    Resend
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}