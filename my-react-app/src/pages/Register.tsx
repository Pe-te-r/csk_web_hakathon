import React, { useState } from "react";
import styles from "../styles/RegisterForm.module.scss";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    password: "",
    username: "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    const newErrors: string[] = [];
    if (!formData.first_name) newErrors.push("First name is required.");
    if (!formData.email) newErrors.push("Email is required.");
    if (!formData.password) newErrors.push("Password is required.");
    if (!formData.username) newErrors.push("Username is required.");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate server-side validation (e.g., username already exists)
    const usernameExists = await checkUsernameExists(formData.username);
    if (usernameExists) {
      setErrors(["Username already exists."]);
      return;
    }

    // If no errors, submit the form (simulate API call)
    console.log("Form submitted:", formData);
    setErrors([]);
  };

  // Simulate a server-side check for username existence
  const checkUsernameExists = async (username: string): Promise<boolean> => {
    // Replace this with an actual API call
    const existingUsernames = ["user1", "user2", "user3"];
    return existingUsernames.includes(username);
  };

  return (
    <div className={styles.registerContainer}>
      {/* Image on the left */}Register
      <div className={styles.imageContainer}>
        <img src="/src/assets/Login.jpeg" alt="Login" className={styles.image} />
      </div>

      {/* Form on the right */}
      <div className={styles.formContainer}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div className={styles.formGroup}>
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Username */}
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className={styles.errorContainer}>
              {errors.map((error, index) => (
                <p key={index} className={styles.error}>
                  {error}
                </p>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className={styles.submitButton}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;