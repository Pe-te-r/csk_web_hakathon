import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRegisterMutation } from "../api/auth";
import styles from "../styles/RegisterForm.module.scss";
import Loading from "../components/Loading";
import { Link, useNavigate } from "react-router-dom";


const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    password: "",
    username: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const navigate=useNavigate()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  //   sending data to api
    const [sendData,{isLoading,isSuccess,error,isError}] = useRegisterMutation()
    

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
      
      sendData(formData)
    setErrors([]);
  };

    
    useEffect(() => {
        if (isSuccess) {
            toast.success("Registration was success");
            navigate('/login')
          
        }
        if (isError) {
            if (error) {
                if ("status" in error) {
                    const errorMessage:string= error?.data as string
                    setErrors([errorMessage])
                }
            }
        }
    },[isError,isSuccess])

  return (
    <div className={styles.registerContainer}>
      <div className={styles.imageContainer}>
        <img src="https://i.pinimg.com/236x/57/c4/04/57c404cf7f5caa95dbd89379872095ff.jpg" alt="Login" className={styles.image} />
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
                  {
                      isLoading ?
                      <Loading/>
                          :
                          <>
          <button type="submit" className={styles.submitButton}>
                Register
                          </button>
                    <small>Already have an account?? <Link to='/login'>Login</Link></small>
                           </>
            }
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;