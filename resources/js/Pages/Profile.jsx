import React, { useState } from 'react';

const Profile = () => {
    const [showUserInfo, setShowUserInfo] = useState(true);
    const [showChangePassword, setShowChangePassword] = useState(false);

    const handleUserInfoClick = () => {
        setShowUserInfo(true);
        setShowChangePassword(false);
    };

    const handleChangePasswordClick = () => {
        setShowUserInfo(false);
        setShowChangePassword(true);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">Profile</h3>
                <a href="/" className="btn btn-primary">Back</a>
            </div>
            <hr className="mb-6" />

            <form method="POST" action="/profile/save" encType="multipart/form-data">
                <div className="flex flex-wrap -mx-3">
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <div className="bg-white shadow-md rounded-lg p-6 text-center">
                            <img className="w-32 h-32 rounded-full mx-auto mb-4" src="cms/img/user.svg" alt="User" />
                            <div className="flex justify-center space-x-4">
                                <label htmlFor="profile_image" className="btn btn-primary">Change Image</label>
                                <input type="file" id="profile_image" name="profile_image" className="hidden" />
                                <button id="btn" className="btn btn-primary" type="submit">Save Profile</button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-2/3 px-3">
                        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                            <div className="flex space-x-4 mb-4">
                                <button type="button" className={`btn ${showUserInfo ? 'btn-primary' : 'btn-outline-primary'}`} onClick={handleUserInfoClick}>User Info</button>
                                <button type="button" className={`btn ${showChangePassword ? 'btn-primary' : 'btn-outline-primary'}`} onClick={handleChangePasswordClick}>Change Password</button>
                            </div>
                            {showUserInfo && (
                                <div id="userInfo">
                                    <h4 className="text-xl font-semibold mb-4">User Info</h4>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Name</label>
                                        <input type="text" name="name" className="form-input mt-1 block w-full" placeholder="Enter your name" defaultValue="User Name" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Email</label>
                                        <input type="text" name="email" className="form-input mt-1 block w-full" placeholder="Email" defaultValue="User Email" />
                                    </div>
                                </div>
                            )}
                            {showChangePassword && (
                                <div id="changePassword">
                                    <h4 className="text-xl font-semibold mb-4">Change Password</h4>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Old Password</label>
                                        <input type="password" name="old_password" className="form-input mt-1 block w-full" placeholder="Enter your old password" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">New Password</label>
                                        <input type="password" name="password" className="form-input mt-1 block w-full" placeholder="Enter your new password" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Confirm New Password</label>
                                        <input type="password" name="password_confirmation" className="form-input mt-1 block w-full" placeholder="Confirm your new password" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Profile;