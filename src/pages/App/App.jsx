import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { getUser } from '../../utilities/users-service';
import AuthPage from '../AuthPage/AuthPage';
import Blog from '../Blog/Blog';
import Contact from '../Contact/Contact';
import Discover from '../Discover/Discover';
import Header from '../../components/Header/Header';
import Karaoke from '../Karaoke/Karaoke';
import Premium from '../Premium/Premium';
import Support from '../Support/Support';

export default function App() {
  const [user, setUser] = useState(getUser()); // need to figure out getUser()

  return (
    <main className="App">
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/premium" element={<Premium />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/support" element={<Support />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      {user ?
        <>
          <Routes>
            <Route path="/" element={<Karaoke />} />
          </Routes>
        </>
        :
        <AuthPage setUser={setUser} />
      }
    </main>
  );
}
