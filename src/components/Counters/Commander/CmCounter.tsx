import React, { useState, useEffect } from 'react';
import CmPlayerCounter from './CmPlayerCounter';
import CmLifeHistory, { HistoryEntry } from './CmLifeHistory';
import './CmCounter.css'
import { ResetIcon, ExitIcon, HistoryIcon, PeopleIcon } from '../../Icons/Icons';
import { useIsMobile } from '../../../hooks/useIsMobile';

interface CmCounterProps {
    onBackToModeSelect: () => void;
}

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 6;
const defaultColors = ["#bf4c4c", "#4c7dbf", "#4caf50", "#9c27b0", "#ff9800", "#795548"];

const CmCounter: React.FC<CmCounterProps> = ({ onBackToModeSelect }) => {
    const [playerCount, setPlayerCount] = useState(4);
    const [players, setPlayers] = useState([
        { id: 1, name: "Jugador 1", life: 40, dmgCommander: 0, poisonCounters: 0, color: "#bf4c4c" },
        { id: 2, name: "Jugador 2", life: 40, dmgCommander: 0, poisonCounters: 0, color: "#4c7dbf" },
        { id: 3, name: "Jugador 3", life: 40, dmgCommander: 0, poisonCounters: 0, color: "#4caf50" },
        { id: 4, name: "Jugador 4", life: 40, dmgCommander: 0, poisonCounters: 0, color: "#9c27b0" }
    ]);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [historyIdCounter, setHistoryIdCounter] = useState(1);
    const [historyVisible, setHistoryVisible] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Estado para el modal de daño
    const [damageGrid, setDamageGrid] = useState<{ [playerId: number]: { [fromId: number]: number } }>({});


    const isMobile = useIsMobile();

    // Ajusta el número de jugadores y sus datos
    useEffect(() => {
        setPlayers(prevPlayers => {
            if (prevPlayers.length < playerCount) {
                const newPlayers = [];
                for (let i = prevPlayers.length; i < playerCount; i++) {
                    newPlayers.push({
                        id: i + 1,
                        name: `Jugador ${i + 1}`,
                        life: 40,
                        dmgCommander: 0,
                        poisonCounters: 0,
                        color: defaultColors[i % defaultColors.length]
                    });
                }
                return [...prevPlayers, ...newPlayers];
            }
            if (prevPlayers.length > playerCount) {
                return prevPlayers.slice(0, playerCount);
            }
            return prevPlayers;
        });
    }, [playerCount]);

    useEffect(() => {
        setDamageGrid(prev => {
            const updated: typeof prev = {};
            players.forEach(player => {
                if (!prev[player.id]) {
                    updated[player.id] = {};
                    players.forEach(p2 => {
                        updated[player.id][p2.id] = 0;
                    });
                } else {
                    updated[player.id] = { ...prev[player.id] };
                    players.forEach(p2 => {
                        if (updated[player.id][p2.id] === undefined) updated[player.id][p2.id] = 0;
                    });
                }
            });
            return updated;
        });
    }, [players.length]);

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

    const handlePoisonCounterChange = (playerId: number, amount: number) => {
        setPlayers(prevPlayers =>
            prevPlayers.map(player =>
                player.id === playerId
                    ? { ...player, poisonCounters: Math.max(0, player.poisonCounters + amount) }
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
            setPlayers(players.map(player => ({ ...player, life: 40, dmgCommander: 0, poisonCounters: 0 })));
            setHistory([]);
            setDamageGrid({});
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

    const openPlayerModal = () => {
        setShowModal(true);
        setTimeout(() => setModalOpen(true), 10);
    };

    const closePlayerModal = () => {
        setModalOpen(false);
        setTimeout(() => setShowModal(false), 350);
    };

    const handleDamageGridChange = (targetId: number, fromId: number, value: number) => {
        setDamageGrid(prev => ({
            ...prev,
            [targetId]: {
                ...prev[targetId],
                [fromId]: Math.max(0, value)
            }
        }));
    };



    return (
        <div className="cm-counter">
            <div className="cm-counter-header">
                <div className="cm-header-buttons">
                    <button className="cm-reset-button" onClick={resetGame}>
                        <ResetIcon className="button-icon" />
                    </button>

                    <button className='cm-people-button' onClick={openPlayerModal}>
                        <PeopleIcon className="cm-button-icon" />
                    </button>

                    <button className="cm-reset-button" onClick={onBackToModeSelect}>
                        <ExitIcon className="cm-button-icon" />
                    </button>
                </div>
            </div>

            {/* Modal para seleccionar el número de jugadores */}
            {showModal && (
                <div className={`cm-modal-overlay${modalOpen ? ' show' : ''}`}>
                    <div className="cm-modal-content">
                        <h3>Selecciona el número de jugadores</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                            <button
                                className="cm-players-counter-btn decrement-lg"
                                onClick={() => setPlayerCount(c => Math.max(MIN_PLAYERS, c - 1))}
                                disabled={playerCount <= MIN_PLAYERS}
                            >-</button>
                            <span>{playerCount}</span>
                            <button
                                className="cm-players-counter-btn increment-lg"
                                onClick={() => setPlayerCount(c => Math.min(MAX_PLAYERS, c + 1))}
                                disabled={playerCount >= MAX_PLAYERS}
                            >+</button>
                        </div>
                        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 16 }}>
                            <button
                                className="cm-people-button"
                                onClick={closePlayerModal}
                                style={{ minWidth: 80 }}
                            >Aceptar</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`cm-player-grid ${isMobile ? 'cm-mobile-grid' : ''}`}>
                {players.map((player, idx) => {
                    let rotateClass = "";
                    if (isMobile) {
                        rotateClass = (idx % 2 === 0) ? "rotate-left" : "rotate-right";
                    }
                    return (
                        <div
                            key={player.id}
                            className={`player-grid-item ${rotateClass}`}
                        >
                            <CmPlayerCounter
                                {...player}
                                players={players}
                                damageGrid={damageGrid}
                                onLifeChange={handleLifeChange}
                                onPoisonCounterChange={handlePoisonCounterChange}
                                onNameChange={handleNameChange}
                                onDamageGridChange={handleDamageGridChange}
                            />
                        </div>
                    );
                })}
            </div>

            {isMobile && (
                <button className="cm-toggle-history-btn" onClick={toggleHistoryVisibility}>
                    <HistoryIcon className="cm-button-icon" />
                    {historyVisible ? 'Ocultar Historial' : 'Mostrar Historial'}
                </button>
            )}

            <CmLifeHistory history={history} isVisible={historyVisible} />
        </div>
    );
};

export default CmCounter;


