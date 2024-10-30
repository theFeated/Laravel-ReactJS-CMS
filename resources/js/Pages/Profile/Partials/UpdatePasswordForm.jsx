import { useRef } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import NotificationManager from "../../../Components/Notification/NotificationManager";
import NotificationHistoryManager from '../../../Components/Notification/NotificationHistoryManager';

export default function UpdatePasswordForm({ className = '', userId }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    const notificationManagerRef = useRef();
    const notificationHistoryManagerRef = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = async (e) => {
        e.preventDefault();

        try {
            await put(route('password.update'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    const message = 'Password updated successfully.';
                    notificationManagerRef.current.addNotification(message, 'success');
                    if (notificationHistoryManagerRef.current) {
                        notificationHistoryManagerRef.current.saveNotification(message, 'success', userId);
                    } else {
                        console.error('notificationHistoryManagerRef is not available');
                    }
                },
                onError: (errors) => {
                    if (errors.password) {
                        reset('password', 'password_confirmation');
                        passwordInput.current.focus();
                    }

                    if (errors.current_password) {
                        reset('current_password');
                        currentPasswordInput.current.focus();
                    }
                },
            });
        } catch (error) {
            const errorMessage = 'Failed to update password. Please try again.';
            notificationManagerRef.current.addNotification(errorMessage, 'error');
            if (notificationHistoryManagerRef.current) {
                await notificationHistoryManagerRef.current.saveNotification(errorMessage, 'error', userId);
            } else {
                console.error('notificationHistoryManagerRef is not available');
            }
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Update Password</h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </header>
            <div>
                <NotificationManager ref={notificationManagerRef} />
                <NotificationHistoryManager ref={notificationHistoryManagerRef} userId={userId} />
            </div>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="current_password" value="Current Password" />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                    />

                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="New Password" />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

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
        </section>
    );
}