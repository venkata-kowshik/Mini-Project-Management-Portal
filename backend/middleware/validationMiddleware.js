const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || typeof username !== 'string' || username.trim() === '') {
    return res.status(400).json({ message: 'Username is required' });
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ message: 'A valid email address is required' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ message: 'A valid email address is required' });
  }

  if (!password || typeof password !== 'string' || password.trim() === '') {
    return res.status(400).json({ message: 'Password is required' });
  }

  next();
};

const validateTask = (req, res, next) => {
  const { title, description, status } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ message: 'Title is required' });
  }

  if (!description || typeof description !== 'string' || description.trim().length < 20) {
    return res.status(400).json({ message: 'Description is required and must be at least 20 characters long' });
  }

  if (status && !['Pending', 'In Progress', 'Completed'].includes(status)) {
    return res.status(400).json({ message: "Status must be 'Pending', 'In Progress', or 'Completed'" });
  }

  next();
};

const validateTaskStatus = (req, res, next) => {
  const { status } = req.body;

  if (!status || !['Pending', 'In Progress', 'Completed'].includes(status)) {
    return res.status(400).json({ message: "Status must be 'Pending', 'In Progress', or 'Completed'" });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateTask,
  validateTaskStatus
};
