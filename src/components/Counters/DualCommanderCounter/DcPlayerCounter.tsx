import React, { useState } from 'react';
import './DcPlayerCounter.css'


interface DcPlayerProps {
    id: number;
    name: string;
    life: number;
    dmgCommander: number;
    color: string;
    onLifeChange: (playerId: number, amount: number) => void;
    onDmgCommanderChange: (playerId: number, amount: number) => void;
    onNameChange: (playerId: number, name: string) => void;
}

const PlayerCounter: React.FC<DcPlayerProps> = ({
    id,
    name,
    life,
    dmgCommander,
    color,
    onLifeChange,
    onDmgCommanderChange,
    onNameChange
}) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(name);
    const [showDmgCommander, setShowDmgCommander] = useState(false);

    const handleNameSubmit = () => {
        setIsEditingName(false);
        onNameChange(id, nameInput.trim() || `Jugador ${id}`);
    };

    return (
        <div className="player-counter" style={{ '--player-color': color } as React.CSSProperties}>
            <div className="player-header">
                {isEditingName ? (
                    <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onBlur={handleNameSubmit}
                        onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                        autoFocus
                        className="player-name-input"
                    />
                ) : (
                    <h3 className="player-name" onClick={() => setIsEditingName(true)}>
                        {name}
                    </h3>
                )}

                <button
                    className="toggle-counter-btn"
                    onClick={() => setShowDmgCommander(!showDmgCommander)}
                >
                    {showDmgCommander ? 'Vida' : 'Daño Comandante'}
                </button>
            </div>

            {!showDmgCommander ? (
                <div className="life-counter">
                    <div className="counter-actions">
                        <button
                            className="counter-btn decrement-lg"
                            onClick={() => onLifeChange(id, -1)}
                        >
                            -1
                        </button>
                        <button
                            className="counter-btn decrement"
                            onClick={() => onLifeChange(id, -5)}
                        >
                            -5
                        </button>
                    </div>

                    <div className="counter-value life-value">
                        {life}
                    </div>

                    <div className="counter-actions">
                        <button
                            className="counter-btn increment"
                            onClick={() => onLifeChange(id, 1)}
                        >
                            +1
                        </button>
                        <button
                            className="counter-btn increment-lg"
                            onClick={() => onLifeChange(id, 5)}
                        >
                            +5
                        </button>
                    </div>
                </div>
            ) : (
                <div className="dmgCommander-counter">
                    <button
                        className="counter-btn dmgCommander-decrement"
                        onClick={() => onDmgCommanderChange(id, -1)}
                        disabled={dmgCommander <= 0}
                    >
                        -1
                    </button>

                    <div className="counter-value dmgCommander-value">
                        <span>{dmgCommander}</span>
                        <small>veneno</small>
                    </div>

                    <button
                        className="counter-btn dmgCommander-increment"
                        onClick={() => onDmgCommanderChange(id, 1)}
                    >
                        +1
                    </button>
                </div>
            )}
        </div>
    );
};

export default PlayerCounter;
