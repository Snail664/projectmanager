import React, { useState, useEffect } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ControlledInput from "../helpers/ControlledInput";
import axios from "axios";

const NewProject = (props) => {
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);
  const [errors, setErrors] = useState({
    title: "This field is required",
    description: "This field is required",
  });

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setFormOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setSubmitClicked(true);
      if (errors.title || errors.description) {
        return;
      }
      const res = await axios.post(
        "/projects",
        {
          title: title,
          description: description,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setTitle("");
      setDescription("");
      setSubmitClicked(false);
      setFormOpen(false);
      props.setRefetchData(true);
    } catch (error) {
      alert(error.message);
    }
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

  if (formOpen) {
    return (
      <Box
        m="5"
        w={{ sm: "100%", md: "30%" }}
        minH="200px"
        bg="gray.600"
        color="white"
        borderWidth="10px"
        borderRadius="lg"
        overflow="hidden"
        borderStyle="solid"
        borderColor="gray.600"
      >
        <Text fontWeight="bold" fontSize="2xl" textAlign="center">
          New Project
        </Text>
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
          te
          error={errors.description}
        />
        <Box d="flex" justifyContent="space-between" mt="5">
          <Button color="black" colorScheme="gray" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            colorScheme="green"
            isLoading={loading}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Box>
      </Box>
    );
  }

  if (!formOpen) {
    return (
      <Box
        d="flex"
        alignItems="center"
        justifyContent="center"
        m="5"
        w={{ sm: "100%", md: "30%" }}
        minH="200px"
        bg="blue.100"
        color="white"
        borderWidth="10px"
        borderRadius="lg"
        overflow="hidden"
        borderStyle="dashed"
        borderColor="gray.500"
        _hover={{ borderColor: "teal", cursor: "pointer" }}
        onClick={() => {
          if (!formOpen) {
            setFormOpen(true);
          }
        }}
      >
        <AddIcon color="gray.500" h={12} w={12} />
      </Box>
    );
  }
};

export default NewProject;
