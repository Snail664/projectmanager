const router = require("express").Router();
const auth = require("../middleware/auth");
const pool = require("../db");
const error404 = require("../utils/error404");
const error500 = require("../utils/error500");

// middlewares
router.use(auth);

// create a task
router.post("/", async (req, res) => {
  try {
    const user = req.user;
    const {
      title,
      description,
      priority,
      due_date,
      projectId,
      category,
    } = req.body;

    // input validation
    if (
      ![title, description, priority, due_date, projectId, category].every(
        Boolean
      )
    )
      return res.status(422).json({ error: "Missing information" });

    if (!["low", "medium", "high"].includes(priority))
      return res
        .status(422)
        .json({ error: `Invalid task priority "${priority}"` });

    if (!["bug", "documentation", "enhancement"].includes(category))
      return res
        .status(422)
        .json({ error: `Invalid task category "${category}"` });

    // create task
    const newTask = await pool.query(
      "INSERT INTO tasks (task_title, task_description, task_priority, task_due_date, task_project, task_owner, task_status, task_category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        title,
        description,
        priority,
        due_date,
        projectId,
        user,
        "pending",
        category,
      ]
    );
    res.json(newTask.rows[0]);
  } catch (error) {
    return error500(res, error);
  }
});

// get a task
router.get("/:tid", async (req, res) => {
  try {
    const user = req.user;
    const { tid } = req.params;
    const task = await pool.query(
      "SELECT * FROM tasks WHERE task_id = $1 AND task_owner = $2",
      [tid, user]
    );

    if (task.rowCount === 0) {
      return error404(res, "Task");
    }
  } catch (error) {
    return error500(res, error);
  }
});

// get all tasks for a user or only for one project
router.get("/", async (req, res) => {
  const { userId, projectId } = req.query;
  console.log(userId);
  console.log(projectId);

  // check is user in query is same as logged in user
  if (userId && userId != req.user) {
    return res.status(403).json({ error: "Forbidden, permission denied" });
  }

  var projects;

  try {
    if (userId) {
      projects = await pool.query("SELECT * FROM tasks WHERE task_owner = $1", [
        userId,
      ]);
    } else if (projectId && !userId) {
      projects = await pool.query(
        "SELECT * FROM tasks WHERE task_project = $1 AND task_owner =$2",
        [projectId, req.user]
      );
    }

    // handle no projects found
    if (projects.rowCount === 0) {
      return error404(res, "Tasks");
    }

    res.json(projects.rows);
  } catch (error) {
    error500(res, error);
  }
});

// update a task
router.put("/:tid", async (req, res) => {
  try {
    const user = req.user;
    const { tid } = req.params;
    const {
      title,
      description,
      priority,
      due_date,
      status,
      category,
    } = req.body;

    // input validation
    if (![title, description, priority, due_date, status].every(Boolean))
      return res.status(422).json({ error: "Missing information" });

    if (!["low", "medium", "high"].includes(priority))
      return res
        .status(422)
        .json({ error: `Invalid task priority "${priority}"` });

    if (!["pending", "completed"].includes(status))
      return res.status(422).json({ error: `Invalid task status ${status}` });

    if (!["bug", "documentation", "enhancement"].includes(category))
      return res
        .status(422)
        .json({ error: `Invalid task category "${category}"` });

    // update task query
    const updateTask = await pool.query(
      "UPDATE tasks SET task_title = $1, task_description = $2, task_priority = $3, task_due_date = $4, task_status =$5, task_category = $6 WHERE task_id = $7 AND task_owner = $8 RETURNING *",
      [title, description, priority, due_date, status, category, tid, user]
    );

    // task not found
    if (updateTask.rowCount == 0) {
      return error404(res, "Task");
    }

    res.json(updateTask.rows[0]);
  } catch (error) {
    return error500(res, error);
  }
});

// delete a task
router.delete("/:tid", async (req, res) => {
  try {
    const user = req.user;
    const { tid } = req.params;

    const deleteTask = await pool.query(
      "DELETE FROM tasks WHERE task_id = $1 AND task_owner = $2 RETURNING task_id",
      [tid, user]
    );

    if (deleteTask.rowCount == 0) {
      return error404(res, "Task");
    }

    res.json(deleteTask.rows[0]);
  } catch (error) {
    return error500(res, error);
  }
});

module.exports = router;
