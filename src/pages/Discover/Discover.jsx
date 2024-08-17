import { Link } from "react-router-dom";

export default function Discover() {
    return (
        <div className="max-w-4xl mx-auto mt-8 p-4">
            <h1 className="text-3xl font-semibold mb-4 text-center">Welcome to Karaoke App!</h1>
            <p className="text-lg text-gray-700 mb-6">
                K-APP is your ultimate online destination for singing and having fun with friends or fellow karaoke enthusiasts! Whether you're looking to host a private session or join a public room, we've got you covered. Here, you can create or join karaoke sessions, search for your favorite karaoke songs from YouTube, and sing your heart out in a live virtual room.
            </p>
            <p className="text-lg text-gray-700 mb-6">
                Explore various features such as creating your own playlist, managing your karaoke room, and interacting with other users. Our platform is designed to bring the joy of karaoke to your screen, allowing you to enjoy singing, no matter where you are.
            </p>
            <p className="text-lg text-gray-700 mb-6">
                Ready to get started? Simply sign up, create or join a room, and let the music take over. Happy singing!
            </p>
            <p className="text-center">
                <Link to="/karaoke"
                    className="inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
                >
                    Start Singing
                </Link>
            </p>
        </div>
    );
}