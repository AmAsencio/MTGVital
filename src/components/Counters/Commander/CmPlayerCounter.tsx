import React, { useState } from 'react';
import './CmPlayerCounter.css';

interface Player {
    id: number;
    name: string;
    color: string;
}

interface CmPlayerProps {
    id: number;
    name: string;
    life: number;
    poisonCounters: number;
    color: string;
    onLifeChange: (playerId: number, amount: number) => void;
    onPoisonCounterChange: (playerId: number, amount: number) => void;
    onNameChange: (playerId: number, name: string) => void;
    players: Player[];
    damageGrid: { [playerId: number]: { [fromId: number]: number } };
    onDamageGridChange: (targetId: number, fromId: number, value: number) => void;
}


const CmPlayerCounter: React.FC<CmPlayerProps> = ({
    id,
    name,
    life,
    poisonCounters,
    color,
    onLifeChange,
    onPoisonCounterChange,
    onNameChange,
    players,
    damageGrid,
    onDamageGridChange
}) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(name);
    const [activeCounter, setActiveCounter] = useState<'life' | 'poison'>('life');

    const handleNameSubmit = () => {
        setIsEditingName(false);
        onNameChange(id, nameInput.trim() || `Jugador ${id}`);
    };

    // --- GRID DINÁMICO ---
    const total = players.length;
    let columns = 2, rows = 2;
    if (total === 3) { columns = 3; rows = 1; }
    if (total === 5 || total === 6) { columns = 3; rows = 2; }
    if (total === 4) { columns = 2; rows = 2; }

    const renderGridSquares = () => {
        // Para 5 jugadores, crear un layout especial
        if (total === 5) {
            return (
                <div  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gridTemplateRows: 'repeat(2, auto)',
                    gap: '6px'
                }}>
                    {/* Primera fila: jugadores 1, 2 y 3 */}
                    {players.slice(0, 3).map(p => {
                        const isMe = p.id === id;
                        const value = damageGrid?.[id]?.[p.id] ?? 0;
                        let bg = '#e5e5e5';
                        let colorTxt = '#222';

                        return (
                            <div
                                key={p.id}
                                className="cm-grid-square"
                                style={{
                                    background: bg,
                                    color: colorTxt,
                                    border: `3px solid ${p.color}`
                                }}
                                onClick={() => {
                                    onDamageGridChange(id, p.id, Number(value) + 1);
                                    if (p.id !== id) {
                                        onLifeChange(id, -1);
                                    }
                                }}
                                onContextMenu={e => {
                                    e.preventDefault();
                                    onDamageGridChange(id, p.id, Math.max(0, Number(value) - 1));
                                    if (p.id !== id && Number(value) > 0) {
                                        onLifeChange(id, 1);
                                    }
                                }}
                                title={isMe ? 'Yo' : p.name}
                            >
                                {isMe ? 'Yo' : value}
                            </div>
                        );
                    })}

                    {/* Segunda fila: jugadores 4 y 5 centrados */}
                    <div style={{
                        gridColumn: '1 / span 3',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '6px'
                    }}>
                        {players.slice(3, 5).map(p => {
                            const isMe = p.id === id;
                            const value = damageGrid?.[id]?.[p.id] ?? 0;
                            let bg = '#e5e5e5';
                            let colorTxt = '#222';

                            return (
                                <div
                                    key={p.id}
                                    className="cm-grid-square"
                                    style={{
                                        background: bg,
                                        color: colorTxt,
                                        border: `3px solid ${p.color}`
                                    }}
                                    onClick={() => {
                                        onDamageGridChange(id, p.id, Number(value) + 1);
                                        if (p.id !== id) {
                                            onLifeChange(id, -1);
                                        }
                                    }}
                                    onContextMenu={e => {
                                        e.preventDefault();
                                        onDamageGridChange(id, p.id, Math.max(0, Number(value) - 1));
                                        if (p.id !== id && Number(value) > 0) {
                                            onLifeChange(id, 1);
                                        }
                                    }}
                                    title={isMe ? 'Yo' : p.name}
                                >
                                    {isMe ? 'Yo' : value}
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        // Para otros números de jugadores, mantener el grid normal
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gap: '6px'
            }}>
                {players.map(p => {
                    const isMe = p.id === id;
                    const value = damageGrid?.[id]?.[p.id] ?? 0;
                    let bg = '#e5e5e5';
                    let colorTxt = '#222';

                    return (
                        <div
                            key={p.id}
                            className="cm-grid-square"
                            style={{
                                background: bg,
                                color: colorTxt,
                                border: `3px solid ${p.color}`
                            }}
                            onClick={() => {
                                onDamageGridChange(id, p.id, Number(value) + 1);
                                if (p.id !== id) {
                                    onLifeChange(id, -1);
                                }
                            }}
                            onContextMenu={e => {
                                e.preventDefault();
                                onDamageGridChange(id, p.id, Math.max(0, Number(value) - 1));
                                if (p.id !== id && Number(value) > 0) {
                                    onLifeChange(id, 1);
                                }
                            }}
                            title={isMe ? 'Yo' : p.name}
                        >
                            {isMe ? 'Yo' : value}
                        </div>
                    );
                })}
            </div>
        );
    };



    return (
        <div className="cm-player-counter" style={{ borderColor: color }}>
            <div className="cm-player-header">
                {isEditingName ? (
                    <input
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                        onBlur={handleNameSubmit}
                        onKeyDown={e => e.key === 'Enter' && handleNameSubmit()}
                        autoFocus
                        className="cm-player-name-input"
                    />
                ) : (
                    <span
                        className="cm-player-name"
                        onClick={() => setIsEditingName(true)}
                    >
                        {name}
                    </span>
                )}
                <div className="cm-counter-toggle-buttons">
                    <button
                        className={`cm-toggle-counter-btn${activeCounter === 'life' ? ' active' : ''}`}
                        onClick={() => setActiveCounter('life')}
                    >
                        Vida
                    </button>
                    <button
                        className={`cm-toggle-counter-btn${activeCounter === 'poison' ? ' active' : ''}`}
                        onClick={() => setActiveCounter('poison')}
                    >
                        Veneno
                    </button>
                </div>
            </div>
            {activeCounter === 'life' && (
                <div className="cm-life-counter">
                    <div className="cm-counter-actions">
                        <button className="cm-counter-btn cm-decrement" onClick={() => onLifeChange(id, -1)}>-1</button>
                        <button className="cm-counter-btn cm-decrement-lg" onClick={() => onLifeChange(id, -5)}>-5</button>
                    </div>
                    <div>
                        <div className="cm-counter-value cm-life-value">{life}</div>

                        {/* GRID DE DAÑO RECIBIDO */}
                        <div className="cm-damage-grid" style={{
                            gridTemplateRows: `repeat(${rows}, auto)`
                        }}>
                            {renderGridSquares()}
                        </div>
                    </div>
                    <div className="cm-counter-actions">
                        <button className="cm-counter-btn cm-increment" onClick={() => onLifeChange(id, 1)}>+1</button>
                        <button className="cm-counter-btn cm-increment-lg" onClick={() => onLifeChange(id, 5)}>+5</button>
                    </div>
                </div>
            )}
            {activeCounter === 'poison' && (
                <div className="cm-poison-counter">
                    <button
                        className="cm-counter-btn cm-poison-decrement"
                        onClick={() => onPoisonCounterChange(id, -1)}
                        disabled={poisonCounters <= 0}
                    >-1</button>
                    <div className="cm-counter-value cm-poison-value">{poisonCounters}</div>
                    <button
                        className="cm-counter-btn cm-poison-increment"
                        onClick={() => onPoisonCounterChange(id, 1)}
                    >+1</button>
                </div>
            )}
        </div>
    );
};

export default CmPlayerCounter;
