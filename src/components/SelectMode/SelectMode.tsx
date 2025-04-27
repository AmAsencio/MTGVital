import React, { useState } from 'react';
import { CardsIcon, PeopleIcon, TimerIcon, CommanderModeIcon, Commander1v1ModeIcon, ArchenemyModeIcon } from '../Icons/Icons';
import './SelectMode.css';

// Definición de tipos
export type GameMode = 'standard' | 'commander' | 'commander1v1' | 'archenemy';

interface ModeCardProps {
    mode: GameMode;
    title: string;
    description: string;
    icon: React.ReactNode;
    isSelected: boolean;
    onClick: (mode: GameMode) => void;
    info: { icon: React.ReactNode; label: string }[];
}

const ModeCard: React.FC<ModeCardProps> = ({
    mode,
    title,
    description,
    icon,
    isSelected,
    onClick,
    info
}) => (
    <div
        className={`mode-card ${isSelected ? 'selected' : ''}`}
        onClick={() => onClick(mode)}
    >
        <div className="mode-icon">{icon}</div>
        <h3 className="mode-title">{title}</h3>
        <p className="mode-description">{description}</p>
        <div className="mode-info-row">
            {info && info.map((item, i) => (
                <div className="mode-info-item" key={i}>
                    <span className="mode-info-icon">{item.icon}</span>
                    <span className="mode-info-label">{item.label}</span>
                </div>
            ))}
        </div>

        {isSelected && <div className="mode-selected-indicator"></div>}
    </div>
);

interface SelectModeProps {
    onModeSelect: (mode: GameMode) => void;
}

const SelectMode: React.FC<SelectModeProps> = ({ onModeSelect }) => {
    const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

    const handleModeSelect = (mode: GameMode) => {
        setSelectedMode(mode);
        onModeSelect(mode);
    };

    const modes = [
        {
            mode: 'standard' as GameMode,
            title: 'Standard',
            description: 'Formato clásico de 60 cartas para 2 jugadores con 20 puntos de vida.',
            icon: <CardsIcon />,
            info: [
                { icon: <CardsIcon />, label: '60 cartas' },
                { icon: <PeopleIcon />, label: '2 jugadores' },
                { icon: <TimerIcon />, label: '50 minutos' }
            ]
        },
        {
            mode: 'commander' as GameMode,
            title: 'Commander',
            description: 'Formato casual multijugador con mazos de 100 cartas y 40 vidas.',
            icon: <CommanderModeIcon />,
            info: [
                { icon: <CardsIcon />, label: '100 cartas' },
                { icon: <PeopleIcon />, label: '3–6 jugadores' },
                { icon: <TimerIcon />, label: '120 minutos' }
            ]
        },
        {
            mode: 'commander1v1' as GameMode,
            title: 'Commander 1v1',
            description: 'Duelo competitivo entre dos comandantes con 30 vidas cada uno.',
            icon: <Commander1v1ModeIcon />,
            info: [
                { icon: <CardsIcon />, label: '100 cartas' },
                { icon: <PeopleIcon />, label: '2 jugadores' },
                { icon: <TimerIcon />, label: '50 minutos' }
            ]
        },
        {
            mode: 'archenemy' as GameMode,
            title: 'Archenemy',
            description: 'Un jugador se enfrenta al resto usando poderosas cartas de esquema.',
            icon: <ArchenemyModeIcon />,
            info: [
                { icon: <CardsIcon />, label: '60–100 cartas' },
                { icon: <PeopleIcon />, label: '3–5 jugadores' },
                { icon: <TimerIcon />, label: '90–120 minutos' }
            ]
        }
    ];

    return (
        <div className="select-mode-container">
            <h2 className="select-mode-title">Selecciona un Modo de Juego</h2>
            <div className="mode-cards-grid">
                {modes.map((mode) => (
                    <ModeCard
                        key={mode.mode}
                        mode={mode.mode}
                        title={mode.title}
                        description={mode.description}
                        icon={mode.icon}
                        isSelected={selectedMode === mode.mode}
                        onClick={handleModeSelect}
                        info={mode.info}
                    />
                ))}
            </div>
        </div>
    );
};

export default SelectMode;
