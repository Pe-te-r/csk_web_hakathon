import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/TwoFAModal.module.scss";
import ReactLoading from "react-loading";
import toast from "react-hot-toast";
import { useGetRandomCodeQuery, useVerifyCodeMutation } from "../api/code";
import { QRCodeCanvas } from "qrcode.react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useUser } from "./context/UserProvider";
import { useParams } from "react-router-dom";

interface TwoFAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TwoFAModal: React.FC<TwoFAModalProps> = ({ isOpen, onClose }) => {
  const [totpCode, setTotpCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [canRequestNewCode, setCanRequestNewCode] = useState(true);

  // Static QR code data
  const staticQrCodeData = "ZRG6NJES4XTURPANCFUIEGGEMSUD3AVT";
  const qrCodeUrl = `otpauth://totp/PhantomMarket?secret=${staticQrCodeData}&issuer=PhantomMarket`;

  const { getUser } = useUser();
  const { id: paramId } = useParams<{ id: string }>();
  const userIdRef = useRef(paramId || getUser()?.userId || ""); // Use a ref for userId

  // Use the codeApi hooks
  const { data, error, isError, isSuccess } = useGetRandomCodeQuery(
    userIdRef.current ? userIdRef.current : skipToken,
    { skip: !isOpen }
  );
  const [verifyCode, { isLoading: verifyIsLoading, isSuccess: verifyIsSuccess, isError: verifyIsError, data: verifyData, error: verifyError }] =
    useVerifyCodeMutation();

  // Generate TOTP code when modal opens
  useEffect(() => {
    if (isOpen && canRequestNewCode) {
      setIsLoading(true);
      setIsLoading(false);
      setCanRequestNewCode(false);
    }
  }, [isOpen, canRequestNewCode]);

  // Handle TOTP code input change
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...totpCode];
    newCode[index] = value;
    setTotpCode(newCode);

    const submittedCode = newCode.join("");
    if (submittedCode.length === 6) {
      verifyCode({ id: userIdRef.current, code: submittedCode }); // Use userIdRef.current
    }
  };

  // Handle paste event for verification code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").slice(0, 6);
    if (pasteData.length === 6) {
      const newCode = pasteData.split("");
      setTotpCode(newCode);
      verifyCode({ id: userIdRef.current, code: pasteData }); // Use userIdRef.current
    }
  };

  // Handle copying QR code URL
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(qrCodeUrl);
    toast.success("QR code URL copied to clipboard!");
  };

  // Handle enabling 2FA
  const handleEnable2FA = () => {
    if (otpInput.length === 6) {
      verifyCode({ id: userIdRef.current, code: otpInput }).unwrap().then(() => {
        setIs2FAEnabled(true);
        toast.success("2FA enabled successfully!");
        onClose();
      }).catch(() => {
        toast.error("Invalid OTP. Please try again.");
      });
    } else {
      toast.error("Please enter a valid 6-digit OTP.");
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTotpCode(["", "", "", "", "", ""]);
      setIsCodeVerified(false);
      setIs2FAEnabled(false);
      setCanRequestNewCode(true);
    }
  }, [isOpen]);

  // Handle API responses
  useEffect(() => {
    if (isSuccess) {
      toast.success(data);
    }
    if (isError) {
      if ("data" in error) toast.error(error?.data as string);
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (verifyIsSuccess) {
      setIsCodeVerified(true)
      toast.success(verifyData);
    }
    if (verifyIsError) {
      if ("data" in verifyError) toast.error(verifyError?.data as string);
    }
  }, [verifyIsError, verifyIsSuccess]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <h2>Enable Two-Factor Authentication (2FA)</h2>

        {/* Step 1: Display TOTP Code */}
        {!isCodeVerified && (
          <div className={styles.step}>
            <p>Enter the verification code sent to your email:</p>
            {isLoading ? (
              <ReactLoading type="bars" color="#3498db" height={50} width={50} />
            ) : (
              <div className={styles.codeInputContainer}>
                {verifyIsLoading ? (
                  <ReactLoading type="bars" color="#3498db" height={50} width={50} />
                ) : (
                  totpCode.map((char, index) => (
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
            )}
          </div>
        )}

        {/* Step 2: Display QR Code */}
        {isCodeVerified && (
          <div className={styles.step}>
            <p>Scan the QR code below with your authenticator app:</p>
            <div className={styles.qrCodeContainer}>
              <QRCodeCanvas value={qrCodeUrl} size={150} /> {/* Generate QR code dynamically */}
            </div>
            <button onClick={handleCopyUrl} className={styles.copyButton}>
              Copy QR Code URL
            </button>
          </div>
        )}

        {/* Step 3: Enable 2FA */}
        {isCodeVerified && !is2FAEnabled && (
          <div className={styles.step}>
            <p>Enter the OTP from your authenticator app to enable 2FA:</p>
            <input
              type="text"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              className={styles.otpInput}
              placeholder="Enter OTP"
              maxLength={6}
            />
            <button onClick={handleEnable2FA} className={styles.enableButton}>
              Enable 2FA
            </button>
          </div>
        )}

        {/* Close Button */}
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TwoFAModal;