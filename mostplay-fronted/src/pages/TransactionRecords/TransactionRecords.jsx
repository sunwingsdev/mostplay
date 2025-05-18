import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaFilter } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserPaymentTransactions, fetchUserWithdrawPaymentTransactions } from '../../features/transaction/transactionSlice';
import walletImage from '../../assets/BettingRecords.png';

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

const filterSlideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const detailsFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  backdrop-filter: blur(3px);
  background-color: rgba(30, 41, 89, 0.7);
  z-index: 500;
`;

const PopupContainer = styled.div`
  background: #ebebeb;
  border-radius: 16px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 380px;
  max-width: 95%;
  max-height: 85vh;
  overflow-y: auto;
  animation: ${(props) => (props.isClosing ? slideOut : slideIn)} 0.3s ease-out forwards;
  z-index: 1000;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  font-family: 'Inter', sans-serif;
  padding-bottom: 20px;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: #ebedf3;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: #6b7280;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #4b5563;
  }

  @media (max-width: 480px) {
    width: 95%;
  }
`;

const RecordsContainer = styled.div`
  padding: 1.5rem;
  max-height: 50vh;
  overflow-y: auto;
  background: #ebedf3;
  border-radius: 8px;
  margin: 0 1.5rem;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(34, 5, 255, 0.57);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(34, 5, 255, 0.2);
  }

  @media (max-width: 768px) {
    padding: 1rem;
    margin: 0 1rem;
  }
  @media (max-width: 480px) {
    padding: 0.75rem;
    margin: 0 0.75rem;
  }
`;

const Header = styled.div`
  background: linear-gradient(90deg, #1e2959 0%, #2a3a7c 100%);
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  position: relative;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.75rem;
  cursor: pointer;
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  transition: color 0.2s ease;

  &:hover {
    color: #f5b800;
  }
`;

const TabButtons = styled.div`
  display: flex;
  padding: 0.5rem 1.5rem;
  background: linear-gradient(90deg, #1e2959 0%, #2a3a7c 100%);
`;

const TabButton = styled.button`
  flex: 1;
  padding: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => (props.active ? '#1e2959' : '#6b7280')};
  background: ${(props) => (props.active ? '#f5b800' : 'transparent')};
  border-radius: 6px;
  border: none;
  cursor: pointer;
  margin: 0 0.25rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.active ? '#e0a700' : '#f4f7fc')};
  }
`;

const FilterBar = styled.div`
  padding: 0.5rem 1.5rem;
  background: #ffffff;
`;

const FilterLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e2959;
`;

const FilterIcon = styled.button`
  background: none;
  border: none;
  color: #f5b800;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s ease;

  &:hover {
    color: #e0a700;
  }
`;

const FilterOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: #ffffff;
  z-index: 1001;
  animation: ${filterSlideIn} 0.3s ease-out forwards;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 30px rgba(0, 0, 0, 0.15);
