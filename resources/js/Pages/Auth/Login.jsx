import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GoogleAuth from '@/Components/GoogleAuth';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const [isGoogleAuthEnabled, setIsGoogleAuthEnabled] = useState(false);

    useEffect(() => {
        axios.get('/api/settings')
            .then(response => {
                setIsGoogleAuthEnabled(response.data.is_google_auth_enabled);
            })
            .catch(error => {
                console.error('Error fetching the settings', error);
            });
    }, []);    

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="flex flex-col justify-center lg:px-2">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-10 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 max-w">
                        Or
                        <Link href={route('register')} className="font-medium text-blue-600 
                        hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 ml-1">
                            create an account
                        </Link>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow sm:rounded-lg sm:px-5">
                        {status && <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">{status}</div>}

                        <form className="space-y-6" onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="email" value="Email address" />
                                <div className="mt-1">
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Enter your email address"
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password" />
                                <div className="mt-1">
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter your password"
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <Checkbox
                                        id="remember_me"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="h-4 w-4 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 border-gray-300 dark:border-gray-700 rounded"
                                    />
                                    <span className="ml-2 block text-sm text-gray-900 dark:text-gray-100">Remember me</span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        Forgot your password?
                                    </Link>
                                )}
                            </div>

                            <div>
                                <PrimaryButton
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
                                    disabled={processing}
                                >
                                    Sign in
                                </PrimaryButton>
                            </div>
                        </form>
                        {isGoogleAuthEnabled ? (
                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
                                    </div>
                                </div>
                                <div className="mt-6 grid grid-cols-1 gap-3">
                                    <GoogleAuth buttonText="Google" />
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}