import './bootstrap';
import '../css/app.css';
import '/public/cms/css/style.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';

function loadScript(src) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.body.appendChild(script);
}

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
    return pages[`./Pages/${name}.jsx`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <AppWrapper>
        <App {...props} />
      </AppWrapper>
    );
  },
});

function AppWrapper({ children }) {
  useEffect(() => {
    loadScript('/cms/js/scripts.js');
  }, []);

  return children;
}