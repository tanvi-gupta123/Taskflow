const Task = require("../models/Task");

// Create Task
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      estimatedHours: req.body.estimatedHours,
      board: req.body.board,
      owner: req.user.id,
    });

    res.status(201).json(task);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get Tasks of a Board
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      board: req.params.boardId,
      owner: req.user.id,
    });

    res.json(tasks);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
    try {

        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        Object.assign(task, req.body);

        await task.save();

        res.json(task);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
// Delete Task
exports.deleteTask = async (req, res) => {
    try {

        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        await task.deleteOne();

        res.json({
            message: "Task deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};