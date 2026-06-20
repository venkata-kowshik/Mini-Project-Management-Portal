import API from './api';

const taskService = {
  async getTasks(params) {
    const response = await API.get('/tasks', { params });
    return response.data;
  },

  async createTask(taskData) {
    const response = await API.post('/tasks', taskData);
    return response.data;
  },

  async updateTaskStatus(id, status) {
    const response = await API.put(`/tasks/${id}`, { status });
    return response.data;
  },

  async deleteTask(id) {
    const response = await API.delete(`/tasks/${id}`);
    return response.data;
  },

  async getStats() {
    const response = await API.get('/tasks/stats');
    return response.data;
  }
};

export default taskService;
