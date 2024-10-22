import { useState } from 'react';
import axios from 'axios';

export default function WebIconAndName({ initialWebIcon, initialWebName }) {
    const [webIcon, setWebIcon] = useState(null);
    const [webName, setWebName] = useState(initialWebName);
    const [preview, setPreview] = useState(initialWebIcon);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        setWebIcon(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setSuccessMessage('');

        const formData = new FormData();
        if (webIcon) {
            formData.append('web_icon', webIcon);
        }
        formData.append('web_name', webName);

        try {
            const response = await axios.post('/settings/update-web-icon-and-name', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccessMessage(response.data.message);
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error('There was an error updating the settings', error);
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8 rounded-lg">
            <div className="mb-6">
                <label htmlFor="webIcon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Web Icon
                </label>
                <div className="flex items-center gap-4 mt-2">
                    <input
                        type="file"
                        id="webIcon"
                        className="text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600"
                        onChange={handleIconChange}
                        disabled={processing}
                    />
                     {preview && (
                        <img 
                            src={preview} 
                            alt="Logo Preview" 
                            className="h-16 w-auto rounded-md border border-gray-300 shadow-sm dark:border-gray-600"
                        />
                    )}
                </div>
                {errors.web_icon && <div className="text-red-500 text-sm mt-2">{errors.web_icon}</div>}
            </div>

            <div className="mb-6">
                <label htmlFor="webName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Web Name
                </label>
                <input
                    type="text"
                    id="webName"
                    className="mt-2 block w-full sm:w-[19rem] px-3 py-2 text-sm text-gray-900 bg-gray-50 border 
                    border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 
                    dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500"
                    value={webName}
                    onChange={(e) => setWebName(e.target.value)}
                    disabled={processing}
                />
                {errors.web_name && <div className="text-red-500 text-sm mt-2">{errors.web_name}</div>}
            </div>

            {errors.general && (
                <div className="text-red-500 text-sm mb-4">{errors.general}</div>
            )}

            {successMessage && (
                <div className="text-green-500 text-sm mb-4">{successMessage}</div>
            )}
            
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
                        Saving...
                    </div>
                ) : (
                    'Save'
                )}
            </button>
        </form>
    );
}