import React, { useEffect, useState } from "react";
import {
  Box,
  Input,
  Badge,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  Switch,
  Popover,
  PopoverArrow,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import toReadableDate from "../../utils/toReadableDate";
import isDateInPast from "../../utils/isDateInPast";
import isDateWithinOneWeek from "../../utils/isDateWithinOneWeek";
import axios from "axios";

const Task = ({ task, setRefetchData }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(task.task_title);
  const [description, setDescription] = useState(task.task_description);
  const [priority, setPriority] = useState(task.task_priority);
  const [category, setCategory] = useState(task.task_category);
  const [status, setStatus] = useState(task.task_status);
  const [dueDate, setDueDate] = useState(toReadableDate(task.task_due_date));
  const [newTitle, setNewTitle] = useState(task.task_title);
  const [newDescription, setNewDescription] = useState(task.task_description);
  const [newPriority, setNewPriority] = useState(task.task_priority);
  const [newCategory, setNewCategory] = useState(task.task_category);
  const [newStatus, setNewStatus] = useState(task.task_status);
  const [newDueDate, setNewDueDate] = useState(
    toReadableDate(task.task_due_date)
  );
  const [styles, setStyles] = useState({
    bgColor: "teal",
    borderColor: "gray.200",
    overdue: false,
    urgent: false,
  });

  const setAllStyles = () => {
    var newStyles = styles;
    if (priority === "low") {
      newStyles.bgColor = "green";
    } else if (priority === "medium") {
      newStyles.bgColor = "yellow";
    } else if (priority === "high") {
      newStyles.bgColor = "red";
    }

    if (isDateInPast(dueDate) && status === "pending") {
      newStyles.borderColor = "red";
      newStyles.overdue = true;
    } else if (isDateWithinOneWeek(dueDate) && status === "pending") {
      newStyles.borderColor = "orange";
      newStyles.urgent = true;
    } else {
      newStyles.borderColor = "gray.200";
      newStyles.urgent = false;
      newStyles.overdue = false;
    }
    setStyles(newStyles);
  };

  useEffect(() => {
    setAllStyles();
  }, [dueDate, priority, status, styles]);

  const handleSave = async () => {
    try {
      // set loading state
      setLoading(true);
      // submit new data
      const res = await axios.put(
        `/tasks/${task.task_id}`,
        {
          title: newTitle ? newTitle : title,
          description: newDescription ? newDescription : description,
          priority: newPriority,
          due_date: newDueDate,
          status: newStatus,
          category: newCategory,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setTitle(res.data.task_title);
      setDescription(res.data.task_description);
      setNewTitle(res.data.task_title);
      setNewDescription(res.data.task_description);
      setPriority(res.data.task_priority);
      setDueDate(toReadableDate(res.data.task_due_date));
      setStatus(res.data.task_status);
      setCategory(res.data.task_category);
      setLoading(false);
      setEditMode(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancel = () => {
    // set "new" States / selected States back to original value
    // close edit mode
    setNewTitle(title);
    setNewDescription(description);
    setNewPriority(priority);
    setEditMode(false);
  };

  const handleDelete = async () => {
    const res = await axios.delete(`/tasks/${task.task_id}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    setRefetchData(true);
  };

  if (editMode) {
    return (
      <Box
        m="10px"
        maxW="sm"
        height="max-content"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg="gray.600"
        color="white"
      >
        <Box p="6">
          <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
            Title:{" "}
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </Box>
          <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
            Description:{" "}
            <Textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </Box>
          <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
            Due Date:{" "}
            <Input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
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
              onClick={() => setNewPriority("low")}
              cursor="pointer"
              colorScheme={newPriority === "low" ? "blue" : "gray"}
            >
              low
            </Badge>
            <Badge
              size="lg"
              borderRadius="full"
              px="2"
              onClick={() => setNewPriority("medium")}
              cursor="pointer"
              colorScheme={newPriority === "medium" ? "blue" : "gray"}
            >
              medium
            </Badge>
            <Badge
              size="lg"
              borderRadius="full"
              px="2"
              onClick={() => setNewPriority("high")}
              cursor="pointer"
              colorScheme={newPriority === "high" ? "blue" : "gray"}
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
              onClick={() => setNewCategory("bug")}
              cursor="pointer"
              colorScheme={newCategory === "bug" ? "blue" : "gray"}
            >
              Bug
            </Badge>
            <Badge
              borderRadius="full"
              px="2"
              onClick={() => setNewCategory("documentation")}
              cursor="pointer"
              colorScheme={newCategory === "documentation" ? "blue" : "gray"}
            >
              Documentation
            </Badge>
            <Badge
              borderRadius="full"
              px="2"
              onClick={() => setNewCategory("enhancement")}
              cursor="pointer"
              colorScheme={newCategory === "enhancement" ? "blue" : "gray"}
            >
              Enhancement
            </Badge>
          </Box>
          <Box mt="3" fontWeight="semibold">
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Completed?</FormLabel>
              <Switch
                isChecked={newStatus === "pending" ? false : true}
                onChange={() =>
                  setNewStatus(
                    newStatus === "pending" ? "completed" : "pending"
                  )
                }
              />
            </FormControl>
            <Popover>
              <PopoverTrigger>
                <Button mt="5" lineHeight="tight" colorScheme="red">
                  Delete Task
                </Button>
              </PopoverTrigger>
              <PopoverContent color="black">
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Confirmation!</PopoverHeader>
                <PopoverBody>
                  Are you sure you want to delete this task?
                </PopoverBody>
                <PopoverFooter>
                  <Button onClick={handleDelete} colorScheme="red">
                    Confirm
                  </Button>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          </Box>
          <Box d="flex" justifyContent="space-between" mt="5">
            <Button
              color="black"
              colorScheme="gray"
              onClick={() => {
                handleCancel();
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="green"
              isLoading={loading}
              onClick={handleSave}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      m="10px"
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      cursor="pointer"
      _hover={{ bg: "gray.600", color: "white" }}
      borderColor={styles.borderColor}
      onClick={() => {
        setEditMode(true);
      }}
    >
      <Box p="6">
        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
          fontSize="xl"
        >
          {title}
        </Box>
        <Box d="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme={styles.bgColor}>
            {priority}
          </Badge>
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="sm"
            textTransform="uppercase"
            ml="2"
          >
            {category} &bull; {dueDate}
          </Box>
        </Box>

        <Box>{description}</Box>

        <Box
          d="flex"
          mt="2"
          alignItems="center"
          color="gray.500"
          fontSize="xs"
          fontWeight="bold"
        >
          {status}
          {status === "completed" && (
            <Box ml="2">
              <CheckIcon color="green" h={5} w={5} />
            </Box>
          )}
          {styles.overdue && (
            <>
              {" "}
              |
              <Badge ml="2" borderRadius="full" px="2" colorScheme="red">
                OVERDUE
              </Badge>
            </>
          )}
          {styles.urgent && (
            <>
              {" "}
              |
              <Badge ml="2" borderRadius="full" px="2" colorScheme="yellow">
                URGENT
              </Badge>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Task;
