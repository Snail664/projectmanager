CREATE DATABASE projectmanager;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

CREATE TABLE projects(
    project_id SERIAL PRIMARY KEY,
    project_title VARCHAR(255) NOT NULL,
    project_description VARCHAR(255) NOT NULL,
    project_status VARCHAR(255) CHECK (project_status IN ('ongoing', 'completed')),
    project_owner INT REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE tasks(
    task_id SERIAL PRIMARY KEY,
    task_title VARCHAR(255) NOT NULL,
    task_description VARCHAR(255) NOT NULL,
    task_priority VARCHAR(255) CHECK (task_priority IN ('low', 'medium', 'high')),
    task_due_date DATE NOT NULL,
    task_status VARCHAR(255) CHECK (task_status IN ('pending', 'completed')),
    task_category VARCHAR(255) CHECK (task_category IN ('bug', 'documentation', 'enhancement')),
    task_project INT REFERENCES projects(project_id) ON DELETE CASCADE,
    task_owner INT REFERENCES users(user_id) ON DELETE CASCADE
);