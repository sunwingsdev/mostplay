import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaSync, FaEdit, FaChevronDown, FaUser, FaCreditCard, FaMoneyBillWave, FaGift, FaClock, FaFile, FaExclamation } from 'react-icons/fa';
import styled from 'styled-components';
import { baseURL, baseURL_For_IMG_UPLOAD } from '../utils/baseURL';

// Styled Components
const DashboardContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%);
  min-height: 100vh;
  display: flex;
  gap: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
`;

const Sidebar = styled.div`
  flex: 0 0 24rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  @media (max-width: 768px) {
    flex: none;
    width: 100%;
    padding: 1.5rem;
    ${props => !props.isOpen && 'display: none;'}
  }
`;

const SidebarToggle = styled.button`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: #ffffff;
    border-radius: 0.5rem;
    border: none;
    width: 100%;
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
`;

const MainContent = styled.div`
  flex: 1;
  background: #ffffff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  margin-bottom: 2rem;
  background: linear-gradient(90deg, #93c5fd 0%, #bfdbfe 100%);
  border-radius: 0.75rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #1e293b;
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
    gap: 0.5rem;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: ${({ bgColor }) => bgColor || '#3b82f6'};
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  &:hover {
    background: ${({ hoverBgColor }) => hoverBgColor || '#2563eb'};
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
  }
  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0.75rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const DetailCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid #93c5fd;
  }
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
`;

const DetailValue = styled.div`
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.6;
  & > p {
    margin-bottom: 0.5rem;
  }
  img {
    max-width: 160px;
    border-radius: 0.5rem;
    margin-top: 0.75rem;
    border: 1px solid #e5e7eb;
    @media (max-width: 768px) {
      max-width: 120px;
    }
  }
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
  ${({ status }) => {
    switch (status) {
      case 'completed':
        return `background: #22c55e; color: #ffffff;`;
      case 'pending':
        return `background: #f59e0b; color: #ffffff;`;
      case 'failed':
        return `background: #ef4444; color: #ffffff;`;
      case 'cancelled':
        return `background: #6b7280; color: #ffffff;`;
      default:
        return `background: #3b82f6; color: #ffffff;`;
    }
  }}
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const ErrorAlert = styled.div`
  padding: 1.5rem;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 0.75rem;
  text-align: center;
  margin: 2rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  font-weight: 600;
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  @media (max-width: 768px) {
    align-items: flex-end;
  }
`;

const ModalContent = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.4s ease;
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (max-width: 768px) {
    padding: 1.5rem;
    max-width: 100%;
    border-radius: 1rem 1rem 0 0;
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
  text-align: center;
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: #f8fafc;
  transition: all 0.3s ease;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
  }
`;


const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s;
  resize: vertical;
  min-height: 100px;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  @media (max-width: 640px) {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
`;



const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  @media (max-width: 640px) {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: none;
  background: ${props => props.bgColor || '#3b82f6'};
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s, transform 0.1s;
  position: relative;
  &:hover {
    background: ${props => props.hoverBgColor || '#2563eb'};
    transform: translateY(-1px);
  }
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
  }
  @media (max-width: 640px) {
    padding: 0.5rem;
    font-size: 0.75rem;
  }
`;

const Message = styled.div`
  padding: 0.75rem;
  border-radius: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
  ${({ error }) => error
    ? `background: #fef2f2; color: #dc2626;`
    : `background: #f0fdf4; color: #16a34a;`}
