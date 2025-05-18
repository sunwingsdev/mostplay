import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaInfoCircle, FaChevronRight, FaUserCircle, FaBirthdayCake, FaPhone, FaEnvelope, FaArrowLeft, FaExclamationCircle } from 'react-icons/fa';
import lever_1 from '../../assets/lever_1.png';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateBirthday } from '../../features/auth/authThunks';
import EmailVerificationPage from './EmailVerificationPage';
import PhoneVerificationPage from './PhoneVerificationPage';
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
  min-width: 300px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  animation: ${(props) => (props.isClosing ? slideOut : slideIn)} 0.3s ease-out forwards;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

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

  @media (max-width: 600px) {
    min-width: 90%;
    max-width: 95%;
    border-radius: 0.5rem;
  }
`;

const Header = styled.div`
  background-color: #2a3a7c;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
  position: relative;

  @media (max-width: 600px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
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

  @media (max-width: 600px) {
    font-size: 1.2rem;
    right: 0.75rem;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);

  @media (max-width: 600px) {
    font-size: 0.9rem;
    left: 0.75rem;
  }
`;

const PromotionBox = styled.div`
  background-color: white;
  margin: 1rem;
  padding: 1.5rem 1rem;
  border-radius: 5px;

  @media (max-width: 600px) {
    margin: 0.5rem;
    padding: 1rem 0.75rem;
  }
`;

const InfoBox = styled.div`
  margin: 1rem;
  padding: 1rem;
  font-size: 0.75rem;
  color: #4a6ea9;
  background-color: white;
  border-radius: 5px;

  @media (max-width: 600px) {
    margin: 0.5rem;
    padding: 0.75rem;
    font-size: 0.7rem;
  }
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 600px) {
    margin-bottom: 0.75rem;
  }
`;

const Highlight = styled.span`
  display: inline-block;
  background-color: #cce4ff;
  color: #4a6ea9;
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  cursor: pointer;

  @media (max-width: 600px) {
    padding: 0.2rem 0.6rem;
    font-size: 0.7rem;
  }
