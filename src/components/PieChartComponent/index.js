import React from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';


const TasksPieChart = ({ data }) => {

  const tasksCount = {
    'Tasks Yet to Start': data.filter((task) => task.status === 'Not Started').length,
    'Tasks in Progress': data.filter((task) => task.status === 'In Progress').length,
    'Tasks Completed': data.filter((task) => task.status === 'Completed').length,
  };


  const pieChartData = Object.keys(tasksCount).map((status) => ({
    name: status,
    value: tasksCount[status],
  }));

  
  const colors = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="tasks-pie-chart">
      <h2 className='chart-heading'>Tasks Distribution</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={pieChartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default TasksPieChart;
