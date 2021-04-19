import React from "react";
import {
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tag,
} from "@chakra-ui/react";
import toReadableDate from "../../utils/toReadableDate";
import history from "../../history";

const UrgentTasks = (props) => {
  console.log(props);

  const renderTasks = (tasks) =>
    tasks.map((task) => {
      var tagBgColor;
      var tagColor = "white";
      console.log(task.task_priority);

      if (task.task_priority === "low") {
        tagBgColor = "green";
      } else if (task.task_priority === "medium") {
        tagBgColor = "yellow";
        tagColor = "black";
      } else if (task.task_priority === "high") {
        tagBgColor = "red";
      }
      console.log(tagColor);
      return (
        <Tr
          onClick={() => {
            history.push(`projects/${task.task_project}`);
          }}
          _hover={{ cursor: "pointer", color: "teal" }}
        >
          <Td>{task.task_title}</Td>
          <Td>{task.task_description}</Td>
          <Td>
            <Tag size="lg" color={tagColor} bgColor={tagBgColor}>
              {task.task_priority}
            </Tag>
          </Td>
          <Td>{toReadableDate(task.task_due_date)}</Td>
        </Tr>
      );
    });
  return (
    <Table
      w={{ sm: "100%", md: "100%", lg: "80%", xl: "60%" }}
      variant="striped"
      colorScheme="gray"
    >
      <TableCaption>Urgent Tasks: due in less than a week</TableCaption>
      <Thead>
        <Tr>
          <Th>Task</Th>
          <Th>Description</Th>
          <Th>Priority</Th>
          <Th>Due Date</Th>
        </Tr>
      </Thead>
      <Tbody>{renderTasks(props.data)}</Tbody>
    </Table>
  );
};

export default UrgentTasks;
