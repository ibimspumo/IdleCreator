/**
 * Compression Utilities
 * Export/Import von Game Data mit LZString + Base64
 */

import LZString from 'lz-string';

export const CompressionUtils = {
  // Komprimiert Game Data zu einem Share-String
  compress(gameData) {
    try {
      const jsonString = JSON.stringify(gameData);
      const compressed = LZString.compressToBase64(jsonString);
      return compressed;
    } catch (error) {
      console.error('Compression failed:', error);
      return null;
    }
  },

  // Dekomprimiert einen Share-String zurück zu Game Data
  decompress(compressedString) {
    try {
      const decompressed = LZString.decompressFromBase64(compressedString);
      let gameData = JSON.parse(decompressed);

      // Ensure logic property exists for older game data (single flow)
      if (!gameData.logic) {
        gameData.logic = { nodes: [], edges: [] };
      }
      
      return gameData;
    } catch (error) {
      console.error('Decompression failed:', error);
      return null;
    }
  },

  // Validiert Game Data Struktur
  validate(gameData) {
    const required = ['meta', 'resources', 'buildings', 'upgrades', 'achievements', 'theme', 'logic'];

    for (const field of required) {
      if (!gameData[field]) {
        return { valid: false, error: `Missing field: ${field}` };
      }
    }

    // Weitere Validierungen
    if (!Array.isArray(gameData.resources) || gameData.resources.length === 0) {
      return { valid: false, error: 'Resources must be a non-empty array' };
    }

    if (!Array.isArray(gameData.buildings)) {
      return { valid: false, error: 'Buildings must be an array' };
    }
    
    if (typeof gameData.logic !== 'object' || !Array.isArray(gameData.logic.nodes) || !Array.isArray(gameData.logic.edges)) {
        return { valid: false, error: 'Logic data is malformed.' };
    }

    return { valid: true };
  },

  // Erstellt eine Standard-Vorlage
  createTemplate() {
    return {
      meta: {
        title: 'Mein Idle Game',
        description: '',
        version: '1.0.0',
        author: ''
      },
      resources: [
        {
          id: 'coins',
          name: 'Münzen',
          icon: '🪙',
          clickable: true,
          clickAmount: 1,
          startAmount: 0
        }
      ],
      buildings: [
        {
          id: 'clicker',
          name: 'Auto-Clicker',
          description: 'Generiert automatisch Münzen',
          icon: '👆',
          cost: [
            { resourceId: 'coins', baseAmount: 10 }
          ],
          costScaling: 1.15,
          produces: [
            { resourceId: 'coins', amount: 1 }
          ]
        }
      ],
      upgrades: [
        {
          id: 'upgrade1',
          name: 'Bessere Clicks',
          description: 'Verdoppelt Click-Wert',
          icon: '⬆️',
          cost: [
            { resourceId: 'coins', amount: 100 }
          ],
          unlockRequirements: [
            { type: 'resource', resourceId: 'coins', amount: 50 }
          ],
          effects: [
            { type: 'multiply', target: 'click', value: 2 }
          ]
        }
      ],
      achievements: [
        {
          id: 'first_click',
          name: 'Erster Click',
          description: 'Klicke zum ersten Mal',
          icon: '🎉',
          requirements: [
            { type: 'totalClicks', amount: 1 }
          ]
        },
        {
          id: 'hundred_coins',
          name: '100 Münzen',
          description: 'Sammle 100 Münzen',
          icon: '💰',
          requirements: [
            { type: 'resource', resourceId: 'coins', amount: 100 }
          ]
        }
      ],
      prestige: {
        enabled: true,
        baseResource: 'coins',
        formula: 'sqrt',
        divisor: 1000,
        multiplier: 1
      },
      theme: {
        primaryColor: '#6366f1',
        secondaryColor: '#818cf8',
        backgroundColor: '#0a0a0a',
        textColor: '#ffffff',
        accentColor: '#10b981',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: '8px'
      },
      logic: {
        nodes: [
          { id: 'event-start', type: 'event', position: { x: 250, y: 50 }, data: { eventType: 'onGameStart' } },
        ],
        edges: [],
      }
    };
  }
};

