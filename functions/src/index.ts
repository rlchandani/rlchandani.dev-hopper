import * as functions from "firebase-functions";

import { CommandNames, COMMANDS, CommandType } from "./commands";
import { viewHelpPage } from "./help";

const hopperLookup = async (input: string) => {
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
      if (!(prefix in COMMANDS)) {
        return resolve("");
      }
      const command: CommandType = COMMANDS[prefix as CommandNames];
      const protocol = new URL(command.url).protocol;
      if (protocol !== "https:" && protocol !== "http:") {
        return resolve("help");
      }
      if (command.searchurl && inputArray.length !== 1) {
        const searchParam = prefix !== "$" ? prefix.length + 1 : prefix.length;
        return resolve(
          `${command.searchurl}${encodeURIComponent(
            input.substring(searchParam)
          )}`
        );
      }
      return resolve(command.url);
    } catch (e) {
      reject(e);
    }
  });
};

export const hopper = functions.https.onRequest((request, response) => {
  const searchQuery = String(request.query.search || "help");
  switch (searchQuery) {
    case "help":
      response.status(200).send(viewHelpPage());
      break;
    default:
      hopperLookup(searchQuery)
        .then((redirectUri: string) => {
          if (!redirectUri && COMMANDS.DEFAULT.searchurl) {
            if (process.env.FUNCTIONS_EMULATOR) {
              response
                .status(200)
                .send(
                  `${COMMANDS.DEFAULT.searchurl}${encodeURIComponent(
                    searchQuery
                  )}`
                );
            } else {
              response
                .status(302)
                .redirect(
                  `${COMMANDS.DEFAULT.searchurl}${encodeURIComponent(
                    searchQuery
                  )}`
                );
            }
          } else {
            if (process.env.FUNCTIONS_EMULATOR) {
              response.status(302).send(redirectUri);
            } else {
              response.status(302).redirect(redirectUri);
            }
          }
        })
        .catch((reject: string) => {
          functions.logger.error(reject);
          response.status(500).send("Unexpected error occured");
        });
      break;
  }
});
