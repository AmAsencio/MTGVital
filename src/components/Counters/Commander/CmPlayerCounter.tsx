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
        return players.map((p, idx) => {
            const isMe = p.id === id;
            const value = damageGrid?.[id]?.[p.id] ?? 0;
            let bg = isMe ? '#e5e5e5' : p.color;
            let colorTxt = isMe ? '#222' : '#fff';

            if (!isMe && Number(value) > 0) {
                bg = p.color;
            } else if (!isMe) {
                bg = '#bfcfdc';
                colorTxt = '#222';
            }
            if (isMe) colorTxt = '#222';

            let longPressTimeout: NodeJS.Timeout;
            const handleTouchStart = () => {
                longPressTimeout = setTimeout(() => {
                    if (p.id !== id && Number(value) > 0) {
                        onLifeChange(id, 1);
                        onDamageGridChange(id, p.id, Math.max(0, Number(value) - 1));
                    }
                }, 450); // 450ms para considerar pulsación larga
            };
            const handleTouchEnd = () => {
                clearTimeout(longPressTimeout);
            };

            // Para 5 jugadores: el último cuadrado ocupa dos columnas
            const extraProps = (total === 5 && idx === 4)
                ? { className: "cm-grid-square cm-grid-square--wide" }
                : { className: "cm-grid-square" };

            return (
                <div
                    key={p.id}
                    {...extraProps}
                    style={{
                        background: bg,
                        color: colorTxt,
                        border: `3px solid ${p.color}`,
                        boxShadow: Number(value) > 0 ? '0 0 0 2px #fff' : '0 1px 8px rgba(0,0,0,0.12)',
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
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    title={isMe ? 'Yo' : p.name}
                >
                    {isMe ? 'Yo' : value}
                </div>
            );
        });
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
                            gridTemplateColumns: `repeat(${columns}, auto)`,
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
