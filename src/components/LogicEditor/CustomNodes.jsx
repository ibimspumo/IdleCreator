import { EventNode } from './nodes/EventNode';
import { ActionNode } from './nodes/ActionNode';
import { ConditionNode } from './nodes/ConditionNode';
import { LogicNode } from './nodes/LogicNode';
import { GroupNode } from './nodes/GroupNode';
import '../../styles/custom-nodes.css'; // New CSS for custom nodes


export const nodeTypes = {
  event: EventNode,
  action: ActionNode,
  condition: ConditionNode,
  logic: LogicNode,
  group: GroupNode,
};