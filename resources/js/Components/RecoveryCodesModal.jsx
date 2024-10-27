import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCopy, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

export default function RecoveryCodesModal({ isOpen, onClose }) {
    const [code, setCode] = useState('');
    const [isCodeCopied, setIsCodeCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recoveryCode, setRecoveryCode] = useState('');
    const [verificationError, setVerificationError] = useState('');

    const fetchCode = async () => {
        try {
            const response = await axios.get('/api/recovery-codes');
            setCode(response.data.code.code);
            setIsCodeCopied(response.data.code.is_code_copied);
            setError('');
        } catch (error) {
            setError('Failed to fetch recovery code');
        }
    };

    const generateCode = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/recovery-codes/generate');
            setCode(response.data.code);
            setIsCodeCopied(false);
            setError('');
        } catch (error) {
            setError('Failed to generate recovery code');
        } finally {
            setLoading(false);
        }
    };

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setIsCodeCopied(true);

            // Update the server to mark the code as copied
            await axios.post('/api/recovery-codes/mark-copied', { code });
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    const verifyRecoveryCode = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/recovery-codes/verify', { 
                recovery_code: recoveryCode 
            });
            if (response.data.success) {
                onClose();
            } else {
                setVerificationError('Invalid recovery code');
            }
        } catch (error) {
            setVerificationError('Failed to verify recovery code');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchCode();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-sm p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Recovery Code
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

                {!isCodeCopied ? (
                    <div className="mb-4">
                        <div className="flex justify-end space-x-2 mb-2">
                            <FontAwesomeIcon 
                                icon={faCopy} 
                                className="text-gray-500 hover:text-blue-500 cursor-pointer" 
                                onClick={copyCode} 
                            />
                            <FontAwesomeIcon 
                                icon={faSyncAlt} 
                                className="text-gray-500 hover:text-green-500 cursor-pointer" 
                                onClick={generateCode} 
                            />
                        </div>
                        <textarea
                            readOnly
                            value={code}
                            className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded font-mono text-sm"
                            rows={4}
                        />
                    </div>
                ) : (
                    <div className="mb-4 text-gray-600 dark:text-gray-300">
                        The recovery code has been copied and will not be displayed again.
                    </div>
                )}

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Copy and save this recovery code in a secure location. It can only be used once.
                </p>

                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Enter the recovery code to verify your account
                    </p>

                    <input
                        type="text"
                        value={recoveryCode}
                        onChange={(e) => setRecoveryCode(e.target.value)}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    />

                    {verificationError && (
                        <div className="text-red-500 text-sm">{verificationError}</div>
                    )}

                    <button
                        onClick={verifyRecoveryCode}
                        className="w-full p-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                    >
                        Verify
                    </button>
                </div>
            </div>
        </div>
    );
}