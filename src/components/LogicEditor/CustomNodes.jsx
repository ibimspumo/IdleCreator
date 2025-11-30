import { EventNode, EVENT_TYPES } from './nodes/EventNode';
import { ActionNode, ACTION_TYPES } from './nodes/ActionNode';
import { ConditionNode } from './nodes/ConditionNode';
import { LogicNode } from './nodes/LogicNode';
import { GroupNode } from './nodes/GroupNode';
import '../../styles/custom-nodes.css'; // New CSS for custom nodes

// Re-export types for use in other components
export { EVENT_TYPES, ACTION_TYPES };

export const nodeTypes = {
  event: EventNode,
  action: ActionNode,
  condition: ConditionNode,
  logic: LogicNode,
  group: GroupNode,
};