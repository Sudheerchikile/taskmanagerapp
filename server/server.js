const express = require("express");
const { open } = require("sqlite");
const cors = require('cors');
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "./tasks.db");

const app = express();
app.use(cors());

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    await database.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        taskName TEXT NOT NULL,
        description TEXT,
        dueDate TEXT,
        assigneeType TEXT,
        status TEXT
      )
    `);

    app.listen(3004, () =>
      console.log("Server Running at http://localhost:3004/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();



// API Endpoints
app.get('/tasks', async (req, res) => {
    try {
      const tasks = await database.all('SELECT * FROM tasks');
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Error fetching tasks' });
    }
  });
  
  app.post('/tasks', async (req, res) => {
    const { taskName, description, dueDate, assigneeType, status } = req.body;
    try {
      const result = await database.run(
        `INSERT INTO tasks (taskName, description, dueDate, assigneeType, status) VALUES (?, ?, ?, ?, ?)`,
        [taskName, description, dueDate, assigneeType, status]
      );
      const newTask = await database.get(
        `SELECT * FROM tasks WHERE id = ?`,
        [result.lastID]
      );
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Error creating task' });
    }
  });
  
  app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { taskName, description, dueDate, assigneeType, status } = req.body;
    try {
      await database.run(
        `UPDATE tasks SET taskName=?, description=?, dueDate=?, assigneeType=?, status=? WHERE id=?`,
        [taskName, description, dueDate, assigneeType, status, id]
      );
      res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Error updating task' });
    }
  });
  
  app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await database.run(`DELETE FROM tasks WHERE id=?`, [id]);
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Error deleting task' });
    }
  });


