export default function Premium() {
    return (
        <div className="max-w-4xl mx-auto mt-8 p-4">
            <h1 className="text-3xl font-semibold text-center mb-4">Premium Membership</h1>
            <p className="text-center text-lg mb-6">
                Unlock exclusive features and enjoy an ad-free experience with our Premium Membership!
            </p>
            <div className="text-center">
                <button className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
                    Upgrade to Premium
                </button>
            </div>
        </div>
    );
}