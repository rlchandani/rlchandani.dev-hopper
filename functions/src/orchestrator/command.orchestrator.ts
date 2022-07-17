import { logger } from "firebase-functions";
import _ = require("lodash");

import * as commandDao from "../dao/command.dao";
import { CommandItemType, DEFAULT_SCOPE } from "../type/command.type";

const addCommand = async (scope: string, commandId: string, commandItem: CommandItemType) => {
  try {
    if (await commandDao.add(scope, commandId, commandItem)) {
      logger.info(
        `Command registered: ${JSON.stringify(
          commandItem
        )} under scope ${scope}`
      );
    }
  } catch (err) {
    logger.error(
      `Command failed to register: ${JSON.stringify(commandItem)}.`,
      err
    );
    throw err;
  }
};

const getAllCommands = async (scope: string = DEFAULT_SCOPE) => {
  return commandDao.getAll(scope)
    .then((commands) => {
      if (commands === null) {
        logger.info(`No commands(s) found in scope: ${scope}`);
      }
      return _.pickBy(commands, (command) => command.enabled === true);
    });
};

const getCommandById = async ( scope: string = DEFAULT_SCOPE, commandId: string) => {
  return commandDao.get(scope, commandId)
    .then((command) => {
      if (command === null || command.enabled === false) {
        throw new Error(
          `No command found with name: ${commandId} in scope: ${scope}`
        );
      }
      return command;
    });
};

export { addCommand, getAllCommands, getCommandById };
