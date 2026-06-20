# Task Management Portal

A full-stack, secure, responsive Task Management Portal built using React.js, Node.js/Express.js, and MySQL. It features JWT Authentication, dashboard task statistics, advanced search/filtering, server-side pagination, sorting, a toggleable dark mode, and a complete suite of unit tests.

---

## Tech Stack

* **Frontend**: React.js, Vite, Axios, React Router DOM, Bootstrap 5 (with custom transitions, animations, and glassmorphism styling).
* **Backend**: Node.js, Express.js, MySQL2 (using pool connections with async/await), CORS, dotenv, jsonwebtoken, bcryptjs, nodemon.
* **Testing**: Jest, Supertest.

---

## Features

1. **Dashboard Statistics**: Dynamic metrics showing *Total Tasks*, *Pending*, *In Progress*, and *Completed* tasks.
2. **Task Filtering & Search**: Filter tasks instantly by status, search task titles dynamically (with a 300ms debounce on search keypresses to optimize API calls), and sort tasks by newest or oldest.
3. **Server-Side Pagination**: Clean pagination controls to request and view task segments, reducing load times.
4. **Authentication**: Secure registration and login flows using JWT (JSON Web Token) saved locally, protecting front-end paths and API endpoints.
5. **Interactive UI Actions**: Quick status updates (using dropdown selectors or "Mark as Completed" checks) and delete triggers with confirmation prompts.
6. **Dark Mode Toggle**: Sleek theme selector utilizing CSS variables for smooth background and color transitions.
7. **Robust Input Validation**: Strict validation middleware checking requirements, valid email patterns, and a minimum of 20 characters for task descriptions.
8. **Unit Tests**: Full suite of mocks for API endpoints validation, authentication check, database routing, and exception handling.

---

## Environment Variables

### Backend (`backend/.env`)
Create a `.env` file inside the `backend` folder:
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=task_management
JWT_SECRET=supersecretjwtkey123!@#
NODE_ENV=development
```

### Frontend (`frontend/.env`)
Create a `.env` file inside the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Database Setup

1. Make sure you have a running MySQL server.
2. Log in to your MySQL terminal or client (e.g., MySQL Workbench, phpMyAdmin, DBeaver).
3. Import the `schema.sql` file located in the root of the project to create the database and tables:
   ```bash
   mysql -u root -p < schema.sql
   ```
   Or execute the SQL commands inside `schema.sql` manually.

---

## Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd "Mini Project"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Configure environment variables in backend/.env
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   # Configure environment variables in frontend/.env
   npm run dev
   ```

4. **Running Unit Tests**
   Inside the `backend` folder, execute:
   ```bash
   npm run test
   ```

---

## API Documentation

All API requests expect headers with a bearer token for protected routes:
`Authorization: Bearer <JWT_TOKEN>`

### Authentication Endpoints

#### 1. Register User
* **Endpoint**: `/api/auth/register`
* **Method**: `POST`
* **Request Body**:
  ```json
  {
    "username": "johndoe",
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```
* **Response Body (201 Created)**:
  ```json
  {
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "johndoe@example.com"
    }
  }
  ```

#### 2. Login User
* **Endpoint**: `/api/auth/login`
* **Method**: `POST`
* **Request Body**:
  ```json
  {
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```
* **Response Body (200 OK)**:
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "johndoe@example.com"
    }
  }
  ```

---

### Task Endpoints (Protected)

#### 1. Get Tasks (With Search, Filter, Sort, Pagination)
* **Endpoint**: `/api/tasks`
* **Method**: `GET`
* **Query Parameters**:
  * `status`: Filter by status (`All`, `Pending`, `In Progress`, `Completed`) - *Optional*
  * `search`: Search task titles - *Optional*
  * `page`: Page index (default: `1`) - *Optional*
  * `limit`: Page count (default: `6`) - *Optional*
  * `sort`: Sorting option (`newest`, `oldest`) - *Optional*
* **Response Body (200 OK)**:
  ```json
  {
    "tasks": [
      {
        "id": 10,
        "user_id": 1,
        "title": "Build Login Page",
        "description": "Create responsive login page with validation",
        "status": "Pending",
        "created_at": "2026-06-20T16:05:23.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 6,
      "pages": 1
    }
  }
  ```

#### 2. Create Task
* **Endpoint**: `/api/tasks`
* **Method**: `POST`
* **Request Body**:
  ```json
  {
    "title": "Build Login Page",
    "description": "Create responsive login page with validation",
    "status": "Pending"
  }
  ```
* **Response Body (201 Created)**:
  ```json
  {
    "message": "Task created successfully",
    "task": {
      "id": 10,
      "user_id": 1,
      "title": "Build Login Page",
      "description": "Create responsive login page with validation",
      "status": "Pending",
      "created_at": "2026-06-20T16:05:23.000Z"
    }
  }
  ```

#### 3. Update Task Status
* **Endpoint**: `/api/tasks/:id`
* **Method**: `PUT`
* **Request Body**:
  ```json
  {
    "status": "Completed"
  }
  ```
* **Response Body (200 OK)**:
  ```json
  {
    "message": "Task status updated successfully",
    "task": {
      "id": 10,
      "user_id": 1,
      "title": "Build Login Page",
      "description": "Create responsive login page with validation",
      "status": "Completed",
      "created_at": "2026-06-20T16:05:23.000Z"
    }
  }
  ```

#### 4. Delete Task
* **Endpoint**: `/api/tasks/:id`
* **Method**: `DELETE`
* **Response Body (200 OK)**:
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```

#### 5. Get Dashboard Statistics
* **Endpoint**: `/api/tasks/stats`
* **Method**: `GET`
* **Response Body (200 OK)**:
  ```json
  {
    "total": 4,
    "pending": 2,
    "inProgress": 1,
    "completed": 1
  }
  ```

---

## Assumptions & Design Choices

1. **User Isolation**: Tasks are locked to individual user accounts. Users can only see, edit, delete, or fetch statistics for tasks that they created under their authenticated session.
2. **Responsive Styling**: Bootstrap 5 grid layout ensures columns collapse cleanly from three columns on desktops, down to two on tablets, and single column cards on smartphones.
3. **Database Drivers**: Using `mysql2/promise` to query the database asynchronously using standard SQL structures, avoiding bulky ORM dependencies.
4. **Mock Testing**: Backend tests run with mocked connection pools to allow testing in isolation without pre-requisite database schemas or active local connections.
