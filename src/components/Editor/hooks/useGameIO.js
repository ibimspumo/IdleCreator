import { useState } from 'react';
import { CompressionUtils } from '../../../utils/compression'; // Adjusted path

export function useGameIO(gameData, setGameData, logicOnSaveRef) {
  const [exportString, setExportString] = useState('');
  const [importString, setImportString] = useState('');

  const handleImportEditor = (compressedString) => {
    const importedData = CompressionUtils.decompress(compressedString);

    if (!importedData) {
      alert('Import failed: Invalid code');
      return;
    }

    const validation = CompressionUtils.validate(importedData);
    if (!validation.valid) {
      alert(`Import failed: ${validation.error}`);
      return;
    }

    setGameData(importedData);
    setImportString(''); // Close the import modal
    alert('Game imported successfully!');
  };

  const handleExport = () => {
    console.log('Export clicked');
    if (logicOnSaveRef.current) {
      logicOnSaveRef.current();
    }
    const validation = CompressionUtils.validate(gameData);
    if (!validation.valid) {
      alert(`Export failed: ${validation.error}`);
      return;
    }

    const compressed = CompressionUtils.compress(gameData);
    console.log('Export string:', compressed?.substring(0, 50));
    setExportString(compressed);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportString);
    alert('Export code copied to clipboard!');
  };

  return {
    exportString,
    setExportString,
    importString,
    setImportString,
    handleExport,
    handleImportEditor,
    handleCopyToClipboard,
  };
}