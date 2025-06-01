// src/App.js
import React, { useState } from "react";
import "./App.css";
import RegistrationForm from "./components/RegistrationForm";
import SuccessPage from "./components/SuccessPage";
import TodoList from "./components/TodoList/TodoList";
// You might want to import a GitHub icon if you have one, or use a text label.
// For now, we'll use a text label + Unicode icon.

function App() {
  // ... (all existing state and functions: currentPage, submittedFormData, handlers) ...
  const [currentPage, setCurrentPage] = useState("form");
  const [submittedFormData, setSubmittedFormData] = useState(null);

  const handleFormSubmitSuccess = (data) => {
    setSubmittedFormData(data);
    setCurrentPage("success");
    window.scrollTo(0, 0);
  };

  const handleGoBackToForm = () => {
    setCurrentPage("form");
    setSubmittedFormData(null);
    window.scrollTo(0, 0);
  };

  const isAssignment1Active =
    currentPage === "form" || currentPage === "success";
  const isAssignment2Active = currentPage === "todo";

  const handleAssignmentClick = (assignmentId) => {
    window.scrollTo(0, 0);
    if (assignmentId === 1) {
      setCurrentPage("form");
      setSubmittedFormData(null);
    } else if (assignmentId === 2) {
      setCurrentPage("todo");
      setSubmittedFormData(null);
    }
  };

  return (
    <div className="app-layout">
      <nav className="app-sidebar">
        <div className="sidebar-main-nav">
          {" "}
          {/* Wrapper for main nav items */}
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
          {/* Future assignment links can be added here */}
        </div>

        <div className="sidebar-footer-nav">
          {" "}
          {/* Wrapper for footer/utility nav items in sidebar */}
          <a
            href="https://github.com/HarshalPatel1972/my-react-assignment"
            target="_blank"
            rel="noopener noreferrer"
            className="button-animated github-link-button" // Use animated style + specific class
            title="View Project on GitHub"
          >
            <span className="button-text">GitHub Repo</span>
            {/* Simple GitHub icon using a Unicode character or placeholder. 
                For a real icon, you'd use an SVG or an icon font. 
                Let's use a generic "link" or "code" icon symbol for now.
            */}
            <span className="button-icon-right">
              {" "}
              {/*  is link icon, </> is code brackets */}->
            </span>
          </a>
        </div>
      </nav>

      {/* ... (rest of App.js: .app-main-area, main, footer) ... */}
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
