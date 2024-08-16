export default function Contact() {
    return (
        <div className="max-w-4xl mx-auto mt-8 p-4">
            <h1 className="text-3xl font-semibold text-center mb-4">Contact Us</h1>
            <p className="text-lg mb-6 text-center">
                We’d love to hear from you! Feel free to reach out with any questions, suggestions, or feedback.
            </p>
            <form className="space-y-4 max-w-md mx-auto">
                <div>
                    <label className="block text-lg font-medium mb-2">Name</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded-lg"
                        placeholder="Your Name"
                    />
                </div>
                <div>
                    <label className="block text-lg font-medium mb-2">Email</label>
                    <input
                        type="email"
                        className="w-full p-2 border rounded-lg"
                        placeholder="Your Email"
                    />
                </div>
                <div>
                    <label className="block text-lg font-medium mb-2">Message</label>
                    <textarea
                        className="w-full p-2 border rounded-lg"
                        rows="5"
                        placeholder="Your Message"
                    ></textarea>
                </div>
                <div className="text-center">
                    <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
                        Send Message
                    </button>
                </div>
            </form>
        </div>
    );
}
