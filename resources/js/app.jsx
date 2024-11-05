import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import axios from 'axios';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const defaultLogo = '/cms/img/j.png';

// List of auth-related routes that should be excluded from custom settings
const authRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
];

const isAuthPage = () => {
    const path = window.location.pathname;
    return authRoutes.some(route => path.startsWith(route));
};

const fetchSettings = async () => {
    // If it's an auth page, return default settings
    if (isAuthPage()) {
        return {
            web_name: appName,
            web_icon: defaultLogo,
            is_dark_mode_enabled: false,
        };
    }

    try {
        const response = await axios.get('/api/settings');
        return response.data;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return {
            web_name: appName,
            web_icon: defaultLogo,
            is_dark_mode_enabled: false,
        };
    }
};

const updateDocument = (settings) => {
    // For auth pages, use default title and icon
    if (isAuthPage()) {
        document.title = appName;
        // Reset favicon to default if needed
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = defaultLogo; // Your default favicon path
        // Ensure dark mode is disabled on auth pages
        document.documentElement.classList.remove('dark');
        return;
    }

    // For non-auth pages, apply custom settings
    document.title = settings.web_name || appName;

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = settings.web_icon || defaultLogo;

    if (settings.is_dark_mode_enabled) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

fetchSettings().then((settings) => {
    createInertiaApp({
        title: (title) => {
            if (isAuthPage()) {
                return `${title} - ${appName}`;
            }
            return `${title} - ${settings.web_name || appName}`;
        },
        resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
        setup({ el, App, props }) {
            const root = createRoot(el);

            // Update document before rendering
            updateDocument(settings);
            root.render(<App {...props} />);
        },
        progress: {
            color: '#4B5563',
        },
    });
});