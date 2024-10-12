import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-js';
import './CleanVersion.css';

const spotifyApi = new SpotifyWebApi();

const CleanVersion = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
    const [isPlaylistReady, setIsPlaylistReady] = useState(false);

    const handleLogin = () => {
        const clientId = import.meta.env.VITE_SPOTIFYKEY;
        const redirectUri = import.meta.env.VITE_CLEANVERSION_REDIRECT_URL;
        const scope = 'user-library-read playlist-read-private playlist-modify-private playlist-modify-public user-read-private';
        const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

        window.location.href = authUrl;
    };

    const getTokenFromUrl = () => {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        return params.get('access_token');
    };

    useEffect(() => {
        const token = getTokenFromUrl();
        if (token) {
            setToken(token);
            spotifyApi.setAccessToken(token);

            spotifyApi.getUserPlaylists().then((response) => {
                setPlaylists(response.items);
            }).catch((error) => {
                console.error('Error fetching playlists:', error);
            });

            window.location.hash = '';
        }
    }, []);

    const handleNavigation = () => {
        navigate('/');
    };

    const handlePlaylistClick = (playlistId) => {
        setSelectedPlaylistId(playlistId);
        setIsPlaylistReady(true);
    };

    const handleShowCleanPlaylist = () => {
        navigate(`/clean-playlist/${selectedPlaylistId}`);
    };

    return (
        <div className="cleanversion-container">
            <header className="header">
                <img
                    src="/images/home-button.svg"
                    alt="home"
                    className="home-button"
                    onClick={handleNavigation}
                />
            </header>
            <div className="cleanversion-content">
                <h1 className="cleanversion-title">Clean Version</h1>
                {!token ? (
                    <button className="cleanversion-login-button" onClick={handleLogin}>
                        Login to Spotify
                    </button>
                ) : (
                    <div className="cleanversion-playlists">
                        <h2>Your Playlists</h2>
                        <div className="cleanversion-playlist-grid">
                            {playlists.map((playlist) => (
                                <div
                                    key={playlist.id}
                                    className="cleanversion-playlist-button"
                                    onClick={() => handlePlaylistClick(playlist.id)}
                                >
                                    <img src={playlist.images[0]?.url} alt={playlist.name} className="cleanversion-playlist-image" />
                                    <span className="cleanversion-playlist-name">{playlist.name}</span>
                                </div>
                            ))}
                        </div>
                        {isPlaylistReady && (
                            <div className="cleanversion-actions">
                                <button className="cleanversion-login-button" onClick={handleShowCleanPlaylist}>
                                    Show Clean Playlist
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CleanVersion;
