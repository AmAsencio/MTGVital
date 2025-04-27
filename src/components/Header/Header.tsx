// src/components/Header/Header.tsx
import logo from '../Logo/logoNoText.webp';
import React from 'react';
import './Header.css';

interface HeaderProps {
    showBackButton?: boolean;
    onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showBackButton = false, onBack }) => (
    <header className="mtgvital-header">
        <div className="header-glow"></div>
        <div className="header-content">
            <img src={logo} alt="MTGVital logo" className="header-logo" />
            <div className="header-text">
                <h1 className="header-title">MTGVital</h1>
                <span className="header-subtitle">Life Counter para Magic: The Gathering</span>
            </div>
            {showBackButton && (
                <button className="header-cta" onClick={onBack}>
                    Volver a selección de modo
                </button>
            )}
        </div>
    </header>
);

export default Header;
