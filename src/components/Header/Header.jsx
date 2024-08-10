import NavBar from "../NavBar/NavBar"
import { useState } from "react";
import { Link } from "react-router-dom";
import './Header.css';

export default function Header({ user, setUser }) {
    const [loggedIn, setLoggedIn] = useState({user}); // need to figure out getUser()

    return (
        <div className="header-full">
            <div className="header">
                <span id="logo">
                    LOGO HERE
                </span>
                <NavBar user={user} setUser={setUser} />
                <span id="right-button">
                    {loggedIn ? <Link to="/">SING NOW</Link> : <Link to="/authpage">LOGIN</Link>}
                </span>
            </div>
        </div>


    )
}