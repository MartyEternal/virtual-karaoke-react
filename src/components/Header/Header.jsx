import NavBar from "../NavBar/NavBar"
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header({user, setUser}) {
    const [loggedIn, setLoggedIn] = useState(true); // need to figure out getUser()

    return (
        <div>
            <span id="logo">
                LOGO HERE
            </span>
            <NavBar user={user} setUser={setUser} />
            <span id="right-button">
            {loggedIn ? <Link to="/karaoke">SING NOW</Link> : <Link to="/AuthPage">LOGIN</Link>}
            </span>
        </div>

    )
}