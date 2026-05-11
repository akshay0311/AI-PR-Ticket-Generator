import GithubService from "../services/github.service.js";
import { buildTicketPrompt } from "../utils/generatePrompt.js";

export const createBranch = (req, res) => {
    console.log("📩 GitHub test.....New Branch Created !!");
    res.status(201).json({ message: "New Branch Created Successfully !!✅" });
}


export const sendPRAndGenerateTicket = async (req, res) => {
    const event = req.headers["x-github-event"];

    const { pull_request, repository, action } = req.body;
    const prTitle = pull_request?.title;
    const prBody = pull_request?.body;
    const branchName = pull_request?.head.ref;
    const prNumber = pull_request?.number;
    const author = pull_request?.user?.login;
    const repoFullName = repository?.full_name;

    const githubService = new GithubService();

    // ✅ Only process these specific actions
    const allowedActions = ["opened", "synchronize", "edited"];

    // wrong event : Though this hook is only for PRs, we add this check to be safe
    if (event !== "pull_request") {
      return res.status(400).json({ 
        message: `Invalid event: ${event}` 
      });
    }

    // wrong action
    if (!allowedActions.includes(action)) {
        console.log(`⏭️ Ignored event: ${event} - action: ${action}`);
        return res.status(202).json({ message: `Ignored action: ${action}` });
    }


    const codeDiff = await githubService.fetchPRDiff(repoFullName, prNumber);

    console.log("code diff: ---", codeDiff);
    
    const promptToCreateTicket = buildTicketPrompt(prTitle, prBody, branchName, author, codeDiff);

    console.log("Prompt to Create ticket ---", promptToCreateTicket);

    const ticketData = await githubService.sendRequestToGroq(promptToCreateTicket);

     // ← check the boolean here
    if (!ticketData.shouldCreateTicket) {
        console.log("⏭️ Skipping ticket creation: ----", ticketData.reason);
        return;
    }

    console.log("Ticket data extracted from Groq response: ---", ticketData);

    const ticketCreationResponse = await githubService.createTicket(ticketData);

    console.log("Ticket created in YouTrack: ---", ticketCreationResponse);

    res.status(200).json({ message: "Ticket created successfully", ticketCreationResponse});
}   




