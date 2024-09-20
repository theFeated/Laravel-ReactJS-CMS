import React, { useState } from "react";

export default function LogReg() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <section className="h-screen bg-gray-100 flex items-center justify-center">
            <div className="container mx-auto p-4">
                <div className="flex flex-wrap items-center justify-center lg:justify-between">
                    <div className="hidden md:block md:w-5/12 lg:w-4/12 mb-8 md:mb-0">
                        <img
                            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                            className="w-full"
                            alt="Phone image"
                        />
                    </div>

                    <div className="md:w-7/12 lg:w-5/12 bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex justify-center mb-4">
                            <button
                                className={`px-4 py-2 rounded-t-lg ${isLogin ? 'bg-gray-200' : 'bg-white'} focus:outline-none`}
                                onClick={() => setIsLogin(true)}
                            >
                                Sign In
                            </button>
                            <button
                                className={`px-4 py-2 rounded-t-lg ${!isLogin ? 'bg-gray-200' : 'bg-white'} focus:outline-none`}
                                onClick={() => setIsLogin(false)}
                            >
                                Register
                            </button>
                        </div>
                        {isLogin ? (
                            <div>
                                <h2 className="text-xl font-bold mb-4 text-center">
                                    Sign In
                                </h2>
                                <form>
                                    {/* Email input */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-1"
                                            htmlFor="email"
                                        >
                                            Email address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    {/* Password input */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-1"
                                            htmlFor="password"
                                        >
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="Enter your password"
                                        />
                                    </div>

                                    {/* Remember me checkbox */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded"
                                                type="checkbox"
                                                id="rememberMe"
                                                defaultChecked
                                            />
                                            <label
                                                className="ml-2 text-gray-700"
                                                htmlFor="rememberMe"
                                            >
                                                Remember me
                                            </label>
                                        </div>

                                        {/* Forgot password link */}
                                        <a
                                            href="#!"
                                            className="text-primary hover:text-primary-600 transition duration-150 ease-in-out text-sm"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>

                                    {/* Submit button */}
                                    <div className="mb-4">
                                        <button
                                            type="submit"
                                            className="w-full bg-primary text-white py-2 rounded-lg shadow-md hover:bg-primary-600 transition duration-150 ease-in-out"
                                        >
                                            Sign in
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-xl font-bold mb-4 text-center">
                                    Register
                                </h2>
                                <form>
                                    {/* Name input */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-1"
                                            htmlFor="name"
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="Enter your name"
                                        />
                                    </div>

                                    {/* Email input */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-1"
                                            htmlFor="email"
                                        >
                                            Email address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    {/* Password input */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-1"
                                            htmlFor="password"
                                        >
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="Enter your password"
                                        />
                                    </div>

                                    {/* Submit button */}
                                    <div className="mb-4">
                                        <button
                                            type="submit"
                                            className="w-full bg-gray-700 text-white py-2 rounded-lg shadow-md hover:bg-secondary-600 transition duration-150 ease-in-out"
                                        >
                                            Register
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}