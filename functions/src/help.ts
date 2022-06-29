import { CommandNames, COMMANDS } from "./commands.js";

export const viewHelpPage = () => {
  const data = Object.keys(COMMANDS).map((command: string) => {
    const cmdData = COMMANDS[command as CommandNames];
    return [cmdData.name, cmdData.url, command];
  });
  const columns = [{ title: "Command" }, { title: "Name" }, { title: "Uri" }];
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
