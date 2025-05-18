import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaInfoCircle, FaExclamation, FaMoneyBillWave, FaCopy, FaQuestionCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { fetchPromotions } from '../../features/promotion/promotionThunkAndSlice';
import { getDepositPaymentMethods } from '../../features/depositPaymentMethod/depositPaymentMethodThunkAndSlice';
import { getWithdrawPaymentMethods, saveWithdrawRequest, resetWithdrawRequestState } from '../../features/withdrawPaymentMethod/withdrawPaymentMethodThunkAndSlice';
import defaultPaymentIcon from '../../assets/bank_icon.png';
import useLangPath from '../../hooks/useLangPath';
import { baseURL_For_IMG_UPLOAD } from '../../utils/baseURL';

// Animations
const slideIn = keyframes`
  from { transform: translate(-50%, 100%); opacity: 0; }
  to { transform: translate(-50%, -50%); opacity: 1; }
`;

const slideOut = keyframes`
  from { transform: translate(-50%, -50%); opacity: 1; }
  to { transform: translate(-50%, 100%); opacity: 0; }
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
  max-width: 70vw;
  max-height: 80vh;
  overflow-y: auto;
  animation: ${({ isClosing }) => (isClosing ? slideOut : slideIn)} 0.3s ease-out forwards;
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

const TabButtons = styled.div`
  display: flex;
  padding: 0.5rem;
  background-color: #2254ba;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ active }) => (active ? 'black' : '#4a4a4a')};
  background-color: ${({ active }) => (active ? '#f5b800' : 'white')};
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin: 0 10px;
`;

const WithdrawAmount = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #4b6cb6;
  padding: 10px;
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
  border-radius: 0.5rem;
`;

const PaymentItem = styled.div`
  background-color: ${({ selected }) => (selected ? '#fef9c3' : '#f9fafb')};
  border-radius: 0.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  border: ${({ selected }) => (selected ? '1px solid #facc15' : '1px solid #e5e7eb')};
  position: relative;

  &:after {
    content: ${({ bonusContent }) => (bonusContent ? `'${bonusContent}'` : 'none')};
    position: absolute;
    top: -10px;
    right: -10px;
    background-color: #ef4444;
    color: #ffffff;
    font-size: 9px;
    font-weight: 600;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    display: ${({ bonusContent }) => (bonusContent ? 'block' : 'none')};
  }
`;

const PaymentText = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ color }) => color || '#4a4a4a'};
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

const DepositChannelGrid = styled.div`
  margin: 1rem;
`;

const DepositChannelMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns || 3}, 1fr);
  gap: 0.75rem;
`;

const ChannelItem = styled.div`
  background-color: ${({ selected }) => (selected ? '#FEF9C3' : '#f3f7fb')};
  border-radius: 0.5rem;
  padding: 0.75rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4a4a4a;
  cursor: pointer;
  border: ${({ selected }) => (selected ? '2px solid #f5b800' : 'none')};
`;

const DepositAmountGrid = styled.div`
  margin-top: 1rem;
`;

const DepositAmountMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
`;

const AmountItem = styled.div`
  background-color: ${({ selected }) => (selected ? '#FEF9C3' : '#f3f7fb')};
  border-radius: 0.5rem;
  padding: 0.75rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4a4a4a;
  cursor: pointer;
  border: ${({ selected }) => (selected ? '2px solid #f5b800' : 'none')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`;

const CustomAmountBox = styled.div`
  margin-top: 1rem;
  flex-direction: column;
  gap: 0.5rem;
`;

const CustomAmountInput = styled.input`
  font-size: 0.875rem;
  color: #4a4a4a;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #f5b800;
    outline: none;
  }
`;

const InputLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: #4a4a4a;
  display: flex;
  align-items: center;
