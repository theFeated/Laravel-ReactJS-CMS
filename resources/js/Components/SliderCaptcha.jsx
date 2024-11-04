import React, { useEffect, useRef, useState } from "react";

const SliderCaptcha = ({ onSuccess, isOpen, onClose }) => {
    const captchaInstance = useRef(null);
    const captchaInitialized = useRef(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const cssLoaded = useRef(false);

    useEffect(() => {
        if (isOpen) {
            // Load the CSS file only if it hasn't been loaded
            if (!cssLoaded.current) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = '../cms/css/slider-captcha.css';
                document.head.appendChild(link);
                cssLoaded.current = true; // Mark CSS as loaded
            }

            // Load the script only if it hasn't been loaded
            if (!scriptLoaded) {
                const script = document.createElement('script');
                script.src = "../cms/js/slider-captcha.js";
                script.async = true;
                script.onload = () => setScriptLoaded(true);
                document.body.appendChild(script);
            }
        }

        // Cleanup function to remove the script and CSS
        return () => {
            if (isOpen) {
                const existingCaptcha = document.getElementById('captcha');
                if (existingCaptcha) {
                    existingCaptcha.innerHTML = ''; // Clear the captcha
                }
                captchaInitialized.current = false; // Reset initialization flag
            }
        };
    }, [isOpen, scriptLoaded]);

    useEffect(() => {
        const cleanup = () => {
            if (captchaInstance.current) {
                captchaInstance.current = null;
            }

            const existingCaptcha = document.getElementById('captcha');
            if (existingCaptcha) {
                existingCaptcha.innerHTML = '';
            }
        };

        if (isOpen && scriptLoaded && !captchaInitialized.current) {
            if (window.sliderCaptcha) {
                captchaInstance.current = window.sliderCaptcha({
                    id: 'captcha',
                    loadingText: 'Loading...',
                    failedText: 'Try again',
                    barText: 'Slide right to fill',
                    repeatIcon: 'fa fa-redo',
                    onSuccess: function () {
                        setTimeout(() => {
                            if (onSuccess) {
                                onSuccess();
                                cleanup();
                            }
                        }, 1000);
                    },
                });
                captchaInitialized.current = true;
            } else {
                console.error('sliderCaptcha is not available');
            }
        }

        return cleanup;
    }, [isOpen, onSuccess, scriptLoaded]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
            <div className="flex items-center justify-center min-h-screen">
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-md-4 mb-5">
                            <div className="sc-slidercaptcha card">
                                <div className="card-header">
                                    <span>Please complete security verification!</span>
                                </div>
                                <div className="card-body">
                                    <div id="captcha"></div>
                                </div>
                                <div className="card-footer">
                                    <button
                                        onClick={() => {
                                            onClose();
                                            captchaInitialized.current = false;
                                        }}
                                        className="btn btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SliderCaptcha;