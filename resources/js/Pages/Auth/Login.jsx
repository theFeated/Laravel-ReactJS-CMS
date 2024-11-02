import React, { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GoogleAuth from '@/Components/GoogleAuth';
import SliderCaptcha from '@/Components/SliderCaptcha';
import LoadingAnimation from '@/Components/LoadingAnimation'; 
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [sliderCaptchaOpen, setSliderCaptchaOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCaptchaSuccess = () => {
        setSliderCaptchaOpen(false);
        setLoading(true); 
        post(route('login'), {
            onFinish: () => {
                setLoading(false); 
                reset('password');
            },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSliderCaptchaOpen(true);
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
    
            {loading ? ( 
                <LoadingAnimation shouldRefresh={true}>
                </LoadingAnimation>
            ) : (
                <div className="flex flex-col justify-center lg:px-2">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <h2 className="mt-10 text-center text-3xl font-extrabold text-gray-900">
                            Sign in to your account
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600 max-w">
                            Or
                            <Link href={route('register')} className="font-medium text-blue-600 hover:text-blue-500 ml-1">
                                create an account
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-5">
                            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <InputLabel htmlFor="email"/>
                                    <span className="ml-2 inline-block text-sm text-gray-900">Email Address</span>
                                    <div className="mt-1">
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="appearance-none rounded-md relative inline-block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            autoComplete="username"
                                            isFocused={true}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Enter your email address"
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="password"/>
                                    <span className="ml-2 inline-block text-sm text-gray-900">Password</span>
                                    <div className="mt-1">
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="appearance-none rounded-md relative inline-block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            autoComplete="current-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Enter your password"
                                        />
                                        <InputError message={errors.password} className=" mt-2" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <Checkbox
                                            id="remember_me"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 inline-block text-sm text-gray-900">Remember me</span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                        >
                                            Forgot your password?
                                        </Link>
                                    )}
                                </div>

                                <div>
                                    <PrimaryButton
                                        type="submit"
                                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        disabled={processing}
                                    >
                                        Sign in
                                    </PrimaryButton>
                                </div>
                            </form>

                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                    </div>
                                </div>
                                <div className="mt-6 grid grid-cols-1 gap-3">
                                    <GoogleAuth buttonText="Google" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <SliderCaptcha
                isOpen={sliderCaptchaOpen}
                onSuccess={handleCaptchaSuccess}
                onClose={() => setSliderCaptchaOpen(false)}
            />
        </GuestLayout>
    );
}