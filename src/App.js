// src/App.js
import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import "./App.css";
import RegistrationForm from "./components/RegistrationForm";
import SuccessPage from "./components/SuccessPage";
import TodoList from "./components/TodoList/TodoList";

// Define paths for clarity
const PATHS = {
  ASSIGNMENT_1: "/assignment1",
  ASSIGNMENT_1_SUCCESS: "/assignment1/success", // Optional: if you want a distinct URL for success
  ASSIGNMENT_2: "/assignment2",
  HOME: "/", // Or default to assignment1
};

// Helper to map path to internal page state
const getPageFromPath = (path) => {
  if (path === PATHS.ASSIGNMENT_2) return "todo";
  if (path === PATHS.ASSIGNMENT_1_SUCCESS) return "success"; // Handle success page path
  if (path === PATHS.ASSIGNMENT_1 || path === PATHS.HOME) return "form"; // Default to form for / or /assignment1
  return "form"; // Fallback
};

function App() {
  // Initialize currentPage based on the current URL path
  const [currentPage, setCurrentPage] = useState(() =>
    getPageFromPath(window.location.pathname)
  );
  const [submittedFormData, setSubmittedFormData] = useState(null);

  // Function to navigate and update history
  const navigate = useCallback((page, path, data = null) => {
    setCurrentPage(page);
    setSubmittedFormData(data); // Store submitted data if navigating to success
    window.history.pushState({ page, data }, "", path); // Update browser history and URL
    window.scrollTo(0, 0);
  }, []); // Empty dependency array, navigate function itself doesn't change

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        setCurrentPage(event.state.page);
        setSubmittedFormData(event.state.data || null);
      } else {
        // Fallback if event.state is null (e.g., initial page load handled differently)
        setCurrentPage(getPageFromPath(window.location.pathname));
        setSubmittedFormData(null);
      }
      window.scrollTo(0, 0);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []); // Run only once on mount

  // Handle successful form submission for Assignment 1
  const handleFormSubmitSuccess = (data) => {
    // Option 1: Navigate to a success URL
    // navigate('success', PATHS.ASSIGNMENT_1_SUCCESS, data);

    // Option 2: Keep success as an internal state of /assignment1 (simpler for now)
    // If using Option 2, ensure that refreshing /assignment1 doesn't show success page
    // The current getPageFromPath defaults /assignment1 to 'form'
    setSubmittedFormData(data);
    setCurrentPage("success");
    // If we want the URL to reflect success:
    // window.history.replaceState({ page: 'success', data }, '', PATHS.ASSIGNMENT_1_SUCCESS); // or PATHS.ASSIGNMENT_1 if success is part of it
    window.scrollTo(0, 0);
  };

  // Handle going back to the form from the success page
  const handleGoBackToForm = () => {
    navigate("form", PATHS.ASSIGNMENT_1);
  };

  // Handle clicks on assignment navigation links
  const handleAssignmentClick = (assignmentId) => {
    if (assignmentId === 1) {
      navigate("form", PATHS.ASSIGNMENT_1);
    } else if (assignmentId === 2) {
      navigate("todo", PATHS.ASSIGNMENT_2);
    }
  };

  // Determine active assignment for sidebar styling and content display
  const isAssignment1Active =
    currentPage === "form" || currentPage === "success";
  const isAssignment2Active = currentPage === "todo";

  return (
    <div className="app-layout">
      <nav className="app-sidebar">
        <div className="sidebar-main-nav">
          <div
            className={`assignment-nav-item ${
              isAssignment1Active ? "active" : ""
            }`}
            onClick={() => handleAssignmentClick(1)}
            title="View Assignment 1: Form Validation"
          >
            Assignment 1
          </div>
          <div
            className={`assignment-nav-item ${
              isAssignment2Active ? "active" : ""
            }`}
            onClick={() => handleAssignmentClick(2)}
            title="View Assignment 2: To-Do List"
          >
            Assignment 2
          </div>
        </div>

        <div className="sidebar-footer-nav">
          <a
            href="https://github.com/HarshalPatel1972/my-react-assignment"
            target="_blank"
            rel="noopener noreferrer"
            className="button-animated github-link-button"
            title="View Project on GitHub"
          >
            <span className="button-text">GitHub Repo</span>
            <span className="button-icon-right">
              → {/* Using right arrow */}
            </span>
          </a>
        </div>
      </nav>

      <div className="app-main-area">
        <main className="main-content-wrapper">
          {currentPage === "form" && (
            <RegistrationForm onSubmitSuccess={handleFormSubmitSuccess} />
          )}
          {currentPage === "success" && (
            <SuccessPage
              formData={submittedFormData}
              onGoBack={handleGoBackToForm}
            />
          )}
          {currentPage === "todo" && <TodoList />}
        </main>

        <footer className="app-footer">
          <p className="footer-text">
            {isAssignment1Active ? "Form Validation" : "To-Do List"}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
