export type CommandType = {
  name: string;
  url: string;
  searchurl?: string;
};

export type CommandNames =
  | "fb"
  | "m"
  | "mw"
  | "wa"
  | "waw"
  | "gm"
  | "yt"
  | "gh"
  | "r"
  | "l"
  | "ig"
  | "tw"
  | "vs"
  | "todo"
  | "c"
  | "wf"
  | "$"
  | "cal"
  | "p"
  | "gd"
  | "wiki"
  | "g"
  | "developer"
  | "DEFAULT";

export const COMMANDS: { [key in CommandNames]: CommandType } = {
  fb: {
    name: "Facebook",
    url: "https://facebook.com/",
    searchurl: "https://www.facebook.com/search/top/?q="
  },
  m: {
    name: "Messenger Desktop App",
    url: "messenger://"
  },
  mw: {
    name: "Messenger Web",
    url: "https://www.messenger.com/"
  },
  wa: {
    name: "WhatsApp Desktop App",
    url: "whatsapp://"
  },
  waw: {
    name: "WhatsApp Web",
    url: "https://web.whatsapp.com/"
  },
  gm: {
    name: "Gmail",
    url: "https://mail.google.com/mail/u/0",
    searchurl: "https://mail.google.com/mail/u/"
  },
  gd: {
    name: "Google Drive",
    url: "https://drive.google.com/drive/u/0",
    searchurl: "https://drive.google.com/drive/u/"
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
  r: {
    name: "Reddit",
    url: "https://reddit.com/",
    searchurl: "https://www.reddit.com/search?q="
  },
  l: {
    name: "Linkedin",
    url: "https://linkedin.com/"
  },
  ig: {
    name: "Instagram",
    url: "https://instagram.com/",
    searchurl: "https://instagram.com/"
  },
  tw: {
    name: "Twitter",
    url: "https://twitter.com/",
    searchurl: "https://twitter.com/search?q="
  },
  developer: {
    name: "Rohit Lal Chandani | ",
    url: "https://rlchandani.dev/about"
  },
  g: {
    name: "Google",
    url: "https://google.com/",
    searchurl: "https://www.google.com/search?q="
  },
  p: {
    name: "Piazza",
    url: "https://piazza.com/class"
  },
  vs: {
    name: "VS Code",
    url: "vscode://"
  },
  wf: {
    name: "Webflow",
    url: "https://webflow.com/design/hoohacks"
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
  cal: {
    name: "Google Calendar",
    url: "https://calendar.google.com/calendar/r"
  },
  wiki: {
    name: "Wikipedia",
    url: "https://en.wikipedia.org",
    searchurl: "https://en.wikipedia.org/wiki/"
  },
  todo: {
    name: "Microsoft To Do",
    url: "https://to-do.live.com"
  },
  DEFAULT: {
    name: "Default - Google Search",
    url: "https://google.com/",
    searchurl: "https://www.google.com/search?q="
  }
};
