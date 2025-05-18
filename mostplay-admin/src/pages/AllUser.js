
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCustomer } from '../redux/userFrontend/userFrontendAPI';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';





// Updated Styled Components
const DashboardContainer = styled.div`
  padding: 1rem;
  margin: 0 auto;
  max-width: 90rem;
  width: 100%;
  box-sizing: border-box;
  background: #f9fafb;
  min-height: 100vh;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const Header = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #ffffff;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  gap: 0.5rem;
`;

const FilterContainer = styled.div`
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  margin-bottom: 1rem;
  display: grid;
  gap: 0.75rem;
  grid-template-columns: 1fr;
  max-height: ${({ isVisible }) => (isVisible ? 'auto' : '0')};
  opacity: ${({ isVisible }) => (isVisible ? '1' : '0')};
  overflow: hidden;
  transition: all 0.4s ease;
  border: 1px solid #d1d5db;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    padding: 1.5rem;
    gap: 1rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FilterInput = styled.input`
  height: 2.5rem;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background: #ffffff;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #000000;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #1C2937;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }

  &::placeholder {
    color: #6b7280;
  }
`;

const FilterSelect = styled.select`
  height: 2.5rem;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background: #ffffff;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #000000;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #1C2937;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
`;

const TableWrapper = styled.div`
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  margin: 0 0.5rem 1rem;
  overflow-x: auto;
  border: 1px solid #d1d5db;

  @media (max-width: 767px) {
    display: none;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 640px; /* Ensures table maintains structure when scrolling */

  th {
    background: #1C2937;
    padding: 0.75rem 1rem;
    text-align: left;
    font-weight: 600;
    color: #ffffff;
    border-bottom: 0.1875rem solid #dbeafe;
    white-space: nowrap;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e5e7eb;
    vertical-align: middle;
    max-width: 12rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #374151;
  }

  tr:hover {
    background: #f3f4f6;
    transition: background-color 0.2s ease;
  }

  @media (min-width: 1024px) {
    th, td {
      padding: 1.125rem;
    }
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 0.5rem;

  @media (min-width: 768px) {
    display: none;
  }
`;

const UserCard = styled.div`
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  display: grid;
  gap: 0.75rem;
  font-size: 0.875rem;
  border: 1px solid #d1d5db;

  &:hover {
    background: #f3f4f6;
  }

  @media (min-width: 640px) {
    padding: 1.5rem;
    gap: 1rem;
    font-size: 0.9375rem;
  }
`;








const Title = styled.h1`
  font-size: 1.5rem; /* Matches reference title size */
  color: #000000; /* Matches text-black */
  margin: 0;
  font-weight: 600; /* Matches font-semibold */
`;

const FilterToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem; /* Matches h-10 */
  padding: 0.5rem 1rem; /* Matches px-4 py-2 */
  border-radius: 0.375rem; /* Matches rounded-md */
  background: #1C2937; /* Matches bg-blue-600 */
  color: #ffffff; /* Matches text-white */
  font-size: 0.875rem; /* Matches text-sm */
  font-weight: 500; /* Matches font-medium */
  outline: none;
  transition: background-color 0.2s ease;

  &:hover {
    background:rgb(18, 33, 49); /* Matches hover:bg-blue-700 */
  }
`;



const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
`;

const StyledSpinner = styled.div`
  border: 0.375rem solid #e5e7eb; /* Matches gray-200 */
  border-top: 0.375rem solid #1C2937; /* Matches blue-600 */
  border-right: 0.375rem solid #dc2626; /* Matches red-600 */
  border-radius: 50%;
  width: 3rem; /* Matches 48px */
  height: 3rem; /* Matches 48px */
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorAlert = styled.div`
  padding: 1rem; /* Matches p-4 */
  background: #fef2f2; /* Matches light red bg */
  color: #dc2626; /* Matches text-red-600 */
  border-radius: 0.375rem; /* Matches rounded-md */
  text-align: center;
  margin: 0 0.75rem; /* Matches margin: 0 12px */
  font-weight: 600; /* Matches font-semibold */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06); /* Matches shadow */
`;


const StatusBadge = styled.span`
  padding: 0.375rem 0.875rem; /* Matches padding from reference */
  border-radius: 1.25rem; /* Matches rounded-full */
  font-size: 0.875rem; /* Matches text-sm */
  font-weight: 500; /* Matches font-medium */
  display: inline-block;
  ${({ status }) => {
    switch (status) {
      case 'active':
        return `
          background: #16a34a; /* Matches bg-green-600 */
          color: #ffffff; /* Matches text-white */
        `;
      case 'banned':
        return `
          background: #dc2626; /* Matches bg-red-600 */
          color: #ffffff; /* Matches text-white */
        `;
      default:
        return `
          background: #6b7280; /* Matches bg-gray-500 */
          color: #ffffff; /* Matches text-white */
        `;
    }
  }}
`;



const CardLabel = styled.span`
  font-weight: 600; /* Matches font-semibold */
  color: #000000; /* Matches text-black */
`;

const CardValue = styled.span`
  color: #374151; /* Matches text-gray-700 */
  word-break: break-word;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 1.75rem; /* Matches 28px */
  color:rgb(35, 76, 119); /* Matches blue-600 */
  font-size: 1.0625rem; /* Matches 17px */
  font-weight: 500; /* Matches font-medium */
  background: #f3f4f6; /* Matches light gray bg */
  border-radius: 0.375rem; /* Matches rounded-md */
  border: 1px dashed #93c5fd; /* Matches light blue dashed */
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem; /* Matches h-10 */
  padding: 0.5rem 1rem; /* Matches px-4 py-2 */
  border-radius: 0.375rem; /* Matches rounded-md */
  background: #1C2937; /* Matches bg-blue-600 */
  color: #ffffff; /* Matches text-white */
  font-size: 0.875rem; /* Matches text-sm */
  font-weight: 500; /* Matches font-medium */
  outline: none;
  transition: background-color 0.2s ease;

  &:hover {
    background:rgb(65, 93, 123); /* Matches hover:bg-blue-700 */
  }
`;

export default function AllUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customerInfo, isLoading, isError, errorMessage } = useSelector(
    (state) => state.userCustomer
  );

  const [filters, setFilters] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    currency: '',
    minDeposit: '',
    maxDeposit: '',
    minWithdraw: '',
    maxWithdraw: '',
    status: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(getAllCustomer());
  }, [dispatch]);

  const filteredCustomers = customerInfo?.filter((user) => {
    const nameMatch = user.name?.toLowerCase().includes(filters.name.toLowerCase());
    const emailMatch = user.email?.toLowerCase().includes(filters.email.toLowerCase());
    const phoneMatch = user.phoneNumber?.toLowerCase().includes(filters.phoneNumber.toLowerCase());
    const currencyMatch = !filters.currency || user.currency?.toLowerCase() === filters.currency.toLowerCase();
    const depositMatch =
      (!filters.minDeposit || (user.deposit >= Number(filters.minDeposit))) &&
      (!filters.maxDeposit || (user.deposit <= Number(filters.maxDeposit)));
    const withdrawMatch =
      (!filters.minWithdraw || (user.withdraw >= Number(filters.minWithdraw))) &&
      (!filters.maxWithdraw || (user.withdraw <= Number(filters.maxWithdraw)));
    const statusMatch = !filters.status || user.status === filters.status;

    return nameMatch && emailMatch && phoneMatch && currencyMatch && depositMatch && withdrawMatch && statusMatch;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handleEdit = (userId) => {
    navigate(`/user/${userId}`);
  };

  if (isLoading) {
    return (
      <DashboardContainer>
        <LoadingContainer>
          <StyledSpinner />
        </LoadingContainer>
      </DashboardContainer>
    );
  }

  if (isError) {
    return (
      <DashboardContainer>
        <ErrorAlert>
          <strong style={{ marginRight: '0.5rem' }}>Error:</strong>
          {errorMessage || 'An unexpected error occurred'}
        </ErrorAlert>
      </DashboardContainer>
    );
  }

  const renderUserCard = (user) => (
    <UserCard key={user._id}>
      <div><CardLabel>Name:</CardLabel> <CardValue>{user.name || '-'}</CardValue></div>
      <div><CardLabel>Email:</CardLabel> <CardValue>{user.email || '-'}</CardValue></div>
      <div><CardLabel>Phone:</CardLabel> <CardValue>{user.phoneNumber || '-'}</CardValue></div>
      <div><CardLabel>Currency:</CardLabel> <CardValue>{user.currency || '-'}</CardValue></div>
      <div><CardLabel>Deposit:</CardLabel> <CardValue>{user.deposit !== undefined ? `${user.deposit.toFixed(2)}` : '-'}</CardValue></div>
      <div><CardLabel>Withdraw:</CardLabel> <CardValue>{user.withdraw !== undefined ? `${user.withdraw.toFixed(2)}` : '-'}</CardValue></div>
      <div><CardLabel>Status:</CardLabel> <StatusBadge status={user.status}>{user.status === 'active' ? 'Active' : user.status === 'banned' ? 'Banned' : 'Inactive'}</StatusBadge></div>
      <ActionButton onClick={() => handleEdit(user._id)}>View User</ActionButton>
    </UserCard>
  );

  return (
    <DashboardContainer>
      <Header>
        <Title>All Users</Title>
        <FilterToggleButton onClick={toggleFilters}>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </FilterToggleButton>
      </Header>

      <FilterContainer isVisible={showFilters}>
        <FilterInput
          type="text"
          name="name"
          placeholder="Filter by Name"
          value={filters.name}
          onChange={handleFilterChange}
        />
        <FilterInput
          type="text"
          name="email"
          placeholder="Filter by Email"
          value={filters.email}
          onChange={handleFilterChange}
        />
        <FilterInput
          type="text"
          name="phoneNumber"
          placeholder="Filter by Phone"
          value={filters.phoneNumber}
          onChange={handleFilterChange}
        />
        <FilterInput
          type="text"
          name="currency"
          placeholder="Filter by Currency"
          value={filters.currency}
          onChange={handleFilterChange}
        />
        <FilterInput
          type="number"
          name="minDeposit"
          placeholder="Min Deposit"
          value={filters.minDeposit}
          onChange={handleFilterChange}
        />
        <FilterInput
          type="number"
          name="maxDeposit"
          placeholder="Max Deposit"
          value={filters.maxDeposit}
          onChange={handleFilterChange}
        />
        <FilterInput
          type="number"
          name="minWithdraw"
          placeholder="Min Withdraw"
          value={filters.minWithdraw}
          onChange={handleFilterChange}
        />
        <FilterInput
          type="number"
          name="maxWithdraw"
          placeholder="Max Withdraw"
          value={filters.maxWithdraw}
          onChange={handleFilterChange}
        />
        <FilterSelect
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
          <option value="inactive">Inactive</option>
        </FilterSelect>
      </FilterContainer>

      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Currency</th>
              <th>Deposit</th>
              <th>Withdraw</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers?.length > 0 ? (
              filteredCustomers.map((user) => (
                <tr key={user._id}>
                  <td title={user.name || '-'}>{user.name || '-'}</td>
                  <td title={user.email || '-'}>{user.email || '-'}</td>
                  <td title={user.phoneNumber || '-'}>{user.phoneNumber || '-'}</td>
                  <td title={user.currency || '-'}>{user.currency || '-'}</td>
                  <td>{user.deposit !== undefined ? `${user.deposit.toFixed(2)}` : '-'}</td>
                  <td>{user.withdraw !== undefined ? `${user.withdraw.toFixed(2)}` : '-'}</td>
                  <td><StatusBadge status={user.status}>{user.status === 'active' ? 'Active' : user.status === 'banned' ? 'Banned' : 'Inactive'}</StatusBadge></td>
                  <td><ActionButton onClick={() => handleEdit(user._id)}>View User</ActionButton></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">
                  <NoDataMessage>No users found matching filters</NoDataMessage>
                </td>
              </tr>
            )}
          </tbody>
        </StyledTable>
      </TableWrapper>

      <CardContainer>
        {filteredCustomers?.length > 0 ? (
          filteredCustomers.map(renderUserCard)
        ) : (
          <NoDataMessage>No users found matching filters</NoDataMessage>
        )}
      </CardContainer>
    </DashboardContainer>
  );
}

AllUser.propTypes = {
  customerInfo: PropTypes.array,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  errorMessage: PropTypes.string,
};
