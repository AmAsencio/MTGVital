import React, { useState, useEffect } from 'react';
import DcPlayerCounter from './DcPlayerCounter';
import DcLifeHistory, { HistoryEntry } from './DcLifeHistory';
import './DcCounter.css'
import { ResetIcon, ExitIcon, HistoryIcon } from '../../Icons/Icons';
import { useIsMobile } from '../../../hooks/useIsMobile';


interface DcCounterProps {
    onBackToModeSelect: () => void;
}

const DcCounter: React.FC<DcCounterProps> = ({ onBackToModeSelect }) => {
    const [players, setPlayers] = useState([
        { id: 1, name: "Jugador 1", life: 30, dmgCommander: 0, color: "#bf4c4c" },
        { id: 2, name: "Jugador 2", life: 30, dmgCommander: 0, color: "#4c7dbf" }
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


    const handleDmgCommanderChange = (playerId: number, amount: number) => {
        setPlayers(prevPlayers =>
            prevPlayers.map(player =>
                player.id === playerId
                    ? { ...player, dmgCommander: Math.max(0, player.dmgCommander + amount) }
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
            setPlayers(players.map(player => ({ ...player, life: 30, dmgCommander: 0 })));
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
        <div className="dc-counter">

            <div className={`player-grid ${isMobile ? 'mobile-invert' : ''}`}>
                {/* Jugador 2 arriba (rotado en móvil) */}
                <div className={`player-grid-item ${isMobile ? 'mobile-rotate' : ''}`}>
                    <DcPlayerCounter
                        id={2}
                        name={players[1].name}
                        life={players[1].life}
                        dmgCommander={players[1].dmgCommander}
                        color={players[1].color}
                        onLifeChange={handleLifeChange}
                        onDmgCommanderChange={handleDmgCommanderChange}
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
                    <DcPlayerCounter
                        id={1}
                        name={players[0].name}
                        life={players[0].life}
                        dmgCommander={players[0].dmgCommander}
                        color={players[0].color}
                        onLifeChange={handleLifeChange}
                        onDmgCommanderChange={handleDmgCommanderChange}
                        onNameChange={handleNameChange}
                    />
                </div>
            </div>

            <DcLifeHistory history={history} isVisible={historyVisible} />
        </div>
    );
};

export default DcCounter;


