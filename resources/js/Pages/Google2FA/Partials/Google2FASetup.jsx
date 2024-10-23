import React, { useState } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';

export default function Google2FASetup() {
    const [secret, setSecret] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    const handleGenerateQRCode = () => {
        axios.get('/setup-2fa')
            .then(response => {
                const secretKey = response.data.secret;
                const issuer = 'Overkill Security';
                const email = response.data.email;
                const qrCodeUrl = `otpauth://totp/${issuer}:${email}?secret=${secretKey}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
                setQrCodeUrl(qrCodeUrl);
                setSecret(secretKey);
            })
            .catch(error => {
                console.error('Error fetching QR code:', error);
            });
    };

    const handleCompleteSetup = () => {
        axios.post('/complete-2fa-setup')
            .then(() => {
                window.location.href = '/verify-2fa';
            })
            .catch(error => {
                console.error('Error completing 2FA setup:', error);
            });
    };

    useState(() => {
        handleGenerateQRCode();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Set up Google Authenticator</h2>
                <p className="mb-4">Please scan the barcode below. Alternatively, you can use the code <strong>{secret}</strong></p>
                <div className="mb-4" style={{ background: 'white', padding: '16px' }}>
                    {qrCodeUrl ? (
                        <QRCode title="Google Authenticator" value={qrCodeUrl} size={256} />
                    ) : (
                        <p>Loading QR code...</p>
                    )}
                </div>
                <p className="mb-4">You need to set up your Google Authenticator app before continuing. You will be unable to login otherwise.</p>
                <button
                    onClick={handleCompleteSetup}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Complete Setup
                </button>
            </div>
        </div>
    );
}