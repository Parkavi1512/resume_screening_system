const express = require("express");
const { uploadResume, getResumes, getResumeById, deleteResume } = require("../controllers/resumeController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();
router.use(protect);

router.post("/upload", upload.single("resume"), uploadResume);
router.get("/", getResumes);
router.get("/:id", getResumeById);
router.delete("/:id", deleteResume);

module.exports = router;
