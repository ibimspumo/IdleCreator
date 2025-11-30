import React from 'react';
import { BaseLogicNode } from './base/BaseLogicNode';
import { LOGIC_TYPES } from './logic';

/**
 * Logic Node Wrapper
 * Dynamically renders the correct logic node based on data.logicType
 */
export function LogicNode(props) {
  const { data } = props;
  const logicType = data.logicType || 'delay';
  const config = LOGIC_TYPES[logicType];

  if (!config) {
    console.error(`Unknown logic type: ${logicType}`);
    return <div className="custom-node error-node">Unknown Logic: {logicType}</div>;
  }

  return <BaseLogicNode {...props} config={config} />;
}
