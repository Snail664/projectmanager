import React from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

const TasksByPriority = (props) => {
  return (
    <BarChart width={400} height={300} data={props.data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar name="Number of Tasks" dataKey="value" fill="#0088FE" />
    </BarChart>
  );
};

export default TasksByPriority;
