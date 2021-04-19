const router = require("express").Router();
const auth = require("../middleware/auth");
const pool = require("../db");
const error500 = require("../utils/error500");
const error404 = require("../utils/error404");

// middlwares
router.use(auth);

// returns data required to display charts and task info on dashboard (home) page
router.get("/", async (req, res) => {
  try {
    const user = req.user;

    // this is the data object to be returned by this endpoint
    var data = {
      tasksByPriority: [],
      tasksByCategory: [],
      urgentTasks: [],
    };

    // counts for task by priority and task by category
    const taskCounts = await pool.query(
      `SELECT 
      SUM(CASE WHEN task_priority = 'low' AND task_status='pending' THEN 1 ELSE 0 END) AS low_priority, 
      SUM(CASE WHEN task_priority = 'medium' AND task_status='pending' THEN 1 ELSE 0 END) AS medium_priority, 
      SUM(CASE WHEN task_priority = 'high' AND task_status='pending' THEN 1 ELSE 0 END) AS high_priority,
      SUM(CASE WHEN task_category = 'bug' AND task_status='pending' THEN 1 ELSE 0 END) AS bug,
      SUM(CASE WHEN task_category = 'documentation' AND task_status='pending' THEN 1 ELSE 0 END) AS documentation,
      SUM(CASE WHEN task_category = 'enhancement' AND task_status='pending' THEN 1 ELSE 0 END) AS enhancement
      FROM tasks WHERE task_owner = $1 
        `,
      [user]
    );

    // get tasks that are due between now and one week from now
    var currentDate = new Date(Date.now());
    var oneWeekFromNow = new Date(
      currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    const urgentTasks = await pool.query(
      `SELECT * FROM tasks
       WHERE task_owner = $1 
       AND (task_due_date BETWEEN $2 AND $3)`,
      [user, currentDate, oneWeekFromNow]
    );
    console.log("urgent tasks ", urgentTasks);

    // handle no tasks found
    if (taskCounts.rowCount == 0) {
      return error404(res, "Tasks");
    }

    // set values for task by priority in data obj
    data.tasksByPriority.push({
      name: "low",
      value: taskCounts.rows[0].low_priority,
    });
    data.tasksByPriority.push({
      name: "medium",
      value: taskCounts.rows[0].medium_priority,
    });
    data.tasksByPriority.push({
      name: "high",
      value: taskCounts.rows[0].high_priority,
    });

    // set values for task by category in data obj
    data.tasksByCategory.push({
      name: "bug",
      value: taskCounts.rows[0].bug,
    });
    data.tasksByCategory.push({
      name: "documentation",
      value: taskCounts.rows[0].documentation,
    });
    data.tasksByCategory.push({
      name: "enhancement",
      value: taskCounts.rows[0].enhancement,
    });

    // set urgent tasks
    data.urgentTasks = urgentTasks.rows;

    // return the data
    return res.json(data);
  } catch (error) {
    return error500(res, error);
  }
});

// create sample data
router.post("/", async (req, res) => {
  const user = req.user;

  try {
    const sampleProject = await pool.query(
      `INSERT INTO projects
     (project_title, project_description, project_status, project_owner) 
     VALUES ('sample project', 'This is a sample project.', 'ongoing', $1) RETURNING project_id`,
      [user]
    );

    const project_id = sampleProject.rows[0].project_id;

    const currentDate = new Date(Date.now());
    // sample urgent task due dates
    const urgent1 = new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000);
    const urgent2 = new Date(currentDate.getTime() + 4 * 24 * 60 * 60 * 1000);
    const urgent3 = new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000);

    // far away due date for the rest of the tasks
    const farAwayDate = new Date(
      currentDate.getTime() + 200 * 24 * 60 * 60 * 1000
    );

    // one date in the past for a completed task
    const completedDate = new Date(
      currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
    );

    // create sample tasks
    const sampleTasks = await pool.query(
      `INSERT INTO tasks
    (task_title, task_description, task_priority, task_due_date, task_status, task_category, task_project, task_owner)
    VALUES
    ('Edit ReadMe file', 'There is a typo in the main ReadMe file', 'low', $3, 'pending', 'documentation', $1, $2),
    ('Add comments', 'Too much spaghetti code with no explanation!', 'high', $4, 'pending', 'documentation', $1, $2),
    ('Favourites feature', 'App users should be able to favourite posts', 'medium', $5, 'pending', 'enhancement', $1, $2),
    ('Fix navbar icon', 'Icon in navbar is not clickable', 'high', $6, 'pending', 'bug', $1, $2),
    ('Add submit button shadow', 'Add box shadow to submit button', 'low', $6, 'pending', 'enhancement', $1, $2),
    ('Change background color', 'Pink background not great', 'low', $6, 'pending', 'enhancement', $1, $2),
    ('Screen flicker', 'Small screen flicker when app loads up', 'low', $6, 'pending', 'enhancement', $1, $2),
    ('Testing', 'Create test suite to find bugs', 'high', $7, 'completed', 'bug', $1, $2) 
    RETURNING *
    `,
      [project_id, user, urgent1, urgent2, urgent3, farAwayDate, completedDate]
    );

    // return data
    return res.json({
      sampleProjectId: sampleProject.rows[0].project_id,
      sampleTasks: sampleTasks.rows,
    });
  } catch (error) {
    return error500(res, error);
  }
});

module.exports = router;
