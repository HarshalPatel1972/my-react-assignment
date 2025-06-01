// src/components/TodoList/TodoList.js
import React, { useState, useEffect } from "react";
import "./TodoList.css";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'completed'

  // Placeholder for localStorage load
  useEffect(() => {
    console.log("TodoList mounted. Implement localStorage load here.");
  }, []);

  // Placeholder for localStorage save
  useEffect(() => {
    if (tasks.length > 0) {
      // Only save if there are tasks, or on initial empty state if desired
      console.log("Tasks changed. Implement localStorage save here.", tasks);
    }
  }, [tasks]);

  const handleInputChange = (e) => {
    setNewTaskText(e.target.value);
    if (error && e.target.value.trim() !== "") {
      setError(""); // Clear error when user starts typing valid text
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault(); // Prevent form submission if it's in a form
    const trimmedText = newTaskText.trim();
    if (!trimmedText) {
      setError("Task cannot be empty.");
      return;
    }
    if (
      tasks.some(
        (task) => task.text.toLowerCase() === trimmedText.toLowerCase()
      )
    ) {
      setError("This task already exists.");
      return;
    }
    // Max length (optional)
    if (trimmedText.length > 100) {
      setError("Task text is too long (max 100 characters).");
      return;
    }

    const newTask = {
      id: Date.now(),
      text: trimmedText,
      completed: false,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]); // Add new tasks to the beginning
    setNewTaskText("");
    setError("");
  };

  const handleToggleComplete = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleRemoveTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleSetFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case "active":
        return tasks.filter((task) => !task.completed);
      case "completed":
        return tasks.filter((task) => task.completed);
      default: // 'all'
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();
  const activeTaskCount = tasks.filter((task) => !task.completed).length;

  return (
    <div className="todo-list-container">
      <h2>My To-Do List</h2>
      <form onSubmit={handleAddTask} className="todo-add-form">
        <input
          type="text"
          className="todo-input"
          value={newTaskText}
          onChange={handleInputChange}
          placeholder="What needs to be done?"
        />
        <button type="submit" className="todo-add-button">
          Add Task
        </button>
      </form>
      {error && <p className="todo-error-message">{error}</p>}

      <div className="todo-controls">
        <span className="todo-count">
          {activeTaskCount} item{activeTaskCount !== 1 ? "s" : ""} left
        </span>
        <div className="todo-filters">
          <button
            onClick={() => handleSetFilter("all")}
            className={filter === "all" ? "active" : ""}
          >
            All
          </button>
          <button
            onClick={() => handleSetFilter("active")}
            className={filter === "active" ? "active" : ""}
          >
            Active
          </button>
          <button
            onClick={() => handleSetFilter("completed")}
            className={filter === "completed" ? "active" : ""}
          >
            Completed
          </button>
        </div>
        {tasks.some((task) => task.completed) && (
          <button
            className="todo-clear-completed"
            onClick={() =>
              setTasks((prevTasks) =>
                prevTasks.filter((task) => !task.completed)
              )
            }
          >
            Clear Completed
          </button>
        )}
      </div>

      {filteredTasks.length === 0 && filter === "all" && (
        <p className="todo-empty-message">No tasks yet. Add some!</p>
      )}
      {filteredTasks.length === 0 && filter === "active" && (
        <p className="todo-empty-message">
          No active tasks. Great job or add more!
        </p>
      )}
      {filteredTasks.length === 0 && filter === "completed" && (
        <p className="todo-empty-message">No completed tasks yet.</p>
      )}

      <ul className="todo-items-list">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className={`todo-item ${task.completed ? "completed" : ""}`}
          >
            <div className="todo-item-content">
              <input
                type="checkbox"
                className="todo-item-checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id)}
                aria-label={`Mark task "${task.text}" as ${
                  task.completed ? "incomplete" : "complete"
                }`}
              />
              <span className="todo-item-text">{task.text}</span>
            </div>
            <button
              onClick={() => handleRemoveTask(task.id)}
              className="todo-remove-button"
              aria-label={`Remove task "${task.text}"`}
            >
              × {/* Times symbol for remove */}
            </button>
          </li>
        ))}
      </ul>
      {/* Optional: Sorting controls can go here */}
    </div>
  );
};

export default TodoList;
