/**
 * Builds a prompt for Claude to generate a YouTrack ticket from a GitHub PR.
 *
 * @param {string} prTitle        - Title of the pull request
 * @param {string} prBody         - Description of the pull request (can be empty)
 * @param {string} branchName     - Branch name e.g "feature/fix-auth-timeout"
 * @param {string} author         - GitHub username of the PR author
 * @param {string} diff           - Raw code diff of the PR
 *
 * @returns {string} - A well structured prompt to send to Claude
 */

export function buildTicketPrompt(prTitle, prBody, branchName, author, diff) {
  return `
    You are an experienced technical project manager.
    A developer has raised a GitHub Pull Request.
    
    Your job is to:
    1. Decide whether this PR is worth creating a YouTrack ticket for
    2. If yes, generate the ticket details

    Here is all the context you have:

    ─── PR DETAILS ────────────────────────────────
    Title       : ${prTitle}
    Author      : ${author}
    Branch      : ${branchName}
    Description : ${prBody?.trim() || "No description provided"}

    ─── CODE DIFF ─────────────────────────────────
    ${diff}
    ───────────────────────────────────────────────

    Decide shouldCreateTicket based on these rules:
    - true  → PR has meaningful code changes (feature, bug fix, refactor) and the decription or title in the PR says to create a ticket   
    - false → PR is trivial (typo fix, readme update, version bump, merge conflict fix) and nowhere is no mention of creating a ticket in the title or description

    Respond ONLY with a JSON object, no markdown, no backticks:
    {
      "shouldCreateTicket": true or false,
      "reason": "brief reason why you decided to create or skip the ticket",
      "summary": "short title (only if shouldCreateTicket is true, else null)",
      "description": "detailed explanation (only if shouldCreateTicket is true, else null)",
      "acceptanceCriteria": "what to test (only if shouldCreateTicket is true, else null)",
      "affectedModules": "affected files (only if shouldCreateTicket is true, else null)",
      "type": "Bug Fix | Feature | Refactor | Chore (only if shouldCreateTicket is true, else null)"
    }
  `;
}
