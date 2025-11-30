import { useState } from 'react';
import GameEditor from './components/Editor/GameEditor';
import GamePlayer from './components/Player/GamePlayer';
// WikiPage is no longer rendered directly by App.jsx
import './styles/app.css';
// nav.css is no longer needed
import './styles/wiki.css'; // Keep wiki.css for styling when rendered inside GameEditor

function App() {
  const [mode, setMode] = useState('editor'); // 'editor', 'player'
  const [currentGameData, setCurrentGameData] = useState(null);



  const handlePreview = (gameData) => {
    setCurrentGameData(gameData);
    setMode('player');
  };

  return (
    <div className="app">
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

      {/* Wiki is now handled within GameEditor */}
    </div>
  );
}



  



export default App;
