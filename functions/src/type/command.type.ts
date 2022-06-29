export const DEFAULT_SCOPE = "public";
export const DEFAULT_COMMAND = "DEFAULT";
export const DEFAULT_SEARCH = "help";

export type CommandItemType = {
  name: string;
  url: string;
  searchurl?: string;
  enabled?: boolean;
};

export type CommandType = {
  [key: string]: {
    [key in PublicCommandNames]: CommandItemType;
  };
};

export type PublicCommandNames =
  | "fb"
  | "mw"
  | "ig"
  | "tw"
  | "waw"
  | "tg"
  | "tgw"
  | "cal"
  | "gcal"
  | "gmail"
  | "gdrive"
  | "gdoc"
  | "gdocs"
  | "gsheet"
  | "gsheets"
  | "gslide"
  | "gslides"
  | "gform"
  | "gforms"
  | "gmap"
  | "gmaps"
  | "gcloud"
  | "yt"
  | "gh"
  | "reddit"
  | "l"
  | "g"
  | "vs"
  | "$"
  | "c"
  | "wiki"
  | "todo"
  | "developer"
  | "DEFAULT";
