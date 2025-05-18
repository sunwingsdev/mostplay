import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { baseURL } from '../../utils/baseURL';
import { useSelector } from 'react-redux';

// Animations
const slideIn = keyframes`
  from {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
  to {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
`;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  backdrop-filter: blur(2px);
  background-color: rgba(42, 58, 124, 0.6);
  z-index: 1000;
`;

const PopupContainer = styled.div`
  background-color: #e6e9f0;
  border-radius: 0.75rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  animation: ${(props) => (props.isClosing ? slideOut : slideIn)} 0.3s ease-out forwards;
  z-index: 1001;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  background-color: #2a3a7c;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
  position: relative;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
`;

const FormContainer = styled.form`
  padding: 1.5rem;
  background-color: white;
  border-radius: 0 0 0.75rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: #2f4f6f;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 0.875rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #f5b800;
  }
`;

const TogglePassword = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 60%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #2f4f6f;
  font-size: 1rem;
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const SuccessMessage = styled.p`
  color: #22c55e;
  font-size: 0.875rem;
  text-align: center;
`;

const SubmitButton = styled.button`
  background-color: #f5b800;
  color: black;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover {
    background-color: #d9a300;
  }
`;

const PasswordChange = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const popupRef = useRef();

  const { token } = useSelector((state) => state.auth); // Get JWT token from Redux

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess('');
      onClose();
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Client-side validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${baseURL}/change-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Failed to change password.');
        setIsLoading(false);
        return;
      }

      setSuccess('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(handleClose, 2000); // Close popup after 2 seconds
    } catch (error) {
      console.error('Password Change Error:', error);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Overlay />
      <PopupContainer ref={popupRef} isClosing={isClosing}>
        <Header>
          Change Password
          <CloseButton onClick={handleClose}>
            <FaTimes />
          </CloseButton>
        </Header>
        <FormContainer onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Old Password</Label>
            <Input
              type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter old password"
            />
            <TogglePassword
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </TogglePassword>
          </InputGroup>
          <InputGroup>
            <Label>New Password</Label>
            <Input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <TogglePassword
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </TogglePassword>
          </InputGroup>
          <InputGroup>
            <Label>Confirm New Password</Label>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
            <TogglePassword
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </TogglePassword>
          </InputGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Changing...' : 'Change Password'}
          </SubmitButton>
        </FormContainer>
      </PopupContainer>
    </>
  );
};

export default PasswordChange;