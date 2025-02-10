// src/components/research/AddTaskModal.jsx
import { useState } from 'react';

function AddTaskModal({ show, onClose, onSubmit }) {
  const [taskData, setTaskData] = useState({
    title: '',
    dateTime: '',
    type: 'Meeting'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(taskData);
    setTaskData({
      title: '',
      dateTime: '',
      type: 'Meeting'
    });
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Priority Task</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Task Title */}
              <div className="mb-3">
                <label htmlFor="taskTitle" className="form-label">Task Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="taskTitle"
                  placeholder="Enter task title"
                  value={taskData.title}
                  onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                  required
                />
              </div>

              {/* Date and Time */}
              <div className="mb-3">
                <label htmlFor="taskDateTime" className="form-label">Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="taskDateTime"
                  value={taskData.dateTime}
                  onChange={(e) => setTaskData({ ...taskData, dateTime: e.target.value })}
                  required
                />
              </div>

              {/* Task Type */}
              <div className="mb-3">
                <label htmlFor="taskType" className="form-label">Task Type</label>
                <select
                  className="form-select"
                  id="taskType"
                  value={taskData.type}
                  onChange={(e) => setTaskData({ ...taskData, type: e.target.value })}
                  required
                >
                  <option value="Meeting">Meeting</option>
                  <option value="Deadline">Deadline</option>
                  <option value="Task">Task</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddTaskModal;