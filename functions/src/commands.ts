import { CommandType, DEFAULT_SCOPE } from "./type/command.type";

export const COMMANDS: CommandType = {
  [DEFAULT_SCOPE]: {
    fb: {
      name: "Facebook",
      url: "https://facebook.com/",
      searchurl: "https://www.facebook.com/search/top/?q="
    },
    mw: {
      name: "Messenger Web",
      url: "https://www.messenger.com/"
    },
    ig: {
      name: "Instagram",
      url: "https://www.instagram.com/",
      searchurl: "https://www.instagram.com/explore/search/keyword/?q="
    },
    tw: {
      name: "Twitter",
      url: "https://twitter.com/",
      searchurl: "https://twitter.com/search?q="
    },
    waw: {
      name: "WhatsApp Web",
      url: "https://web.whatsapp.com/"
    },
    tg: {
      name: "Telegram Desktop",
      url: "https://t.me/",
      searchurl: "https://t.me/"
    },
    tgw: {
      name: "Telegram Web",
      url: "https://web.telegram.org/"
    },
    cal: {
      name: "Google Calendar",
      url: "https://calendar.google.com/calendar/r"
    },
    gcal: {
      name: "Google Calendar",
      url: "https://calendar.google.com/calendar/r"
    },
    gmail: {
      name: "Gmail",
      url: "https://mail.google.com/mail/u/0",
      searchurl: "https://mail.google.com/mail/u/0/#search/"
    },
    gdrive: {
      name: "Google Drive",
      url: "https://drive.google.com/drive/u/0/",
      searchurl: "https://drive.google.com/drive/search?q="
    },
    gdoc: {
      name: "Google Docs",
      url: "https://docs.google.com/document/u/0/",
      searchurl: "https://docs.google.com/document/u/0/?q="
    },
    gdocs: {
      name: "Google Docs",
      url: "https://docs.google.com/document/u/0/",
      searchurl: "https://docs.google.com/document/u/0/?q="
    },
    gsheet: {
      name: "Google Sheets",
      url: "https://docs.google.com/spreadsheets/u/0/",
      searchurl: "https://docs.google.com/spreadsheets/u/0/?q="
    },
    gsheets: {
      name: "Google Sheets",
      url: "https://docs.google.com/spreadsheets/u/0/",
      searchurl: "https://docs.google.com/spreadsheets/u/0/?q="
    },
    gslide: {
      name: "Google Slides",
      url: "https://docs.google.com/presentation/u/0/",
      searchurl: "https://docs.google.com/presentation/u/0/?q="
    },
    gslides: {
      name: "Google Slides",
      url: "https://docs.google.com/presentation/u/0/",
      searchurl: "https://docs.google.com/presentation/u/0/?q="
    },
    gform: {
      name: "Google Forms",
      url: "https://docs.google.com/forms/u/0/",
      searchurl: "https://docs.google.com/forms/u/0/?q="
    },
    gforms: {
      name: "Google Forms",
      url: "https://docs.google.com/forms/u/0/",
      searchurl: "https://docs.google.com/forms/u/0/?q="
    },
    gmap: {
      name: "Google Maps",
      url: "https://www.google.com/maps",
      searchurl: "https://www.google.com/maps/search/"
    },
    gmaps: {
      name: "Google Maps",
      url: "https://www.google.com/maps",
      searchurl: "https://www.google.com/maps/search/"
    },
    gcloud: {
      name: "Google Cloud",
      url: "https://console.cloud.google.com/",
      searchurl: "https://console.cloud.google.com/search;q="
    },
    yt: {
      name: "YouTube",
      url: "https://youtube.com/",
      searchurl: "https://www.youtube.com/results?search_query="
    },
    gh: {
      name: "GitHub",
      url: "https://github.com/",
      searchurl: "https://www.github.com/search?q="
    },
    reddit: {
      name: "Reddit",
      url: "https://reddit.com/",
      searchurl: "https://www.reddit.com/search?q="
    },
    l: {
      name: "Linkedin",
      url: "https://linkedin.com/",
      searchurl:
        "https://www.linkedin.com/search/results/all/?origin=RICH_QUERY_SUGGESTION&position=0&sid=C3C&keywords="
    },
    g: {
      name: "Google",
      url: "https://google.com/",
      searchurl: "https://www.google.com/search?q="
    },
    vs: {
      name: "VS Code",
      url: "vscode://"
    },
    $: {
      name: "Robinhood",
      url: "https://robinhood.com/",
      searchurl: "https://robinhood.com/stocks/"
    },
    c: {
      name: "Robinhood Crypto",
      url: "https://robinhood.com/",
      searchurl: "https://robinhood.com/crypto/"
    },
    wiki: {
      name: "Wikipedia",
      url: "https://en.wikipedia.org",
      searchurl: "https://en.wikipedia.org/wiki/"
    },
    todo: {
      name: "Microsoft To Do",
      url: "https://to-do.live.com/tasks/",
      searchurl: "https://to-do.live.com/tasks/search/"
    },
    developer: {
      name: "Rohit Lal Chandani | Developer",
      url: "https://rlchandani.dev/about"
    },
    DEFAULT: {
      name: "Default - Google Search",
      url: "https://google.com/",
      searchurl: "https://www.google.com/search?q="
    }
  }
};
