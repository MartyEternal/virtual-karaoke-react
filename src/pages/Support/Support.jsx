export default function Support() {
    return (
        <div className="max-w-4xl mx-auto mt-8 p-4">
            <h1 className="text-3xl font-semibold text-center mb-4">Support</h1>
            <p className="text-lg mb-6 text-center">
                Need help? Our support team is here for you! Reach out to us through any of the following methods.
            </p>
            <ul className="list-disc list-inside mb-6">
                <li>Email: <a href="mailto:support@virtualkaraoke.com" className="text-blue-500">support@virtualkaraoke.com</a></li>
                <li>Phone: 131 888</li>
                <li>Live Chat: Available 24/7</li>
            </ul>
            <div className="text-center">
                <button className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
                    Start Live Chat
                </button>
            </div>
        </div>
    );
}