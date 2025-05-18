import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { baseURL } from '../../utils/baseURL';
import { updateUser } from '../../features/auth/authSlice';

// Styled Components
const FormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #f9fafb;
  color: #333;
  cursor: not-allowed;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const OtpContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
`;

const OtpInput = styled.input`
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 20px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #ffffff;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 8px;
  font-size: 14px;
  font-weight: 600;
  color: rgb(255, 255, 255);
  background: #f4b600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 20px;

  &:hover {
    background: rgb(130, 98, 0);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ResendText = styled.p`
  text-align: center;
  font-size: 14px;
  color: #4b5563;
  margin: 16px 0;
`;

const ResendLink = styled.span`
  color: #3b82f6;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const PrivacyNotice = styled.p`
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  margin-top: 16px;
`;

const Message = styled.p`
  text-align: center;
  font-size: 14px;
  margin: 10px 0;
  color: ${(props) => (props.isError ? '#dc2626' : '#16a34a')};
`;

const EmailVerificationPage = ({ onBack }) => {
  const { user } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showOtpPage, setShowOtpPage] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const inputRefs = useRef([]);

  const dispatch = useDispatch();
 
  // Handle sending the verification code
  const handleSendCode = async () => {
    try {
        // Adjust to your backend URL

      const response = await fetch(`${baseURL}/send-email-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: user._id, email: user.email }),
      });

      const data = await response.json();

      if (data.success) {
        setShowOtpPage(true);
        setMessage(data.message);
        setIsError(false);
      } else {
        setMessage(data.message);
        setIsError(true);
      }
    } catch (error) {
      setMessage('Failed to send verification code. Please try again.');
      setIsError(true);
      console.error('Error sending verification code:', error);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if value is entered
      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle key down events (e.g., backspace)
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    if (/^\d{4}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[3].focus();
    }
  };

  // Handle verification
  const handleVerify = async () => {
    const verificationCode = otp.join('');
    try {
      const response = await fetch(`${baseURL}/check-email-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: user._id, email: user.email, otp: verificationCode }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setIsError(false);

        dispatch(updateUser(data.data));

        // Optionally redirect or update UI after successful verification
        onBack()
      } else {
        setMessage(data.message);
        setIsError(true);
      }
    } catch (error) {
      setMessage('Failed to verify OTP. Please try again.');
      setIsError(true);
      console.error('Error verifying OTP:', error);
    }
  };

  // Handle resending the code
  const handleResendCode = async () => {
    try {
      const response = await fetch(`${baseURL}/send-email-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: user._id, email: user.email }),
      });

      const data = await response.json();

      if (data.success) {
        setOtp(['', '', '', '']);
        inputRefs.current[0].focus();
        setMessage('OTP resent successfully');
        setIsError(false);
      } else {
        setMessage(data.message);
        setIsError(true);
      }
    } catch (error) {
      setMessage('Failed to resend OTP. Please try again.');
      setIsError(true);
      console.error('Error resending OTP:', error);
    }
  };

  // Auto-focus first OTP input when OTP page is shown
  useEffect(() => {
    if (showOtpPage) {
      inputRefs.current[0].focus();
    }
  }, [showOtpPage]);

  return (
    <FormContainer>
      <div>
        <Label>Email Address</Label>
        <Input type="email" value={user.email} readOnly />
      </div>
      {showOtpPage ? (
        <>
          <OtpContainer onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <OtpInput
                key={index}
                type="number"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
                maxLength={1}
                autoComplete="one-time-code"
              />
            ))}
          </OtpContainer>
          <ResendText>
            Didn't receive the code?{' '}
            <ResendLink onClick={handleResendCode}>Resend OTP</ResendLink>
          </ResendText>
          {message && <Message isError={isError}>{message}</Message>}
          <Button onClick={handleVerify} disabled={otp.some((digit) => !digit)}>
            Submit
          </Button>
        </>
      ) : (
        <>
          {message && <Message isError={isError}>{message}</Message>}
          <Button onClick={handleSendCode}>Send Verification Code</Button>
        </>
      )}
      <PrivacyNotice>
        For your privacy, the email address cannot be modified. If you need help, please contact Customer Service.
      </PrivacyNotice>
    </FormContainer>
  );
};

export default EmailVerificationPage;