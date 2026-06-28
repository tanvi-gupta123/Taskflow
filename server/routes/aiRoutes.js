const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const { suggestEstimate } = require("../controllers/aiController");

router.post("/suggest", auth, suggestEstimate);

module.exports = router;