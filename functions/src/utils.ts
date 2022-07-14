import { COMMANDS } from "./commands";
import {
  addCommand,
  getAllCommands
} from "./orchestrator/command.orchestrator";
import { PublicCommandNames } from "./type/command.type";

export const viewHelpPage = async () => {
  const columns = [{ title: "Command" }, { title: "Name" }, { title: "Uri" }];
  const allCommands = await getAllCommands();
  const data = Object.keys(allCommands).map((command: string) => {
    const cmdData = allCommands[command];
    return [command, cmdData.name, cmdData.url];
  });
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Hopper | Help</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="https://cdn.datatables.net/1.12.1/css/jquery.dataTables.min.css">
    </head>
    <body>
      <table id="hopper-commands" class="display" style="width:100%"></table>
      <script src="https://code.jquery.com/jquery-3.5.1.js"></script>
      <script src="https://cdn.datatables.net/1.12.1/js/jquery.dataTables.min.js"></script>
      <script>
        $(document).ready(function () {
          $('#hopper-commands').DataTable({
            data: ${JSON.stringify(data)},
            columns: ${JSON.stringify(columns)}
          });
        });
      </script>
    </body>
    </html>
  `;
};

export const initDB = async () => {
  const promises: Promise<void>[] = [];
  Object.keys(COMMANDS).forEach((scope: string) => {
    Object.keys(COMMANDS[scope]).forEach((id: string) =>
      promises.push(
        addCommand(scope, id, COMMANDS[scope][id as PublicCommandNames])
      )
    );
  });
  await Promise.all(promises);
};

export const getAvailableCommands = async (scopes: string[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response:any = {};
  for (const scope of scopes) {
    await getAllCommands(scope).then((allCommands) => {
      Object.keys(allCommands).forEach((command: string) => {
        const cmdData = allCommands[command];
        allCommands[command] = cmdData.name;
      });
      response[scope] = allCommands;
    });
  }
  return response;
};
