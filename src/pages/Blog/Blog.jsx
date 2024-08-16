export default function Blog() {
    return (
        <div className="max-w-4xl mx-auto mt-8 p-4">
            <h1 className="text-3xl font-semibold text-center mb-4">Blog</h1>
            <p className="text-lg mb-6 text-center">
                Stay updated with our latest news, updates, and stories from our community.
            </p>
            <div className="space-y-6">
                <article className="p-4 bg-white shadow-md rounded-lg">
                    <h2 className="text-2xl font-bold">How to Make the Most of Your Karaoke Experience</h2>
                    <p className="mt-2 text-gray-600">Discover tips and tricks to enhance your karaoke sessions...</p>
                </article>
                <article className="p-4 bg-white shadow-md rounded-lg">
                    <h2 className="text-2xl font-bold">Top 10 Karaoke Songs of the Month</h2>
                    <p className="mt-2 text-gray-600">Here are the most popular songs sung by our community this month...</p>
                </article>
            </div>
        </div>
    );
}