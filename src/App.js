// src/App.js
import React, { useState } from "react";
import "./App.css"; // Main App CSS for layout and shared styles
import RegistrationForm from "./components/RegistrationForm";
import SuccessPage from "./components/SuccessPage";
import TodoList from "./components/TodoList/TodoList";

function App() {
  // 'form', 'success' (for Assignment 1 success page), 'todo'
  const [currentPage, setCurrentPage] = useState("form");
  const [submittedFormData, setSubmittedFormData] = useState(null);

  const handleFormSubmitSuccess = (data) => {
    setSubmittedFormData(data);
    setCurrentPage("success"); // Navigate to success page for form
    window.scrollTo(0, 0);
  };

  const handleGoBackToForm = () => {
    // Used by SuccessPage or Assignment 1 nav
    setCurrentPage("form");
    setSubmittedFormData(null);
    window.scrollTo(0, 0);
  };

  // Determine active assignment for sidebar styling and content display
  const isAssignment1Active =
    currentPage === "form" || currentPage === "success";
  const isAssignment2Active = currentPage === "todo";

  const handleAssignmentClick = (assignmentId) => {
    window.scrollTo(0, 0); // Scroll to top on navigation
    if (assignmentId === 1) {
      setCurrentPage("form"); // Go to (or reset) the form validation page
      setSubmittedFormData(null); // Clear any previous form data
    } else if (assignmentId === 2) {
      setCurrentPage("todo"); // Go to the To-Do list page
      setSubmittedFormData(null); // Clear form data if navigating away from form assignment
    }
  };

  return (
    <div className="app-layout">
      <nav className="app-sidebar">
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
