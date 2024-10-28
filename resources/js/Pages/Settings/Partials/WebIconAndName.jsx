import { useState, useRef } from 'react';
import axios from 'axios';
import InstructionModal from '../../../Components/InstructionModal';
import NotificationManager from "../../../Components/Notification/NotificationManager";

export default function WebIconAndName({ initialWebIcon, initialWebName }) {
    const [webIcon, setWebIcon] = useState(null);
    const [webName, setWebName] = useState(initialWebName);
    const [preview, setPreview] = useState(initialWebIcon);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [showInstructions, setShowInstructions] = useState(false);
    const notificationManagerRef = useRef();

    const instructionSteps = [
        {
            title: 'Website Icon',
            description: 'Upload a square image that represents your brand. This will appear as your favicon and app icon.'
        },
        {
            title: 'Image Requirements',
            description: 'Use PNG, JPG, or GIF format, maximum 2MB. Recommended size: 512x512 pixels.'
        },
        {
            title: 'Website Name',
            description: 'Enter your website name that will appear in browser tabs and search results.'
        },
        {
            title: 'Best Practices',
            description: 'Use a clear, recognizable icon and a concise website name for better brand recognition.'
        },
        {
            title: 'After Saving',
            description: 'Changes may take a few minutes to appear across all pages due to caching.'
        }
    ];

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // File size validation (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                setErrors({ web_icon: 'File size must be less than 2MB' });
                notificationManagerRef.current.addNotification(
                    'File size must be less than 2MB',
                    'error'
                );
                return;
            }

            // File type validation including SVG
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
            if (!validTypes.includes(file.type)) {
                setErrors({ web_icon: 'Please upload a valid image file (SVG, PNG, JPG, or GIF)' });
                notificationManagerRef.current.addNotification(
                    'Please upload a valid image file (SVG, PNG, JPG, or GIF)',
                    'error'
                );
                return;
            }

            // Additional SVG validation
            if (file.type === 'image/svg+xml') {
                validateSVG(file).then(isValid => {
                    if (isValid) {
                        setWebIcon(file);
                        setPreview(URL.createObjectURL(file));
                        setErrors({});
                        notificationManagerRef.current.addNotification(
                            'SVG file uploaded successfully',
                            'success'
                        );
                    } else {
                        setErrors({ web_icon: 'Invalid SVG file. Please ensure it contains no malicious content.' });
                        notificationManagerRef.current.addNotification(
                            'Invalid SVG file. Please ensure it contains no malicious content.',
                            'error'
                        );
                    }
                });
            } else {
                setWebIcon(file);
                setPreview(URL.createObjectURL(file));
                setErrors({});
                notificationManagerRef.current.addNotification(
                    'Image file uploaded successfully',
                    'success'
                );
            }
        }
    };

    // SVG validation function
    const validateSVG = async (file) => {
        try {
            const text = await file.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'image/svg+xml');

            // Check for parsing errors
            const parserError = doc.querySelector('parsererror');
            if (parserError) {
                return false;
            }

            // Check for potentially dangerous elements and attributes
            const dangerousElements = ['script', 'iframe', 'object', 'embed', 'base'];
            const dangerousAttributes = ['onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout'];

            // Check for dangerous elements
            const hasDangerousElements = dangerousElements.some(element => 
                doc.getElementsByTagName(element).length > 0
            );

            if (hasDangerousElements) {
                return false;
            }

            // Check for dangerous attributes
            const allElements = doc.getElementsByTagName('*');
            for (const element of allElements) {
                const attributes = element.attributes;
                for (const attr of attributes) {
                    if (dangerousAttributes.some(dangerous => 
                        attr.name.toLowerCase().includes(dangerous)
                    )) {
                        return false;
                    }
                }
            }

            return true;
        } catch (error) {
            console.error('SVG validation error:', error);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        
        if (webIcon) {
            // Additional processing for SVG files
            if (webIcon.type === 'image/svg+xml') {
                try {
                    // Sanitize SVG before upload
                    const sanitizedSVG = await sanitizeSVG(webIcon);
                    formData.append('web_icon', sanitizedSVG);
                } catch (error) {
                    setErrors({ web_icon: 'Error processing SVG file' });
                    notificationManagerRef.current.addNotification(
                        'Error processing SVG file',
                        'error'
                    );
                    setProcessing(false);
                    return;
                }
            } else {
                formData.append('web_icon', webIcon);
            }
        }

        if (webName) formData.append('web_name', webName);

        try {
            const response = await axios.post('/settings/update-web-icon-and-name', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                },
            });
            notificationManagerRef.current.addNotification(
                response.data.message,
                'success'
            );
        } catch (error) {
            const errorMessage = error.response?.data?.errors || { 
                general: 'An unexpected error occurred. Please try again.' 
            };
            setErrors(errorMessage);
            notificationManagerRef.current.addNotification(
                'An unexpected error occurred. Please try again.',
                'error'
            );
        } finally {
            setProcessing(false);
        }
    };

    // SVG sanitization function
    const sanitizeSVG = async (file) => {
        const text = await file.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');

        // Remove potentially dangerous elements and attributes
        const dangerousElements = ['script', 'iframe', 'object', 'embed', 'base'];
        const dangerousAttributes = ['onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout'];

        // Remove dangerous elements
        dangerousElements.forEach(tag => {
            const elements = doc.getElementsByTagName(tag);
            while (elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }
        });

        // Remove dangerous attributes
        const allElements = doc.getElementsByTagName('*');
        for (const element of allElements) {
            for (const attr of [...element.attributes]) {
                if (dangerousAttributes.some(dangerous => 
                    attr.name.toLowerCase().includes(dangerous)
                )) {
                    element.removeAttribute(attr.name);
                }
            }
        }

        // Convert sanitized SVG back to a file
        const serializer = new XMLSerializer();
        const sanitizedSVGString = serializer.serializeToString(doc);
        return new File([sanitizedSVGString], file.name, { type: 'image/svg+xml' });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div>
                <NotificationManager ref={notificationManagerRef} />
            </div>
            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Website Settings
                                </h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Customize your website's appearance and branding
                                </p>
                            </div>
                            <button
                                onClick={() => setShowInstructions(true)}
                                className="text-sm text-blue-500 hover:text-blue-600 transition"
                            >
                                View Guidelines
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Web Icon Section */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Website Icon
                            </label>
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                                        {preview ? (
                                            <img 
                                                src={preview} 
                                                alt="Icon Preview" 
                                                className="h-20 w-20 object-contain"
                                            />
                                        ) : (
                                            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        id="webIcon"
                                        className="hidden"
                                        onChange={handleIconChange}
                                        accept="image/*"
                                        disabled={processing}
                                    />
                                    <label
                                        htmlFor="webIcon"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition"
                                    >
                                        Select New Icon
                                    </label>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Recommended: 400x100 pixels (PNG, JPG, GIF)
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Maximum file size: 2MB
                                    </p>
                                </div>
                            </div>
                            {errors.web_icon && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.web_icon}</p>
                            )}
                        </div>

                        {/* Web Name Section */}
                        <div className="space-y-2">
                            <label htmlFor="webName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Website Name
                            </label>
                            <input
                                type="text"
                                id="webName"
                                className="block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm transition"
                                value={webName}
                                onChange={(e) => setWebName(e.target.value)}
                                disable ={processing}
                                placeholder="Enter website name"
                            />
                            {errors.web_name && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.web_name}</p>
                            )}
                        </div>

                        {/* Messages */}
                        {successMessage && (
                            <div className="p-4 rounded-md bg-green-50 dark:bg-green-900/30">
                                <p className="text-sm text-green-700 dark:text-green-400">{successMessage}</p>
                            </div>
                        )}

                        {errors.general && (
                            <div className="p-4 rounded-md bg-red-50 dark:bg-red-900/30">
                                <p className="text-sm text-red-700 dark:text-red-400">{errors.general}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {processing ? (
                                    <div className="flex items-center space-x-2">
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                        </svg>
                                        <span>Saving changes...</span>
                                    </div>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <InstructionModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Website Settings Guidelines"
                icon={<svg className="w-6 h-6 text-blue-500" />}
                steps={instructionSteps}
            />
        </div>
    );
}