`;

const SubmitButton = styled.button`
  background-color: ${({ disabled }) => (disabled ? '#d1d5db' : '#f5b800')};
  color: ${({ disabled }) => (disabled ? '#6b7280' : 'black')};
  border-radius: 5px;
  padding: 10px;
  text-align: center;
  margin: 1rem;
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  width: calc(100% - 2rem);
  font-size: 0.875rem;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? '#d1d5db' : '#e5a700')};
  }
`;

const ReminderBox = styled.div`
  margin: 1rem;
  padding: 1rem;
  font-size: 0.75rem;
  color: #4a6ea9;
  background-color: white;
  border-radius: 5px;
  min-width: 90%;
  max-width: 26vw;

  div {
    color: #4a6ea9;
    font-size: 0.75rem;
    line-height: 1.5;
  }
  p {
    margin: 0 0 0.5rem 0;
  }
  strong {
    font-weight: 700;
  }
  ul {
    list-style-type: disc;
    padding-left: 1.5rem;
  }
`;

const ReminderHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-weight: 600;
  min-width: 270px;
  max-width: 25vw;
`;

const LoadingMessage = styled.div`
  margin: 1rem;
  padding: 1rem;
  font-size: 0.75rem;
  color: #4a4a4a;
  background-color: #f3f7fb;
  border-radius: 5px;
  text-align: center;
  min-width: 270px;
  max-width: 25vw;
`;

const ErrorMessage = styled.div`
  margin: 1rem;
  padding: 1rem;
  font-size: 0.75rem;
  color: #dc2626;
  background-color: #fef2f2;
  border-radius: 5px;
  text-align: center;
`;

const AmountInfo = styled.div`
  font-size: 0.75rem;
  color: #4a6ea9;
  margin-top: 0.5rem;
`;

const UserInputsGrid = styled.div`
  margin: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  border-radius: 0.5rem;
  border: ${({ error }) => (error ? '1px solid #dc2626' : '1px solid #d1d5db')};
  background: #ffffff;
  padding: 0.5rem 2.75rem 0.5rem 0.75rem;
  font-size: 0.9rem;
  color: #374151;
  &:focus {
    outline: none;
    border-color: #f5b800;
  }
`;

const FileInput = styled.input`
  width: 100%;
  border-radius: 0.5rem;
  border: ${({ error }) => (error ? '1px solid #dc2626' : '1px solid #d1d5db')};
  background: #ffffff;
  padding: 0.5rem;
  font-size: 0.9rem;
  color: #374151;
  &:focus {
    outline: none;
    border-color: #f5b800;
  }
`;

const CopyButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #f5b800;
  font-size: 1.1rem;
  border: none;
  background: none;
  cursor: pointer;
  &:hover {
    color: #e5a700;
  }
`;

const QuestionIcon = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #f5b800;
  cursor: pointer;
  font-size: 1.1rem;
  background: none;
  border: none;
  &:hover {
    color: #e5a700;
  }
`;

const ErrorText = styled.p`
  font-size: 0.7rem;
  color: #dc2626;
  margin-top: 0.2rem;
`;

