import { logger } from "firebase-functions";

import * as commandDao from "../dao/command.dao";
import { CommandItemType, DEFAULT_SCOPE } from "../type/command.type";

const addCommand = async (
  scope: string,
  commandId: string,
  commandItem: CommandItemType
) => {
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
  const snapshot = await commandDao.getAll(scope);
  if (snapshot !== null) {
    return snapshot;
  }
  logger.info(`No commands(s) found in scope: ${scope}`);
  return {};
};

const getCommandById = async (
  scope: string = DEFAULT_SCOPE,
  commandId: string
) => {
  const snapshot = await commandDao.get(scope, commandId);
  if (snapshot !== null && snapshot.enabled === true) {
    return snapshot;
  }
  throw new Error(
    `No command found with name: ${commandId} in scope: ${scope}`
  );
};

const checkIfCommandExist = async (
  scope: string = DEFAULT_SCOPE,
  commandId: string
) => {
  try {
    await getCommandById(scope, commandId);
    return true;
  } catch (err) {
    return false;
  }
};

export { addCommand, checkIfCommandExist, getAllCommands, getCommandById };
