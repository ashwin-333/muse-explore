import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const FacialRecognition = () => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/');
    };

    return (
        <div className="container">
            <header className="header">
                <img
                    src="/images/home-button.svg"
                    alt="home"
                    className="home-button"
                    onClick={handleNavigation}
                />
            </header>
            <div className="content">
                <h1 className="title">facial recognition</h1>
                <p className="description coming-soon">coming soon</p>
            </div>
        </div>
    );
};

export default FacialRecognition;
