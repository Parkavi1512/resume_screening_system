const express = require("express");
const { analyzeResume, matchCandidate } = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.post("/analyzeResume", analyzeResume);
router.post("/matchCandidate", matchCandidate);

module.exports = router;
