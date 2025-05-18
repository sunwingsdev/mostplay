import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FaEdit, FaTrash, FaSearch, FaEye, FaSync, FaFilter, FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../utils/baseURL';

// Styled Components
const Container = styled.div`
  padding: 1.5rem;
  background: #f8fafc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: 640px) {
    padding: 1rem;
    gap: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e293b;
  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`;

const ControlWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  @media (max-width: 640px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const SearchFilterWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.75rem;
  margin-bottom: 1rem;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const FilterToggle = styled.button`
  display: none;
  @media (max-width: 640px) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 0.875rem;
    color: #1e293b;
    cursor: pointer;
  }
`;

const Input = styled.input`
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

const Tooltip = styled.span`
  visibility: hidden;
  position: absolute;
  top: -2rem;
  background: #1e293b;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: 10;
  ${Button}:hover & {
    visibility: visible;
  }
  @media (max-width: 640px) {
    display: none;
  }
`;

const TableWrapper = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  @media (max-width: 640px) {
    background: transparent;
    box-shadow: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  @media (max-width: 640px) {
    display: none;
  }
`;

const Th = styled.th`
  padding: 0.75rem 1rem;
  background: #f1f5f9;
  color: #1e293b;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  &:first-child {
    border-top-left-radius: 0.5rem;
  }
  &:last-child {
    border-top-right-radius: 0.5rem;
  }
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #374151;
`;

const MobileCard = styled.div`
  display: none;
  @media (max-width: 640px) {
    display: block;
    background: white;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

const MobileCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const MobileCardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
`;

const MobileCardContent = styled.div`
  display: grid;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #374151;
`;

const MobileCardRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  background: ${props => {
    switch (props.status) {
      case 'completed': return '#22c55e';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      case 'cancelled': return '#6b7280';
      default: return '#3b82f6';
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  @media (max-width: 640px) {
    gap: 0.25rem;
    justify-content: flex-end;
  }
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
  @media (max-width: 640px) {
    align-items: flex-end;
    padding: 0;
  }
`;

const ModalContent = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.2s ease;
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  @media (max-width: 640px) {
    max-width: 100%;
    border-radius: 0.5rem 0.5rem 0 0;
    padding: 1rem;
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  @media (max-width: 640px) {
    font-size: 1rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  @media (max-width: 640px) {
    gap: 0.75rem;
  }
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  @media (max-width: 640px) {
    font-size: 0.75rem;
  }
`;

const Message = styled.p`
  font-size: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  ${props => props.error ? `
    color: #dc2626;
    background: #fef2f2;
  ` : `
    color: #16a34a;
    background: #f0fdf4;
  `}
  @media (max-width: 640px) {
    font-size: 0.6875rem;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin: 1rem auto;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @media (max-width: 640px) {
    width: 20px;
    height: 20px;
    border-width: 2px;
  }
`;

export default function DepositTransaction() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ amount: '', status: 'pending', reason: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (filterStatus) {
      setFilteredTransactions(
        transactions.filter((transaction) => transaction.status === filterStatus)
      );
    } else {
      setFilteredTransactions(transactions);
    }
  }, [transactions, filterStatus]);

  const fetchTransactions = async (query = '') => {
    setLoading(true);
    try {
      let url = `${baseURL}/deposit-transaction`;
      if (query) url = `${baseURL}/deposit-search-transaction/search?query=${encodeURIComponent(query)}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.data.success || !response.data.data) {
        throw new Error('No transaction data received');
      }
      setTransactions(response.data.data.slice().reverse());
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch transactions';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim() && !filterStatus) {
      setError('Please enter a search term or select a filter.');
      return;
    }
    if (searchQuery.trim()) {
      fetchTransactions(searchQuery);
    }
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setFilterStatus('');
    setError('');
    setShowFilters(false);
    fetchTransactions();
  };

  const openModal = (transaction) => {
    setEditId(transaction._id);
    setFormData({
      amount: transaction.amount,
      status: transaction.status,
      reason: transaction.reason || '',
    });
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

    // Validate reason for failed or cancelled status
    if (['failed', 'cancelled'].includes(formData.status) && !formData.reason.trim()) {
      setError('Reason is required for failed or cancelled status');
      setLoading(false);
      return;
    }

    try {
      const url = `${baseURL}/deposit-transaction/${editId}`;
      const response = await axios.put(url, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Transaction updated successfully');
      await fetchTransactions(searchQuery);
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    setLoading(true);
    try {
      await axios.delete(`${baseURL}/deposit-transaction/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Transaction deleted successfully');
      await fetchTransactions(searchQuery);
      setTimeout(() => setSuccess(''), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete transaction');
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = (id) => {
    navigate(`/transaction/${id}`);
  };

  return (
    <Container>
      <Header>
        <Title>Deposit Transactions</Title>
        <ControlWrapper>
          <FilterToggle onClick={() => setShowFilters(!showFilters)}>
            <FaFilter /> Filters <FaChevronDown />
          </FilterToggle>
          <Button onClick={handleRefresh} disabled={loading} title="Refresh">
            <FaSync />
            <Tooltip>Refresh</Tooltip>
          </Button>
        </ControlWrapper>
      </Header>

      <SearchFilterWrapper isOpen={showFilters}>
        <Input
          type="text"
          placeholder="Search by User ID, Name, or Email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
        <Button onClick={handleSearch} disabled={loading}>
          <FaSearch />
          <Tooltip>Search</Tooltip>
        </Button>
      </SearchFilterWrapper>

      {error && <Message error>{error}</Message>}
      {success && <Message>{success}</Message>}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>User</Th>
                  <Th>Payment Method</Th>
                  <Th>Channel</Th>
                  <Th>Amount</Th>
                  <Th>Total Amount</Th>
                  <Th>Promotion</Th>
                  <Th>Status</Th>
                  <Th>Reason</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <Td>
                      {transaction.userId?.name || 'Unknown'}<br />
                      ({transaction.userId?.phoneNumber})
                    </Td>
                    <Td>{transaction.paymentMethod?.methodName || 'Unknown'}</Td>
                    <Td>{transaction?.channel || 'Unknown'}</Td>
                    <Td>৳{transaction.amount}</Td>
                    <Td>৳{transaction.totalAmount || transaction.amount}</Td>
                    <Td>
                      {transaction.promotionId?.title?.length > 4
                        ? `${transaction.promotionId?.title?.slice(0, 4)}...`
                        : transaction.promotionId?.title || 'None'}
                    </Td>
                    <Td>
                      <StatusBadge status={transaction.status}>
                        {transaction.status}
                      </StatusBadge>
                    </Td>
                    <Td title={transaction.reason}>
                      {transaction.reason.length > 5
                        ? `${transaction.reason.slice(0, 5)}...`
                        : transaction.reason}
                    </Td>
                    <Td>
                      <ActionButtons>
                        <Button
                          bgColor="#22c55e"
                          hoverBgColor="#16a34a"
                          onClick={() => viewDetails(transaction._id)}
                        >
                          <FaEye />
                          <Tooltip>View</Tooltip>
                        </Button>
                        <Button
                          bgColor="#f59e0b"
                          hoverBgColor="#d97706"
                          onClick={() => openModal(transaction)}
                          disabled={transaction.status === 'completed'}
                        >
                          <FaEdit />
                          <Tooltip>Edit</Tooltip>
                        </Button>
                        <Button
                          bgColor="#ef4444"
                          hoverBgColor="#dc2626"
                          onClick={() => handleDelete(transaction._id)}
                          disabled={transaction.status === 'completed'}
                        >
                          <FaTrash />
                          <Tooltip>Delete</Tooltip>
                        </Button>
                      </ActionButtons>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>

          {filteredTransactions.map((transaction) => (
            <MobileCard key={transaction._id}>
              <MobileCardHeader>
                <MobileCardTitle>
                  {transaction.userId?.name || 'Unknown'}
                </MobileCardTitle>
                <StatusBadge status={transaction.status}>
                  {transaction.status}
                </StatusBadge>
              </MobileCardHeader>
              <MobileCardContent>
                <MobileCardRow>
                  <span>Phone:</span>
                  <span>{transaction.userId?.phoneNumber}</span>
                </MobileCardRow>
                <MobileCardRow>
                  <span>Payment:</span>
                  <span>{transaction.paymentMethod?.methodName || 'Unknown'}</span>
                </MobileCardRow>
                <MobileCardRow>
                  <span>Amount:</span>
                  <span>৳{transaction.amount}</span>
                </MobileCardRow>
                <MobileCardRow>
                  <span>Total Amount:</span>
                  <span>৳{transaction.totalAmount || transaction.amount}</span>
                </MobileCardRow>
                <MobileCardRow>
                  <span>Promotion:</span>
                  <span title={transaction.promotionId?.title}>
                    {transaction.promotionId?.title.length > 4
                      ? `${transaction.promotionId?.title.slice(0, 4)}...`
                      : transaction.promotionId?.title || 'None'}
                  </span>
                </MobileCardRow>
                <MobileCardRow>
                  <span>Reason:</span>
                  <span title={transaction.reason}>
                    {transaction.reason.length > 4
                      ? `${transaction.reason.slice(0, 4)}...`
                      : transaction.reason}
                  </span>
                </MobileCardRow>
              </MobileCardContent>
              <ActionButtons>
                <Button
                  bgColor="#22c55e"
                  hoverBgColor="#16a34a"
                  onClick={() => viewDetails(transaction._id)}
                >
                  <FaEye />
                </Button>
                <Button
                  bgColor="#f59e0b"
                  hoverBgColor="#d97706"
                  onClick={() => openModal(transaction)}
                  disabled={transaction.status === 'completed'}
                >
                  <FaEdit />
                </Button>
                <Button
                  bgColor="#ef4444"
                  hoverBgColor="#dc2626"
                  onClick={() => handleDelete(transaction._id)}
                  disabled={transaction.status === 'completed'}
                >
                  <FaTrash />
                </Button>
              </ActionButtons>
            </MobileCard>
          ))}
        </>
      )}

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
    </Container>
  );
}