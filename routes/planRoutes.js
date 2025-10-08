const express = require("express");
const { generatePlans } = require("../controllers/planController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate", protect, generatePlans);

module.exports = router;
