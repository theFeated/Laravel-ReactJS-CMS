// modal appear even when logged out. fix it later.

document.addEventListener('DOMContentLoaded', function () {
    if (!window.isAuthenticated) {
        return;
    }

    const modalHTML = `
        <div id="logoutModal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded shadow-lg">
                <h2 class="text-xl font-bold mb-4">Session Expired</h2>
                <p>You have been logged out due to inactivity.</p>
                <button id="closeModal" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Close</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    let inactivityTimeout = 5 * 1000; // Set your inactivity timeout in milliseconds
    let lastActivityTime = Date.now();

    function resetTimer() {
        lastActivityTime = Date.now();
    }

    function checkInactivity() {
        if (Date.now() - lastActivityTime > inactivityTimeout) {
            document.getElementById('logoutModal').classList.remove('hidden');
            document.body.classList.add('overflow-hidden'); // Prevent background scrolling
        }
    }

    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('keypress', resetTimer);

    setInterval(checkInactivity, 1000); // Check every second

    document.getElementById('closeModal').addEventListener('click', function () {
        document.getElementById('logoutModal').classList.add('hidden');
        document.body.classList.remove('overflow-hidden'); // Re-enable background scrolling
        location.reload(); // Refresh the page
    });
});