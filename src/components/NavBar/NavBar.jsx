import { Link } from 'react-router-dom';
import * as userService from '../../utilities/users-service';

export default function NavBar({ user, setUser }) {

  function handleLogOut() {
    userService.logOut();
    setUser(null);
  }

  return (
    <nav className="hidden md:flex space-x-6 text-gray-700">
      <Link to="/premium" className="hover:text-blue-500">PREMIUM</Link>
      {user ? (
        <>
          <Link to="/karaoke" className="hover:text-blue-500">{user.displayName}</Link>
          <Link to="/" onClick={handleLogOut} className="hover:text-red-500">LOG OUT</Link>
        </>
      ) : (
        <>
          <Link to="/discover" className="hover:text-blue-500">DISCOVER</Link>
        </>
      )}
      <Link to="/support" className="hover:text-blue-500">SUPPORT</Link>
      <Link to="/blog" className="hover:text-blue-500">BLOG</Link>
      <Link to="/contact" className="hover:text-blue-500">CONTACT</Link>
    </nav>
  );
}
