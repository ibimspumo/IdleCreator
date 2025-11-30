import { useState } from 'react';
import { CompressionUtils } from '../../../utils/compression'; // Adjusted path

export function useGameData() {
  const [gameData, setGameData] = useState(CompressionUtils.createTemplate());
  const [selectedItem, setSelectedItem] = useState(null);

  const selectItem = (type, id) => {
    setSelectedItem({ type, id });
  };

  const addItem = (type) => {
    let newItem;
    const timestamp = Date.now();

    switch (type) {
      case 'resource':
        newItem = {
          id: `resource_${timestamp}`,
          name: 'New Resource',
          icon: '💎',
          clickable: false,
          clickAmount: 1,
          startAmount: 0
        };
        setGameData(prev => ({ ...prev, resources: [...prev.resources, newItem] }));
        selectItem('resource', newItem.id);
        break;

      case 'building':
        newItem = {
          id: `building_${timestamp}`,
          name: 'New Building',
          description: 'Description...',
          icon: '🏗️',
          cost: [{ resourceId: gameData.resources[0]?.id || 'coins', baseAmount: 10 }],
          costScaling: 1.15,
          produces: [{ resourceId: gameData.resources[0]?.id || 'coins', amount: 1 }]
        };
        setGameData(prev => ({ ...prev, buildings: [...prev.buildings, newItem] }));
        selectItem('building', newItem.id);
        break;

      case 'upgrade':
        newItem = {
          id: `upgrade_${timestamp}`,
          name: 'New Upgrade',
          description: 'Description...',
          icon: '⬆️',
          cost: [{ resourceId: gameData.resources[0]?.id || 'coins', amount: 100 }],
          unlockRequirements: [],
          effects: [{ type: 'multiply', target: 'production', value: 2 }]
        };
        setGameData(prev => ({ ...prev, upgrades: [...prev.upgrades, newItem] }));
        selectItem('upgrade', newItem.id);
        break;

      case 'achievement':
        newItem = {
          id: `achievement_${timestamp}`,
          name: 'New Achievement',
          description: 'Description...',
          icon: '🏆',
          requirements: [{ type: 'resource', resourceId: gameData.resources[0]?.id || 'coins', amount: 100 }]
        };
        setGameData(prev => ({ ...prev, achievements: [...prev.achievements, newItem] }));
        selectItem('achievement', newItem.id);
        break;
    }
  };

  const deleteItem = (type, id) => {
    if (!confirm('Delete this item?')) return;

    switch (type) {
      case 'resource':
        if (gameData.resources.length === 1) {
          alert('You must have at least one resource!');
          return;
        }
        setGameData(prev => ({ ...prev, resources: prev.resources.filter(r => r.id !== id) }));
        break;
      case 'building':
        setGameData(prev => ({ ...prev, buildings: prev.buildings.filter(b => b.id !== id) }));
        break;
      case 'upgrade':
        setGameData(prev => ({ ...prev, upgrades: prev.upgrades.filter(u => u.id !== id) }));
        break;
      case 'achievement':
        setGameData(prev => ({ ...prev, achievements: prev.achievements.filter(a => a.id !== id) }));
        break;
    }

    if (selectedItem?.type === type && selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const updateMeta = (field, value) => {
    setGameData(prev => ({ ...prev, meta: { ...prev.meta, [field]: value } }));
  };

  const updateItem = (type, id, updates) => {
    switch (type) {
      case 'resource':
        setGameData(prev => ({
          ...prev,
          resources: prev.resources.map(r => r.id === id ? { ...r, ...updates } : r)
        }));
        break;
      case 'building':
        setGameData(prev => ({
          ...prev,
          buildings: prev.buildings.map(b => b.id === id ? { ...b, ...updates } : b)
        }));
        break;
      case 'upgrade':
        setGameData(prev => ({
          ...prev,
          upgrades: prev.upgrades.map(u => u.id === id ? { ...u, ...updates } : u)
        }));
        break;
      case 'achievement':
        setGameData(prev => ({
          ...prev,
          achievements: prev.achievements.map(a => a.id === id ? { ...a, ...updates } : a)
        }));
        break;
    }
  };

  return {
    gameData,
    setGameData,
    selectedItem,
    setSelectedItem,
    selectItem,
    addItem,
    deleteItem,
    updateMeta,
    updateItem,
  };
}
