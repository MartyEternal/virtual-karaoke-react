import NavBar from "../NavBar/NavBar";
import { Link } from "react-router-dom";

export default function Header({ user, setUser }) {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <span id="logo" className="text-2xl font-bold text-gray-900">
                    <img src="/K-APP.png" alt="Logo Here" className="w-24" />
                </span>
                <NavBar user={user} setUser={setUser} />
                <div className="flex justify-center">
                    {user ? (
                        <Link to="/" className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">
                            SING NOW
                        </Link>
                    ) : (
                        <Link to="/authpage" className="text-blue-500 hover:text-blue-600">
                            LOGIN
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
