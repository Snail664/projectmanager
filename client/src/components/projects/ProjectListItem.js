import React, { useState } from "react";
import {
  Box,
  Badge,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  propNames,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import axios from "axios";

const ProjectListItem = ({ project, setRefetchData }) => {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/projects/${project.project_id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setRefetchData(true);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <Box
        m="5"
        w={{ sm: "100%", md: "30%" }}
        bg="gray.600"
        color="white"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
      >
        Loading...
      </Box>
    );
  }
  return (
    <Box
      m="5"
      w={{ sm: "100%", md: "30%" }}
      bg="gray.600"
      color="white"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      borderColor="gray.600"
    >
      <Box p="6">
        <Box mt="1" fontWeight="semibold" fontSize="2xl" as="h4">
          {project.project_title}
        </Box>

        <Box mt="2" d="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="teal">
            {project.project_status}
          </Badge>
        </Box>

        <Box mt="2">{project.project_description}</Box>

        <Box
          d="flex"
          flexWrap="wrap"
          alignItems="baseline"
          mt="2"
          alignItems="center"
        >
          <Menu>
            <MenuButton
              colorScheme="facebook"
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              Actions
            </MenuButton>
            <MenuList color="black" borderColor="teal" bg="teal.200">
              <Link to={`/projects/${project.project_id}`}>
                <MenuItem>Manage</MenuItem>
              </Link>
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectListItem;
