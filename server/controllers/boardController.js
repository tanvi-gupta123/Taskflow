const Board = require("../models/Board");

// Create Board
exports.createBoard = async (req, res) => {
  try {
    const board = await Board.create({
      title: req.body.title,
      description: req.body.description,
      owner: req.user.id,
    });

    res.status(201).json(board);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get Boards
exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      owner: req.user.id,
    });

    res.json(boards);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Delete Board

    exports.deleteBoard = async (req, res) => {
    try {

        const board = await Board.findOne({
            _id: req.params.id,
            owner: req.user.id
        });

        if (!board) {
            return res.status(404).json({
                message: "Board not found"
            });
        }

        await board.deleteOne();

        res.json({
            message: "Board deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


// Update Board
exports.updateBoard = async (req, res) => {
    try {

        const board = await Board.findOne({
            _id: req.params.id,
            owner: req.user.id
        });

        if (!board) {
            return res.status(404).json({
                message: "Board not found"
            });
        }

        board.title = req.body.title || board.title;
        board.description = req.body.description || board.description;

        await board.save();

        res.json(board);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};