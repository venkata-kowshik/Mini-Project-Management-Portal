const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('../app');
const db = require('../config/db');

// Mock db connection pool execute method
jest.mock('../config/db', () => ({
  execute: jest.fn(),
  query: jest.fn(),
  getConnection: jest.fn().mockResolvedValue({
    release: jest.fn()
  })
}));

describe('Task Management API Test Suite', () => {
  let mockToken;
  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'hashedpassword123'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockToken = jwt.sign(
      { id: mockUser.id, username: mockUser.username, email: mockUser.email },
      process.env.JWT_SECRET || 'supersecretjwtkey123!@#',
      { expiresIn: '1h' }
    );
  });

  describe('Auth Routes', () => {
    describe('POST /api/auth/register', () => {
      it('should register a new user successfully', async () => {
        // Mock checking existing users (none found)
        db.execute.mockResolvedValueOnce([[]]); // check email
        db.execute.mockResolvedValueOnce([[]]); // check username
        // Mock inserting user
        db.execute.mockResolvedValueOnce([{ insertId: 1 }]);

        const res = await request(app)
          .post('/api/auth/register')
          .send({
            username: 'newuser',
            email: 'newuser@example.com',
            password: 'password123'
          });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.username).toBe('newuser');
        expect(db.execute).toHaveBeenCalledTimes(3);
      });

      it('should fail registration if email is invalid', async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            username: 'newuser',
            email: 'invalid-email',
            password: 'password123'
          });

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('valid email address');
      });

      it('should fail registration if password is too short', async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            username: 'newuser',
            email: 'newuser@example.com',
            password: '123'
          });

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('at least 6 characters');
      });
    });

    describe('POST /api/auth/login', () => {
      it('should login user and return a token', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        // Mock finding user by email
        db.execute.mockResolvedValueOnce([[
          { id: 1, username: 'testuser', email: 'testuser@example.com', password: hashedPassword }
        ]]);

        const res = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'testuser@example.com',
            password: 'password123'
          });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.username).toBe('testuser');
      });

      it('should reject invalid credentials', async () => {
        // Mock user not found
        db.execute.mockResolvedValueOnce([[]]);

        const res = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'wrong@example.com',
            password: 'wrongpassword'
          });

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('Invalid email or password');
      });
    });
  });

  describe('Task Routes (Protected)', () => {
    describe('GET /api/tasks', () => {
      it('should block requests without a token', async () => {
        const res = await request(app).get('/api/tasks');
        expect(res.status).toBe(401);
      });

      it('should return tasks list and pagination info for logged-in user', async () => {
        const mockTasks = [
          { id: 1, title: 'Task 1', description: 'This is task one description', status: 'Pending', created_at: new Date() },
          { id: 2, title: 'Task 2', description: 'This is task two description', status: 'In Progress', created_at: new Date() }
        ];

        // Mock Task.findAllByUser
        db.query.mockResolvedValueOnce([mockTasks]);
        // Mock Task.countByUser
        db.execute.mockResolvedValueOnce([[{ total: 2 }]]);

        const res = await request(app)
          .get('/api/tasks')
          .set('Authorization', `Bearer ${mockToken}`);

        expect(res.status).toBe(200);
        expect(res.body.tasks).toHaveLength(2);
        expect(res.body.pagination.total).toBe(2);
        expect(res.body.pagination.page).toBe(1);
      });
    });

    describe('POST /api/tasks', () => {
      it('should create a task successfully when payload is valid', async () => {
        const newTask = {
          title: 'Build Login Page',
          description: 'Create responsive login page with validation',
          status: 'Pending'
        };

        // Mock inserting task (returns insertId)
        db.execute.mockResolvedValueOnce([{ insertId: 10 }]);
        // Mock finding created task by ID
        db.execute.mockResolvedValueOnce([[{ id: 10, ...newTask, user_id: 1, created_at: new Date() }]]);

        const res = await request(app)
          .post('/api/tasks')
          .set('Authorization', `Bearer ${mockToken}`)
          .send(newTask);

        expect(res.status).toBe(201);
        expect(res.body.task.title).toBe(newTask.title);
        expect(res.body.task.id).toBe(10);
      });

      it('should fail task creation if description is less than 20 characters', async () => {
        const res = await request(app)
          .post('/api/tasks')
          .set('Authorization', `Bearer ${mockToken}`)
          .send({
            title: 'Quick Task',
            description: 'Too short'
          });

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('at least 20 characters');
      });
    });

    describe('PUT /api/tasks/:id', () => {
      it('should update task status successfully', async () => {
        const mockTask = { id: 5, title: 'Task Title', description: 'Task description long enough', status: 'Pending' };
        
        // Mock finding task to verify ownership
        db.execute.mockResolvedValueOnce([[mockTask]]);
        // Mock status update query
        db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
        // Mock finding task again for the response
        db.execute.mockResolvedValueOnce([[{ ...mockTask, status: 'Completed' }]]);

        const res = await request(app)
          .put('/api/tasks/5')
          .set('Authorization', `Bearer ${mockToken}`)
          .send({ status: 'Completed' });

        expect(res.status).toBe(200);
        expect(res.body.task.status).toBe('Completed');
      });

      it('should fail if status value is invalid', async () => {
        const res = await request(app)
          .put('/api/tasks/5')
          .set('Authorization', `Bearer ${mockToken}`)
          .send({ status: 'InvalidStatus' });

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('Status must be');
      });
    });

    describe('DELETE /api/tasks/:id', () => {
      it('should delete task successfully', async () => {
        const mockTask = { id: 5, user_id: 1, title: 'Task Title', description: 'Task description long enough', status: 'Pending' };

        // Mock finding task
        db.execute.mockResolvedValueOnce([[mockTask]]);
        // Mock deleting task
        db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

        const res = await request(app)
          .delete('/api/tasks/5')
          .set('Authorization', `Bearer ${mockToken}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toContain('deleted successfully');
      });

      it('should fail to delete if task is not found', async () => {
        // Mock task not found
        db.execute.mockResolvedValueOnce([[]]);

        const res = await request(app)
          .delete('/api/tasks/999')
          .set('Authorization', `Bearer ${mockToken}`);

        expect(res.status).toBe(404);
        expect(res.body.message).toContain('Task not found');
      });
    });
  });
});
