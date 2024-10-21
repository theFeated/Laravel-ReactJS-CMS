import { useState } from 'react';
import axios from 'axios';

export default function UploadLogo({ initialLogo }) {
    const [logo, setLogo] = useState(null);
    const [preview, setPreview] = useState(initialLogo);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setLogo(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setSuccessMessage('');

        const formData = new FormData();
        formData.append('logo', logo);

        try {
            const response = await axios.post('/settings/upload-logo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccessMessage(response.data.message);
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Error uploading logo', error);
                setErrors({ general: 'An unexpected error occurred. Please try again later.' });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Logo
                </label>
                <div className="flex items-center gap-4 mt-2">
                    {/* Logo Upload Input */}
                    <input
                        type="file"
                        id="logo"
                        className="text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600"
                        onChange={handleLogoChange}
                        disabled={processing}
                    />
                    
                    {/* Preview Image */}
                    {preview && (
                        <img 
                            src={preview} 
                            alt="Logo Preview" 
                            className="h-16 w-auto rounded-md border border-gray-300 shadow-sm dark:border-gray-600"
                        />
                    )}
                </div>

                {/* Display Errors */}
                {errors.logo && (
                    <div className="text-red-500 text-sm mt-2">{errors.logo}</div>
                )}
            </div>

            {errors.general && (
                <div className="text-red-500 text-sm mb-4">{errors.general}</div>
            )}

            {successMessage && (
                <div className="text-green-500 text-sm mb-4">{successMessage}</div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={processing}
            >
                {processing ? (
                    <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Uploading...
                    </div>
                ) : (
                    'Upload Logo'
                )}
            </button>
        </form>
    );
}
