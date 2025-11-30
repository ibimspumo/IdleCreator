/**
 * Auto-loader for Logic Nodes
 * Automatically imports all logic node definitions from this directory
 */

// Import all .jsx files in this directory (except index.js)
const logicModules = import.meta.glob('./*.jsx', { eager: true });

// Build LOGIC_TYPES object from all imported modules
export const LOGIC_TYPES = {};

Object.entries(logicModules).forEach(([path, module]) => {
  const nodeConfig = module.default;
  if (nodeConfig && nodeConfig.id) {
    LOGIC_TYPES[nodeConfig.id] = nodeConfig;
  }
});

// Export for convenience
export default LOGIC_TYPES;
