/**
 * Auto-loader for Event Nodes
 * Automatically imports all event node definitions from this directory
 */

// Import all .jsx files in this directory (except index.js)
const eventModules = import.meta.glob('./*.jsx', { eager: true });

// Build EVENT_TYPES object from all imported modules
export const EVENT_TYPES = {};

Object.entries(eventModules).forEach(([path, module]) => {
  const nodeConfig = module.default;
  if (nodeConfig && nodeConfig.id) {
    EVENT_TYPES[nodeConfig.id] = nodeConfig;
  }
});

// Export for convenience
export default EVENT_TYPES;
