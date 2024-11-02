import React, { useState } from 'react';
import LoadingAnimation from '@/Components/LoadingAnimation';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const LogoutLink = () => {
    const [loading, setLoading] = useState(false);

    const handleLogout = async (e) => {
        e.preventDefault(); // Prevent the default link behavior
        setLoading(true); // Start loading animation

        try {
            // Perform the logout request
            const response = await fetch(route('logout'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content, 
                },
            });

            if (response.ok) {
                // Redirect to the login page after logout
                window.location.href = '/login';
            } else {
                // Handle error response
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            // Stop loading animation regardless of success or failure
            // Note: Do not set loading to false here to keep the loading animation visible
        }
    };

    return (
        <>
            {loading && <LoadingAnimation shouldRefresh={true} />} {/* Always show loading animation if loading is true */}
            <div className={loading ? 'invisible' : ''}> {/* Hide the buttons if loading */}
                {/* Mobile View */}
                <div className="block md:hidden">
                    <ResponsiveNavLink
                        method="post"
                        href={route('logout')}
                        as="button"
                        onClick={handleLogout}
                        disabled={loading} // Disable while loading
                        className={`transition-opacity duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                        Log Out
                    </ResponsiveNavLink>
                </div>

                {/* Desktop View */}
                <div className="hidden md:flex">
                    <Dropdown.Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        onClick={handleLogout}
                        disabled={loading} // Disable while loading
                        className={`flex items-center transition-opacity duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                        Log Out
                    </Dropdown.Link>
                </div>
            </div>
        </>
    );
};

export default LogoutLink;