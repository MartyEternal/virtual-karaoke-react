import { useState } from "react";
import { searchKaraokeVideos } from "../../utilities/youtube-api";

export default function SongSearchUI() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    async function handleSearch(evt) {
        evt.preventDefault();
        const videos = await searchKaraokeVideos(query);
        setResults(videos);
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-4 shadow-lg rounded-lg bg-white">
            <h2 className="text-xl font-semibold mb-4">Search Karaoke Songs</h2>
            <form onSubmit={handleSearch}>
                <div className="mb-4">
                    <input
                        type="text"
                        value={query}
                        onChange={(evt) => setQuery(evt.target.value)}
                        placeholder="Enter song or artist"
                        required
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
                >
                    Search
                </button>
            </form>
            <div className="mt-4">
                {results.length > 0 ? (
                    <ul>
                        {results.map((video) => (
                            <li key={video.id.videoId} className="mb-2">
                                <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
                                    {video.snippet.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No results found</p>
                )}
            </div>
        </div>
    );
}