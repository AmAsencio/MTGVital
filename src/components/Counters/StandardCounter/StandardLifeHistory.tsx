import './StandardLifeHistory.css';
import { useIsMobile } from '../../../hooks/useIsMobile'; 

export interface HistoryEntry {
    id: number;
    playerId: number;
    playerName: string;
    change: number;
    newLife: number;
    timestamp: Date;
}

interface LifeHistoryProps {
    history: HistoryEntry[];
    isVisible?: boolean; 
}

const LifeHistory: React.FC<LifeHistoryProps> = ({ history, isVisible = true }) => {
    const isMobile = useIsMobile();

    if (history.length === 0) {
        return null;
    }

    const shouldDisplay = !isMobile || (isMobile && isVisible);

    return (
        <div className="life-history" style={{ display: shouldDisplay ? 'block' : 'none' }}>
            <h3 className="history-title">Historial</h3>
            <div className="history-entries">
                {history.map(entry => (
                    <div key={entry.id} className="history-entry">
                        <div className="history-player">{entry.playerName}</div>
                        <div className={`history-change ${entry.change > 0 ? 'positive' : 'negative'}`}>
                            {entry.change > 0 ? '+' : ''}{entry.change}
                        </div>
                        <div className="history-life">{entry.newLife}</div>
                        <div className="history-time">
                            {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LifeHistory;
