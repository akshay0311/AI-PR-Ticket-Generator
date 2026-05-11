const express = require('express');
const githubRoutes = require('./routes/github.route');
const youTrackRoutes = require('./routes/youtrack.route');

const router = express.Router();

router.use("/github", githubRoutes);
router.get("/youtrack", youTrackRoutes);

module.exports = router;
