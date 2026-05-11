require("dotenv").config();

const express = require("express");
const axios = require("axios");
const Anthropic = require("@anthropic-ai/sdk");

const { CONFIG } = require("./config/appConfig");


const app = express();
const PORT = 3000;


// ─── In-memory store (ticket context) ──────────────────────────────────────
// Stores YouTrack ticket data temporarily until a PR comes in
// Key: ticket ID (e.g "TKT-123"), Value: ticket details
const ticketStore = {};


// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(express.json()); // parses incoming JSON webhook payloads

// Health check — open http://localhost:3000 to confirm server is running
app.get("/health-check", (req, res) => {
  res.json({ status: "Server health is good ✅" });
});

app.use("/api", require("./routes")); // Import routes from routes.js


// ─── Routes ─────────────────────────────────────────────────────────────────




// YouTrack webhook — fires when a ticket is created or updated
app.post("/webhook/youtrack", async (req, res) => {
  try {
    const payload = req.body;
    console.log("📩 YouTrack webhook received:", JSON.stringify(payload, null, 2));

    // TODO: Extract ticket details from payload
    // const ticketId = payload.issue.id;
    // const summary = payload.issue.summary;
    // const description = payload.issue.description;

    // TODO: Store ticket context
    // ticketStore[ticketId] = { summary, description };

    res.status(200).json({ message: "YouTrack webhook received" });
  } catch (error) {
    console.error("❌ Error handling YouTrack webhook:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GitHub webhook — fires when a PR is opened or updated
app.post("/webhook/github", async (req, res) => {
  try {
    const payload = req.body;
    const action = payload.action;

    console.log("📩 GitHub webhook received. Action:", action);

    // Only process when PR is opened or new commits are pushed
    if (action !== "opened" && action !== "synchronize") {
      return res.status(200).json({ message: `Ignored action: ${action}` });
    }

    const pr = payload.pull_request;
    const repoFullName = payload.repository.full_name; // e.g "owner/repo"
    const prNumber = pr.number;
    const branchName = pr.head.ref;                    // e.g "feature/TKT-123-login"
    const prTitle = pr.title;                          // e.g "TKT-123: Add login"

    console.log(`🔀 PR #${prNumber} - Branch: ${branchName}`);

    // TODO: Extract ticket ID from branch name or PR title
    // const ticketId = extractTicketId(branchName) || extractTicketId(prTitle);

    // TODO: Fetch PR diff from GitHub API
    // const diff = await fetchPRDiff(repoFullName, prNumber);

    // TODO: Get ticket context from store
    // const ticketContext = ticketStore[ticketId];

    // TODO: Send to Claude for review
    // const review = await getAIReview(diff, ticketContext);

    // TODO: Post review as GitHub PR comment
    // await postGitHubComment(repoFullName, prNumber, review);

    res.status(200).json({ message: "GitHub webhook received" });
  } catch (error) {
    console.error("❌ Error handling GitHub webhook:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


// ─── Helper Functions (to be implemented) ───────────────────────────────────

// Extracts ticket ID from a string e.g "feature/TKT-123-login" → "TKT-123"
function extractTicketId(text) {
  const match = text.match(new RegExp(`${CONFIG.TICKET_PREFIX}-\\d+`));
  return match ? match[0] : null;
}

// Fetches the PR code diff from GitHub API
async function fetchPRDiff(repoFullName, prNumber) {
  // TODO: implement
}

// Sends the PR diff + ticket context to Claude and returns the review
async function getAIReview(diff, ticketContext) {
  // TODO: implement
}

// Posts the AI review as a comment on the GitHub PR
async function postGitHubComment(repoFullName, prNumber, comment) {
  // TODO: implement
}


// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📌 YouTrack webhook URL: http://localhost:${PORT}/webhook/youtrack`);
  console.log(`📌 GitHub webhook URL:   http://localhost:${PORT}/webhook/github`);
});