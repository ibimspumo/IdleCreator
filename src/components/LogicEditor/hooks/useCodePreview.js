import { useState, useMemo } from 'react';
import { generateCodePreview } from '../../../utils/codePreviewGenerator';

/**
 * useCodePreview - Handles code preview generation and visibility
 */
export function useCodePreview(nodes, edges, gameData) {
  const [showCodePreview, setShowCodePreview] = useState(false);

  // Create a stable dependency key that changes when gameData items change
  const gameDataKey = useMemo(() => {
    return JSON.stringify({
      resources: gameData?.resources?.map(r => ({ id: r.id, name: r.name })),
      buildings: gameData?.buildings?.map(b => ({ id: b.id, name: b.name })),
      upgrades: gameData?.upgrades?.map(u => ({ id: u.id, name: u.name })),
      achievements: gameData?.achievements?.map(a => ({ id: a.id, name: a.name }))
    });
  }, [gameData?.resources, gameData?.buildings, gameData?.upgrades, gameData?.achievements]);

  const codePreview = useMemo(() => {
    return generateCodePreview(nodes, edges, gameData);
  }, [nodes, edges, gameData, gameDataKey]);

  const toggleCodePreview = () => setShowCodePreview(!showCodePreview);

  return {
    showCodePreview,
    setShowCodePreview,
    toggleCodePreview,
    codePreview
  };
}
