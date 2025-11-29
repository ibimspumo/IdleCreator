import { useState } from 'react';
import GameEditor from './components/Editor/GameEditor';
import GamePlayer from './components/Player/GamePlayer';
import { CompressionUtils } from './utils/compression';
import './styles/app.css';

function App() {
  const [mode, setMode] = useState('home'); // 'home', 'editor', 'player', 'import'
  const [currentGameData, setCurrentGameData] = useState(null);

  const handleStartEditor = () => {
    setMode('editor');
    setCurrentGameData(null);
  };

  const handlePreview = (gameData) => {
    setCurrentGameData(gameData);
    setMode('player');
  };

  const handleImport = (compressedString) => {
    const gameData = CompressionUtils.decompress(compressedString);

    if (!gameData) {
      alert('Import fehlgeschlagen: Ungültiger Code');
      return;
    }

    const validation = CompressionUtils.validate(gameData);
    if (!validation.valid) {
      alert(`Import fehlgeschlagen: ${validation.error}`);
      return;
    }

    setCurrentGameData(gameData);
    setMode('player');
  };

  const handleBackToHome = () => {
    setMode('home');
    setCurrentGameData(null);
  };

  return (
    <div className="app">
      {mode === 'home' && (
        <div className="home-screen">
          <div className="home-content">
            <h1 className="home-title">🎮 Idle Game Creator</h1>
            <p className="home-subtitle">
              Erstelle dein eigenes Idle/Clicker Game - ohne Programmierung!
            </p>

            <div className="home-actions">
              <button onClick={handleStartEditor} className="home-button primary">
                <span className="button-icon">✏️</span>
                <span className="button-text">
                  <strong>Neues Game erstellen</strong>
                  <small>Starte den Editor und erstelle dein eigenes Idle Game</small>
                </span>
              </button>

              <button onClick={() => setMode('import')} className="home-button secondary">
                <span className="button-icon">📥</span>
                <span className="button-text">
                  <strong>Game importieren</strong>
                  <small>Importiere ein bestehendes Game über Code</small>
                </span>
              </button>
            </div>

            <div className="home-features">
              <h2>Features</h2>
              <div className="features-grid">
                <div className="feature">
                  <div className="feature-text">
                    <h3>Buildings</h3>
                    <p>Erstelle Gebäude mit automatischer Produktion und skalierbaren Kosten</p>
                  </div>
                </div>
                <div className="feature">
                  <div className="feature-text">
                    <h3>Upgrades</h3>
                    <p>Einmalige Verbesserungen mit Freischalt-Bedingungen</p>
                  </div>
                </div>
                <div className="feature">
                  <div className="feature-text">
                    <h3>Achievements</h3>
                    <p>Erfolge für Spieler-Meilensteine</p>
                  </div>
                </div>
                <div className="feature">
                  <div className="feature-text">
                    <h3>Prestige System</h3>
                    <p>Reset mit permanenten Boni</p>
                  </div>
                </div>
                <div className="feature">
                  <div className="feature-text">
                    <h3>Full Theming</h3>
                    <p>Vollständige Design-Anpassung</p>
                  </div>
                </div>
                <div className="feature">
                  <div className="feature-text">
                    <h3>Export & Share</h3>
                    <p>Komprimierter Export zum Teilen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === 'import' && (
        <div className="import-screen">
          <div className="import-content">
            <button onClick={handleBackToHome} className="back-button">← Zurück</button>

            <h1>Game importieren</h1>
            <p>Füge hier den Export-Code eines Games ein:</p>

            <ImportForm onImport={handleImport} />

            <div className="import-info">
              <h3>Wie funktioniert der Import?</h3>
              <ol>
                <li>Kopiere den Export-Code eines Games</li>
                <li>Füge ihn in das Textfeld ein</li>
                <li>Klicke auf "Importieren"</li>
                <li>Das Game wird geladen und kann gespielt werden</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {mode === 'editor' && (
        <div className="editor-screen">
          <GameEditor onPreview={handlePreview} onBackToHome={handleBackToHome} />
        </div>
      )}

      {mode === 'player' && currentGameData && (
        <div className="player-screen">
          <button onClick={handleBackToHome} className="back-button">← Zurück zur Startseite</button>
          <GamePlayer gameData={currentGameData} />
        </div>
      )}
    </div>
  );
}

function ImportForm({ onImport }) {
  const [importCode, setImportCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (importCode.trim()) {
      onImport(importCode.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="import-form">
      <textarea
        value={importCode}
        onChange={(e) => setImportCode(e.target.value)}
        placeholder="Export-Code hier einfügen..."
        rows={10}
        required
      />
      <button type="submit" className="btn-primary">
        Importieren & Spielen
      </button>
    </form>
  );
}

export default App;
