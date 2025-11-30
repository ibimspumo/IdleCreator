import { useState, useEffect, useRef } from 'react';

/**
 * useAutoSave - Handles auto-saving logic with 5 second debounce
 */
export function useAutoSave(nodes, edges, gameData, onGameDataChange) {
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'unsaved', 'saving'
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    const currentLogic = gameData.logic || { nodes: [], edges: [] };
    const hasChanges = JSON.stringify(currentLogic.nodes) !== JSON.stringify(nodes) ||
                       JSON.stringify(currentLogic.edges) !== JSON.stringify(edges);

    if (hasChanges) {
      setSaveStatus('unsaved');

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout for auto-save after 5 seconds
      saveTimeoutRef.current = setTimeout(() => {
        setSaveStatus('saving');
        onGameDataChange({
          ...gameData,
          logic: { nodes, edges }
        });

        // Show saved status briefly
        setTimeout(() => {
          setSaveStatus('saved');
        }, 500);
      }, 5000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [nodes, edges, gameData, onGameDataChange]);

  return { saveStatus };
}
