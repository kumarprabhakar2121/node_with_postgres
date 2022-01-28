const express = require("express");
const app = express();
const pool = require("./db");
app.use(express.json());

/* ROUTES */
// get all todo
app.get("/todos", async (req, res) => {
  try {
    const start = new Date();
    const todos = await pool.query("SELECT * FROM todo");
    res.json(todos);
    const stop = Date.now();
    console.log(`Time Taken to execute = ${(stop - start) / 1000} seconds`);
  } catch (error) {
    res.send(error);
  }
});

// get a todo
app.get("/todos/:id", async (req, res) => {
  try {
    const start = new Date();
    const id = req.params.id;
    const todos = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.json(todos);
    const stop = Date.now();
    console.log(`Time Taken to execute = ${(stop - start) / 1000} seconds`);
  } catch (error) {
    res.send(error);
  }
});

// create a todo
app.post("/todos", async (req, res) => {
  try {
    const start = new Date();

    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES ($1) RETURNING *",
      [description]
    );
    res.json(newTodo.rows[0]);
    const stop = Date.now();
    console.log(`Time Taken to execute = ${(stop - start) / 1000} seconds`);
  } catch (error) {
    res.send(error);
  }
});
// update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const start = new Date();
    const { id } = req.params;
    const { description } = req.body;
    const todo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );
    if (todo.rowCount === 0) {
      res.json({
        success: true,
        message: "data not found",
      });
      const stop = Date.now();
      console.log(`Time Taken to execute = ${(stop - start) / 1000} seconds`);
    }
    if (todo.rowCount === 1) {
      res.json({
        success: true,
        message: "Successfully updated!",
      });
      const stop = Date.now();
      console.log(`Time Taken to execute = ${(stop - start) / 1000} seconds`);
    }
  } catch (error) {
    res.send(error);
  }
});

// delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const start = new Date();
    const { id } = req.params;
    var deletedTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
      id,
    ]);
    if (deletedTodo.rowCount === 1) {
      res.json("Successfully deleted!");
      const stop = Date.now();
      console.log(`Time Taken to execute = ${(stop - start) / 1000} seconds`);
    } else {
      res.json("Not found!");
      const stop = Date.now();
      console.log(`Time Taken to execute = ${(stop - start) / 1000} seconds`);
    }
  } catch (error) {
    res.send(error);
  }
});

app.listen(3300, () => {
  console.log(`listening on port 3300`);
});
