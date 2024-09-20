import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                <div className="relative min-h-screen flex flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="flex flex-col items-center gap-6 py-10">
                            <div className="flex justify-center">
                                <img
                                    src="/cms/img/j.png"
                                    alt="Logo"
                                    className="h-12 w-auto lg:h-16"
                                />
                            </div>
                            <nav className="flex flex-row items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="flex items-center rounded-md px-3 py-2 text-gray-800 ring-1 ring-transparent transition hover:text-gray-600 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-gray-200 dark:hover:text-gray-400 dark:focus-visible:ring-gray-200"
                                    >
                                        <i className="fas fa-tachometer-alt mr-2"></i>
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="flex items-center rounded-md px-3 py-2 text-gray-800 ring-1 ring-transparent transition hover:text-gray-600 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-gray-200 dark:hover:text-gray-400 dark:focus-visible:ring-gray-200"
                                        >
                                            <i className="fas fa-sign-in-alt mr-2"></i>
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="flex items-center rounded-md px-3 py-2 text-gray-800 ring-1 ring-transparent transition hover:text-gray-600 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-gray-200 dark:hover:text-gray-400 dark:focus-visible:ring-gray-200"
                                        >
                                            <i className="fas fa-user-plus mr-2"></i>
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <footer className="py-16 text-center text-sm text-gray-800 dark:text-gray-400">
                            Laravel v{laravelVersion} (PHP v{phpVersion})
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}