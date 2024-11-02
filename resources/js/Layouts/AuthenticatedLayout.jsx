import { useState, useRef, useEffect } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import Sidebar from "./Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faCog } from "@fortawesome/free-solid-svg-icons";
import NotificationManager from "../Components/Notification/NotificationManager";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import NotificationHistoryModal from "../Components/Notification/NotificationHistoryModal";
import NotificationHistoryManager from "../Components/Notification/NotificationHistoryManager";
import LoadingAnimation from "@/Components/LoadingAnimation";
import LogoutLink from "../Components/LogoutLink";

export default function Authenticated({
    header,
    children,
    initialIsDarkModeEnabled,
    userId,
}) {
    const user = usePage().props.auth.user;
    const { url } = usePage();
    const currentPage = url
        .split("/")
        .pop()
        .replace("-", " ")
        .replace(/^\w/, (c) => c.toUpperCase());
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        const savedState = localStorage.getItem("sidebarState");
        return savedState !== null ? JSON.parse(savedState) : true;
    });

    useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleComplete = () => setLoading(false);

        window.addEventListener("inertia:start", handleStart);
        window.addEventListener("inertia:finish", handleComplete);

        return () => {
            window.removeEventListener("inertia:start", handleStart);
            window.removeEventListener("inertia:finish", handleComplete);
        };
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen((prevState) => {
            const newState = !prevState;
            localStorage.setItem("sidebarState", JSON.stringify(newState));
            return newState;
        });
    };

    const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(
        initialIsDarkModeEnabled
    );
    const [error, setError] = useState("");
    const notificationManagerRef = useRef(null);
    const notificationHistoryManagerRef = useRef(null);

    const { setData, processing } = useForm({
        is_dark_mode_enabled: initialIsDarkModeEnabled,
    });

    const toggleDarkMode = async () => {
        try {
            const newState = !isDarkModeEnabled;
            setData("is_dark_mode_enabled", newState);

            const response = await axios.post("/api/settings", {
                is_dark_mode_enabled: newState,
            });

            setIsDarkModeEnabled(newState);
            setError("");

            // Apply dark mode class to document element
            if (newState) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }

            const message = newState
                ? "Dark mode has been enabled successfully."
                : "Dark mode has been disabled successfully.";

            // Show success notification
            notificationManagerRef.current.addNotification(message, "success");

            // Save notification to history
            if (notificationHistoryManagerRef.current) {
                await notificationHistoryManagerRef.current.saveNotification(
                    message,
                    "success"
                );
            } else {
                console.error("notificationHistoryManagerRef is not available");
            }
        } catch (error) {
            setError("Failed to update dark mode settings. Please try again.");
            console.error("Settings update error:", error);

            const errorMessage =
                "Failed to update dark mode settings. Please try again.";

            // Show error notification
            notificationManagerRef.current.addNotification(
                errorMessage,
                "error"
            );

            // Save error notification to history
            if (notificationHistoryManagerRef.current) {
                await notificationHistoryManagerRef.current.saveNotification(
                    errorMessage,
                    "error"
                );
            } else {
                console.error("notificationHistoryManagerRef is not available");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {loading && <LoadingAnimation />}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div>
                <NotificationManager ref={notificationManagerRef} />
                <NotificationHistoryManager
                    ref={notificationHistoryManagerRef}
                    userId={userId}
                />
            </div>
            <NotificationHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
            />
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center mr-4">
                                <button
                                    className="text-gray-500 w-10 h-10 relative focus:outline-none bg-white dark:bg-gray-800"
                                    onClick={toggleSidebar}
                                >
                                    <span className="sr-only">
                                        Toggle sidebar
                                    </span>
                                    <div className="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <span
                                            aria-hidden="true"
                                            className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
                                                isSidebarOpen
                                                    ? "rotate-45"
                                                    : "-translate-y-1.5"
                                            }`}
                                        ></span>
                                        <span
                                            aria-hidden="true"
                                            className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
                                                isSidebarOpen ? "opacity-0" : ""
                                            }`}
                                        ></span>
                                        <span
                                            aria-hidden="true"
                                            className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
                                                isSidebarOpen
                                                    ? "-rotate-45"
                                                    : "translate-y-1.5"
                                            }`}
                                        ></span>
                                    </div>
                                </button>
                            </div>
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={url} active={true}>
                                    {currentPage}
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="relative">
                                <button
                                    onClick={() => setIsHistoryModalOpen(true)}
                                    className="h-12 w-12 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition"
                                    aria-label="View notification history"
                                >
                                    <svg
                                        className="w-6 h-6 text-gray-500 dark:text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="ms-3 relative">
                                <button
                                    onClick={toggleDarkMode}
                                    disabled={processing}
                                    className="h-12 w-12 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
                                    aria-label="Toggle dark mode"
                                >
                                    <svg
                                        className="fill-violet-700 block dark:hidden"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                                    </svg>
                                    <svg
                                        className="fill-yellow-500 hidden dark:block"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </button>
                            </div>

                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                <img
                                                    src={
                                                        user.userphoto
                                                            ? `/user_photos/${user.userphoto}`
                                                            : "./cms/img/grayprofile.png"
                                                    }
                                                    alt="Profile"
                                                    className="w-8 h-8 rounded-full mr-2"
                                                />
                                                {user.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            <FontAwesomeIcon
                                                icon={faUser}
                                                className="mr-2"
                                            />
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route("settings")}>
                                            <FontAwesomeIcon
                                                icon={faCog}
                                                className="mr-2"
                                            />
                                            Settings
                                        </Dropdown.Link>
                                        <LogoutLink />
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={url} active={true}>
                            {currentPage}
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800 dark:text-gray-200">
                                {user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <div className="flex items-center">
                                <label
                                    htmlFor="toggle-dark-mode"
                                    className="flex items-center cursor-pointer"
                                >
                                    <button
                                        id="toggle-dark-mode"
                                        onClick={toggleDarkMode}
                                        disabled={processing}
                                        className="h-12 w-12 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
                                        aria-label="Toggle dark mode"
                                    >
                                        <svg
                                            className="fill-violet-700 block dark:hidden"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                                        </svg>
                                        <svg
                                            className="fill-yellow-500 hidden dark:block"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </button>
                                    <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                                        {isDarkModeEnabled
                                            ? "Dark Mode"
                                            : "Dark Mode"}
                                    </span>
                                </label>
                            </div>

                            <div className="flex items-center">
                                <label
                                    htmlFor="view-notifications"
                                    className="flex items-center cursor-pointer"
                                >
                                    <button
                                        id="view-notifications"
                                        onClick={() =>
                                            setIsHistoryModalOpen(true)
                                        }
                                        className="h-12 w-12 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition"
                                        aria-label="View notification history"
                                    >
                                        <svg
                                            className="w-6 h-6 text-gray-500 dark:text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                            />
                                        </svg>
                                    </button>
                                    <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                                        Notifications
                                    </span>
                                </label>
                            </div>

                            <ResponsiveNavLink href={route("profile.edit")}>
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="mr-2"
                                />
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route("settings")}>
                                <FontAwesomeIcon
                                    icon={faCog}
                                    className="mr-2"
                                />
                                Settings
                            </ResponsiveNavLink>
                            <LogoutLink />
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
