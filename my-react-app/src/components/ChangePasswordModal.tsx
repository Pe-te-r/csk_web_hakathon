import { useState, useEffect } from "react";
import styles from "../styles/ChangePasswordModal.module.scss";
import toast from "react-hot-toast";
import { useGetRandomCodeQuery, useVerifyCodeMutation } from "../api/code";
import { useUser } from "./context/UserProvider";
import { useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import ReactLoading from "react-loading";

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
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [isRequestingNewCode, setIsRequestingNewCode] = useState(false);

  const { id: paramId } = useParams<{ id: string }>();
  const { getUser } = useUser();
  const id = paramId || getUser()?.userId;

  const {
    data,
    isSuccess,
    error,
    isError,
    isLoading,
    refetch,
  } = useGetRandomCodeQuery(id ? id : skipToken, { skip: !requestSent, refetchOnFocus: true, refetchOnReconnect: true });

  const [
    verifyCode,
    { data: codeData, isSuccess: codeIsSuccess, error: codeError, isError: codeIsError, isLoading: codeIsLoading },
  ] = useVerifyCodeMutation();

  // Reset everything when the modal is closed or "Back" is clicked
  const resetState = () => {
    setNewPassword("");
    setConfirmPassword("");
    setVerificationCode(["", "", "", "", "", ""]);
    setIsCodeVerified(false);
    setIsSubmitEnabled(false);
    setRequestSent(false);
    setIsRequestingNewCode(false);
  };

  // Handle password and confirm password match
  useEffect(() => {
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      if (!requestSent) {
        toast.success("Passwords match");
        setRequestSent(true);
      }
    }
  }, [newPassword, confirmPassword]);

  // Handle verification code input change
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    const submittedCode = newCode.join("");

    if (submittedCode.length === 6) {
      verifyCode({ id: getUser()?.userId, code: submittedCode });
    }
  };

  // Handle paste event for verification code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").slice(0, 6);
    if (pasteData.length === 6) {
      setVerificationCode(pasteData.split(""));
      verifyCode({ id: getUser()?.userId, code: pasteData });
    }
  };

  // Handle password submission
  const handleSubmit = () => {
    console.log("Password being submitted:", newPassword);
    toast.success("Password changed successfully!");
    onClose();
    resetState();
  };

  // Handle "Back" button click
  const handleClose = () => {
    onClose();
    resetState();
  };

  // Handle verification code success or error
  useEffect(() => {
    if (codeIsSuccess) {
      setIsSubmitEnabled(true);
      setIsCodeVerified(true);
      toast.success("Verification code is correct!");
    }
    if (codeIsError) {
      toast.error("Invalid verification code. Please try again.");
    }
  }, [codeIsSuccess, codeIsError]);

  // Handle random code request success or error
  useEffect(() => {
    if (isSuccess) {
      toast.success("Verification code sent to your email.");
    }
    if (isError) {
      if ("data" in error) toast.error(error?.data as string);
    }
  }, [isSuccess, isError]);

  // Handle requesting a new code
  const handleRequestNewCode = () => {
    setIsRequestingNewCode(true);
    refetch().finally(() => setIsRequestingNewCode(false));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <h2>Change Password</h2>

        {/* Password Form */}
        <form className={styles.form}>
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
        </form>

        {/* Verification Code Form */}
        {newPassword && confirmPassword && newPassword === confirmPassword && (
          <form className={styles.form}>
            <p>Enter the 6-digit verification code sent to your email:</p>
            <div className={styles.codeInputContainer}>
              {isLoading || isRequestingNewCode ? (
                <ReactLoading type="bars" color="#3498db" height={50} width={50} />
              ) : (
                verificationCode.map((char, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={char}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onPaste={handlePaste}
                    className={styles.codeInput}
                  />
                ))
              )}
            </div>
            {isCodeVerified && <span className={styles.tickMark}>✔</span>}
            {codeIsLoading && <ReactLoading type="bars" color="#3498db" height={30} width={30} />}
            <button
              type="button"
              onClick={handleRequestNewCode}
              className={styles.requestNewCodeButton}
              disabled={isRequestingNewCode}
            >
              {isRequestingNewCode ? "Sending..." : "Request New Code"}
            </button>
          </form>
        )}

        {/* Buttons */}
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