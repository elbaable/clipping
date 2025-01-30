"use client";

import { useEffect, useState } from "react";

const VerifyEmail = () => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      setMessage("Please check your email to verify your account.");
      return;
    }

    // Make API request to verify token
    verifyEmail(token);
  }, []);

  const verifyEmail = async (token: string) => {
    const response = await fetch(`/api/verify-email?token=${token}`);
    const data = await response.json();

    if (data.error) {
      setMessage(data.error);
    } else {
      setMessage("Your email has been verified successfully! Login now!");
    }
  };

  return (
    <div>
      <h1>Email Verification</h1>
      {message ? (
        <p>{message}</p>
      ) : (
        <p>Verifying your email...</p>
      )}
    </div>
  );
};

export default VerifyEmail;
