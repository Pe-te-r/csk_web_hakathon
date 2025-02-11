import { useState, useEffect } from "react";
import styles from "../styles/ChangePasswordModal.module.scss";
import toast from "react-hot-toast";
import { useGetRandomCodeQuery } from "../api/code";
import { useUser } from "./context/UserProvider";
import { useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import ReactLoading from 'react-loading'

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState(["", "", "", "", ""]);
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
    const[requestSent,setRequestSent]=useState(false)
    
    const { id: paramId } = useParams<{ id: string }>();
    const { getUser } = useUser()
    const id = paramId || getUser()?.userId;
    const {data,isLoading,isSuccess,error,isError}= useGetRandomCodeQuery(id ? id : skipToken, { skip: !requestSent })

  const staticCode = "ABCDE"; // Static verification code

  useEffect(() => {
      if (newPassword && confirmPassword && newPassword === confirmPassword) {
          if (!requestSent) {
              toast.success('password math')
              setRequestSent(true)
        }
    }
  }, [newPassword, confirmPassword]);

  // Handle input change for verification code
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...verificationCode];
    newCode[index] = value.toUpperCase();
    setVerificationCode(newCode);

    // Auto-submit when all characters are entered
    if (newCode.join("").length === 5) {
      if (newCode.join("") === staticCode) {
        setIsCodeVerified(true);
        toast.success("Verification successful!");
        setIsSubmitEnabled(true);
      } else {
        toast.error("Invalid verification code.");
        setIsCodeVerified(false);
        setIsSubmitEnabled(false);
      }
    }
  };

  // Handle paste event for verification code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").toUpperCase().slice(0, 5);
    if (pasteData.length === 5) {
      setVerificationCode(pasteData.split(""));
      if (pasteData === staticCode) {
        setIsCodeVerified(true);
        setIsSubmitEnabled(true);
        toast.success("Verification successful!");
      } else {
        setIsCodeVerified(false);
        setIsSubmitEnabled(false);
        toast.error("Invalid verification code.");
      }
    }
  };
    const handleClose = () => {
        onClose()
        setNewPassword('')
        setConfirmPassword('')
        setIsCodeVerified(false)
        setVerificationCode(['','','','',''])

  }
  // Handle password submission
  const handleSubmit = () => {
    console.log("New Password:", newPassword);
    toast.success("Password changed successfully!");
    onClose(); // Close modal
  };
    useEffect(() => {
        if (isSuccess) {
            console.log(data)
        }
        if (isError) {
            console.log(error)
        }
    },[isSuccess,isError])

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <h2>Change Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={styles.inputField}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.inputField}
        />
        {newPassword && confirmPassword && newPassword === confirmPassword && (
          <div className={styles.verificationContainer}>
                      {isLoading ?
            <>
                          <p>Verification code being sent to your email</p>
                          <ReactLoading type="bars" color="#3498db" height={50} width={50} /> 
            </>
                          :
                          <>
            <p>Enter the verification code sent to your email:</p>
                      <div className={styles.codeInputContainer}>
                          {verificationCode.map((char, index) => (
                  <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={char}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onPaste={handlePaste}
                  className={styles.codeInput}
                  />
                ))}
            </div>
            </>
                }
            {isCodeVerified && <span className={styles.tickMark}>✔</span>}
          </div>
        )}
        <div className={styles.buttonContainer}>
          <button className={styles.backButton} onClick={handleClose}>
            Back
          </button>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={!isSubmitEnabled}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
