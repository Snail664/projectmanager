import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  FormControl,
  FormLabel,
  Switch,
  Button,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import _ from "lodash";
import axios from "axios";
import { useRouteMatch } from "react-router-dom";
import Task from "../tasks/Task";
import Header from "../Header";
import NewTask from "../tasks/NewTask";
import ControlledInput from "../helpers/ControlledInput";

const Project = (props) => {
  const [project, setProject] = useState({});
  const [tasks, setTasks] = useState([]);
  const [newTaskFormOpen, setNewTaskFormOpen] = useState(false);
  const [refetchData, setRefetchData] = useState(false);
  const match = useRouteMatch("/projects/:id");
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("ongoing");
  const [errors, setErrors] = useState({
    title: "Title is required!",
    description: "Description is required!",
  });

  const [submitClicked, setSubmitClicked] = useState(false);

  const fetchData = async () => {
    // fetch project
    const projectRes = await axios.get(`/projects/${match.params.id}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    // fetch tasks associated with this project
    const tasksRes = await axios.get("/tasks/", {
      params: {
        projectId: match.params.id,
      },
      headers: {
        token: localStorage.getItem("token"),
      },
    });

    setProject(projectRes.data);
    setTasks(tasksRes.data || []);
    setTitle(projectRes.data.project_title);
    setDescription(projectRes.data.project_description);
    setRefetchData(false);
  };

  const handleCancel = () => {
    setTitle(project.project_title);
    setDescription(project.project_description);
    setStatus(project.project_status);
    setEditMode(false);
  };

  const handleSubmit = async () => {
    try {
      setSubmitClicked(true);
      if (errors.title || errors.description) {
        return;
      }

      const res = await axios.put(
        `/projects/${match.params.id}`,
        {
          title: title,
          description: description,
          status: status,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setProject(res.data);
      setSubmitClicked(false);
      setEditMode(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const renderTasksLitst = (tasks) => {
    return tasks.map((task) => {
      return <Task setRefetchData={setRefetchData} task={task} />;
    });
  };

  const validateForm = () => {
    const errTitle = title.length === 0 ? "Title is required!" : "";
    const errDescription =
      description.length === 0 ? "Description is required!" : "";
    const newErrors = { title: errTitle, description: errDescription };
    setErrors(newErrors);
  };

  useEffect(() => {
    validateForm();
  }, [title, description]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (refetchData) {
      fetchData();
    }
  }, [refetchData]);

  if (_.isEmpty(project)) {
    return <Heading>404 - Project not found</Heading>;
  }

  return (
    <>
      <Header
        isSignedIn={props.isSignedIn}
        setIsSignedIn={props.setIsSignedIn}
      />
      <Box mt="5" pl="5" pr="5">
        <Box
          alignItems="flex-start"
          d="flex"
          borderRadius="10"
          padding="6"
          color="white"
          bg="gray.600"
        >
          <Box>
            {!editMode && (
              <>
                <Text fontSize="3xl">{project.project_title}</Text>
                <Text fontSize="2xl">{project.project_description}</Text>
                <Text fontSize="xl">Status: {project.project_status}</Text>{" "}
              </>
            )}
            {editMode && (
              <Box>
                <ControlledInput
                  value={title}
                  setValue={setTitle}
                  type="text"
                  submitClicked={submitClicked}
                  label="Title"
                  error={errors.title}
                />
                <ControlledInput
                  value={description}
                  setValue={setDescription}
                  textarea={true}
                  submitClicked={submitClicked}
                  label="Description"
                  error={errors.description}
                />
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Completed?</FormLabel>
                  <Switch
                    isChecked={status === "ongoing" ? false : true}
                    onChange={() => {
                      const newStatus =
                        status === "ongoing" ? "completed" : "ongoing";
                      console.log(
                        "status: ",
                        status,
                        "new status: ",
                        newStatus
                      );
                      setStatus(newStatus);
                    }}
                  />
                </FormControl>
                <Box d="flex" justifyContent="space-between" mt="5">
                  <Button
                    color="black"
                    colorScheme="gray"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button colorScheme="green" onClick={handleSubmit}>
                    Save
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
          <EditIcon
            cursor="pointer"
            onClick={() => {
              setEditMode(true);
            }}
            color="gray.800"
            h={7}
            w={7}
          />
        </Box>
        <Box
          borderColor="gray.600"
          borderWidth="2px"
          borderRadius="20"
          padding="2"
          bg={newTaskFormOpen ? "gray.600" : "white"}
          w={{ sm: "100%", md: newTaskFormOpen ? "50%" : "25%" }}
          mt="6"
          mb="3"
          ml="auto"
          mr="auto"
          _hover={
            !newTaskFormOpen && {
              cursor: "text",
              bg: "gray.100",
              borderColor: "gray.100",
            }
          }
          onClick={() => {
            if (!newTaskFormOpen) {
              setNewTaskFormOpen(true);
            }
          }}
        >
          {!newTaskFormOpen && <Text>Create New Task</Text>}
          {newTaskFormOpen && (
            <NewTask
              setRefetchData={setRefetchData}
              projectId={project.project_id}
              setNewTaskFormOpen={setNewTaskFormOpen}
            />
          )}
        </Box>
        <Flex alignItems="baseline" flexWrap="wrap">
          {renderTasksLitst(tasks)}
        </Flex>
      </Box>
    </>
  );
};

export default Project;
