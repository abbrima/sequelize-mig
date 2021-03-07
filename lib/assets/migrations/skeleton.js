const {
  database: { Sequelize },
} = require('usol-utils');
/**
 * Actions summary:
 *
 * '<%actions%>'
 *
 */

const info = '<%info%>';

const migrationCommands = (transaction) => {
  return ['<%commandsUp%>'];
};

const rollbackCommands = (transaction) => {
  return ['<%commandsDown%>'];
};

const pos = 0;
const useTransaction = true;

/**
 *
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {ipmort('sequelize').Sequelize} sequelize
 * @param {} _commands
 */
const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (this.useTransaction) {
    return queryInterface.sequelize.transaction(run);
  }
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) => {
    return execute(queryInterface, sequelize, migrationCommands);
  },
  down: (queryInterface, sequelize) => {
    return execute(queryInterface, sequelize, rollbackCommands);
  },
  info,
};
