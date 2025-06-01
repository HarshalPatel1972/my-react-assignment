// src/components/TodoList/TodoList.js
import React, { useState, useEffect, useCallback } from "react";
import "./TodoList.css"; // We will update this later

const LOCAL_STORAGE_KEY = "react-todo-list-tasks";

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    // Load tasks from localStorage on initial render
    try {
      const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error("Error loading tasks from localStorage", error);
      return [];
    }
  });

  const [newTaskText, setNewTaskText] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'completed'
  const [sortBy, setSortBy] = useState("date-desc"); // 'date-desc', 'date-asc', 'name-asc', 'name-desc'

  // Save tasks to localStorage whenever tasks array changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage", error);
    }
  }, [tasks]);

  const handleInputChange = (e) => {
    setNewTaskText(e.target.value);
    if (error && e.target.value.trim() !== "") {
      setError("");
    }
  };

  const validateTaskInput = (text) => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      return "Task cannot be empty.";
    }
    if (
      tasks.some(
        (task) =>
          task.text.toLowerCase() === trimmedText.toLowerCase() &&
          !task.completed
      )
    ) {
      // Only check against non-completed for duplicates
      return "This active task already exists.";
    }
    if (trimmedText.length > 150) {
      // Increased max length slightly
      return "Task text is too long (max 150 characters).";
    }
    return ""; // No error
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const validationError = validateTaskInput(newTaskText);
    if (validationError) {
      setError(validationError);
      return;
    }

    const newTask = {
      id: Date.now(), // Using timestamp as a simple unique ID
      text: newTaskText.trim(),
      completed: false,
      createdAt: new Date().toISOString(), // For sorting by date
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]); // Add to beginning for default newest first
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

  const handleSetSortBy = (e) => {
    setSortBy(e.target.value);
  };

  const getProcessedTasks = useCallback(() => {
    let processed = [...tasks];

    // 1. Filter
    if (filter === "active") {
      processed = processed.filter((task) => !task.completed);
    } else if (filter === "completed") {
      processed = processed.filter((task) => task.completed);
    }

    // 2. Sort
    switch (sortBy) {
      case "date-asc":
        processed.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "name-asc":
        processed.sort((a, b) => a.text.localeCompare(b.text));
        break;
      case "name-desc":
        processed.sort((a, b) => b.text.localeCompare(a.text));
        break;
      case "date-desc": // Default
      default:
        processed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    return processed;
  }, [tasks, filter, sortBy]);

  const processedTasks = getProcessedTasks();
  const activeTaskCount = tasks.filter((task) => !task.completed).length;

  const handleClearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  };

  return (
    <div className="todo-list-container">
      <h2>My To-Do List</h2>
      <form onSubmit={handleAddTask} className="todo-add-form">
        <input
          type="text"
          // className="todo-input" // Will rely on common input style from App.css or .common-input-style
          className="common-input-style todo-input-specifics" // Use common and add specific if needed
          value={newTaskText}
          onChange={handleInputChange}
          placeholder="What needs to be done?"
          aria-label="New task input"
        />
        {/* Updated Add Task Button */}
        <button
          type="submit"
          className="button-animated todo-add-button-specifics"
        >
          <span className="button-text">Add Task</span>
          <span className="button-icon-right">→</span>
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}{" "}
      {/* Uses common .error-message from App.css */}
      <div className="todo-controls">
        <span className="todo-count">
          {activeTaskCount} item{activeTaskCount !== 1 ? "s" : ""} left
        </span>
        <div className="todo-filters">
          {/* Updated Filter Buttons */}
          <button
            onClick={() => handleSetFilter("all")}
            className={`button-utility ${filter === "all" ? "active" : ""}`}
          >
            All
          </button>
          <button
            onClick={() => handleSetFilter("active")}
            className={`button-utility ${filter === "active" ? "active" : ""}`}
          >
            Active
          </button>
          <button
            onClick={() => handleSetFilter("completed")}
            className={`button-utility ${
              filter === "completed" ? "active" : ""
            }`}
          >
            Completed
          </button>
        </div>
        <div className="todo-sort">
          <label htmlFor="sort-tasks" className="todo-sort-label">
            Sort by:{" "}
          </label>
          <select
            id="sort-tasks"
            value={sortBy}
            onChange={handleSetSortBy}
            className="todo-sort-select"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>
        {tasks.some((task) => task.completed) && (
          <button
            className="button-utility todo-clear-completed-specifics"
            onClick={handleClearCompleted}
          >
            Clear Completed
          </button>
        )}
      </div>
      {processedTasks.length === 0 && tasks.length > 0 && (
        <p className="todo-empty-message">No tasks match the current filter.</p>
      )}
      {tasks.length === 0 && (
        <p className="todo-empty-message">No tasks yet. Add your first one!</p>
      )}
      <ul className="todo-items-list">
        {processedTasks.map((task) => (
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
            {/* Updated Remove Task Button */}
            <button
              onClick={() => handleRemoveTask(task.id)}
              className="button-utility todo-remove-button-specifics"
              aria-label={`Remove task "${task.text}"`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
