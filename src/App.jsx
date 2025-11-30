import { useState } from 'react';
import GameEditor from './components/Editor/GameEditor';
import GamePlayer from './components/Player/GamePlayer';

import './styles/app.css';

function App() {
  const [mode, setMode] = useState('editor'); // 'home', 'editor', 'player', 'import'
  const [currentGameData, setCurrentGameData] = useState(null);



  const handlePreview = (gameData) => {
    setCurrentGameData(gameData);
    setMode('player');
  };





  return (
    <div className="app">
      {/* Home screen removed */}

      {/* Import screen removed */}

      {mode === 'editor' && (
        <div className="editor-screen">
          <GameEditor onPreview={handlePreview} />
        </div>
      )}

      {mode === 'player' && currentGameData && (
        <div className="player-screen">
          <button onClick={() => setMode('editor')} className="back-button">← Zurück zum Editor</button>
          <GamePlayer gameData={currentGameData} />
        </div>
      )}
    </div>
  );
}



export default App;
