import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getUser } from '../../utilities/users-service';
import AuthPage from '../AuthPage/AuthPage';
import Blog from '../Blog/Blog';
import Contact from '../Contact/Contact';
import Discover from '../Discover/Discover';
import Header from '../../components/Header/Header';
import Karaoke from '../Karaoke/Karaoke';
import KaraokeNewRoom from '../Karaoke/KaraokeNewRoom';
import KaraokeRoom from '../Karaoke/KaraokeRoom';
import SongSearchUI from '../Karaoke/SongSearchUI';
import Premium from '../Premium/Premium';
import Support from '../Support/Support';

export default function App() {
  const [user, setUser] = useState(getUser());

  return (
    <main className="App">
      <Header user={user} setUser={setUser} />
      <Routes>
        <>
          <Route path="/premium" element={<Premium />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/support" element={<Support />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
        </>
        {user ? (
          <>
            <Route path="/" element={user ? <Karaoke user={user} /> : <Navigate to="/authpage" />} />
            <Route path="/karaoke/new" element={user ? <KaraokeNewRoom user={user} /> : <AuthPage setUser={setUser} />} />
            <Route path="/karaoke/:id" element={user ? <KaraokeRoom user={user} /> : <AuthPage setUser={setUser} />} />
            <Route path="/karaoke/:id/search" element={user ? <SongSearchUI /> : <Navigate to="/authpage" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <Route path="*" element={<AuthPage setUser={setUser} />} />
        )}
      </Routes>
    </main>
  );
}
