// App.tsx
import { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import SelectMode, { GameMode } from './components/SelectMode/SelectMode';
import StandardCounter from './components/Counters/StandardCounter/StandardCounter';
import DcCounter from './components/Counters/DualCommanderCounter/DcCounter';
import { useIsMobile } from './hooks/useIsMobile';

// Importaremos los otros contadores cuando los creemos
const CommanderCounter = () => <div className="counter-container">Contador para Commander</div>;
const ArchenemyCounter = () => <div className="counter-container">Contador para Archenemy</div>;

function App() {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const isMobile = useIsMobile();

  const handleBackToSelection = () => setSelectedMode(null);

  const renderCounter = () => {
    switch (selectedMode) {
      case 'standard':
        return <StandardCounter onBackToModeSelect={handleBackToSelection}/>;
      case 'commander':
        return <CommanderCounter />;
      case 'commander1v1':
        return <DcCounter onBackToModeSelect={handleBackToSelection}/>;
      case 'archenemy':
        return <ArchenemyCounter />;
      default:
        return null;
    }
  };

  const showHeader = !selectedMode || !isMobile;

  return (
    <>
      {showHeader && (
        <Header
        />
      )}
      <main>
        {!selectedMode && <SelectMode onModeSelect={setSelectedMode} />}
        {selectedMode && (
          <div className="game-container">
            {renderCounter()}
          </div>
        )}
      </main>
    </>
  );
}

export default App;
