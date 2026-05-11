import {buildTicketPrompt} from '../utils/generatePrompt.js';
import groq from '../config/groqApiConfg.js';
import axios from 'axios';

class GithubService {
  constructor() {
    this.baseUrl = 'https://api.github.com';
  }

  /**
   * Fetch raw pull request diff
   * @param {string} repoFullName - Repository full name (owner/repo)
   * @param {number} prNumber - Pull request number
   * @returns {Promise<string>} Raw diff string
   */
  async fetchPRDiff(repoFullName, prNumber) {
    const response = await axios.get(
      `https://api.github.com/repos/${repoFullName}/pulls/${prNumber}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3.diff',
        },
      }
    );

    return response.data;
  }

  /**
   * Send request to Groq to generate ticket data
   * @param {string} promptToCreateTicket - Prompt for ticket creation
   * @returns {Promise<Object>} Parsed ticket data
   */
  async sendRequestToGroq(promptToCreateTicket) {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: promptToCreateTicket,
        },
      ],
      model: "openai/gpt-oss-20b",
    });

    console.log("Raw response from GPT: ---", response);

    // Extract the text response
    const rawText = response.choices[0].message.content;

    // Parse the JSON
    const ticketData = JSON.parse(rawText);

    return ticketData;
  }

  /**
   * Create ticket in YouTrack
   * @param {Object} ticketData - Ticket data with summary and description
   * @returns {Promise<Object>} Created ticket response
   */
  async createTicket(ticketData) {
    const projectResponse = await axios.get(`${process.env.YOUTRACK_BASE_URL}/api/admin/projects`, {
      headers: {
        "Authorization": `Bearer ${process.env.YOUTRACK_TOKEN}`,
      }
    });

    console.log("Projects in YouTrack: ---", projectResponse.data);

    const response = await axios.post(
      `${process.env.YOUTRACK_BASE_URL}/api/issues`,
      {
        summary: ticketData.summary,
        description: ticketData.description,
        project: {
          id: projectResponse.data[0]?.id || "0-0"
        }
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.YOUTRACK_TOKEN}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      }
    );

    return response.data;
  }
}

export default GithubService;
