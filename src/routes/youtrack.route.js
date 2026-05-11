const express = require('express');
const router = express.Router();

const youTrackRoutes = (req, res) => {
  res.json({ message: "YouTrack webhook test endpoint ✅" });
};

module.exports = youTrackRoutes;
