import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLoginMutation } from "../api/auth";
import styles from "../styles/LoginForm.module.scss";
import Loading from "../components/Loading";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../components/context/UserProvider";

const LoginForm: React.FC = () => {
  const {saveUser} =useUser()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate()
  const location = useLocation();
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

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isSuccess) {
        console.log(data)
        saveUser(data.token,data.id,data.role)
      toast.success("Login successful");
      navigate(from, { replace: true });
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
        <img src='https://i.pinimg.com/236x/5f/86/14/5f8614ae67f8d5dd6981ff3da41323da.jpg' alt="Login" className={styles.image} />
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
