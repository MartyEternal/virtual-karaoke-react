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
import { KaraokeRoomProvider } from '../../context/KaraokeRoomContext';
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
            <Route path="/" element={<Karaoke user={user} />} />
            <Route path="/karaoke/new" element={<KaraokeNewRoom user={user} />} />
            <Route
              path="/karaoke/:id"
              element={
                <KaraokeRoomProvider>
                  <KaraokeRoom user={user} />
                </KaraokeRoomProvider>
              }
            />
            <Route path="/karaoke/:id/search" element={<SongSearchUI />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <Route path="*" element={<AuthPage setUser={setUser} />} />
        )}
      </Routes>
    </main>
  );
}
