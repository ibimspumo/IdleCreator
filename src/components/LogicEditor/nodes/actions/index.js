/**
 * Auto-loader for Action Nodes
 * Automatically imports all action node definitions from this directory
 */

// Import all .jsx files in this directory (except index.js)
const actionModules = import.meta.glob('./*.jsx', { eager: true });

// Build ACTION_TYPES object from all imported modules
export const ACTION_TYPES = {};

Object.entries(actionModules).forEach(([path, module]) => {
  const nodeConfig = module.default;
  if (nodeConfig && nodeConfig.id) {
    ACTION_TYPES[nodeConfig.id] = nodeConfig;
  }
});

// Export for convenience
export default ACTION_TYPES;
