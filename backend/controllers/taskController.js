const Task = require('../models/taskModel');

const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const user_id = req.user.id;

    const taskId = await Task.create({
      user_id,
      title,
      description,
      status: status || 'Pending'
    });

    const newTask = await Task.findByIdAndUser(taskId, user_id);

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask
    });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Server error while creating task' });
  }
};

const getTasks = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { status, search, page = 1, limit = 6, sort = 'newest' } = req.query;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;

    const tasks = await Task.findAllByUser(user_id, {
      status,
      search,
      limit: parsedLimit,
      offset,
      sort
    });

    const totalTasks = await Task.countByUser(user_id, { status, search });
    const totalPages = Math.ceil(totalTasks / parsedLimit);

    res.status(200).json({
      tasks,
      pagination: {
        total: totalTasks,
        page: parsedPage,
        limit: parsedLimit,
        pages: totalPages || 1
      }
    });
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ message: 'Server error while fetching tasks' });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user_id = req.user.id;

    const task = await Task.findByIdAndUser(id, user_id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found or access denied' });
    }

    const updated = await Task.updateStatus(id, user_id, status);
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update task status' });
    }

    const updatedTask = await Task.findByIdAndUser(id, user_id);

    res.status(200).json({
      message: 'Task status updated successfully',
      task: updatedTask
    });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Server error while updating task status' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const task = await Task.findByIdAndUser(id, user_id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found or access denied' });
    }

    const deleted = await Task.delete(id, user_id);
    if (!deleted) {
      return res.status(400).json({ message: 'Failed to delete task' });
    }

    res.status(200).json({
      message: 'Task deleted successfully'
    });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ message: 'Server error while deleting task' });
  }
};

const getStats = async (req, res) => {
  try {
    const user_id = req.user.id;
    const stats = await Task.getStats(user_id);
    res.status(200).json(stats);
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ message: 'Server error while fetching stats' });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
  getStats
};
