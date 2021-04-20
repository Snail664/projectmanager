import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import Header from "../Header";
import TasksByCategory from "./TasksByCategory";
import TasksByPriority from "./TasksByPriority";
import axios from "axios";
import UrgentTasks from "./UrgentTasks";
import { Link } from "react-router-dom";

const Dashboard = (props) => {
  const [tasksByCategory, setTasksByCategory] = useState([]);
  const [tasksByPriority, setTasksByPriority] = useState([]);
  const [urgentTasks, setUrgentTasks] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get("/dashboard", {
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
    if (props.isSignedIn) {
      fetchData();
    }
  }, []);

  if (!props.isSignedIn) {
    return (
      <Box overflow="hidden">
        <Header
          isSignedIn={props.isSignedIn}
          setIsSignedIn={props.setIsSignedIn}
        />
        <Flex
          backgroundSize="cover"
          backgroundImage="url('/homepage.jpg')"
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          textAlign="center"
          h="100vh"
        >
          <Box p="10" borderRadius="lg" bg="rgba(219,224,255,0.8);">
            <Heading pt="5" fontSize="7xl">
              Task Tracker
            </Heading>
            <Heading mt="3" color="gray.600" fontSize="2xl">
              A simple project manager for keeping track of your personal
              projects and TODOs.
            </Heading>
            <Link to="/register">
              <Button size="lg" colorScheme="orange" mt="20">
                Get Started
              </Button>
            </Link>
          </Box>
        </Flex>
      </Box>
    );
  }

  return (
    <Box>
      <Header
        isSignedIn={props.isSignedIn}
        setIsSignedIn={props.setIsSignedIn}
      />
      <Box bg="blue.100" p="6">
        <Heading textAlign="center">Dashboard</Heading>
        <Text textAlign="center" fontSize="sm">
          Overview of your tasks
        </Text>
        <Flex flexWrap="wrap" justifyContent="center">
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
        <Box mt="5" textAlign="center">
          <Link to="/projects">
            <Button colorScheme="orange">View Projects</Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
