const db = require('../config/db');

const Task = {
  async create({ user_id, title, description, status }) {
    const [result] = await db.execute(
      'INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)',
      [user_id, title, description, status || 'Pending']
    );
    return result.insertId;
  },

  async findByIdAndUser(id, user_id) {
    const [rows] = await db.execute(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, user_id]
    );
    return rows[0];
  },

  async findAllByUser(user_id, { status, search, limit, offset, sort }) {
    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [user_id];

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND title LIKE ?';
      params.push(`%${search}%`);
    }

    if (sort === 'oldest') {
      query += ' ORDER BY created_at ASC';
    } else {
      query += ' ORDER BY created_at DESC'; // default newest first
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await db.query(query, params);
    return rows;
  },

  async countByUser(user_id, { status, search }) {
    let query = 'SELECT COUNT(*) as total FROM tasks WHERE user_id = ?';
    const params = [user_id];

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND title LIKE ?';
      params.push(`%${search}%`);
    }

    const [rows] = await db.execute(query, params);
    return rows[0].total;
  },

  async update(id, user_id, { title, description, status }) {
    let query = 'UPDATE tasks SET';
    const params = [];
    const fields = [];

    if (title !== undefined) {
      fields.push(' title = ?');
      params.push(title);
    }
    if (description !== undefined) {
      fields.push(' description = ?');
      params.push(description);
    }
    if (status !== undefined) {
      fields.push(' status = ?');
      params.push(status);
    }

    if (fields.length === 0) return false;

    query += fields.join(',');
    query += ' WHERE id = ? AND user_id = ?';
    params.push(id, user_id);

    const [result] = await db.execute(query, params);
    return result.affectedRows > 0;
  },

  async updateStatus(id, user_id, status) {
    const [result] = await db.execute(
      'UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?',
      [status, id, user_id]
    );
    return result.affectedRows > 0;
  },

  async delete(id, user_id) {
    const [result] = await db.execute(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, user_id]
    );
    return result.affectedRows > 0;
  },

  async getStats(user_id) {
    const [rows] = await db.execute(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as inProgress,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed
       FROM tasks WHERE user_id = ?`,
      [user_id]
    );
    
    const stats = rows[0];
    return {
      total: stats.total || 0,
      pending: parseInt(stats.pending) || 0,
      inProgress: parseInt(stats.inProgress) || 0,
      completed: parseInt(stats.completed) || 0
    };
  }
};

module.exports = Task;
