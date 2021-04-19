import React, { useEffect, useState } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import Header from "../Header";
import TasksByCategory from "./TasksByCategory";
import TasksByPriority from "./TasksByPriority";
import axios from "axios";
import UrgentTasks from "./UrgentTasks";

const Dashboard = (props) => {
  const [tasksByCategory, setTasksByCategory] = useState([]);
  const [tasksByPriority, setTasksByPriority] = useState([]);
  const [urgentTasks, setUrgentTasks] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/dashboard", {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setTasksByCategory(res.data.tasksByCategory);
      setTasksByPriority(res.data.tasksByPriority);
      setUrgentTasks(res.data.urgentTasks);
    } catch (error) {
      alert(error.message);
    }
  };

  // fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box>
      <Header
        isSignedIn={props.isSignedIn}
        setIsSignedIn={props.setIsSignedIn}
      />
      <Box bg="blue.100" p="6">
        <Heading mb="30px" textAlign="center">
          Dashboard
        </Heading>
        <Flex mb="30px" justifyContent="center">
          <Box m="5">
            <Heading pt="6" mb="5" textAlign="center">
              Tasks by Priority
            </Heading>
            <TasksByPriority data={tasksByPriority} />
          </Box>
          <Box m="5">
            <Heading pt="6" mb="5" textAlign="center">
              Tasks by Category
            </Heading>
            <TasksByCategory data={tasksByCategory} />
          </Box>
        </Flex>
        <Heading textAlign="center">Urgent Tasks</Heading>
        <Flex justifyContent="center">
          <UrgentTasks data={urgentTasks} />
        </Flex>
      </Box>
    </Box>
  );
};

export default Dashboard;
