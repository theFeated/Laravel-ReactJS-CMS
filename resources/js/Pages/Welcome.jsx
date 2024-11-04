import { Link, Head } from "@inertiajs/react";
import ApplicationLogo from "../Components/ApplicationLogo";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const [footerRef, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });
    return (
        <>
            <Head title="Welcome" />
            <div className="relative min-h-screen overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 animate-gradient-xy"></div>

                {/* Floating particles */}
                <div className="absolute inset-0">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute h-2 w-2 bg-white rounded-full animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                transform: `translateZ(${
                                    Math.random() * 20 - 10
                                }px)`,
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 flex-grow flex flex-col">
                    <div className="container mx-auto px-6 flex-grow">
                        <header className="py-8">
                            <motion.div
                                initial={{ y: -100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                className="flex justify-between items-center"
                            >
                                <motion.div
                                    whileHover={{ rotate: 5, scale: 1.1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                    }}
                                >
                                    <Link href="/">
                                        <ApplicationLogo className="w-20 h-20 fill-current text-white transition-all duration-300" />
                                    </Link>
                                </motion.div>
                                <nav className="space-x-4">
                                    {auth.user ? (
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <Link
                                                href={route("dashboard")}
                                                className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-all duration-300"
                                            >
                                                Dashboard
                                            </Link>
                                        </motion.div>
                                    ) : (
                                        <>
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                className="inline-block"
                                            >
                                                <Link
                                                    href={route("login")}
                                                    className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-all duration-300"
                                                >
                                                    Login
                                                </Link>
                                            </motion.div>
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                className="inline-block"
                                            >
                                                <Link
                                                    href={route("register")}
                                                    className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-opacity-90 transition-all duration-300"
                                                >
                                                    Register
                                                </Link>
                                            </motion.div>
                                        </>
                                    )}
                                </nav>
                            </motion.div>
                        </header>

                        <main className="py-20">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="text-center"
                            >
                                <motion.h1
                                    className="text-6xl font-bold text-white mb-8 leading-tight"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{
                                        duration: 1,
                                        staggerChildren: 0.1,
                                    }}
                                >
                                    {[
                                        "Welcome",
                                        "to",
                                        "the",
                                        "Next",
                                        "Generation",
                                    ].map((word, index) => (
                                        <motion.span
                                            key={index}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: index * 0.1,
                                            }}
                                            className="inline-block mr-3"
                                        >
                                            {word}
                                        </motion.span>
                                    ))}
                                    <motion.span
                                        className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.5,
                                        }}
                                    >
                                        Content Management System
                                    </motion.span>
                                </motion.h1>
                                <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12">
                                    Experience the future of content management
                                    with our innovative platform. Built with
                                    cutting-edge technology for maximum
                                    performance and flexibility.
                                </p>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="inline-block"
                                >
                                    <Link
                                        href={route("register")}
                                        className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded -lg text-white text-lg font-semibold hover:opacity-90 transition-all duration-300"
                                    >
                                        Get Started →
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </main>
                    </div>
                    <motion.footer
                        ref={footerRef}
                        initial={{ opacity: 0, y: 50 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        className="w-full py-8 bg-gradient-to-r from-purple-800 to-indigo-900 text-white/80"
                    >
                        {" "}
                        <div className="container mx-auto px-6">
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <div className="mb-4 md:mb-0">
                                    <p className="text-lg font-semibold">
                                        Created by{" "}
                                        <span className="text-pink-400">
                                            Jean Vergel Dionsay
                                        </span>
                                    </p>
                                    <p className="text-sm">
                                        Design enhanced by{" "}
                                        <span className="text-yellow-400">
                                            Claude AI
                                        </span>
                                    </p>
                                </div>
                                <div className="text-center md:text-right">
                                    <p className="text-sm">
                                        Powered by Laravel v{laravelVersion}{" "}
                                        (PHP v{phpVersion})
                                    </p>
                                    <p className="text-xs mt-1">
                                        © {new Date().getFullYear()} JVPD CMS.
                                        All rights reserved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.footer>
                </div>
            </div>
        </>
    );
}
