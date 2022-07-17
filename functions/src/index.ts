import { https, logger } from "firebase-functions";
import { ParsedQs } from "qs";

import { COMMANDS } from "./commands";
import { getCommandById } from "./orchestrator/command.orchestrator";
import {
  CommandItemType,
  DEFAULT_COMMAND,
  DEFAULT_SCOPE,
  DEFAULT_SEARCH
} from "./type/command.type";
import { getAvailableCommands, initDB, viewHelpPage } from "./utils";

const hopperLookup = async (scope: string, input: string) => {
  let inputArray: Array<string> = [];
  if (input.startsWith("$")) {
    inputArray = input.split(/[ $+]/g);
    inputArray[0] = "$";
    if (inputArray[1] === "") {
      inputArray = ["$"];
    }
  } else {
    inputArray = input.split(/[ +]/g);
  }

  const prefix = inputArray[0].endsWith(".")
    ? inputArray[0].slice(0, -1).toLowerCase()
    : inputArray[0].toLowerCase();

  return new Promise<string>((resolve, reject) => {
    try {
      getCommandById(scope, prefix)
        .then((command: CommandItemType | null) => {
          if (command !== null) {
            const protocol = new URL(command.url).protocol;
            if (protocol !== "https:" && protocol !== "http:") {
              return resolve("");
            }
            if (command.searchurl && inputArray.length !== 1) {
              const searchParam =
              prefix !== "$" ? prefix.length + 1 : prefix.length;
              return resolve(
                `${command.searchurl}${encodeURIComponent(
                  input.substring(searchParam)
                )}`
              );
            }
            return resolve(command.url);
          }
        })
        .catch(() => {
          return resolve("");
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const loadDB = https.onRequest(async (request, response) => {
  await initDB();
  response.status(200).send("Data loaded");
});

const _handleScopeQueryParameter = (queryParameter: string | string[] | ParsedQs | ParsedQs[] | undefined) => {
  if (queryParameter === undefined || queryParameter === null || queryParameter === "") {
    return [];
  }
  return queryParameter.toString().split(",");
};

export const apiGetCommands = https.onRequest(async (request, response) => {
  const scopesQuery = new Set([..._handleScopeQueryParameter(request.query.scope), DEFAULT_SCOPE]);
  response.status(200).send(await getAvailableCommands([...scopesQuery]));
});

export const hopper = https.onRequest(async (request, response) => {
  const scopesQuery = new Set([..._handleScopeQueryParameter(request.query.scope), DEFAULT_SCOPE]);
  const searchQuery = String(request.query.search || DEFAULT_SEARCH);
  const defaultCommand = await getCommandById(
    DEFAULT_SCOPE,
    DEFAULT_COMMAND
  ).catch(() => COMMANDS[DEFAULT_SCOPE][DEFAULT_COMMAND]);
  let isFound = false;
  switch (searchQuery) {
    case DEFAULT_SEARCH:
      response.status(200).send(await viewHelpPage(scopesQuery));
      break;
    default:
      for (const scopeQuery of scopesQuery) {
        if (isFound) {
          return;
        }
        await hopperLookup(scopeQuery, searchQuery)
          .then((redirectUri: string) => {
            if (!redirectUri && defaultCommand?.searchurl) {
              if (scopeQuery === DEFAULT_SCOPE) {
                if (process.env.FUNCTIONS_EMULATOR) {
                  return response
                    .status(200)
                    .send(
                      `${defaultCommand?.searchurl}${encodeURIComponent(
                        searchQuery
                      )}`
                    );
                } else {
                  return response
                    .status(302)
                    .redirect(
                      `${defaultCommand?.searchurl}${encodeURIComponent(
                        searchQuery
                      )}`
                    );
                }
              }
            } else {
              isFound = true;
              if (process.env.FUNCTIONS_EMULATOR) {
                return response.status(302).send(redirectUri);
              } else {
                return response.status(302).redirect(redirectUri);
              }
            }
          })
          .catch((reject: string) => {
            logger.error(reject);
            response.status(500).send("Unexpected error occured");
          });
      }
      break;
  }
});
