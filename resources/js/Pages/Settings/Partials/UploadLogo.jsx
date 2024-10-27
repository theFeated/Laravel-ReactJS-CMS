import { useState, useRef } from 'react';
import axios from 'axios';
import InstructionModal from '../../../Components/InstructionModal';
import NotificationManager from '@/Components/NotificationManager';


export default function UploadLogo({ initialLogo }) {
    const [logo, setLogo] = useState(null);
    const [preview, setPreview] = useState(initialLogo);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [showInstructions, setShowInstructions] = useState(false);
    const notificationManagerRef = useRef();

    const instructionSteps = [
        {
            title: 'Logo Requirements',
            description: 'Upload a high-quality image in PNG, JPG, or GIF format, maximum 2MB size.'
        },
        {
            title: 'Recommended Dimensions',
            description: 'For best results, use an image that is 400x100 pixels or maintains a similar aspect ratio.'
        },
        {
            title: 'File Format Tips',
            description: 'PNG format is recommended for logos with transparency. Use JPG for photos or complex images.'
        },
        {
            title: 'Design Guidelines',
            description: 'Ensure your logo is clear and readable when displayed in different sizes.'
        },
        {
            title: 'After Upload',
            description: 'Your new logo will be automatically optimized and may take a few minutes to appear across all pages.'
        }
    ];

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // File size validation (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                setErrors({ logo: 'File size must be less than 2MB' });
                notificationManagerRef.current.addNotification(
                    'File size must be less than 2MB',
                    'error'
                );
                return;
            }

            // File type validation including SVG
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
            if (!validTypes.includes(file.type)) {
                setErrors({ logo: 'Please upload a valid image file (SVG, PNG, JPG, or GIF)' });
                notificationManagerRef.current.addNotification(
                    'Please upload a valid image file (SVG, PNG, JPG, or GIF)',
                    'error'
                );
                return;
            }

            // SVG-specific validation
            if (file.type === 'image/svg+xml') {
                validateSVGFile(file).then(result => {
                    if (result.isValid) {
                        setLogo(file);
                        setPreview(URL.createObjectURL(file));
                        setErrors({});
                        notificationManagerRef.current.addNotification(
                            'SVG file uploaded successfully',
                            'success'
                        );
                    } else {
                        setErrors({ logo: result.error });
                        notificationManagerRef.current.addNotification(
                            result.error,
                            'error'
                        );
                    }
                });
            } else {
                // Handle other image types
                validateImageDimensions(file).then(result => {
                    if (result.isValid) {
                        setLogo(file);
                        setPreview(URL.createObjectURL(file));
                        setErrors({});
                        notificationManagerRef.current.addNotification(
                            'Image file uploaded successfully',
                            'success'
                        );
                    } else {
                        setErrors({ logo: result.error });
                        notificationManagerRef.current.addNotification(
                            result.error,
                            'error'
                        );
                    }
                });
            }
        }
    };

    // Validate SVG file
    const validateSVGFile = async (file) => {
        try {
            const text = await file.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'image/svg+xml');

            // Check for parsing errors
            const parserError = doc.querySelector('parsererror');
            if (parserError) {
                return { 
                    isValid: false, 
                    error: 'Invalid SVG file format' 
                };
            }

            // Check for potentially dangerous elements and attributes
            const dangerousElements = ['script', 'iframe', 'object', 'embed', 'base'];
            const dangerousAttributes = ['onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout'];

            // Check for dangerous elements
            const hasDangerousElements = dangerousElements.some(element => 
                doc.getElementsByTagName(element).length > 0
            );

            if (hasDangerousElements) {
                return { 
                    isValid: false, 
                    error: 'SVG contains potentially harmful elements' 
                };
            }

            // Check for dangerous attributes
            const allElements = doc.getElementsByTagName('*');
            for (const element of allElements) {
                for (const attr of element.attributes) {
                    if (dangerousAttributes.some(dangerous => 
                        attr.name.toLowerCase().includes(dangerous)
                    )) {
                        return { 
                            isValid: false, 
                            error: 'SVG contains potentially harmful attributes' 
                        };
                    }
                }
            }

            return { isValid: true };
        } catch (error) {
            console.error('SVG validation error:', error);
            return { 
                isValid: false, 
                error: 'Error validating SVG file' 
            };
        }
    };

    // Validate image dimensions
    const validateImageDimensions = async (file) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(img.src);
                const maxDimension = 2000; // Maximum allowed dimension
                const minDimension = 50;   // Minimum allowed dimension

                if (img.width > maxDimension || img.height > maxDimension) {
                    resolve({ 
                        isValid: false, 
                        error: `Image dimensions must be less than ${maxDimension}x${maxDimension} pixels` 
                    });
                } else if (img.width < minDimension || img.height < minDimension) {
                    resolve({ 
                        isValid: false, 
                        error: `Image dimensions must be at least ${minDimension}x${minDimension} pixels` 
                    });
                } else {
                    resolve({ isValid: true });
                }
            };
            img.onerror = () => {
                URL.revokeObjectURL(img.src);
                resolve({ 
                    isValid: false, 
                    error: 'Error loading image file' 
                });
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!logo) {
            setErrors({ logo: 'Please select a logo to upload' });
            notificationManagerRef.current.addNotification(
                'Please select a logo to upload',
                'error'
            );
            return;
        }

        setProcessing(true);
        setErrors({});

        const formData = new FormData();

        try {
            // Process SVG files before upload
            if (logo.type === 'image/svg+xml') {
                const sanitizedSVG = await sanitizeSVGFile(logo);
                formData.append('logo', sanitizedSVG);
            } else {
                formData.append('logo', logo);
            }

            const response = await axios.post('/settings/upload-logo', formData, {
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
                general: 'Failed to upload logo. Please try again.' 
            };
            setErrors(errorMessage);
            notificationManagerRef.current.addNotification(
                'Failed to upload logo. Please try again.',
                'error'
            );
        } finally {
            setProcessing(false);
        }
    };

    // Sanitize SVG file
    const sanitizeSVGFile = async (file) => {
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

        // Convert back to file
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
                                    Upload Your Logo
                                </h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Customize your website's branding with a professional logo
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
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Logo Image
                            </label>
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                                        {preview ? (
                                            <img 
                                                src={preview} 
                                                alt="Logo Preview" 
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
                                        id="logo"
                                        className="hidden"
                                        onChange={handleLogoChange}
                                        accept="image/*"
                                        disabled={processing}
                                    />
                                    <label
                                        htmlFor="logo"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition"
                                    >
                                        Select New Logo
                                    </label>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Recommended: 400x100 pixels (PNG, JPG, GIF)
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Maximum file size: 2MB
                                    </p>
                                </div>
                            </div>
                            {errors.logo && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-2">{errors.logo}</p>
                            )}
                        </div>

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
                                        <span>Uploading...</span>
                                    </div>
                                ) : (
                                    'Upload Logo'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <InstructionModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Logo Upload Guidelines"
                icon={<svg className="w-6 h-6 text-blue-500" />}
                steps={instructionSteps}
            />
        </div>
    );
}