`;

const FormContainer = styled.div`
  width: 350px;
  max-width: 90%;
  margin: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  

  @media (max-width: 600px) {
    width: 90%;
    margin: 0.5rem;
    padding: 0.75rem;
    gap: 0.75rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin: 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 0.9rem;
  background-color: #f9f9f9;

  &:focus {
    outline: none;
    border-color: #2a3a7c;
    box-shadow: 0 0 5px rgba(42, 58, 124, 0.2);
  }

  @media (max-width: 600px) {
    padding: 0.4rem;
    font-size: 0.8rem;
  }
`;

const Button = styled.button`
  background-color:#F4B600;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;

  &:hover {
    background-color:rgb(190, 145, 8);
  }

  @media (max-width: 600px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;

  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
`;

const PrivacyNotice = styled.p`
  font-size: 0.7rem;
  color: #666;
  margin-top: 0.5rem;
  line-height: 1.4;

  @media (max-width: 600px) {
    font-size: 0.65rem;
  }
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CountryCode = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  font-size: 0.9rem;
  width: 100px;

  &:focus {
    outline: none;
    border-color: #2a3a7c;
    box-shadow: 0 0 5px rgba(42, 58, 124, 0.2);
  }

  @media (max-width: 600px) {
    padding: 0.4rem;
    font-size: 0.8rem;
    width: 80px;
  }
`;





// Email Verification Page Component


// Date of Birth Page Component
const DateOfBirthPage = ({ onBack }) => {
  const { user, loading, error, success } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [dob, setDob] = useState(user.birthday);

  const handleSave = async () => {
    try {
      await dispatch(updateBirthday({ userId: user._id, birthday: dob }));
      console.log('Saving date of birth:', dob);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (success) {
      onBack();
    }
  }, [success, onBack]);

  return (
    <FormContainer>
     
      <div>
        <Label>Date of Birth</Label>
        <Input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
      </div>
      <Button onClick={handleSave} disabled={loading}>Save</Button>
      <div className="d-flex justify-content-center" style={{color:"black"}}>
        {loading && <div className="text-center">Loading...</div>}
        {error && (
          <div className="d-flex align-items-center text-danger" style={{ color: 'red' }}>
            <FaExclamationCircle className="me-2" />
            {error}
          </div>
        )}
        {success && <div className="text-success">Updated successfully</div>}
      </div>
    
    </FormContainer>
  );
};

// Main PersonalInformation Component
export default function PersonalInformation({ isOpen, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const popupRef = useRef();
  const [optionSelect, setOptionSelect] = useState('deposit');
  const [page, setPage] = useState('main');
  const { user } = useSelector((state) => state.auth);



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

  const handlePhoneClick = () => {
    setPage('phone');
  };

  const handleEmailClick = () => {
    setPage('email');
  };

  const handleDobClick = () => {
    setPage('dob');
  };

  const handleBack = () => {
    setPage('main');
  };

  if (!isOpen) return null;

  return (
    <>
      <Overlay />
      <PopupContainer ref={popupRef} isClosing={isClosing}>
        <Header>
          {page === 'main' ? (
            <>
              <h5>Personal Information</h5>
              <CloseButton onClick={handleClose}>×</CloseButton>
            </>
          ) : (
            <>
              <BackButton onClick={handleBack}>
                <FaArrowLeft />
              </BackButton>
              <h5>
                {page === 'phone' ? 'Verify Phone Number' : page === 'email' ? 'Verify Email' : 'Add Date of Birth'}
              </h5>
              <CloseButton onClick={handleClose}>×</CloseButton>
            </>
          )}
        </Header>

        {page === 'phone' ? (
          <PhoneVerificationPage onBack={handleBack} />
        ) : page === 'email' ? (
          <EmailVerificationPage onBack={handleBack} />
        ) : page === 'dob' ? (
          <DateOfBirthPage onBack={handleBack} />
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '10px' }}>
              <img src={lever_1} alt="Wallet" style={{ width: '15%', maxWidth: '60px' }} />
              <span style={{ textAlign: 'center', fontSize: '1rem', color: 'black' }}>{user?.name}</span>
              <span style={{ textAlign: 'center', fontSize: '0.7rem', color: 'darkgray' }}>Date Registered: 2025/03/28</span>
            </div>

            <PromotionBox>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.85rem' }}>
                <span style={{ color: 'black' }}>VIP Points (VP)</span>
                <span style={{ color: '#F4B600' }}>0</span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '5px', color: '#F4B600', fontSize: '0.7rem' }}>My VIP</span>
                  <FaChevronRight style={{ color: '#F4B600', fontSize: '0.7rem' }} />
                </div>
              </div>
            </PromotionBox>


            {
              !user.phoneNumberVerified &&   <InfoBox>
              <InfoHeader>
                <FaInfoCircle style={{ fontSize: '0.9rem' }} />
                <p style={{ marginBottom: '0', marginLeft: '5px' }}>
                  Below info are required to proceed {optionSelect} request.
                </p>
              </InfoHeader>
              <p style={{ fontWeight: 600, marginBottom: '0.25rem', color: '#B1D5AC' }}>Personal Info</p>
              <Highlight
                style={{ backgroundColor: '#F0F7EF', color: 'rgb(71 157 60)', cursor: 'pointer' }}
                onClick={handlePhoneClick}
              >
                Phone Number
              </Highlight>
            </InfoBox>
            }

          

            <InfoBox>
              <div className="my-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <FaUserCircle style={{ fontSize: '0.9rem', marginRight: '15px', color: '#f5b800' }} />
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ marginBottom: '0', fontWeight: 600, color: 'gray', fontSize: '0.85rem' }}>Full Name</p>
                    <input
                      type="text"
                      value={user.name}
                      style={{ marginBottom: '0', fontWeight: 600, color: 'gray', border: 'none', background: 'transparent', fontSize: '0.85rem' }}
                      readOnly
                    />
                  </div>
                </div>
              </div>


         


              {
              user.birthday ? 
                    <div className="my-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <FaBirthdayCake style={{ fontSize: '0.9rem', marginRight: '15px', color: '#f5b800' }} />
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ marginBottom: '0', fontWeight: 600, color: 'gray', fontSize: '0.85rem' }}>Birthday</p>
                    <input
                      type="text"
                      value={user.birthday}
                      style={{ marginBottom: '0', fontWeight: 600, color: 'gray', border: 'none', background: 'transparent', fontSize: '0.85rem' }}
                      readOnly
                    />
                  </div>
                </div>
              </div> :    <div className="my-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaBirthdayCake style={{ fontSize: '0.9rem', marginRight: '15px', color: '#f5b800' }} />
                  <p style={{ marginBottom: '0', fontWeight: 600, color: 'gray', fontSize: '0.85rem' }}>Birthday</p>
                </div>

              
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                      style={{ backgroundColor: '#f5b800', borderRadius: '5px', padding: '4px 30px', border: 'none', color: 'white', fontSize: '0.8rem' }}
                      onClick={handleDobClick}
                    >
                      Add
                    </button>
                  </div>
             

         
              </div>
              }


           

              <div className="my-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <FaPhone style={{ fontSize: '0.9rem', marginRight: '15px', color: '#f5b800' }} />
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ marginBottom: '0', fontWeight: 600, color: 'gray', fontSize: '0.85rem' }}>Phone Number</p>
                    <input
                      type="text"
                      value={user.phoneNumber}
                      style={{ marginBottom: '0', fontWeight: 600, color: 'gray', border: 'none', background: 'transparent', fontSize: '0.85rem' }}
                      readOnly
                    />
                  </div>
                </div>

                {
                  user.phoneNumberVerified ?
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button
                        style={{ borderRadius: '5px', padding: '4px 15px', border: 'none', color: 'green', fontSize: '0.8rem' }}
                      //  onClick={handleEmailClick}
                      >
                        Verified
                      </button>
                    </div> :
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button
                        style={{ backgroundColor: '#FF8989', borderRadius: '5px', padding: '4px 15px', border: 'none', color: 'white', fontSize: '0.8rem' }}
                        onClick={handlePhoneClick}
                      >
                        Not Verified
                      </button>
                    </div>
                }

            
              </div>

              <div className="my-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <FaEnvelope style={{ fontSize: '0.9rem', marginRight: '15px', color: '#f5b800' }} />
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ marginBottom: '0', fontWeight: 600, color: 'gray', fontSize: '0.85rem' }}>Email</p>
                    <input
                      type="text"
                      value={user.email}
                      style={{ marginBottom: '0', fontWeight: 600, color: 'gray', border: 'none', background: 'transparent', fontSize: '0.85rem' }}
                      readOnly
                    />
                  </div>
                </div>

                {
                  user.emailVerified ?
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button
                        style={{ borderRadius: '5px', padding: '4px 15px', border: 'none', color: 'green', fontSize: '0.8rem' }}
                      //  onClick={handleEmailClick}
                      >
                        Verified
                      </button>
                    </div> :
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button
                        style={{ backgroundColor: '#FF8989', borderRadius: '5px', padding: '4px 15px', border: 'none', color: 'white', fontSize: '0.8rem' }}
                        onClick={handleEmailClick}
                      >
                        Not Verified
                      </button>
                    </div>
                }

              
              </div>
            </InfoBox>
          </>
        )}
      </PopupContainer>
    </>
  );
}