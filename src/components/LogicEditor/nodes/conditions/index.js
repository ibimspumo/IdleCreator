/**
 * Auto-loader for Condition Nodes
 * Automatically imports all condition node definitions from this directory
 */

// Import all .jsx files in this directory (except index.js)
const conditionModules = import.meta.glob('./*.jsx', { eager: true });

// Build CONDITION_TYPES object from all imported modules
export const CONDITION_TYPES = {};

Object.entries(conditionModules).forEach(([path, module]) => {
  const nodeConfig = module.default;
  if (nodeConfig && nodeConfig.id) {
    CONDITION_TYPES[nodeConfig.id] = nodeConfig;
  }
});

// Export for convenience
export default CONDITION_TYPES;
