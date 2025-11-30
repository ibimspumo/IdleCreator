import React from 'react';
import { BaseConditionNode } from './base/BaseConditionNode';
import { CONDITION_TYPES } from './conditions';

/**
 * Condition Node Wrapper
 * Dynamically renders the correct condition node based on data.conditionType
 */
export function ConditionNode(props) {
  const { data } = props;
  const conditionType = data.conditionType || 'ifResource';
  const config = CONDITION_TYPES[conditionType];

  if (!config) {
    console.error(`Unknown condition type: ${conditionType}`);
    return <div className="custom-node error-node">Unknown Condition: {conditionType}</div>;
  }

  return <BaseConditionNode {...props} config={config} />;
}
