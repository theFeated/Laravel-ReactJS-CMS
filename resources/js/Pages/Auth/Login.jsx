import React, { useState } from "react";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GoogleAuth from "@/Components/GoogleAuth";
import SliderCaptcha from "@/Components/SliderCaptcha";
import LoadingAnimation from "@/Components/LoadingAnimation";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import ApplicationLogo from "../../Components/ApplicationLogo";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [sliderCaptchaOpen, setSliderCaptchaOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCaptchaSuccess = () => {
        setSliderCaptchaOpen(false);
        setLoading(true);
        post(route("login"), {
            onFinish: () => {
                setLoading(false);
                reset("password");
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
                <LoadingAnimation shouldRefresh={true} />
            ) : (
                <div className="min-h-screen bg-gradient-to-br from-pink-200 to-blue-300 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md"
                    >
                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 10,
                                }}
                                className="flex justify-center mb-4"
                            >
                                <ApplicationLogo className="w-16 h-16 text-indigo-600" />
                            </motion.div>
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                                Sign in to your account
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Or{" "}
                                <Link
                                    href={route("register")}
                                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                                >
                                    create a new account
                                </Link>
                            </p>
                        </div>

                        <form
                            className="mt-8 space-y-6"
                            onSubmit={handleSubmit}
                        >
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div>
                                    <InputLabel
                                        htmlFor="email"
                                        value="Email address"
                                        className="sr-only"
                                    />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Email address"
                                        autoComplete="username"
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="password"
                                        className="sr-only"
                                    >
                                        Password
                                    </InputLabel>
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                                        autoComplete="current-password"
                                        required
                                        placeholder="Password"
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                password: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                remember: e.target.checked,
                                            })
                                        }
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-2 block text-sm text-gray-900"
                                    >
                                        Remember me
                                    </label>
                                </div>

                                {canResetPassword && (
                                    <div className="text-sm">
                                        <Link
                                            href={route("password.request")}
                                            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <svg
                                            className="animate-spin h-5 w-5 mr-3"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                    ) : (
                                        "Sign in"
                                    )}
                                </motion.button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        Or continue with
                                    </span>
                                </div>
                            </div>
                            <GoogleAuth />
                        </div>
                    </motion.div>
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
