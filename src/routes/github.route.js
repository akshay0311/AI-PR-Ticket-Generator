const express = require('express');
const router = express.Router();
const { createBranch, sendPRAndGenerateTicket } = require('../controllers/github.controller');

// GET /github/user - return GitHub user info placeholder
router.post('/create-branch', createBranch);

// Get /github/pr - return GitHub PR info placeholder
router.post('/send-pr-and-generate-ticket', sendPRAndGenerateTicket);


module.exports = router;
