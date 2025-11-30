/**
 * Custom Nodes Registry
 * Exports all node types and their configurations
 *
 * This file now uses a dynamic import system where all node definitions
 * are loaded from individual files in the nodes/ subdirectories.
 */

import { EventNode } from './nodes/EventNodeWrapper';
import { ActionNode } from './nodes/ActionNodeWrapper';
import { ConditionNode } from './nodes/ConditionNodeWrapper';
import { LogicNode } from './nodes/LogicNodeWrapper';
import { GroupNode } from './nodes/GroupNode';

// Import node type definitions (for toolbox and properties)
import { EVENT_TYPES } from './nodes/events';
import { ACTION_TYPES } from './nodes/actions';
import { CONDITION_TYPES } from './nodes/conditions';
import { LOGIC_TYPES } from './nodes/logic';

// Re-export types for use in other components
export { EVENT_TYPES, ACTION_TYPES, CONDITION_TYPES, LOGIC_TYPES };

// Node types registry for ReactFlow
export const nodeTypes = {
  event: EventNode,
  action: ActionNode,
  condition: ConditionNode,
  logic: LogicNode,
  group: GroupNode,
};
