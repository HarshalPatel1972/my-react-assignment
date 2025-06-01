// src/components/RegistrationForm.js
import React, { useState, useEffect, useCallback } from "react";
import "./RegistrationForm.css";

// Sample data for dropdowns
const countryData = [
  { name: "Select Country", code: "", phoneCode: "", cities: [] },
  {
    name: "India",
    code: "IN",
    phoneCode: "+91",
    cities: [
      "Select City",
      "Mumbai",
      "Delhi",
      "Bangalore",
      "Hyderabad",
      "Chennai",
    ],
  },
  {
    name: "USA",
    code: "US",
    phoneCode: "+1",
    cities: [
      "Select City",
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "Phoenix",
    ],
  },
  {
    name: "United Kingdom",
    code: "GB",
    phoneCode: "+44",
    cities: [
      "Select City",
      "London",
      "Manchester",
      "Birmingham",
      "Liverpool",
      "Bristol",
    ],
  },
];

const initialFormData = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  phoneCountryCode:
    countryData.find((c) => c.code === "IN")?.phoneCode ||
    countryData[1]?.phoneCode ||
    "",
  phoneNumber: "",
  country: "",
  city: "",
  panNo: "",
  aadharNo: "",
};

const RegistrationForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // --- Validation Rules ---
  const validateField = useCallback(
    (name, value, currentFormData = formData) => {
      let error = "";
      const trimmedValue = typeof value === "string" ? value.trim() : value;

      switch (name) {
        case "firstName":
          if (!trimmedValue) error = "First Name is required.";
          else if (trimmedValue !== value && value.length > 0)
            error = "No leading/trailing spaces allowed.";
          // Check if original had spaces
          else if (!/^[a-zA-Z]+$/.test(trimmedValue))
            error = "First Name must contain only alphabetic letters.";
          else if (trimmedValue.length > 50)
            error = "First Name cannot exceed 50 characters.";
          else if (trimmedValue.length < 1)
            error = "First Name must be at least 1 character."; // Already covered by required
          break;
        case "lastName":
          if (!trimmedValue) error = "Last Name is required.";
          else if (trimmedValue !== value && value.length > 0)
            error = "No leading/trailing spaces allowed.";
          else if (!/^[a-zA-Z]+$/.test(trimmedValue))
            error = "Last Name must contain only alphabetic letters.";
          else if (trimmedValue.length > 50)
            error = "Last Name cannot exceed 50 characters.";
          else if (trimmedValue.length < 1)
            error = "Last Name must be at least 1 character.";
          break;
        case "username":
          if (!trimmedValue) error = "Username is required.";
          else if (!/^[a-zA-Z]/.test(trimmedValue))
            error = "Username must start with a letter.";
          else if (/_$/.test(trimmedValue))
            error = "Username cannot end with an underscore.";
          else if (!/^[a-zA-Z0-9_]+$/.test(trimmedValue))
            error =
              "Username can only contain letters, numbers, and underscores.";
          else if (/__/.test(trimmedValue))
            error = "Username cannot have consecutive underscores.";
          else if (trimmedValue.length < 3)
            error = "Username must be at least 3 characters.";
          else if (trimmedValue.length > 16)
            error = "Username cannot exceed 16 characters.";
          break;
        case "email":
          // Basic regex for structure: local@domain.tld
          // More complex regex for stricter validation of local part and domain labels:
          const emailRegex =
            /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
          if (!trimmedValue) error = "Email is required.";
          else if (!emailRegex.test(trimmedValue))
            error = "Invalid email format.";
          else {
            const [localPart, domainPart] = trimmedValue.split("@");
            if (
              localPart.startsWith(".") ||
              localPart.endsWith(".") ||
              /\.\./.test(localPart)
            ) {
              error = "Invalid local part of email (dots).";
            }
            if (domainPart) {
              const domainLabels = domainPart.split(".");
              if (
                domainLabels.some(
                  (label) =>
                    label.startsWith("-") ||
                    label.endsWith("-") ||
                    !/^[a-zA-Z0-9-]+$/.test(label)
                )
              ) {
                error = "Invalid domain part of email.";
              }
              if (domainLabels[domainLabels.length - 1].length < 2) {
                error = "Top-level domain must be at least 2 characters.";
              }
            }
          }
          break;
        case "password":
          if (!value) error = "Password is required.";
          // Don't trim password for space check
          else if (/\s/.test(value)) error = "Password cannot contain spaces.";
          else if (value.length < 12)
            error = "Password must be at least 12 characters.";
          // else if (value.length > 20) error = 'Password ideally should not exceed 20 characters for memorability.'; // Optional
          else if (!/(?=.*[a-z])/.test(value))
            error = "Password needs a lowercase letter.";
          else if (!/(?=.*[A-Z])/.test(value))
            error = "Password needs an uppercase letter.";
          else if (!/(?=.*\d)/.test(value)) error = "Password needs a digit.";
          else if (!/(?=.*[!@#$%^&*])/.test(value))
            error = "Password needs a special character (!@#$%^&*).";
          break;
        case "phoneNumber":
          if (!trimmedValue) error = "Phone Number is required.";
          else if (!/^[6-9]\d{9}$/.test(trimmedValue))
            error =
              "Phone Number must be 10 digits and start with 6, 7, 8, or 9.";
          break;
        case "country":
          if (!value) error = "Country is required.";
          break;
        case "city":
          if (!currentFormData.country) error = "Select a country first.";
          else if (!value) error = "City is required.";
          break;
        case "panNo": // Value is already uppercased by handleChange
          if (!value) error = "PAN Number is required.";
          else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value))
            error = "Invalid PAN format (e.g., ABCDE1234F).";
          break;
        case "aadharNo":
          if (!trimmedValue) error = "Aadhar Number is required.";
          else if (!/^[2-9]\d{11}$/.test(trimmedValue))
            error = "Aadhar must be 12 digits and not start with 0 or 1.";
          break;
        default:
          break;
      }
      return error;
    },
    [formData.country]
  ); // formData.country needed for city validation context

  // --- Handle Autofill and Initial Validation ---
  useEffect(() => {
    const timer = setTimeout(() => {
      let hasAutofilledValues = false;
      const newTouched = { ...touched };
      const newErrors = { ...errors };

      Object.keys(initialFormData).forEach((key) => {
        const currentValue = formData[key];
        const initialValue = initialFormData[key];
        // If field has a value, and it's different from initial (or initial was empty)
        // and it hasn't been touched manually yet.
        if (currentValue && currentValue !== initialValue && !touched[key]) {
          newTouched[key] = true;
          const error = validateField(key, currentValue, formData);
          if (error) {
            newErrors[key] = error;
          } else {
            delete newErrors[key]; // Clear previous error if now valid
          }
          hasAutofilledValues = true;
        }
      });

      if (hasAutofilledValues) {
        setTouched(newTouched);
        setErrors(newErrors);
      }
    }, 500); // Delay to allow browser autofill to complete

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!touched[name]) {
      // Only set touched if it wasn't already (e.g. by autofill check)
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
    const error = validateField(
      name,
      name === "panNo" ? value.toUpperCase() : value
    );
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === "panNo") {
      processedValue = value.toUpperCase();
    }

    setFormData((prev) => {
      const newFormData = { ...prev, [name]: processedValue };
      // Special handling for country change
      if (name === "country") {
        const selectedCountryData = countryData.find(
          (c) => c.code === processedValue
        );
        newFormData.phoneCountryCode = selectedCountryData?.phoneCode || "";
        newFormData.city = ""; // Reset city
        // If city was touched, re-validate it immediately as it's now likely invalid/empty
        if (touched.city) {
          const cityError = validateField("city", "", newFormData); // Validate with empty city value
          setErrors((prevErrors) => ({ ...prevErrors, city: cityError }));
        }
      }
      return newFormData;
    });

    if (touched[name]) {
      const error = validateField(name, processedValue, {
        ...formData,
        [name]: processedValue,
      }); // Pass updated formData for context
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  useEffect(() => {
    if (formData.country) {
      const selectedCountry = countryData.find(
        (c) => c.code === formData.country
      );
      setAvailableCities(selectedCountry ? selectedCountry.cities : []);
    } else {
      setAvailableCities([]);
    }
  }, [formData.country]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validateFullForm = () => {
    const newErrors = {};
    let formIsValid = true;
    const tempTouched = {};

    for (const key in initialFormData) {
      // Iterate using initialFormData keys to ensure all are checked
      tempTouched[key] = true; // Mark all as touched for this submit validation pass
      const error = validateField(key, formData[key], formData);
      if (error) {
        newErrors[key] = error;
        formIsValid = false;
      }
    }
    setErrors(newErrors);
    setTouched(tempTouched);
    return formIsValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    if (validateFullForm()) {
      console.log("Form Data Submitted:", formData);
      setTimeout(() => onSubmitSuccess(formData), 1000);
    } else {
      console.log("Validation Errors found.");
      setIsSubmitting(false);
    }
  };

  const isFormGloballyValid = () => {
    // Check if all required fields are filled according to their current values in formData
    for (const key of Object.keys(initialFormData)) {
      const error = validateField(key, formData[key], formData);
      if (error) {
        // If any field has a validation error
        return false;
      }
    }
    return true; // All fields pass validation
  };

  // --- Placeholders ---
  const placeholders = {
    firstName: "e.g., Sarah (letters only)",
    lastName: "e.g., Connor (letters only)",
    username: "e.g., sarah_c (3-16 chars, starts letter)",
    email: "name@example.com",
    password: "Min 12 chars (Aa1!@#)",
    phoneNumber: "e.g. 9876543210 (starts 6-9)",
    panNo: "ABCDE1234F",
    aadharNo: "12 digits, not starting 0 or 1",
  };

  return (
    <form className="registration-form" onSubmit={handleSubmit} noValidate>
      {/* First Name */}
      <div className="form-group">
        <label htmlFor="firstName">
          First Name <span className="required-star">*</span>
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholders.firstName}
          required
        />
        {touched.firstName && errors.firstName && (
          <p className="error-message">{errors.firstName}</p>
        )}
      </div>

      {/* Last Name */}
      <div className="form-group">
        <label htmlFor="lastName">
          Last Name <span className="required-star">*</span>
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholders.lastName}
          required
        />
        {touched.lastName && errors.lastName && (
          <p className="error-message">{errors.lastName}</p>
        )}
      </div>

      {/* Username */}
      <div className="form-group">
        <label htmlFor="username">
          Username <span className="required-star">*</span>
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholders.username}
          required
        />
        {touched.username && errors.username && (
          <p className="error-message">{errors.username}</p>
        )}
      </div>

      {/* E-mail */}
      <div className="form-group">
        <label htmlFor="email">
          E-mail <span className="required-star">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholders.email}
          required
        />
        {touched.email && errors.email && (
          <p className="error-message">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="form-group">
        <label htmlFor="password">
          Password <span className="required-star">*</span>
        </label>
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholders.password}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="toggle-password-visibility"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {touched.password && errors.password && (
          <p className="error-message">{errors.password}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="form-group">
        <label htmlFor="phoneNumber">
          Phone Number <span className="required-star">*</span>
        </label>
        <div className="phone-input-group">
          <select
            id="phoneCountryCode"
            name="phoneCountryCode"
            value={formData.phoneCountryCode}
            onChange={handleChange}
            onBlur={handleBlur} // Added onBlur
            className="country-code-select"
          >
            {countryData
              .filter((c) => c.phoneCode)
              .map((country) => (
                <option
                  key={country.code || country.name}
                  value={country.phoneCode}
                >
                  {country.phoneCode} ({country.name})
                </option>
              ))}
          </select>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            className="phone-number-input"
            placeholder={placeholders.phoneNumber}
            required
          />
        </div>
        {touched.phoneNumber && errors.phoneNumber && (
          <p className="error-message">{errors.phoneNumber}</p>
        )}
        {/* Consider if error for phoneCountryCode is needed if it can be invalidly empty */}
      </div>

      {/* Country */}
      <div className="form-group">
        <label htmlFor="country">
          Country <span className="required-star">*</span>
        </label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        >
          {countryData.map((country) => (
            <option key={country.code || "select-country"} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        {touched.country && errors.country && (
          <p className="error-message">{errors.country}</p>
        )}
      </div>

      {/* City */}
      <div className="form-group">
        <label htmlFor="city">
          City <span className="required-star">*</span>
        </label>
        <select
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          disabled={!formData.country || availableCities.length <= 1}
        >
          {availableCities.length > 0 ? (
            availableCities.map((city) => (
              <option key={city} value={city === "Select City" ? "" : city}>
                {city}
              </option>
            ))
          ) : (
            <option value="">
              {formData.country
                ? "No cities available"
                : "Select a country first"}
            </option>
          )}
        </select>
        {touched.city && errors.city && (
          <p className="error-message">{errors.city}</p>
        )}
      </div>

      {/* Pan No. */}
      <div className="form-group">
        <label htmlFor="panNo">
          Pan No. <span className="required-star">*</span>
        </label>
        <input
          type="text"
          id="panNo"
          name="panNo"
          value={formData.panNo}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholders.panNo}
          required
          style={{ textTransform: "uppercase" }}
          maxLength="10"
        />
        {touched.panNo && errors.panNo && (
          <p className="error-message">{errors.panNo}</p>
        )}
      </div>

      {/* Aadhar No. */}
      <div className="form-group">
        <label htmlFor="aadharNo">
          Aadhar No. <span className="required-star">*</span>
        </label>
        <input
          type="text"
          id="aadharNo"
          name="aadharNo"
          value={formData.aadharNo}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholders.aadharNo}
          required
          maxLength="12"
        />
        {touched.aadharNo && errors.aadharNo && (
          <p className="error-message">{errors.aadharNo}</p>
        )}
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={!isFormGloballyValid() || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Register"}
      </button>
    </form>
  );
};

export default RegistrationForm;
