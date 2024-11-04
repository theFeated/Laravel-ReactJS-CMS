import { motion } from 'framer-motion';

const GoogleAuth = () => {
    return (
        <div className="mt-6">
            <motion.a
                href="/auth/google/redirect"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
            >
                <img
                    className="h-5 w-5 mr-2"
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google logo"
                />
                Google
            </motion.a>
        </div>
    );
};

export default GoogleAuth;