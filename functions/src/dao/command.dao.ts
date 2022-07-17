import { logger } from "firebase-functions";
import _ = require("lodash");

import { firebaseCommandsRef } from "../helper/db.helper";
import { CommandItemType } from "../type/command.type";

// Hack to store $ sign as key can't contain ".", "#", "$", "[", or "]"
const encodeSpecialChars = (input: string) => {
  return input
    .replace(/\$/g, "|dollar|")
    .replace(/\./g, "|period|")
    .replace(/#/g, "|pound|")
    .replace(/\[/g, "|sq_bracket_open|")
    .replace(/\]/g, "|sq_bracket_close|");
};

const decodeSpecialChars = (input: string) => {
  return input
    .replace(/\|dollar\|/g, "$")
    .replace(/\|period\|/g, ".")
    .replace(/\|pound\|/g, "#")
    .replace(/\|sq_bracket_open\|/g, "[")
    .replace(/\|sq_bracket_close\|/g, "]");
};

const add = async (scope: string, commandId: string, commandItem: CommandItemType): Promise<boolean> => {
  const id = encodeSpecialChars(commandId);
  const retCommand = await get(scope, id);
  if (
    retCommand === null ||
    retCommand.name !== commandItem.name ||
    retCommand.url !== commandItem.url ||
    retCommand.searchurl != commandItem.searchurl
  ) {
    commandItem.enabled = true;
    await firebaseCommandsRef.child(scope).child(id).set(commandItem);
    return true;
  }
  return false;
};

const getAll = async (scope: string): Promise<{ [key: string]: CommandItemType } | null> => {
  return firebaseCommandsRef
    .child(scope)
    .once("value")
    .then((snapshot) => {
      const commands = snapshot.val();
      if (commands !== null) {
        return _.mapKeys(commands, (value, key) => decodeSpecialChars(key)) as { [key: string]: CommandItemType };
      }
      return null;
    })
    .catch((err) => {
      logger.error("Failed to query database in function: getAll.", err);
      throw err;
    });
};

const get = async (scope: string, commandId: string): Promise<CommandItemType | null> => {
  return firebaseCommandsRef
    .child(scope)
    .child(encodeSpecialChars(commandId))
    .once("value")
    .then((snapshot) => {
      const command = snapshot.val();
      if (command !== null) {
        return command as CommandItemType;
      }
      return null;
    })
    .catch((err) => {
      logger.error("Failed to query database in function: get.", err);
      throw err;
    });
};

const remove = async (id: string) => {
  return firebaseCommandsRef.child(encodeSpecialChars(id)).remove();
};

const purge = async () => {
  return firebaseCommandsRef.remove();
};

export { add, get, getAll, purge, remove };