`;

const FilterHeader = styled.div`
  background: linear-gradient(90deg, #1e2959 0%, #2a3a7c 100%);
  color: #ffffff;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
`;

const FilterCategory = styled.div`
  padding: 1rem 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e2959;
  background: #f4f7fc;
  border-bottom: 1px solid #e5e7eb;
`;

const FilterOptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  background: #ffffff;
`;

const FilterOption = styled.div`
  padding: 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => (props.isSelected ? '#ffffff' : '#1e2959')};
  background: ${(props) => (props.isSelected ? '#f5b800' : '#ffffff')};
  border: 1px solid ${(props) => (props.isSelected ? '#f5b800' : '#e5e7eb')};
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${(props) => (props.isSelected ? '#e0a700' : '#f4f7fc')};
    border-color: ${(props) => (props.isSelected ? '#e0a700' : '#d1d5db')};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ConfirmButton = styled.button`
  background: #f5b800;
  color: #1e2959;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  margin: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #e0a700;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 8px;
`;

const FilterScrollContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    height: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

const FilterPill = styled.span`
  background-color: #f5b800;
  color: #1e2959;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  transition: background 0.2s ease;

  &:hover {
    background-color: #e0a700;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
  color: #1e2959;
  font-size: 12px;

  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;

    &::-webkit-scrollbar {
      height: 2px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background: red;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: rgb(24, 204, 0);
    }
  }
`;

const TableHeader = styled.thead`
  background: linear-gradient(90deg, #1e2959 0%, #2a3a7c 100%);
  color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 10;
  font-size: 12px;
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem 1rem;
  font-weight: 600;
  text-align: left;
  text-transform: uppercase;
  border-bottom: 2px solid #e5e7eb;
  font-size: 12px;

  &:first-child {
    border-top-left-radius: 8px;
  }
  &:last-child {
    border-top-right-radius: 8px;
  }
`;

const TableRow = styled.tr`
  background: #ffffff;
  transition: background 0.2s ease, transform 0.2s ease;
  cursor: pointer;

  &:hover {
    background: #f4f7fc;
    transform: translateY(-2px);
  }
`;

const TableCell = styled.td`
  padding: 0.75rem 1rem;
  font-size: 12px;
  font-weight: 400;
  border-bottom: 1px solid #e5e7eb;
  color: #1e2959;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:last-child {
    color: ${(props) => {
      if (props.status === 'completed') return '#22c55e';
      if (props.status === 'failed' || props.status === 'cancelled') return '#ef4444';
      return '#f5b800';
    }};
    font-weight: 500;
  }
`;

const DetailsView = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
  animation: ${detailsFadeIn} 0.3s ease-out;
  max-height: 70vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: #ebedf3;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: #6b7280;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #4b5563;
  }
`;

const DetailsHeader = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1e2959;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BackButton = styled.button`
  background: #f5b800;
  color: #1e2959;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e0a700;
    transform: translateY(-1px);
  }
`;

const DetailItem = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 13px;
  align-items: center;
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: #1e2959;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

const DetailValue = styled.span`
  color: #374151;
  font-weight: 400;
  word-break: break-word;
`;

const DetailSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #d1d5db;
`;

const DetailSectionTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #1e2959;
  margin-bottom: 0.75rem;
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  text-align: center;
  color: #1e2959;
  font-size: 0.875rem;
  font-weight: 500;
`;

const EmptyStateImage = styled.img`
  max-width: 120px;
  height: auto;
  margin-bottom: 0.75rem;
`;

export default function TransactionRecords({ isOpen, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Deposit');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    Status: null,
    TransactionType: null,
    Date: null,
  });
  const [tempFilters, setTempFilters] = useState({ ...selectedFilters });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const popupRef = useRef();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { 
    paymentTransactions, 
    withdrawTransactions, 
    isLoading, 
    isError, 
    errorMessage 
  } = useSelector((state) => state.transaction);

  const filterOptions = [
    {
      main: 'Status',
      sub: ['pending', 'completed', 'failed', 'cancelled'],
    },
    {
      main: 'TransactionType',
      sub: ['Deposit', 'Withdrawal'],
    },
    {
      main: 'Date',
      sub: ['Today', 'Yesterday', 'Last 7 days'],
    },
  ];

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

  useEffect(() => {
    if (isOpen && user?._id) {
      dispatch(fetchUserPaymentTransactions(user._id));
      dispatch(fetchUserWithdrawPaymentTransactions(user._id));
    }
  }, [dispatch, isOpen, user]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setSelectedTransaction(null);
  };

  const handleFilterSelect = (main, subOption) => {
    setTempFilters((prev) => ({
      ...prev,
      [main]: prev[main] === subOption ? null : subOption,
    }));
  };

  const handleConfirmFilters = () => {
    setSelectedFilters(tempFilters);
    setShowFilter(false);
  };

  const showDetails = (tx) => {
    setSelectedTransaction(tx);
  };

  const hideDetails = () => {
    setSelectedTransaction(null);
  };

  // Combine and filter transactions
  const allTransactions = [
    ...(paymentTransactions || []).map(tx => ({ ...tx, transactionType: 'Deposit' })),
    ...(withdrawTransactions || []).map(tx => ({ ...tx, transactionType: 'Withdrawal' })),
  ];

  const filteredData = allTransactions.filter((tx) => {
    const createdAt = new Date(tx.createdAt);
    const now = new Date();
    let dateMatch = true;

    if (selectedFilters.Date === 'Today') {
      dateMatch = createdAt.toDateString() === now.toDateString();
    } else if (selectedFilters.Date === 'Yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      dateMatch = createdAt.toDateString() === yesterday.toDateString();
    } else if (selectedFilters.Date === 'Last 7 days') {
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);
      dateMatch = createdAt >= lastWeek;
    }

    return (
      (selectedFilters.Status === null || tx.status === selectedFilters.Status) &&
      (selectedFilters.TransactionType === null || tx.transactionType === selectedFilters.TransactionType) &&
      (selectedFilters.Date === null || dateMatch) &&
      (selectedTab === tx.transactionType)
    );
  });

  if (!isOpen) return null;

  return (
    <>
      <Overlay />
      <PopupContainer ref={popupRef} isClosing={isClosing}>
        <Header>
          <h5>{selectedTransaction ? 'Transaction Details' : 'Transaction Records'}</h5>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </Header>
        {!selectedTransaction && (
          <>
            <TabButtons>
              <TabButton
                active={selectedTab === 'Deposit'}
                onClick={() => handleTabChange('Deposit')}
              >
                Deposit
              </TabButton>
              <TabButton
                active={selectedTab === 'Withdrawal'}
                onClick={() => handleTabChange('Withdrawal')}
              >
                Withdrawal
              </TabButton>
            </TabButtons>
            <FilterBar className="row m-2 p-0">
              <div className="col-10">
                <FilterWrapper>
                  <FilterLabel>Filter:</FilterLabel>
                  <FilterScrollContainer>
                    {Object.entries(selectedFilters)
                      .filter(([_, value]) => value !== null)
                      .map(([key, value]) => (
                        <FilterPill key={`${key}-${value}`}>{`${key}: ${value}`}</FilterPill>
                      ))}
                  </FilterScrollContainer>
                </FilterWrapper>
              </div>
              <div className="col-2 d-flex justify-content-center align-items-center">
                <FilterIcon onClick={() => setShowFilter(true)}>
                  <FaFilter />
                </FilterIcon>
              </div>
            </FilterBar>
            <RecordsContainer>
              {isLoading && (
                <StyledTable>
                  <TableHeader>
                    <tr>
                      <TableHeaderCell scope="col">Method</TableHeaderCell>
                      <TableHeaderCell scope="col">Amount</TableHeaderCell>
                      <TableHeaderCell scope="col">Date</TableHeaderCell>
                      <TableHeaderCell scope="col">Status</TableHeaderCell>
                    </tr>
                  </TableHeader>
                  <tbody>
                    {[...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell> </TableCell>
                        <TableCell> </TableCell>
                        <TableCell> </TableCell>
                        <TableCell> </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </StyledTable>
              )}
              {isError && <div>Error: {errorMessage}</div>}
              {!isLoading && !isError && (
                <StyledTable>
                  <TableHeader>
                    <tr>
                      <TableHeaderCell scope="col">Method</TableHeaderCell>
                      <TableHeaderCell scope="col">Amount</TableHeaderCell>
                      <TableHeaderCell scope="col">Date</TableHeaderCell>
                      <TableHeaderCell scope="col">Status</TableHeaderCell>
                    </tr>
                  </TableHeader>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((tx, index) => (
                        <TableRow key={tx._id || index} onClick={() => showDetails(tx)}>
                          <TableCell>{tx.paymentMethod.methodName || 'N/A'}</TableCell>
                          <TableCell>{tx.amount || '0'} {user?.currency || 'BDT'}</TableCell>
                          <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell status={tx.status}>
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="4">
                          <EmptyStateContainer>
                            <EmptyStateImage
                              src={walletImage}
                              alt="No transaction records available"
                            />
                            No transaction records available
                          </EmptyStateContainer>
                        </TableCell>
                      </TableRow>
                    )}
                  </tbody>
                </StyledTable>
              )}
            </RecordsContainer>
            {showFilter && (
              <FilterOverlay style={{ paddingBottom: '20px' }}>
                <FilterHeader>
                  <h5>Filter Options</h5>
                  <CloseButton onClick={() => setShowFilter(false)}>×</CloseButton>
                </FilterHeader>
                {filterOptions.map((category) => (
                  <div key={category.main}>
                    <FilterCategory>{category.main}</FilterCategory>
                    <FilterOptionsGrid>
                      {category.sub.map((subOption) => (
                        <FilterOption
                          key={subOption}
                          isSelected={tempFilters[category.main] === subOption}
                          onClick={() => handleFilterSelect(category.main, subOption)}
                        >
                          {subOption}
                        </FilterOption>
                      ))}
                    </FilterOptionsGrid>
                  </div>
                ))}
                <ConfirmButton
                  style={{ marginBottom: '20px' }}
                  onClick={handleConfirmFilters}
                >
                  Apply Filters
                </ConfirmButton>
              </FilterOverlay>
            )}
          </>
        )}
        {selectedTransaction && (
          <DetailsView>
            <DetailsHeader>
              Transaction Details
              <BackButton onClick={hideDetails}>Back</BackButton>
            </DetailsHeader>
        
            <DetailItem>
              <DetailLabel>Channel</DetailLabel>
              <DetailValue>{selectedTransaction.channel || 'N/A'}</DetailValue>
            </DetailItem>
            {selectedTransaction.transactionType === 'Deposit' && selectedTransaction.promotionTitle && (
              <DetailItem>
                <DetailLabel>Promotion</DetailLabel>
                <DetailValue>{selectedTransaction.promotionTitle}</DetailValue>
              </DetailItem>
            )}
            {selectedTransaction.transactionType === 'Deposit' && selectedTransaction.promotionBonus?.bonus && (
              <DetailItem>
                <DetailLabel>Bonus</DetailLabel>
                <DetailValue>
                  {selectedTransaction.promotionBonus.bonus_type === 'Percentage'
                    ? `${selectedTransaction.promotionBonus.bonus}%`
                    : selectedTransaction.promotionBonus.bonus} {user?.currency }
                </DetailValue>
              </DetailItem>
            )}

{selectedTransaction.amount && (
  <DetailItem>
    <DetailLabel>Amount</DetailLabel>
    <DetailValue>
      {selectedTransaction.amount} {user?.currency || 'BDT'}
    </DetailValue>
  </DetailItem>
)}


            {(selectedTransaction.status === 'failed' || selectedTransaction.status === 'cancelled') && selectedTransaction.reason && (
              <DetailItem>
                <DetailLabel>Reason</DetailLabel>
                <DetailValue>{selectedTransaction.reason}</DetailValue>
              </DetailItem>
            )}
            <DetailItem>
              <DetailLabel>Created At</DetailLabel>
              <DetailValue>{new Date(selectedTransaction.createdAt).toLocaleString()}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Updated At</DetailLabel>
              <DetailValue>{new Date(selectedTransaction.updatedAt).toLocaleString()}</DetailValue>
            </DetailItem>
            {selectedTransaction.userInputs?.length > 0 && (
              <DetailSection>
                <DetailSectionTitle>User Inputs</DetailSectionTitle>
                {selectedTransaction.userInputs.map((input, idx) => (
                  <DetailItem key={idx}>
                    <DetailLabel>{input.label}</DetailLabel>
                    <DetailValue>{input.value}</DetailValue>
                  </DetailItem>
                ))}
              </DetailSection>
            )}
          </DetailsView>
        )}
      </PopupContainer>
    </>
  );
}