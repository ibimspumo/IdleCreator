import { useState, useMemo } from 'react';
import { generateCodePreview } from '../../../utils/codePreviewGenerator';
import { ExecutableCodeGenerator } from '../../../utils/executableCodeGenerator';

/**
 * useCodePreview - Handles code preview generation and visibility
 */
export function useCodePreview(nodes, edges, gameData) {
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [codeMode, setCodeMode] = useState('readable'); // 'readable' or 'executable'

  // Create a stable dependency key that changes when gameData items change
  const gameDataKey = useMemo(() => {
    return JSON.stringify({
      resources: gameData?.resources?.map(r => ({ id: r.id, name: r.name })),
      buildings: gameData?.buildings?.map(b => ({ id: b.id, name: b.name })),
      upgrades: gameData?.upgrades?.map(u => ({ id: u.id, name: u.name })),
      achievements: gameData?.achievements?.map(a => ({ id: a.id, name: a.name }))
    });
  }, [gameData?.resources, gameData?.buildings, gameData?.upgrades, gameData?.achievements]);

  // Generate human-readable code
  const readableCode = useMemo(() => {
    return generateCodePreview(nodes, edges, gameData);
  }, [nodes, edges, gameData, gameDataKey]);

  // Generate executable JavaScript code
  const executableCode = useMemo(() => {
    const generator = new ExecutableCodeGenerator(nodes, edges, gameData);
    return generator.generate();
  }, [nodes, edges, gameData, gameDataKey]);

  const codePreview = codeMode === 'executable' ? executableCode : readableCode;

  const toggleCodePreview = () => setShowCodePreview(!showCodePreview);
  const toggleCodeMode = () => setCodeMode(codeMode === 'executable' ? 'readable' : 'executable');

  return {
    showCodePreview,
    setShowCodePreview,
    toggleCodePreview,
    codePreview,
    codeMode,
    setCodeMode,
    toggleCodeMode
  };
}
