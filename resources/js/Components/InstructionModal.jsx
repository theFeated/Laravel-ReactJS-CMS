export default function InstructionModal({ isOpen, onClose, title, icon, steps }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
                
                <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            {icon}
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                                {title}
                            </h2>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6">
                        {steps.map((step, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        {step.title}
                                    </h3>
                                    <p className="mt-1 text-gray-500 dark:text-gray-300">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}