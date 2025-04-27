import React, { useState, useEffect } from 'react';
import PlayerCounter from './StandardPlayerCounter';
import LifeHistory, { HistoryEntry } from './StandardLifeHistory';
import './StandardCounter.css';
import { ResetIcon, ExitIcon, HistoryIcon } from '../../Icons/Icons';
import { useIsMobile } from '../../../hooks/useIsMobile';

interface StandardCounterProps {
    onBackToModeSelect: () => void;
}

const StandardCounter: React.FC<StandardCounterProps> = ({ onBackToModeSelect }) => {
    const [players, setPlayers] = useState([
        { id: 1, name: "Jugador 1", life: 20, poison: 0, color: "#bf4c4c" },
        { id: 2, name: "Jugador 2", life: 20, poison: 0, color: "#4c7dbf" }
    ]);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [historyIdCounter, setHistoryIdCounter] = useState(1);
    const [historyVisible, setHistoryVisible] = useState(false);
    const isMobile = useIsMobile();

    const handleLifeChange = (playerId: number, amount: number) => {
        const playerToUpdate = players.find(player => player.id === playerId);

        if (playerToUpdate) {
            const newLife = playerToUpdate.life + amount;

            const historyEntry: HistoryEntry = {
                id: historyIdCounter,
                playerId: playerId,
                playerName: playerToUpdate.name,
                change: amount,
                newLife: newLife,
                timestamp: new Date()
            };

            setHistoryIdCounter(prev => prev + 1);
            setHistory(prev => [historyEntry, ...prev].slice(0, 20));

            setPlayers(prevPlayers =>
                prevPlayers.map(player =>
                    player.id === playerId
                        ? { ...player, life: newLife }
                        : player
                )
            );
        }
    };

    const handlePoisonChange = (playerId: number, amount: number) => {
        setPlayers(prevPlayers =>
            prevPlayers.map(player =>
                player.id === playerId
                    ? { ...player, poison: Math.max(0, player.poison + amount) }
                    : player
            )
        );
    };

    const handleNameChange = (playerId: number, name: string) => {
        setPlayers(prevPlayers =>
            prevPlayers.map(player =>
                player.id === playerId ? { ...player, name: name } : player
            )
        );
    };

    const resetGame = () => {
        if (window.confirm('¿Seguro que quieres reiniciar la partida?')) {
            setPlayers(players.map(player => ({ ...player, life: 20, poison: 0 })));
            setHistory([]);
        }
    };

    const toggleHistoryVisibility = () => {
        setHistoryVisible(!historyVisible);
    };

    useEffect(() => {
        if (!isMobile) {
            setHistoryVisible(true);
        }
    }, [isMobile]);

    return (
        <div className="standard-counter">

            <div className={`player-grid ${isMobile ? 'mobile-invert' : ''}`}>
                {/* Jugador 2 arriba (rotado en móvil) */}
                <div className={`player-grid-item ${isMobile ? 'mobile-rotate' : ''}`}>
                    <PlayerCounter
                        id={2}
                        name={players[1].name}
                        life={players[1].life}
                        poison={players[1].poison}
                        color={players[1].color}
                        onLifeChange={handleLifeChange}
                        onPoisonChange={handlePoisonChange}
                        onNameChange={handleNameChange}
                    />
                </div>

                {/* Botones centrales */}
                <div className="buttons-center-container">
                    <button className="reset-button" onClick={resetGame}>
                        <ResetIcon className="button-icon" />
                    </button>

                    {/* Botón para mostrar/ocultar historial (solo en móvil) */}
                    {isMobile && (
                        <button
                            className="toggle-history-btn"
                            onClick={toggleHistoryVisibility}
                        >
                            {historyVisible ? 'Ocultar Historial' : <HistoryIcon className="button-icon" />}
                        </button>
                    )}

                    <button className="reset-button" onClick={onBackToModeSelect} aria-label="Volver a selección de modo" type="button">
                        <ExitIcon className="button-icon" />
                    </button>
                </div>

                {/* Jugador 1 abajo */}
                <div className="player-grid-item">
                    <PlayerCounter
                        id={1}
                        name={players[0].name}
                        life={players[0].life}
                        poison={players[0].poison}
                        color={players[0].color}
                        onLifeChange={handleLifeChange}
                        onPoisonChange={handlePoisonChange}
                        onNameChange={handleNameChange}
                    />
                </div>
            </div>

            <LifeHistory history={history} isVisible={historyVisible} />
        </div>
    );
};

export default StandardCounter;
