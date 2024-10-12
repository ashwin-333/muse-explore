import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Recommender from './components/Recommender';
import CleanVersion from './components/CleanVersion';
import CleanPlaylist from './components/CleanPlaylist';
import FacialRecognition from './components/FacialRecognition';
import YoutubeToSpotify from './components/YoutubeToSpotify';
import ArtistLibrary from './components/ArtistLibrary';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/recommender" element={<Recommender />} />
                <Route path="/clean-version" element={<CleanVersion />} />
                <Route path="/artist-library" element={<ArtistLibrary />} />
                <Route path="/clean-playlist/:playlistId" element={<CleanPlaylist />} />
                <Route path="/facial-recognition" element={<FacialRecognition />} />
                <Route path="/youtube-to-spotify" element={<YoutubeToSpotify />} />
            </Routes>
        </Router>
    );
}

export default App;