`;

export default function TransactionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ amount: '', status: 'pending' });
  const [success, setSuccess] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);

  const fetchTransaction = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${baseURL}/deposit-transaction/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.data.success || !response.data.data) {
        throw new Error('No transaction data received from server');
      }
      setTransaction(response.data.data);
      setFormData({
        amount: response.data.data.amount || '',
        status: response.data.data.status || 'pending',
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        `Failed to fetch transaction details (ID: ${id}). Please check the transaction ID or try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const openEditModal = () => {
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await axios.put(`${baseURL}/deposit-transaction/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Transaction updated successfully');
      await fetchTransaction();
      setTimeout(() => {
        setShowModal(false);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update transaction');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !transaction) {
    return (
      <LoadingContainer>
        <div className="border-4 border-t-blue-500 border-gray-200 rounded-full w-12 h-12 animate-spin"></div>
      </LoadingContainer>
    );
  }

  if (error || !transaction) {
    return (
      <DashboardContainer>
        <Sidebar isOpen={showSidebar}>
          <ButtonContainer>
            <ActionButton
              onClick={() => navigate('/deposit-transaction')}
              bgColor="#3b82f6"
              hoverBgColor="#2563eb"
            >
              <FaArrowLeft /> Back
            </ActionButton>
            <ActionButton
              onClick={fetchTransaction}
              disabled={loading}
              bgColor="#6b7280"
              hoverBgColor="#4b5563"
            >
              <FaSync /> Retry
            </ActionButton>
          </ButtonContainer>
        </Sidebar>
        <MainContent>
          <Header>
            <Title><FaUser /> Transaction Details</Title>
            <ButtonContainer>
              <ActionButton
                onClick={() => navigate('/deposit-transaction')}
                bgColor="#3b82f6"
                hoverBgColor="#2563eb"
              >
                <FaArrowLeft /> Back
              </ActionButton>
              <ActionButton
                onClick={fetchTransaction}
                disabled={loading}
                bgColor="#6b7280"
                hoverBgColor="#4b5563"
              >
                <FaSync /> Retry
              </ActionButton>
            </ButtonContainer>
          </Header>
          <ErrorAlert>{error || 'No transaction data available.'}</ErrorAlert>
        </MainContent>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Sidebar isOpen={showSidebar}>
        <Section>
          <SectionTitle><FaUser /> User Information</SectionTitle>
          <DetailGrid>
            <DetailCard>
              <DetailLabel><FaUser /> Name</DetailLabel>
              <DetailValue>{transaction.userId?.name || 'Unknown'}</DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel><FaUser /> Phone Number</DetailLabel>
              <DetailValue>{transaction.userId?.phoneNumber || 'No Phone Number'}</DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel><FaUser /> Email</DetailLabel>
              <DetailValue>{transaction.userId?.email || 'No Email'}</DetailValue>
            </DetailCard>
          </DetailGrid>
        </Section>
      </Sidebar>

      <MainContent>
        <Header>
          <Title><FaUser /> Transaction Details</Title>
          <ButtonContainer>
            <ActionButton
              onClick={() => navigate('/deposit-transaction')}
              bgColor="#3b82f6"
              hoverBgColor="#2563eb"
            >
              <FaArrowLeft /> Back
            </ActionButton>
            <ActionButton
              onClick={fetchTransaction}
              disabled={loading}
              bgColor="#6b7280"
              hoverBgColor="#4b5563"
            >
              <FaSync /> Refresh
            </ActionButton>
            <ActionButton
              onClick={openEditModal}
              bgColor="#f59e0b"
              hoverBgColor="#d97706"
disabled={transaction.status === 'completed'}

            >
              <FaEdit /> Edit
            </ActionButton>
            <SidebarToggle onClick={() => setShowSidebar(!showSidebar)}>
              <FaUser /> User Info <FaChevronDown />
            </SidebarToggle>
          </ButtonContainer>
        </Header>

        <Section>
          <SectionTitle><FaCreditCard /> Transaction Information</SectionTitle>
          <DetailGrid>
          <DetailCard>
              <DetailLabel><FaClock /> Status</DetailLabel>
              <DetailValue>
                <StatusBadge status={transaction.status}>{transaction.status}</StatusBadge>
              </DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel><FaCreditCard /> Payment Method</DetailLabel>
              <DetailValue>
                {transaction.paymentMethod ? (
                  <>
                    <p><strong>Name:</strong> {transaction.paymentMethod.methodName || 'Not Specified'}</p>
                    <p><strong>Agent Wallet:</strong> {transaction.paymentMethod.agentWalletNumber || 'Not Specified'}</p>
                    <p><strong>Wallet Text:</strong> {transaction.paymentMethod.agentWalletText || 'Not Specified'}</p>
                    <p><strong>Gateway:</strong> {transaction.paymentMethod.gateway || 'Not Specified'}</p>
                    {transaction.paymentMethod.methodImage && (
                      <img
                        src={`${baseURL_For_IMG_UPLOAD}s/${transaction.paymentMethod.methodImage}`}
                        alt="Payment Method"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    )}
                  </>
                ) : (
                  'No Payment Method Information'
                )}
              </DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel><FaCreditCard /> Channel</DetailLabel>
              <DetailValue>{transaction.channel || 'Not Specified'}</DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel><FaMoneyBillWave /> Amount</DetailLabel>
              <DetailValue>{typeof transaction.amount === 'number' ? `৳${transaction.amount}` : 'Not Specified'}</DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel><FaGift /> Promotion</DetailLabel>
              <DetailValue>{transaction.promotionId?.title || 'No Promotion'}</DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel><FaGift /> Promotion Bonus</DetailLabel>
              <DetailValue>
                {transaction.promotionBonus ? (
                  <>
                    <p><strong>Type:</strong> {transaction.promotionBonus.bonus_type || 'Not Specified'}</p>
                    <p><strong>Amount:</strong> {transaction.promotionBonus.bonus || 'Not Specified'}</p>
                  </>
                ) : (
                  'No Bonus Information'
                )}
              </DetailValue>
            </DetailCard>
          </DetailGrid>
        </Section>

        <Section>
          <SectionTitle><FaMoneyBillWave /> Total Amount</SectionTitle>
          <DetailGrid>
            <DetailCard>
              <DetailLabel><FaMoneyBillWave /> Total</DetailLabel>
              <DetailValue>
                {transaction.promotionBonus ? (
                  `৳${transaction.amount + transaction.promotionBonus.bonus}`
                ) : (
                  `৳${transaction.amount}`
                )}
              </DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel><FaExclamation /> Reason</DetailLabel>
              <DetailValue>{transaction.reason || 'No Reason Specified'}</DetailValue>
            </DetailCard>
          </DetailGrid>
        </Section>


        <Section>
          <SectionTitle><FaFile /> User Inputs</SectionTitle>
          <DetailGrid>
            {transaction.userInputs && Array.isArray(transaction.userInputs) && transaction.userInputs.length > 0 ? (
              transaction.userInputs.map((input, index) => (
                <DetailCard key={index}>
                  <DetailLabel><FaFile /> {input.label || 'Input'}</DetailLabel>
                  <DetailValue>
                    {input.type === 'file' ? (
                      <img
                        src={`${baseURL_For_IMG_UPLOAD}s/${input.value}`}
                        alt={input.label || 'User Input File'}
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    ) : (
                      <p>{input.value || 'Not Specified'} ({input.type || 'Unknown Type'})</p>
                    )}
                  </DetailValue>
                </DetailCard>
              ))
            ) : (
              <DetailCard>
                <DetailLabel><FaFile /> User Inputs</DetailLabel>
                <DetailValue>No User Inputs</DetailValue>
              </DetailCard>
            )}
          </DetailGrid>
        </Section>

        <Section>
          <SectionTitle><FaClock /> Metadata</SectionTitle>
          <DetailGrid>
         
            <DetailCard>
              <DetailLabel><FaClock /> Created At</DetailLabel>
              <DetailValue>
                {transaction.createdAt && !isNaN(new Date(transaction.createdAt))
                  ? new Date(transaction.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                  : 'Not Available'}
              </DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel><FaClock /> Updated At</DetailLabel>
              <DetailValue>
                {transaction.updatedAt && !isNaN(new Date(transaction.updatedAt))
                  ? new Date(transaction.updatedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                  : 'Not Available'}
              </DetailValue>
            </DetailCard>
          </DetailGrid>
        </Section>
      </MainContent>

      {showModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>Edit Transaction</ModalTitle>
            {error && <Message error>{error}</Message>}
            {success && <Message>{success}</Message>}
            <Form onSubmit={handleSubmit}>
              <Label>Amount</Label>
              <Input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                min="200"
                max="30000"
                disabled={loading || formData.status === 'completed'}
              />
              <Label>Status</Label>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
             //   disabled={loading || formData.status === 'completed'}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </Select>
              <Label>Reason {['failed', 'cancelled'].includes(formData.status) && '*'}</Label>
              <Textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Enter reason for failed or cancelled status"
                disabled={loading }
                required={['failed', 'cancelled'].includes(formData.status)}
              />
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <Button type="submit" disabled={loading }>
                  Update
                </Button>
                <Button
                  bgColor="#6b7280"
                  hoverBgColor="#4b5563"
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </DashboardContainer>
  );
}