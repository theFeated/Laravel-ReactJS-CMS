import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useState } from 'react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const { data: photoData, setData: setPhotoData, post: postPhoto, errors: photoErrors, processing: photoProcessing, recentlySuccessful: photoRecentlySuccessful } = useForm({
        userphoto: null,
    });

    const [photoPreview, setPhotoPreview] = useState(user.userphoto ? `/user_photos/${user.userphoto}` : null);

    const submitProfile = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const submitPhoto = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        if (photoData.userphoto) {
            formData.append('userphoto', photoData.userphoto);
        }
    
        postPhoto(route('profile.updatePhoto'), {
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onSuccess: () => {
                setPhotoPreview(URL.createObjectURL(photoData.userphoto));
            },
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setPhotoData('userphoto', file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPhotoPreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Profile Information</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Update your account's profile information and email address.
                </p>
            </header>

            <div className="mt-6 flex flex-col md:flex-row space-x-0 md:space-x-6">
                <div className="flex-shrink-0 flex items-start gap-4 mb-6 md:mb-0">
                    {photoPreview && (
                        <img src={photoPreview} alt="Profile Preview" className="w-32 h-32 rounded-full" />
                    )}

                    <form onSubmit={submitPhoto} encType="multipart/form-data" className="flex flex-col items-start">
                        <InputLabel htmlFor="userphoto" value="Profile Photo" />
                        <InputError className="mt-2" message={photoErrors.userphoto} />

                        <input
                            id="userphoto"
                            type="file"
                            className="mt-4 block text-sm text-gray-500 dark:text-gray-300 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            onChange={handlePhotoChange}
                        />
                        <PrimaryButton disabled={photoProcessing} className="mt-4">Save Photo</PrimaryButton>

                        <Transition
                            show={photoRecentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-gray-600 dark:text-gray-400">Photo Saved.</p>
                        </Transition>
                    </form>
                </div>

                <div className="flex-grow">
                    <form onSubmit={submitProfile} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                className="mt-1 block w-60"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                isFocused
                                autoComplete="name"
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-60"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                            />
                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && user.email_verified_at === null && (
                            <div>
                                <p className="text-sm mt-2 text-gray-800 dark:text-gray-200">
                                    Your email address is unverified.
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                                    >
                                        Click here to re-send the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 font-medium text-sm text-green-600 dark:text-green-400">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <PrimaryButton disabled={processing}>Save</PrimaryButton>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
