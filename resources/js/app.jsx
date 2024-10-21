import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import axios from 'axios';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const fetchSettings = async () => {
    try {
        const response = await axios.get('/api/settings');
        return response.data;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return {
            web_name: appName,
            web_icon: null,
        };
    }
};

const updateDocument = (settings) => {
    document.title = settings.web_name || appName;

    if (settings.web_icon) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = settings.web_icon;  // Update icon with full URL
    }
};

fetchSettings().then((settings) => {
    updateDocument(settings);

    createInertiaApp({
        title: (title) => `${title} - ${settings.web_name || appName}`,
        resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
        setup({ el, App, props }) {
            const root = createRoot(el);

            root.render(<App {...props} />);
        },
        progress: {
            color: '#4B5563',
        },
    });
});
