const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  createBoard,
  getBoards,
  deleteBoard,
  updateBoard,
} = require("../controllers/boardController");

router.post("/", auth, createBoard);

router.get("/", auth, getBoards);

router.put("/:id", auth, updateBoard);

router.delete("/:id", auth, deleteBoard);

module.exports = router;