const Deposit = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [optionSelect, setOptionSelect] = useState('deposit');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPromotion, setSelectedPromotion] = useState('');
  const [userInputs, setUserInputs] = useState({});
  const [inputErrors, setInputErrors] = useState({});
  const [amountError, setAmountError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const popupRef = useRef();
  const { user } = useSelector((state) => state.auth);
  const { promotions, isLoading: promotionLoading, isError, errorMessage } = useSelector((state) => state.promotionSlice);
  const { depositPaymentMethods, isLoading: depositPaymentLoading, error: depositPaymentError } = useSelector((state) => state.depositPaymentGateway);
  const { withdrawPaymentMethods, isLoading: withdrawPaymentLoading, error: withdrawPaymentError, withdrawRequestLoading, withdrawRequestSuccess, withdrawRequestError } = useSelector((state) => state.withdrawPaymentGateway);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const langPath = useLangPath();

  // Filter active payment methods
  const activeDepositMethods = depositPaymentMethods.filter((method) => method.status === 'active');
  const activeWithdrawMethods = withdrawPaymentMethods.filter((method) => method.status === 'active');

  // Memoize selected method
  const selectedMethod = useMemo(() => {
    return optionSelect === 'deposit'
      ? activeDepositMethods.find((m) => m._id.toString() === selectedPayment)
      : activeWithdrawMethods.find((m) => m._id.toString() === selectedPayment);
  }, [optionSelect, activeDepositMethods, activeWithdrawMethods, selectedPayment]);

  // Fetch data on open
  useEffect(() => {
    if (isOpen) {
      dispatch(getDepositPaymentMethods());
      dispatch(getWithdrawPaymentMethods());
      dispatch(fetchPromotions());
    }
  }, [dispatch, isOpen]);

  // Auto-select first payment method
  useEffect(() => {
    if (isOpen && !selectedPayment) {
      if (optionSelect === 'deposit' && activeDepositMethods.length > 0) {
        setSelectedPayment(activeDepositMethods[0]._id.toString());
      } else if (optionSelect === 'withdrawal' && activeWithdrawMethods.length > 0) {
        setSelectedPayment(activeWithdrawMethods[0]._id.toString());
      }
    }
  }, [isOpen, optionSelect, activeDepositMethods, activeWithdrawMethods, selectedPayment]);

  // Auto-select first promotion
  useEffect(() => {
    if (promotions.length > 0 && !selectedPromotion && optionSelect === 'deposit') {
      setSelectedPromotion(promotions[0].title);
    }
  }, [promotions, selectedPromotion, optionSelect]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        handleClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle withdrawal request status
  useEffect(() => {
    if (withdrawRequestSuccess) {
      alert('Withdrawal request saved successfully!');
      dispatch(resetWithdrawRequestState());
      handleClose();
    }
    if (withdrawRequestError) {
      alert(`Error: ${withdrawRequestError}`);
      dispatch(resetWithdrawRequestState());
    }
  }, [withdrawRequestSuccess, withdrawRequestError, dispatch]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setSelectedPayment(null);
      setSelectedChannel(null);
      setSelectedAmount(null);
      setCustomAmount('');
      setSelectedPromotion(promotions.length > 0 && optionSelect === 'deposit' ? promotions[0].title : '');
      setUserInputs({});
      setInputErrors({});
      setAmountError('');
      setUploadError('');
      dispatch(resetWithdrawRequestState());
      onClose();
    }, 300);
  };

  const handleTabChange = (tab) => {
    setOptionSelect(tab);
    setSelectedPayment(
      tab === 'deposit' && activeDepositMethods.length > 0
        ? activeDepositMethods[0]._id.toString()
        : tab === 'withdrawal' && activeWithdrawMethods.length > 0
        ? activeWithdrawMethods[0]._id.toString()
        : null
    );
    setSelectedChannel(null);
    setSelectedAmount(null);
    setCustomAmount('');
    setSelectedPromotion(tab === 'deposit' && promotions.length > 0 ? promotions[0].title : '');
    setUserInputs({});
    setInputErrors({});
    setAmountError('');
    setUploadError('');
  };

  const handlePaymentSelect = (paymentId) => {
    if (user.phoneNumberVerified) {
      setSelectedPayment(paymentId);
      setSelectedChannel(null);
      setSelectedAmount(null);
      setCustomAmount('');
      setUserInputs({});
      setInputErrors({});
      setAmountError('');
      setUploadError('');
    }
  };

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    setSelectedAmount(null);
    setCustomAmount('');
    setUserInputs({});
    setInputErrors({});
    setAmountError('');
    setUploadError('');
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setAmountError('');
  };

  const handleCustomAmountInput = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) || value === '') {
      setCustomAmount(value);
      setSelectedAmount(value ? parseInt(value, 10) : null);
      if (optionSelect === 'withdrawal' && value && parseInt(value, 10) > user.balance) {
        setAmountError('Amount cannot exceed your withdrawable balance');
      } else {
        setAmountError('');
      }
    }
  };

  const handlePromotionChange = (e) => {
    setSelectedPromotion(e.target.value);
  };

  const handleImageUpload = async (file) => {
    const uploadData = new FormData();
    uploadData.append('image', file);
    try {
      const res = await fetch(baseURL_For_IMG_UPLOAD, {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (!res.ok || !data.imageUrl) throw new Error('Image upload failed');
      return data.imageUrl;
    } catch (error) {
      throw error;
    }
  };

  const handleUserInputChange = async (name, value) => {
    if (value instanceof File) {
      try {
        setUploadError('');
        const imageUrl = await handleImageUpload(value);
        setUserInputs((prev) => ({ ...prev, [name]: imageUrl }));
      } catch (error) {
        setUploadError('Failed to upload image. Please try again.');
        return;
      }
    } else {
      setUserInputs((prev) => ({ ...prev, [name]: value }));
    }
    if (inputErrors[name]) {
      setInputErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleShowInstruction = (input) => {
    const instruction = input.fieldInstruction || 'No instruction provided';
    const instructionBD = input.fieldInstructionBD || 'কোন নির্দেশনা প্রদান করা হয়নি';
    alert(`${instruction}\n${instructionBD}`);
  };

  const getBonusContent = (methodId) => {
    if (optionSelect !== 'deposit' || !selectedPromotion || !methodId) return null;
    const promotion = promotions.find((promo) => promo.title === selectedPromotion);
    if (!promotion) return null;
    const bonus = promotion.promotion_bonuses.find(
      (bonus) => bonus.payment_method._id.toString() === methodId.toString()
    );
    if (!bonus || !bonus.bonus_type || !bonus.bonus) return null;
    return bonus.bonus_type === 'Fix' ? `+৳${bonus.bonus}` : `+${bonus.bonus}%`;
  };

  const isSubmitEnabled = () => {
    if (!selectedPayment || !user.phoneNumberVerified || !selectedMethod) return false;

    if (optionSelect === 'withdrawal') {
      const amount = selectedAmount || parseInt(customAmount, 10);
      if (!amount || amount > user.balance) return false;
      if (selectedMethod.userInputs && selectedMethod.userInputs.length > 0) {
        for (const input of selectedMethod.userInputs) {
          if (input.isRequired === 'true' && !userInputs[input.name]) return false;
        }
      }
    }

    return selectedMethod.gateway.length === 0
      ? selectedAmount || customAmount
      : !!selectedChannel && (selectedAmount || customAmount);
  };

  const handleSubmit = async () => {
    if (!isSubmitEnabled()) return;

    if (optionSelect === 'withdrawal') {
      const newErrors = {};
      if (selectedMethod.userInputs) {
        selectedMethod.userInputs.forEach((input) => {
          if (input.isRequired === 'true' && !userInputs[input.name]) {
            newErrors[input.name] = `${input.label} is required`;
          }
        });
        setInputErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
      }

      const formattedUserInputs = selectedMethod.userInputs
        ? selectedMethod.userInputs
            .filter((input) => userInputs[input.name])
            .map((input) => ({
              name: input.name,
              value: userInputs[input.name].toString(),
              label: input.label,
              labelBD: input.labelBD,
              type: input.type,
            }))
        : [];

      const withdrawData = {
        userId: user._id,
        paymentMethodId: selectedPayment,
        channel: selectedChannel || '',
        amount: selectedAmount ? selectedAmount : parseInt(customAmount, 10),
        userInputs: formattedUserInputs,
      };
      dispatch(saveWithdrawRequest(withdrawData));
    } else {
      const paymentDetails = {
        userInfo: user,
        channel: selectedChannel,
        paymentMethod: selectedMethod,
        amount: selectedAmount ? selectedAmount : parseInt(customAmount, 10),
        promotion: promotions.find((promo) => promo.title === selectedPromotion),
      };
      navigate(langPath('/payment-getaway'), { state: paymentDetails });
    }
  };

  const amountOptions = [200, 1000, 2000, 5000, 10000, 15000, 20000, 30000];

  if (!isOpen) return null;

  return (
    <>
      <Overlay />
      <PopupContainer ref={popupRef} isClosing={isClosing}>
        <Header>
          <h5>My Wallet</h5>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </Header>
        <TabButtons>
          <TabButton active={optionSelect === 'deposit'} onClick={() => handleTabChange('deposit')}>
            Deposit
          </TabButton>
          <TabButton active={optionSelect === 'withdrawal'} onClick={() => handleTabChange('withdrawal')}>
            Withdrawal
          </TabButton>
        </TabButtons>
        {optionSelect === 'withdrawal' && (
          <WithdrawAmount>
            <span>Withdrawable Amount</span>
            <span style={{ textAlign: 'right' }}>{user.balance.toLocaleString()}</span>
          </WithdrawAmount>
        )}
        {optionSelect === 'deposit' && (
          <>
            {promotionLoading ? (
              <LoadingMessage>Loading promotions...</LoadingMessage>
            ) : isError ? (
              <ErrorMessage>Failed to load promotions: {errorMessage}</ErrorMessage>
            ) : (
              <PromotionBox>
                <PromotionLabel>
                  <YellowBar />
                  <label htmlFor="promotion">Promotion</label>
                </PromotionLabel>
                <Select id="promotion" value={selectedPromotion} onChange={handlePromotionChange}>
                  {(promotions || []).map((promo) => (
                    <option key={promo._id} value={promo.title}>
                      {promo.title}
                    </option>
                  ))}
                </Select>
              </PromotionBox>
            )}
          </>
        )}
        {!user.phoneNumberVerified && (
          <InfoBox>
            <InfoHeader>
              <FaInfoCircle />
              <p style={{ marginBottom: '0', marginLeft: '5px' }}>
                Below info are required to proceed {optionSelect} request.
              </p>
            </InfoHeader>
            <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Contact Info</p>
            <Highlight>Phone Number</Highlight>
          </InfoBox>
        )}
        {withdrawRequestLoading && <LoadingMessage>Saving withdrawal request...</LoadingMessage>}
        {uploadError && <ErrorMessage>{uploadError}</ErrorMessage>}
        <PaymentGrid>
          {(optionSelect === 'deposit' ? depositPaymentLoading : withdrawPaymentLoading) ? (
            <LoadingMessage>Loading payment methods...</LoadingMessage>
          ) : (optionSelect === 'deposit' ? depositPaymentError : withdrawPaymentError) ? (
            <ErrorMessage>Failed to load payment methods: {optionSelect === 'deposit' ? depositPaymentError : withdrawPaymentError}</ErrorMessage>
          ) : (optionSelect === 'deposit' ? activeDepositMethods : activeWithdrawMethods).length === 0 ? (
            <ErrorMessage>No active payment methods available.</ErrorMessage>
          ) : user.phoneNumberVerified ? (
            <div style={{ marginBottom: '20px', padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
              <PromotionLabel style={{ marginBottom: '10px' }}>
                <YellowBar />
                <label htmlFor="payment-method">Payment Method</label>
              </PromotionLabel>
              <PaymentMethods>
                {(optionSelect === 'deposit' ? activeDepositMethods : activeWithdrawMethods).map((method) => (
                  <PaymentItem
                    key={method._id}
                    selected={selectedPayment === method._id.toString()}
                    onClick={() => handlePaymentSelect(method._id.toString())}
                    bonusContent={getBonusContent(method._id)}
                  >
                    <img
                      src={`${baseURL_For_IMG_UPLOAD}s/${method.methodImage}` || `${baseURL_For_IMG_UPLOAD}s/${defaultPaymentIcon}`}
                      alt={method.methodName}
                      height="40"
                      onError={(e) => (e.target.src = defaultPaymentIcon)}
                    />
                    <PaymentText color={method.color}>{method.methodName}</PaymentText>
                  </PaymentItem>
                ))}
              </PaymentMethods>
              {selectedPayment && (
                <span
                  style={{
                    padding: '10px 50px',
                    backgroundColor: '#FEF9C3',
                    border: '1px solid #f5b800',
                    borderRadius: '5px',
                    fontSize: '0.75rem',
                    color: 'black',
                  }}
                >
                  {selectedMethod?.methodName || 'Unknown'}
                </span>
              )}
            </div>
          ) : (
            <>
              <PaymentMethods style={{ filter: 'blur(4px)', pointerEvents: 'none' }}>
                {(optionSelect === 'deposit' ? activeDepositMethods : activeWithdrawMethods).map((method) => (
                  <PaymentItem key={method._id} bonusContent={getBonusContent(method._id)}>
                    <img
                      src={`${baseURL_For_IMG_UPLOAD}s/${method.methodImage}` || `${baseURL_For_IMG_UPLOAD}s/${defaultPaymentIcon}`}
                      alt={method.methodName}
                      height="40"
                      onError={(e) => (e.target.src = defaultPaymentIcon)}
                    />
                    <PaymentText color={method.color}>{method.methodName}</PaymentText>
                  </PaymentItem>
                ))}
              </PaymentMethods>
              <PaymentOverlay>
                <ExclamationCircle style={{ color: 'gray' }}>
                  <FaExclamation />
                </ExclamationCircle>
                <p>Please complete the verification.</p>
              </PaymentOverlay>
            </>
          )}
        </PaymentGrid>
        {user.phoneNumberVerified && (
          <div>
            {selectedPayment && !(optionSelect === 'deposit' ? depositPaymentLoading : withdrawPaymentLoading) && !(optionSelect === 'deposit' ? depositPaymentError : withdrawPaymentError) && (optionSelect === 'deposit' ? activeDepositMethods : activeWithdrawMethods).length > 0 && selectedMethod?.gateway?.length > 0 && (
              <DepositChannelGrid>
                <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
                  <PromotionLabel style={{ marginBottom: '10px' }}>
                    <YellowBar />
                    <label htmlFor="deposit-channel">{optionSelect === 'deposit' ? 'Deposit' : 'Withdraw'} Channel</label>
                  </PromotionLabel>
                  <DepositChannelMethods columns={selectedMethod.gateway.length}>
                    {selectedMethod.gateway.map((channel) => (
                      <ChannelItem
                        key={channel}
                        selected={selectedChannel === channel}
                        onClick={() => handleChannelSelect(channel)}
                      >
                        {channel}
                      </ChannelItem>
                    ))}
                  </DepositChannelMethods>
                </div>
              </DepositChannelGrid>
            )}
            {(selectedChannel || (selectedPayment && selectedMethod?.gateway.length === 0)) && !(optionSelect === 'deposit' ? depositPaymentLoading : withdrawPaymentLoading) && !(optionSelect === 'deposit' ? depositPaymentError : withdrawPaymentError) && (optionSelect === 'deposit' ? activeDepositMethods : activeWithdrawMethods).length > 0 && (
              <div style={{ margin: '1rem', padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
                <PromotionLabel style={{ marginBottom: '10px' }}>
                  <YellowBar />
                  <label htmlFor="deposit-amount">{optionSelect === 'deposit' ? 'Deposit' : 'Withdraw'} Amount</label>
                </PromotionLabel>
                <DepositAmountGrid>
                  <DepositAmountMethods>
                    {amountOptions.map((amount) => (
                      <AmountItem
                        key={amount}
                        selected={selectedAmount === amount}
                        onClick={() => handleAmountSelect(amount)}
                        disabled={optionSelect === 'withdrawal' && amount > user.balance}
                      >
                        {amount.toLocaleString()}
                      </AmountItem>
                    ))}
                  </DepositAmountMethods>
                  <CustomAmountBox>
                    <InputLabel>
                      <FaMoneyBillWave style={{ marginRight: '5px' }} />
                      Custom Amount
                    </InputLabel>
                    <CustomAmountInput
                      type="number"
                      value={selectedAmount || customAmount}
                      onChange={handleCustomAmountInput}
                      placeholder="Enter custom amount"
                      step="any"
                      style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}
                    />
                    <AmountInfo>
                      Minimum {optionSelect === 'deposit' ? 'deposit' : 'withdrawal'}: 200 | Maximum {optionSelect === 'deposit' ? 'deposit' : 'withdrawal'}: 30,000
                    </AmountInfo>
                    {amountError && <ErrorText>{amountError}</ErrorText>}
                  </CustomAmountBox>
                </DepositAmountGrid>
              </div>
            )}
            {optionSelect === 'withdrawal' && selectedPayment && selectedMethod?.userInputs?.length > 0 && (
              <UserInputsGrid>
                <PromotionLabel style={{ marginBottom: '10px' }}>
                  <YellowBar />
                  <label>User Information</label>
                </PromotionLabel>
                {selectedMethod.userInputs.map((input) => (
                  <div key={input.name}>
                    <InputLabel htmlFor={input.name}>
                      {input.label} <span>({input.labelBD})</span>
                      {input.isRequired === 'true' && <span style={{ color: '#dc2626' }}>*</span>}
                    </InputLabel>
                    <InputWrapper>
                      {input.type === 'file' ? (
                        <FileInput
                          id={input.name}
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={(e) => handleUserInputChange(input.name, e.target.files[0])}
                          error={!!inputErrors[input.name]}
                        />
                      ) : (
                        <Input
                          id={input.name}
                          type={input.type}
                          placeholder={input.fieldInstruction || input.fieldInstructionBD}
                          value={userInputs[input.name] || ''}
                          onChange={(e) => handleUserInputChange(input.name, e.target.value)}
                          error={!!inputErrors[input.name]}
                        />
                      )}
                      {input.type === 'number' && (
                        <CopyButton
                          type="button"
                          aria-label={`Copy ${input.label}`}
                          onClick={() => handleCopy(userInputs[input.name] || '')}
                        >
                          <FaCopy />
                        </CopyButton>
                      )}
                      {input.type !== 'file' && (
                        <QuestionIcon
                          type="button"
                          aria-label={`Show instructions for ${input.label}`}
                          onClick={() => handleShowInstruction(input)}
                        >
                          <FaQuestionCircle />
                        </QuestionIcon>
                      )}
                    </InputWrapper>
                    {inputErrors[input.name] && <ErrorText>{inputErrors[input.name]}</ErrorText>}
                  </div>
                ))}
              </UserInputsGrid>
            )}
            {(optionSelect === 'deposit' ? activeDepositMethods : activeWithdrawMethods).length > 0 && selectedPayment && (
              <ReminderBox>
                <ReminderHeader>
                  <FaInfoCircle />
                  <span style={{ marginLeft: '5px' }}>Gentle Reminder</span>
                </ReminderHeader>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      selectedMethod?.instruction || '<p>No instructions available.</p>',
                      { ALLOWED_TAGS: ['p', 'strong', 'ul', 'li', 'br', 'span', 'div'], ALLOWED_ATTR: ['style'] }
                    ),
                  }}
                />
              </ReminderBox>
            )}
            <SubmitButton disabled={!isSubmitEnabled() || withdrawRequestLoading} onClick={handleSubmit}>
              {withdrawRequestLoading ? 'Processing...' : optionSelect === 'deposit' ? 'Deposit' : 'Withdraw'}
            </SubmitButton>
          </div>
        )}
      </PopupContainer>
    </>
  );
};

export default Deposit;