import { Link } from 'react-router-dom';
import { useState } from 'react';
import * as userService from '../../utilities/users-service';

export default function NavBar({ user, setUser }) {
  const [loggedIn, setLoggedIn] = useState(false);

  function handleLogOut() {
    userService.logOut();
    setUser(null);
  }

  return (
    <nav>
      <Link to="/premium">PREMIUM</Link>
      &nbsp;&nbsp;
      {loggedIn ? <Link to="/karaoke">KARAOKE</Link> : <Link to="/discover">DISCOVER</Link>}
      &nbsp;&nbsp;
      <Link to="/support">SUPPORT</Link>
      &nbsp;&nbsp;
      <Link to="/blog">BLOG</Link>
      &nbsp;&nbsp;
      <Link to="/contact">CONTACT</Link>
    </nav>
  );
}