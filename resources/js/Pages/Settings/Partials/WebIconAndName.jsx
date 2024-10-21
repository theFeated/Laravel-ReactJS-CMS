import { useState } from 'react';
import axios from 'axios';

export default function WebIconAndName({ initialWebIcon, initialWebName }) {
    const [webIcon, setWebIcon] = useState(null);
    const [webName, setWebName] = useState(initialWebName);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

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
            console.log(response.data.message);
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
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900 rounded-lg">

            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Web Icon and Name</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
                Update the web icon and name for your application.
            </p>
            <div className="mb-6">
                <label htmlFor="webIcon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Web Icon
                </label>
                <input
                    type="file"
                    id="webIcon"
                    className="mt-2 block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500"
                    onChange={(e) => setWebIcon(e.target.files[0])}
                    disabled={processing}
                />
                {errors.web_icon && <div className="text-red-500 text-sm mt-2">{errors.web_icon}</div>}
            </div>

            <div className="mb-6">
                <label htmlFor="webName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Web Name
                </label>
                <input
                    type="text"
                    id="webName"
                    className="mt-2 block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500"
                    value={webName}
                    onChange={(e) => setWebName(e.target.value)}
                    disabled={processing}
                />
                {errors.web_name && <div className="text-red-500 text-sm mt-2">{errors.web_name}</div>}
            </div>

            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={processing}
            >
                {processing ? 'Saving...' : 'Save'}
            </button>
        </form>
    );
}
