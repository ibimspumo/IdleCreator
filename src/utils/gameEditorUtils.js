// Utility function to get selected game data
export function getSelectedData(gameData, selectedItem) {
  if (!selectedItem) return null;

  switch (selectedItem.type) {
    case 'resource':
      return gameData.resources.find(r => r.id === selectedItem.id);
    case 'building':
      return gameData.buildings.find(b => b.id === selectedItem.id);
    case 'upgrade':
      return gameData.upgrades.find(u => u.id === selectedItem.id);
    case 'achievement':
      return gameData.achievements.find(a => a.id === selectedItem.id);
    default:
      return null;
  }
}
