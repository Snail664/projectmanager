const router = require("express").Router();
const pool = require("../db");
const auth = require("../middleware/auth");
const error404 = require("../utils/error404");

// middleware for this entire projects router
router.use(auth);

// create a project
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    // validate input
    if (!title.length || !description.length) {
      return res
        .status(422)
        .json({ error: "Both title and description are required!" });
    }
    const newProject = await pool.query(
      "INSERT INTO projects (project_title, project_description, project_status, project_owner) VALUES($1, $2, $3, $4) RETURNING *",
      [title, description, "ongoing", req.user]
    );
    res.json(newProject.rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
});

// get all projects for given user
router.get("/", async (req, res) => {
  try {
    const user = req.user;
    const projects = await pool.query(
      "SELECT * FROM projects WHERE project_owner = $1",
      [user]
    );

    // 404
    if (projects.rows.length === 0) {
      return error404(res, "Projects");
    }

    res.json(projects.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
});

// get a project
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const project = await pool.query(
    "SELECT * FROM projects WHERE project_id = $1 AND project_owner = $2",
    [id, user]
  );

  // 404
  if (project.rowCount === 0) {
    return error404(res, "Project");
  }

  res.json(project.rows[0]);
});

// update a project
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const { title, description, status } = req.body;

    // validate input
    if (
      !title.length ||
      !description.length ||
      !["ongoing", "completed"].includes(status)
    ) {
      return res.status(422).json({ error: "Invalid data provided" });
    }

    // update project query
    const updateProject = await pool.query(
      "UPDATE projects SET project_title = $1, project_description = $2, project_status = $3 WHERE project_id = $4 AND project_owner = $5 RETURNING *",
      [title, description, status, id, user]
    );

    // if project not found because id or user were wrong then
    if (updateProject.rows.length === 0) {
      return error404(res, "Project");
    }

    // return updated data
    res.json(updateProject.rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
});

// delete a project
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const deleteProject = await pool.query(
      "DELETE FROM projects WHERE project_id = $1 AND project_owner = $2 RETURNING project_id",
      [id, user]
    );

    // project not found
    if (updateProject.rows.length === 0) {
      return error404(res, "Project");
    }

    res.json(deleteProject.rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
