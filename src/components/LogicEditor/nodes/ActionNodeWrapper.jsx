import React from 'react';
import { BaseActionNode } from './base/BaseActionNode';
import { ACTION_TYPES } from './actions';

/**
 * Action Node Wrapper
 * Dynamically renders the correct action node based on data.actionType
 */
export function ActionNode(props) {
  const { data } = props;
  const actionType = data.actionType || 'addResource';
  const config = ACTION_TYPES[actionType];

  if (!config) {
    console.error(`Unknown action type: ${actionType}`);
    return <div className="custom-node error-node">Unknown Action: {actionType}</div>;
  }

  return <BaseActionNode {...props} config={config} />;
}
