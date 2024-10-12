import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-js';
import './ArtistLibrary.css';

const spotifyApi = new SpotifyWebApi();

const ArtistLibrary = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [artists, setArtists] = useState([]);
    const [allArtists, setAllArtists] = useState([]);
    const [selectedArtistId, setSelectedArtistId] = useState('');

    const handleLogin = () => {
        const clientId = import.meta.env.VITE_SPOTIFYKEY;
        const redirectUri = import.meta.env.VITE_ARTISTLIBRARY_REDIRECT_URL;
        const scope = 'user-library-read playlist-read-private';
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
            fetchUserPlaylists();
            window.location.hash = '';
        }
    }, []);

    const fetchUserPlaylists = () => {
        spotifyApi.getUserPlaylists().then((response) => {
            const playlistPromises = response.items.map(playlist => spotifyApi.getPlaylistTracks(playlist.id));
            Promise.all(playlistPromises).then(results => {
                const tracks = results.flatMap(result => result.items);
                const artistSet = new Set(tracks.map(track => track.track.artists[0]?.id).filter(id => id));
                fetchArtists(Array.from(artistSet));
            });
        }).catch((error) => {
            console.error('Error fetching playlists:', error);
        });
    };

    const fetchArtists = (artistIds) => {
        spotifyApi.getArtists(artistIds).then(response => {
            setAllArtists(response.artists);
        }).catch((error) => {
            console.error('Error fetching artists:', error);
        });
    };

    const handleSearch = () => {
        if (searchTerm) {
            const filteredArtists = allArtists.filter(artist =>
                artist.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setArtists(filteredArtists);
        } else {
            setArtists(allArtists);
        }
    };

    const handleArtistClick = (artistId) => {
        setSelectedArtistId(artistId);
        navigate(`/artist/${artistId}`);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        handleSearch();
    };

    return (
        <div className="artist-library-container">
            <header className="header">
                <img
                    src="/images/home-button.svg"
                    alt="home"
                    className="home-button"
                    onClick={() => navigate('/')}
                />
            </header>
            <div className="artist-library-content">
                <h1 className="artist-library-title">Artist Library</h1>
                {!token ? (
                    <button className="artist-library-login-button" onClick={handleLogin}>
                        Login to Spotify
                    </button>
                ) : (
                    <div className="artist-library-search">
                        <input
                            type="text"
                            placeholder="Search for an artist..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                )}
                <div className="artist-library-results">
                    {artists.map((artist) => (
                        <div
                            key={artist.id}
                            className="artist-library-artist"
                            onClick={() => handleArtistClick(artist.id)}
                        >
                            <img src={artist.images[0]?.url} alt={artist.name} className="artist-library-artist-image" />
                            <span className="artist-library-artist-name">{artist.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ArtistLibrary;
