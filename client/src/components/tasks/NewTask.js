import React, { useState, useEffect } from "react";
import { Box, Badge, Input, Button } from "@chakra-ui/react";
import axios from "axios";
import ControlledInput from "../helpers/ControlledInput";

const NewTask = (props) => {
  const [loading, setLoading] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("2025-01-01");
  const [category, setCategory] = useState("bug");
  const [errors, setErrors] = useState({
    title: "Title is required",
    description: "Description is required",
  });

  const handleCancel = () => {
    props.setNewTaskFormOpen(false);
  };

  const handleSave = async () => {
    try {
      setSubmitClicked(true);
      setLoading(true);
      if (errors.title || errors.description) {
        setLoading(false);
        return;
      }

      // create task
      await axios.post(
        "/tasks",
        {
          title: title,
          description: description,
          priority: priority,
          due_date: dueDate,
          category: category,
          projectId: props.projectId,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setLoading(false);
      props.setRefetchData(true);
      props.setNewTaskFormOpen(false);
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
  return (
    <Box m="10px" overflow="hidden" bg="gray.600" color="white">
      <Box p="6">
        <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
          Title:{" "}
          <ControlledInput
            value={title}
            setValue={setTitle}
            type="text"
            submitClicked={submitClicked}
            error={errors.title}
          />
        </Box>
        <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
          Description:{" "}
          <ControlledInput
            value={description}
            setValue={setDescription}
            textarea={true}
            submitClicked={submitClicked}
            error={errors.description}
          />
        </Box>
        <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
          Due Date:{" "}
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </Box>
        <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
          {" "}
          Select Priority:
        </Box>
        <Box
          d="flex"
          mt="2"
          justifyContent="space-between"
          alignItems="baseline"
        >
          <Badge
            size="lg"
            borderRadius="full"
            px="2"
            onClick={() => setPriority("low")}
            cursor="pointer"
            colorScheme={priority === "low" ? "blue" : "gray"}
          >
            low
          </Badge>
          <Badge
            size="lg"
            borderRadius="full"
            px="2"
            onClick={() => setPriority("medium")}
            cursor="pointer"
            colorScheme={priority === "medium" ? "blue" : "gray"}
          >
            medium
          </Badge>
          <Badge
            size="lg"
            borderRadius="full"
            px="2"
            onClick={() => setPriority("high")}
            cursor="pointer"
            colorScheme={priority === "high" ? "blue" : "gray"}
          >
            high
          </Badge>
        </Box>
        <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
          {" "}
          Select Category:
        </Box>
        <Box
          d="flex"
          mt="2"
          justifyContent="space-between"
          alignItems="baseline"
        >
          <Badge
            borderRadius="full"
            px="2"
            onClick={() => setCategory("bug")}
            cursor="pointer"
            colorScheme={category === "bug" ? "blue" : "gray"}
          >
            Bug
          </Badge>
          <Badge
            borderRadius="full"
            px="2"
            onClick={() => setCategory("documentation")}
            cursor="pointer"
            colorScheme={category === "documentation" ? "blue" : "gray"}
          >
            Documentation
          </Badge>
          <Badge
            borderRadius="full"
            px="2"
            onClick={() => setCategory("enhancement")}
            cursor="pointer"
            colorScheme={category === "enhancement" ? "blue" : "gray"}
          >
            Enhancement
          </Badge>
        </Box>
        <Box d="flex" justifyContent="space-between" mt="5">
          <Button color="black" colorScheme="gray" onClick={handleCancel}>
            Cancel
          </Button>
          <Button colorScheme="green" isLoading={loading} onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default NewTask;
