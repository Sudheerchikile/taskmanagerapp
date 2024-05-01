import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import TasksPieChart from '../PieChartComponent';
import "./index.css"; 
import { Link } from 'react-router-dom';

const TasksChart = () => {
  const [tasksData, setTasksData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3004/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasksData(data); 
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
   

    fetchData();
  }, []);


  const notStartedCount = tasksData.filter(task => task.status === 'Not Started').length;
  const inProgressCount = tasksData.filter(task => task.status === 'In Progress').length;
  const completedCount = tasksData.filter(task => task.status === 'Completed').length;
  console.log(tasksData.length);
  
  const data = [
    { name: 'Not Started', value: notStartedCount, color: '#8884d8' },
    { name: 'In Progress', value: inProgressCount, color: '#82ca9d' },
    { name: 'Completed', value: completedCount, color: '#ffc658' }
  ];

  return (
    <div className="tasks-chart-con">
      {tasksData.length > 0 ? (
        <>
          <div className='chart-con'>
            <h2 className='chart-heading'>Tasks Status Chart</h2>
            <BarChart width={600} height={400} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" barSize={40} name="count" />
            </BarChart>
          </div>
          <div className='chart-con'>
            <TasksPieChart data={tasksData}/>
          </div>
        </>
      ) : (
        <div className='messages-con'>
        <h1 className='message'>No Tasks in Database To Show Metrics</h1>
        <Link to="/">
        <span className='suggest'>Go to home page</span>
        </Link>
        </div>
      )}
    </div>
  );
};

export default TasksChart;
