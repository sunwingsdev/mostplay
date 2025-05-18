import React, { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components';
import { FaCreditCard, FaMoneyBillWave, FaBullhorn, FaTicketAlt, FaClipboardList, FaChartBar, FaExchangeAlt, FaUserCircle, FaGem, FaKey, FaInbox, FaUserFriends, FaSignOutAlt, FaExclamation, FaInfoCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import walletImage from '../../assets/promotionOptionImg.png'

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
  z-index: 500;
`;

const PopupContainer = styled.div`
  background-color: #e6e9f0;
  border-radius: 0.75rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 370px;
  max-width: 90vw;
  max-height: 80vh; /* Smaller height */
  overflow-y: auto; /* Enable vertical scrolling */
  animation: ${(props) => (props.isClosing ? slideOut : slideIn)} 0.3s ease-out forwards;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 2px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const Header = styled.div`
  background-color: #2a3a7c;
  color: white;
  display: flex;
  justify-content: center; /* Center the content horizontally */
  align-items: center;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
  position: relative; /* Allow absolute positioning for the close button */
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem; /* Increase the font size for a larger close button */
  cursor: pointer;
  position: absolute; /* Position the button absolutely */
  right: 1rem; /* Align to the right side of the header */
  top: 50%; /* Vertically center the button */
  transform: translateY(-50%); /* Adjust for vertical centering */
`;

const TabButtons = styled.div`
  display: flex;
  padding: 0.5rem;
  background-color: #2254BA;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => (props.active ? 'black' : 'white')};
  background-color: ${(props) => (props.active ? '#f5b800' : '#2254BA')};
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin: 0px 10px;
`;

const PromotionBox = styled.div`
  background-color: white;
  margin: 1rem;
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
`;

const PromotionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4a4a4a;
`;

const YellowBar = styled.div`
  width: 6px;
  height: 24px;
  background-color: #f5b800;
  border-radius: 0.375rem;
`;

const Select = styled.select`
  font-size: 0.875rem;
  color: #4a4a4a;
  max-width: 180px;
  appearance: none;
  padding: 0.25rem 2rem 0.25rem 0.5rem;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3csvg%20width%3d'10'%20height%3d'6'%20viewBox%3d'0%200%2010%206'%20xmlns%3d'http%3a//www.w3.org/2000/svg'%3e%3cpath%20d%3d'M0%200l5%206%205-6z'%20fill%3d'%23666'%20/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 10px 6px;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
`;

const InfoBox = styled.div`
  margin: 1rem;
  padding: 1rem;
  font-size: 0.75rem;
  color: #4a6ea9;
  background-color: white;
  border-radius: 5px;
  display: flex;
  text-align: center;
  align-items: center;
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Highlight = styled.span`
  display: inline-block;
  background-color: #cce4ff;
  color: #4a6ea9;
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
`;

const PaymentGrid = styled.div`
  margin: 1rem;
  position: relative;
`;

const PaymentMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  padding: 1rem;
  background-color: white;
  filter: blur(4px);
  pointer-events: none;
  border-radius: 0.5rem;
`;

const PaymentItem = styled.div`
  background-color: ${(props) => props.bg || '#f3f7fb'};
  border-radius: 0.5rem;
  padding: 0.75rem 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const PaymentText = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => props.color || '#4a4a4a'};
`;

const PaymentOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgb(174 174 174 / 70%);
  border-radius: 5px;
`;

const ExclamationCircle = styled.div`
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 9999px;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
`;

export default function HeaderPromotionProfileMenu({isOpen,onClose}) {
     const [isClosing, setIsClosing] = useState(false);
      const popupRef = useRef();
      const [optionSelect, setOptionSelect] = useState('deposit'); // Default to 'deposit'
    
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
          onClose();
        }, 300);
      };
    
      const handleTabChange = (tab) => {
        setOptionSelect(tab);
      };
    
      if (!isOpen) return null;
    
  return (
<>
      <Overlay />
      <PopupContainer ref={popupRef} isClosing={isClosing}>
        <Header>
          <h5>My Promotion</h5>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </Header>
        <TabButtons>
          <TabButton
            active={optionSelect === 'deposit'}
            onClick={() => handleTabChange('deposit')}
          >
            Running
          </TabButton>
          <TabButton
            active={optionSelect === 'withdrawal'}
            onClick={() => handleTabChange('withdrawal')}
          >
            Completed
          </TabButton>
        </TabButtons>
   
             <InfoBox style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
           
             <img src={walletImage} alt="this"  style={{width:"60%",}} />


              </InfoBox>
    
      </PopupContainer>
    </>
  )
}
