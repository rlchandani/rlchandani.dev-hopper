import { COMMANDS } from "./commands";
import {
  addCommand,
  getAllCommands
} from "./orchestrator/command.orchestrator";
import { PublicCommandNames } from "./type/command.type";

export const viewHelpPage = async (scopes: Set<string>) => {
  const columns = [
    { title: "Scope" },
    { title: "Command" },
    { title: "Name" },
    { title: "Uri" },
    { title: "Search Uri" }];
  const data: string[][] = [];
  for (const scope of scopes) {
    const tempCommands = await getAllCommands(scope);
    Object.keys(tempCommands).forEach((command: string) => {
      const cmdData = tempCommands[command];
      return data.push([scope, command, cmdData.name, cmdData.url, cmdData.searchurl || ""]);
    });
  }
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Hopper | Help</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.css">
      <link rel="stylesheet" href="https://cdn.datatables.net/1.12.1/css/dataTables.semanticui.min.css">
      <style>
        .ui.container {
          margin-top:10px;
          padding-bottom:40px;
        }
        code {
          background-color: rgba(175,184,193,0.2);
          font-family: ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
          padding: 0.2em 0.4em;
          margin: 0;
          font-size: 85%;
          border-radius: 6px;
        }
      </style>
    </head>
    <body>
      <div class="ui container">
        <div class="ui icon message">
          <i class="inbox icon"></i>
          <div class="content">
            <div class="header">
              Do you know Hopper is hosted live and available to use publicly?
            </div>
            <p><a href="#" id="link-to-configure">Click here</a> to learn how to configure your browser to use it.</p>
          </div>
        </div>
        <div id="hopper-tabs" class="ui top attached tabular menu">
          <a class="item active" data-tab="commands">Commands</a>
          <a class="item" data-tab="configure">Configure</a>
          <a class="item" data-tab="about">About Hopper</a>
        </div>
        <div class="ui bottom attached tab segment active" data-tab="commands">
          <table id="hopper-commands" class="ui celled table" style="width:100%"></table>
        </div>
        <div class="ui bottom attached tab segment" data-tab="configure">
          <h3 id="configure-hopper-on-browser">Configure Hopper on Browser</h3>
          <ol>
            <li>
              Open 
                <code>
                  Chrome &gt; Settings &gt; Search Engines &gt; Manage Search Engines
                </code>
            </li>
            <li>Click <code>Add</code> under <code>Site search</code></li>
            <li>Type in following information in dialog and click <code>Save</code><ul>
            <li>Search engine: <code>Hopper</code></li>
            <li>Shortcut: <code>hopper.rlchandani.com</code></li>
            <li>URL with %s in place of query: <code>https://hopper.rlchandani.dev/?search=%s</code></li>
            </ul>
            </li>
            <li>Make this newly added custom site search as the default search engine.</li>
            <li>
              All done! Now open a new tab and start using 
              <a href="#" id="link-to-commands">available commands</a>
            </li>
          </ol>
          <h3 id="use-hopper-on-browser">Use Hopper on Browser</h3>
          <ol>
            <li>Command can be used as it is to redirect to configured URL like <code>gh</code> will redirect to <code>https://github.com/</code></li>
            <li>Also, additional text can be added after the command to redirect to configured search URL like <code>gh rlchandani</code> will redirect to <code>https://github.com/search?q=rlchandani</code></li>
          </ol>
          <h3 id="supported-browser">Supported Browser</h3>
          <ol>
            <li>Chrome</li>
            <li>Firefox (Use <a href="https://addons.mozilla.org/en-US/firefox/addon/add-custom-search-engine/" target"_blank">Add custom search engine</a> plugin to configure custom seach engine)</li>
            <li>Any other browser that support custom site search</li>
          </ol>
        </div>
        <div class="ui bottom attached tab segment" data-tab="about">
          <p>
            While I was at Meta, I was introduced to an internally developed tool <code>bunnylol</code> and 
            instantly fell in ❤️ with it.
          </p>
          <p>
            Hopper is an open source version I developed for personal use because it is impossible to go back 
            to typing full URLs in the address bar 😃.
          </p>
          <p>
            This is configured to be hosted on Firebase which will deploy 1 function and 1 hosting website to 
            enable hosting using a custom domain which is <code>rlchandani.me</code> in this case.
          </p>        
        </div>
      </div>
      <script src="https://code.jquery.com/jquery-3.5.1.js"></script>
      <script src="https://cdn.datatables.net/1.12.1/js/jquery.dataTables.min.js"></script>
      <script src="https://cdn.datatables.net/1.12.1/js/dataTables.semanticui.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.js"></script>
      <script>
        $(document).ready(function () {
          $('#hopper-tabs .item').tab();
          $('#link-to-commands').click((e) => {
            e.preventDefault();
            $('#hopper-tabs .item').tab('change tab', 'commands');
          });
          $('#link-to-configure').click((e) => {
            e.preventDefault();
            $('#hopper-tabs .item').tab('change tab', 'configure');
          });
          $('#hopper-commands').DataTable({
            data: ${JSON.stringify(data)},
            columns: ${JSON.stringify(columns)},
            paging: false,
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

type GetAvailableCommandsResponseCommand = {
  // { command: description of command }
  // eg: { "pt": "Phonetool"}
  [command:string]: string;
}

type GetAvailableCommandsResponse = {
  // { scope: { command: description of command } }
  // eg: { "amazon": { "pt": "Phonetool" } }
  [scope: string]: GetAvailableCommandsResponseCommand
};

export const getAvailableCommands = async (scopes: string[]) => {
  const response:GetAvailableCommandsResponse = {};
  for (const scope of scopes) {
    await getAllCommands(scope).then((allCommands) => {
      Object.keys(allCommands).forEach((command: string) => {
        const cmdData = allCommands[command];
        if (scope in response === false) {
          response[scope] = {} as GetAvailableCommandsResponseCommand;
        }
        response[scope][command] = cmdData.name;
      });
    });
  }
  return response;
};
