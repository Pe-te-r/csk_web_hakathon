import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLoginMutation } from "../api/auth";
import styles from "../styles/LoginForm.module.scss";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Sending data to API
  const [sendLogin, { isLoading,data, isSuccess, error, isError }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    const newErrors: string[] = [];
    if (!formData.email) newErrors.push("Email is required.");
    if (!formData.password) newErrors.push("Password is required.");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    sendLogin(formData);
    setErrors([]);
  };

  useEffect(() => {
    if (isSuccess) {
        console.log(data)
      toast.success("Login successful");
    }
    if (isError && error) {
      if ("status" in error) {
        console.log(error);
        const errorMessage: string = error?.data as string;
        setErrors([errorMessage]);
      }
    }
  }, [isError, isSuccess]);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.imageContainer}>
        <img src="/src/assets/register.jpeg" alt="Login" className={styles.image} />
      </div>

      {/* Form on the right */}
      <div className={styles.formContainer}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
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
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <button type="submit" className={styles.submitButton}>
                Login
              </button>
              <small>
                Don't have an account? <Link to="/register">Register</Link>
              </small>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
