import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaFilter } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGameSection } from '../../features/GamePage/GamePageSliceAndThunk';
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
  border-radius: 12px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: ${(props) => (props.isClosing ? slideOut : slideIn)} 0.3s ease-out forwards;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-family: 'Inter', sans-serif;
  padding-bottom: 15px;

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
    width: 90%;
  }
`;

const RecordsContainer = styled.div`
  padding: 1rem;
  max-height: 50vh;
  overflow-y: auto;
  background: #ebedf3;
  border-radius: 8px;

  &::-webkit-scrollbar {
    width: 5px;
    height:5px
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: red;
    border-radius: 10px;
   background: rgba(34, 5, 255, 0.57)
  }
  &::-webkit-scrollbar-thumb:hover {
    background:rgba(34, 5, 255, 0.2);
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const Header = styled.div`
  background: linear-gradient(90deg, #1e2959 0%, #2a3a7c 100%);
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  position: relative;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  transition: color 0.2s ease;

  &:hover {
    color: #f5b800;
  }
`;

const TabButtons = styled.div`
  display: flex;
  padding: 0.5rem;
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
  padding: 0.5rem 1rem;
  background: rgb(255, 255, 255);
`;

const FilterLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

const FilterIcon = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s ease;

  &:hover {
    color: #f5b800;
  }
`;

const FilterOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: linear-gradient(180deg, #ffffff 0%, #f4f7fc 100%);
  border-left: 1px solid #e5e7eb;
  z-index: 1001;
  animation: ${filterSlideIn} 0.3s ease-out forwards;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
`;

const FilterHeader = styled.div`
  background: linear-gradient(90deg, #1e2959 0%, #2a3a7c 100%);
  color: #ffffff;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
`;

const FilterOption = styled.div`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 400;
  color: #1e2959;
  background: #ffffff;
  cursor: pointer;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s ease;

  &:hover {
    background: #f4f7fc;
  }
`;

const Checkbox = styled.input`
  cursor: pointer;
  accent-color: #f5b800;
  width: 14px;
  height: 14px;
`;

const ConfirmButton = styled.button`
  background: #f5b800;
  color: #1e2959;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  margin: 1rem;
  text-align: center;
  transition: background 0.2s ease;

  &:hover {
    background: #e0a700;
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
      background:rgb(24, 204, 0);
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
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:last-child {
    color: ${(props) => (props.value && props.value.startsWith('+') ? '#22c55e' : '#ef4444')};
    font-weight: 500;
  }
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

export default function BettingRecords({ isOpen, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Settled');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [tempFilters, setTempFilters] = useState(['Last 7 days']);
  const popupRef = useRef();
  const dispatch = useDispatch();

  const { menuOptions } = useSelector((state) => state.homeGameMenu.homeGameMenu);
  const { data, isLoading, isError, errorMessage } = useSelector((state) => state.gameSection);

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
    dispatch(fetchGameSection());
  }, [dispatch]);

  useEffect(() => {
    console.log(data.subMenu);
  }, [data]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleFilterToggle = (filter) => {
    setTempFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const handleConfirmFilters = () => {
    setSelectedFilters(tempFilters.length > 0 ? tempFilters : ['Last 7 days']);
    setShowFilter(false);
  };

  if (!isOpen) return null;

  // Filter the data based on selected filters
  const filteredData = data?.subMenu?.filter((item) =>
    selectedFilters.includes(item.title)
  ) || [];

  return (
    <>
      <Overlay />
      <PopupContainer ref={popupRef} isClosing={isClosing}>
        <Header>
          <h5>Betting Records</h5>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </Header>
        <TabButtons>
          <TabButton
            active={selectedTab === 'Settled'}
            onClick={() => handleTabChange('Settled')}
          >
            Settled
          </TabButton>
          <TabButton
            active={selectedTab === 'Unsettled'}
            onClick={() => handleTabChange('Unsettled')}
          >
            Unsettled
          </TabButton>
        </TabButtons>
        <FilterBar className="row m-2 p-0">
          <div className="col-10">
            <FilterWrapper>
              <FilterLabel style={{ color: 'black' }}>Filter:</FilterLabel>
              <FilterScrollContainer>
                {selectedFilters.map((filter) => (
                  <FilterPill key={filter}>{filter}</FilterPill>
                ))}
              </FilterScrollContainer>
            </FilterWrapper>
          </div>
          <div className="col-2 d-flex justify-content-center align-items-center">
            <FilterIcon onClick={() => setShowFilter(true)}>
              <FaFilter style={{ color: '#f5b800' }} />
            </FilterIcon>
          </div>
        </FilterBar>
        <RecordsContainer>
          {isLoading && (
            <StyledTable>
              <TableHeader>
                <tr>
                  <TableHeaderCell scope="col">Platform</TableHeaderCell>
                  <TableHeaderCell scope="col">Type</TableHeaderCell>
                  <TableHeaderCell scope="col">Turnover</TableHeaderCell>
                  <TableHeaderCell scope="col">Profit/Loss</TableHeaderCell>
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
                  <TableHeaderCell scope="col">Platform</TableHeaderCell>
                  <TableHeaderCell scope="col">Type</TableHeaderCell>
                  <TableHeaderCell scope="col">Turnover</TableHeaderCell>
                  <TableHeaderCell scope="col">Profit/Loss</TableHeaderCell>
                </tr>
              </TableHeader>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell scope="row">{item.platform || 'N/A'}</TableCell>
                      <TableCell>{item.type || 'N/A'}</TableCell>
                      <TableCell>{item.turnover || '0'}</TableCell>
                      <TableCell value={item.profitLoss || '0'}>
                        {item.profitLoss || '0'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="4">
                      <EmptyStateContainer>
                        <EmptyStateImage
                          src={walletImage}
                          alt="No betting records available"
                        />
                        No betting records available
                      </EmptyStateContainer>
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </StyledTable>
          )}
        </RecordsContainer>
        {showFilter && (
          <FilterOverlay style={{ paddingBottom: '15px' }}>
            <FilterHeader>
              <h5>Select Filter</h5>
              <CloseButton onClick={() => setShowFilter(false)}>×</CloseButton>
            </FilterHeader>
            {data && data.subMenu && data.subMenu.length > 0 ? (
              data.subMenu.map((filter) => (
                <FilterOption
                  key={filter.title}
                  onClick={() => handleFilterToggle(filter.title)}
                >
                  <Checkbox
                    type="checkbox"
                    checked={tempFilters.includes(filter.title)}
                    onChange={() => handleFilterToggle(filter.title)}
                  />
                  {filter.title}
                </FilterOption>
              ))
            ) : (
              <FilterOption>No filter options available</FilterOption>
            )}
            <ConfirmButton
              style={{ marginBottom: '15px' }}
              onClick={handleConfirmFilters}
            >
              Confirm
            </ConfirmButton>
          </FilterOverlay>
        )}
      </PopupContainer>
    </>
  );
}