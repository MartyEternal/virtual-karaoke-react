import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { getUser } from '../../utilities/users-service';
import AuthPage from '../AuthPage/AuthPage';
import Blog from '../Blog/Blog';
import Contact from '../Contact/Contact';
import Discover from '../Discover/Discover';
import Header from '../../components/Header/Header';
import Karaoke from '../Karaoke/Karaoke';
import KaraokeNewRoom from '../Karaoke/KaraokeNewRoom';
import KaraokeRoom from '../Karaoke/KaraokeRoom';
import Premium from '../Premium/Premium';
import Support from '../Support/Support';

export default function App() {
  const [user, setUser] = useState(getUser());

  return (
    <main className="App">
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={user ? <Karaoke /> : <Navigate to="/authpage" />} />
        <Route path="/karaoke/new" element={user ? <KaraokeNewRoom /> : <AuthPage setUser={setUser} />} />
        <Route path="/karaoke/:id" element={user ? <KaraokeRoom /> : <AuthPage setUser={setUser} />} />
        {/* <Route path="/karaoke/:id/search" element={user ? <SongSearchUI /> : <AuthPage setUser={setUser} />} /> */}
        <Route path="/premium" element={<Premium />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/support" element={<Support />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/authpage" element={<AuthPage setUser={setUser} />} />
        {/* Add a catch-all route for any undefined paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </main>
  );
}
