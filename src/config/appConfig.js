// ─── Config ────────────────────────────────────────────────────────────────
export const CONFIG = {
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,         // GitHub personal access token
  YOUTRACK_TOKEN: process.env.YOUTRACK_TOKEN,     // YouTrack permanent token
  YOUTRACK_BASE_URL: process.env.YOUTRACK_BASE_URL, // YouTrack URL
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  TICKET_PREFIX: process.env.TICKET_PREFIX || "TKT",                           // Your YouTrack ticket prefix e.g TKT-123
};