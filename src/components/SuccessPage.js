// src/components/SuccessPage.js
import React from "react";

const SuccessPage = ({ formData, onGoBack }) => {
  if (!formData) {
    return <p>No data submitted.</p>;
  }

  return (
    <div
      className="success-page"
      style={{
        textAlign: "left",
        background: "#fff",
        padding: "30px",
        borderRadius: "8px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
      }}
    >
      <h2>Registration Successful!</h2>
      <p>Thank you for registering. Here are the details you submitted:</p>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {Object.entries(formData).map(([key, value]) => (
          <li
            key={key}
            style={{
              marginBottom: "10px",
              borderBottom: "1px solid #eee",
              paddingBottom: "5px",
            }}
          >
            <strong
              style={{ textTransform: "capitalize", marginRight: "10px" }}
            >
              {key.replace(/([A-Z])/g, " $1")}:
            </strong>
            {value}
          </li>
        ))}
      </ul>
      <button
        onClick={onGoBack}
        style={{
          marginTop: "20px",
          padding: "10px 15px",
          backgroundColor: "#007AFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Go Back to Form
      </button>
    </div>
  );
};

export default SuccessPage;
