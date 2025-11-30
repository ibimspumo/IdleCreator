/**
 * Logic System Debug Utilities
 * Use in browser console to debug logic execution
 */

export const LogicDebug = {
  /**
   * Check if logic data exists in gameData
   */
  checkLogicData(gameData) {
    if (!gameData.logic) {
      console.error('❌ No logic data found in gameData');
      return false;
    }

    console.log('✅ Logic data found:');
    console.log('  - Nodes:', gameData.logic.nodes?.length || 0);
    console.log('  - Edges:', gameData.logic.edges?.length || 0);

    if (gameData.logic.nodes?.length === 0) {
      console.warn('⚠️ No logic nodes defined');
    }

    if (gameData.logic.edges?.length === 0) {
      console.warn('⚠️ No logic edges defined (nodes not connected)');
    }

    return true;
  },

  /**
   * Visualize logic flow as text
   */
  visualizeFlow(gameData) {
    if (!this.checkLogicData(gameData)) return;

    const { nodes, edges } = gameData.logic;

    console.log('\n📊 Logic Flow Visualization:\n');

    // Group nodes by type
    const eventNodes = nodes.filter(n => n.type === 'event');
    const actionNodes = nodes.filter(n => n.type === 'action');
    const conditionNodes = nodes.filter(n => n.type === 'condition');
    const logicNodes = nodes.filter(n => n.type === 'logic');

    console.log(`Events (${eventNodes.length}):`);
    eventNodes.forEach(node => {
      console.log(`  - ${node.data.eventType} [${node.id}]`);
      this.showConnections(node.id, edges, nodes);
    });

    if (actionNodes.length > 0) {
      console.log(`\nActions (${actionNodes.length}):`);
      actionNodes.forEach(node => {
        console.log(`  - ${node.data.actionType} [${node.id}]`);
      });
    }

    if (conditionNodes.length > 0) {
      console.log(`\nConditions (${conditionNodes.length}):`);
      conditionNodes.forEach(node => {
        console.log(`  - ${node.data.conditionType} [${node.id}]`);
      });
    }

    if (logicNodes.length > 0) {
      console.log(`\nLogic (${logicNodes.length}):`);
      logicNodes.forEach(node => {
        console.log(`  - ${node.data.logicType} [${node.id}]`);
      });
    }
  },

  /**
   * Show connections from a node
   */
  showConnections(nodeId, edges, nodes) {
    const outgoing = edges.filter(e => e.source === nodeId);
    if (outgoing.length === 0) {
      console.log('      └─ (no connections)');
      return;
    }

    outgoing.forEach((edge, i) => {
      const target = nodes.find(n => n.id === edge.target);
      const prefix = i === outgoing.length - 1 ? '└─' : '├─';
      if (target) {
        const label = target.data[`${target.type}Type`] || target.type;
        console.log(`      ${prefix}> ${label} [${target.id}]`);
      } else {
        console.log(`      ${prefix}> BROKEN LINK [${edge.target}]`);
      }
    });
  },

  /**
   * Test if logic executes
   */
  testLogicExecution(engine) {
    if (!engine) {
      console.error('❌ No engine instance provided');
      console.log('💡 Usage: LogicDebug.testLogicExecution(window.gameEngine)');
      return;
    }

    console.log('\n🧪 Testing Logic Execution:\n');

    // Test onGameStart
    console.log('Triggering: onGameStart');
    try {
      engine.logicExecutor.triggerEvent('onGameStart');
      console.log('✅ onGameStart triggered successfully');
    } catch (e) {
      console.error('❌ onGameStart failed:', e);
    }

    // Test onClick
    const resources = engine.gameData.resources;
    if (resources.length > 0) {
      const firstResource = resources[0].id;
      console.log(`\nTriggering: onClick (${firstResource})`);
      try {
        engine.logicExecutor.triggerEvent('onClick', { resourceId: firstResource });
        console.log(`✅ onClick triggered successfully`);
      } catch (e) {
        console.error(`❌ onClick failed:`, e);
      }
    }

    console.log('\n💡 Check gameState for changes');
    console.log('Current resources:', engine.gameState.resources);
  },

  /**
   * Validate logic structure
   */
  validateLogic(gameData) {
    if (!this.checkLogicData(gameData)) return false;

    const { nodes, edges } = gameData.logic;
    let valid = true;

    console.log('\n🔍 Validating Logic Structure:\n');

    // Check for orphaned nodes (no connections)
    const connectedNodes = new Set();
    edges.forEach(edge => {
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.target);
    });

    const orphans = nodes.filter(n => !connectedNodes.has(n.id) && n.type !== 'event');
    if (orphans.length > 0) {
      console.warn(`⚠️ Found ${orphans.length} orphaned nodes (not connected):`);
      orphans.forEach(n => {
        console.warn(`  - ${n.data[`${n.type}Type`]} [${n.id}]`);
      });
      valid = false;
    } else {
      console.log('✅ No orphaned nodes');
    }

    // Check for broken edges (target doesn't exist)
    const nodeIds = new Set(nodes.map(n => n.id));
    const brokenEdges = edges.filter(e => !nodeIds.has(e.target) || !nodeIds.has(e.source));
    if (brokenEdges.length > 0) {
      console.error(`❌ Found ${brokenEdges.length} broken edges:`);
      brokenEdges.forEach(e => {
        console.error(`  - ${e.source} → ${e.target}`);
      });
      valid = false;
    } else {
      console.log('✅ No broken edges');
    }

    // Check if event nodes exist
    const eventNodes = nodes.filter(n => n.type === 'event');
    if (eventNodes.length === 0) {
      console.warn('⚠️ No event nodes found (logic won\'t trigger)');
      valid = false;
    } else {
      console.log(`✅ Found ${eventNodes.length} event node(s)`);
    }

    // Check if events are connected
    const connectedEvents = eventNodes.filter(n =>
      edges.some(e => e.source === n.id)
    );
    if (connectedEvents.length < eventNodes.length) {
      console.warn(`⚠️ ${eventNodes.length - connectedEvents.length} event node(s) not connected to actions`);
      valid = false;
    } else {
      console.log('✅ All events connected');
    }

    console.log(valid ? '\n✅ Logic structure is valid' : '\n⚠️ Logic has issues');
    return valid;
  },

  /**
   * Monitor logic execution
   */
  enableDebugMode(engine) {
    if (!engine) {
      console.error('❌ No engine instance provided');
      return;
    }

    console.log('🔧 Debug mode enabled - all logic execution will be logged');

    // Wrap triggerEvent
    const originalTrigger = engine.logicExecutor.triggerEvent.bind(engine.logicExecutor);
    engine.logicExecutor.triggerEvent = function(eventName, context) {
      console.log(`🎯 [EVENT] ${eventName}`, context || '');
      return originalTrigger(eventName, context);
    };

    // Wrap executeAction
    const originalAction = engine.logicExecutor.actionExecutor.executeAction.bind(
      engine.logicExecutor.actionExecutor
    );
    engine.logicExecutor.actionExecutor.executeAction = function(node, context) {
      console.log(`⚡ [ACTION] ${node.data.actionType}`, node.data);
      return originalAction(node, context);
    };

    // Wrap executeCondition
    const originalCondition = engine.logicExecutor.conditionExecutor.executeCondition.bind(
      engine.logicExecutor.conditionExecutor
    );
    engine.logicExecutor.conditionExecutor.executeCondition = function(node, context) {
      console.log(`❓ [CONDITION] ${node.data.conditionType}`, node.data);
      return originalCondition(node, context);
    };

    console.log('💡 Use LogicDebug.disableDebugMode(engine) to stop logging');
  },

  /**
   * Disable debug mode
   */
  disableDebugMode() {
    console.log('Debug mode can only be disabled by reloading the page');
  }
};

// Make available globally for console access
if (typeof window !== 'undefined') {
  window.LogicDebug = LogicDebug;
}
