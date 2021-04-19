import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Header from "../Header";
import axios from "axios";
import ProjectListItem from "./ProjectListItem";
import NewProject from "./NewProject";

const Projects = (props) => {
  const [projects, setProjects] = useState([]);
  const [refetchData, setRefetchData] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get("/projects", {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setProjects(res.data);
      setRefetchData(false);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [refetchData]);

  const renderProjectsList = projects.map((project) => {
    console.log(project);
    return (
      <ProjectListItem setRefetchData={setRefetchData} project={project} />
    );
  });
  return (
    <Box bg="blue.100" minH="max-content" h="100vh">
      <Header
        isSignedIn={props.isSignedIn}
        setIsSignedIn={props.setIsSignedIn}
      />
      <Flex alignItems="flex-start" flexWrap="wrap" p="6">
        {renderProjectsList}
        <NewProject setRefetchData={setRefetchData} />
      </Flex>
    </Box>
  );
};

export default Projects;
