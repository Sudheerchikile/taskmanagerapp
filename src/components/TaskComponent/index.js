import React, { Component } from 'react';
import { RiDeleteBinLine } from "react-icons/ri";
import './index.css';

class TaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      taskName: '',
      description: '',
      dueDate: '',
      assigneeType: 'user',
      errors: {},
    };
  }

  componentDidMount() {
    this.fetchTasks();
  }

  fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3004/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const tasks = await response.json();
      if (!Array.isArray(tasks)) {
        throw new Error('Invalid tasks data format');
      }
      this.setState({ tasks });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  

  handleChange = (field) => (e) => {
    this.setState({ [field]: e.target.value });
  };

  validateForm = () => {
    const { taskName,description } = this.state;
    let errors = {};

    

    if (!taskName.trim()) {
      errors.taskName = 'Task Name is required';
    }

    if (!description.trim()) {
      errors.description = 'Description is required';
    }
  

   

    
    // Add validation for other fields as needed

    return errors;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const errors = this.validateForm();

    if (Object.keys(errors).length === 0) {
      const { taskName, description, dueDate, assigneeType } = this.state;
      const newTask = {
        taskName,
        description,
        dueDate,
        assigneeType,
        status: 'Not Started', 
      };

      try {
        const response = await fetch('http://localhost:3004/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask),
        });

        if (response.ok) {
          
          this.fetchTasks();
          this.setState({
            taskName: '',
            description: '',
            dueDate: '',
            assigneeType: 'user',
            errors: {},
          });
        } else {
          console.error('Failed to add task:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    } else {
      this.setState({ errors });
    }
  };

  handleStatusChange = async (taskId, newStatus) => {
    const { taskName, description, dueDate, assigneeType } = this.state.tasks.find(task => task.id === taskId);
    try {
      const response = await fetch(`http://localhost:3004/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskName, description, dueDate, assigneeType, status: newStatus }),
      });
      if (response.ok) {
        this.fetchTasks();
      } else {
        const errorData = await response.json(); 
        console.error('Failed to update task status:', errorData);
      }
     
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  

  handleTaskDelete = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3004/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        this.fetchTasks(); 
      } else {
        console.error('Failed to delete task:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  render() {
    const { tasks, taskName, description, dueDate, assigneeType, errors } = this.state;
return (
  <div className='main-container'>
     <div className="task-form-container">
        <h2 className="heading">Task Manager</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="taskName" className="label">Task Name</label>
            <input type="text" id="taskName" placeholder='Enter a Title'
             value={taskName} onChange={this.handleChange('taskName')} className="form-control" />
              {errors.taskName && <span className="error">{errors.taskName}</span>}
           
          </div>

          <div className="form-group">
            <label htmlFor="description"  className="label">Description</label>
            <textarea id="description" placeholder="give a short note"
             value={description} onChange={this.handleChange('description')} className="form-control" />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dueDate" className="label">Due Date</label>
            <input type="date" id="dueDate" placeholder='select a date'
             value={dueDate} onChange={this.handleChange('dueDate')} className="form-control" />
            {errors.dueDate && <p className="error">{errors.dueDate}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="assigneeType" className="label">Assigned To</label>
            <select id="assigneeType" value={assigneeType} 
            onChange={this.handleChange('assigneeType')} className="select-item">
              <option value="user">User</option>
              <option value="team">Team</option>
            </select>
            {errors.assigneeType && <span className="error">{errors.assigneeType}</span>}
          </div>
          <button type="submit" className="button">Add Task</button>
         
        </form>

        
        
      </div>
      <h2 className='heading-2'>Tasks List</h2>
      
         <div className="task-list-container">
         {tasks.length === 0 ? (
           <div className='heading'>No tasks to show</div>
         ) : (
           tasks.map((task) => (
             <div key={task.id} className="task-item">
               <span className="task-name">Title: {task.taskName}</span>
               <span>Description: {task.description}</span>
               <span>Deadline: {task.dueDate}</span>
              <div className='assigned-delete-con'>
               <span>Assigned to: {task.assigneeType}</span>
               <button className="delete-button" onClick={() => this.handleTaskDelete(task.id)}>
               <RiDeleteBinLine/>
             </button>
               </div>
               <div className='button-con'>
                 <button
                   className={`status-button ${task.status === 'Not Started' ? 'active-status' : 'normal-button'}`}
                   onClick={() => this.handleStatusChange(task.id, 'Not Started')}
                 >
                   Not Started
                 </button>
                 <button
                   className={`status-button ${task.status === 'In Progress' ? 'active-status' : 'normal-button'}`}
                   onClick={() => this.handleStatusChange(task.id, 'In Progress')}
                 >
                   InProgress
                 </button>
                 <button
                   className={`status-button ${task.status === 'Completed' ? 'active-status' : 'normal-button'}`}
                   onClick={() => this.handleStatusChange(task.id, 'Completed')}
                 >
                   Completed
                 </button>
               </div>
              
              
             </div>
       
           ))
         )}
       </div>
       

      </div>
); 
  }
}

export default TaskForm;

