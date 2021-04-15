const router = require("express").Router();
const auth = require("../middleware/auth");
const pool = require("../db");
const error500 = require("../utils/error500");
const error404 = require("../utils/error404");

// middlwares
router.use(auth);

router.get("/", async (req, res) => {
  try {
    const user = req.user;
    var data = {
      tasksByPriorityAndCategory: {},
      urgentTasks: [],
      projectsProgress: [],
    };

    // counts for task by priority and task by category
    const taskCounts = await pool.query(
      `SELECT 
      SUM(CASE WHEN task_priority = 'low' THEN 1 ELSE 0 END) AS low_priority, 
      SUM(CASE WHEN task_priority = 'medium' THEN 1 ELSE 0 END) AS medium_priority, 
      SUM(CASE WHEN task_priority = 'high' THEN 1 ELSE 0 END) AS high_priority,
      SUM(CASE WHEN task_category = 'bug' THEN 1 ELSE 0 END) AS bug,
      SUM(CASE WHEN task_category = 'documentaion' THEN 1 ELSE 0 END) AS documentaion,
      SUM(CASE WHEN task_category = 'enhancement' THEN 1 ELSE 0 END) AS enhancement
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

    data.tasksByPriorityAndCategory = taskCounts.rows[0] || null;
    data.urgentTasks = urgentTasks.rows;

    return res.json(data);
  } catch (error) {
    return error500(res, error);
  }
});

module.exports = router;
