import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GoogleAuth from "@/Components/GoogleAuth";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import SliderCaptcha from "../../Components/SliderCaptcha";
import ApplicationLogo from "../../Components/ApplicationLogo";
import LoadingAnimation from "@/Components/LoadingAnimation";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [sliderCaptchaOpen, setSliderCaptchaOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCaptchaSuccess = () => {
        setSliderCaptchaOpen(false);
        setLoading(true);
        post(route("login"), {
            onFinish: () => {
                setLoading(false);
                reset("password", "password_confirmation");
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
                                Create a new account
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Or{" "}
                                <Link
                                    href={route("login")}
                                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                                >
                                    sign in to your account
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
                                        htmlFor="name"
                                        value="Name"
                                        className="sr-only"
                                    />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Full Name"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                    />
                                </div>
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
                                        value="Password"
                                        className="sr-only"
                                    />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Password"
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Confirm Password"
                                        className="sr-only"
                                    />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Confirm Password"
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                    ) : (
                                        "Create Account"
                                    )}
                                </motion.button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        Or continue with
                                    </span>
                                </div>
                            </div>
                            <div className="mt-6">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                                >
                                    <img
                                        className="h-5 w-5 mr-2"
                                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                                        alt="Google logo"
                                    />
                                    Sign up with Google
                                </motion.button>
                            </div>
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
