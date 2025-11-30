import { useCallback } from 'react';

// Helper to update node data (will be passed from LogicEditor)
export const NodeDataUpdater = ({ nodeId, data, onUpdate }) => {
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    onUpdate(nodeId, { ...data, [name]: value });
  }, [nodeId, data, onUpdate]);

  return { handleChange };
};
