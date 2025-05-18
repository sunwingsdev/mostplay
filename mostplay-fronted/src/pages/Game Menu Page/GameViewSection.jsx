import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGameSection } from '../../features/GamePage/GamePageSliceAndThunk';
import styled from 'styled-components';
import Header from '../../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import useLangPath from '../../hooks/useLangPath';
import { baseURL_For_IMG_UPLOAD } from '../../utils/baseURL';

const HomeContainer = styled.div`
  padding: 0px;
  @media (min-width: 769px) {
    padding: 0 20px;
  }
`;

const GameViewWrapper = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px 10px;
  position: relative;
`;

const SubMenuTabs = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 10px;
  margin-bottom: 20px;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  padding-bottom: 10px; /* Space for scrollbar on desktop */
  scroll-behavior: smooth;

  /* Hide scrollbar on mobile */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  /* Show scrollbar on desktop */
  @media (min-width: 769px) {
    scrollbar-width: thin; /* Firefox */
    scrollbar-color: #ccc transparent; /* Firefox: thumb color, track color */
    &::-webkit-scrollbar {
      display: block;
      height: 8px; /* Horizontal scrollbar height */
    }
    &::-webkit-scrollbar-thumb {
      background-color: #ccc;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }
`;

const SubMenuTab = styled.button`
  background-color: ${({ isActive }) => (isActive ? '#ffc400' : '#e0e0e0')};
  color: ${({ isActive }) => (isActive ? '#000' : '#333')};
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
  border: none;
  border-radius: 6px;
  padding: 10px 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  flex-shrink: 0; /* Prevent tabs from shrinking */

  &:hover {
    background-color: ${({ isActive }) => (isActive ? '#ffc400' : '#d5d5d5')};
  }
`;

const FilterButton = styled.button`
  background: #fff;
  border: 1px solid #ccc;
  padding: 6px 12px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  border-radius: 6px;
`;

const FilterDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 10px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const FilterOption = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 10px 20px;
  text-align: left;
  font-size: 14px;
  color: #333;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const GameCard = styled(Link)`
  background: #fff;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  text-decoration: none;
  background-color: #fff;
  border-radius: 8px;
  cursor: pointer;
  color: "black";
  &:hover {
    transform: scale(1.04);
  }
`;

const GameImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
`;

const GameTitle = styled.div`
  padding: 10px;
  font-size: 15px;
  font-weight: 500;
  background-color: #f9f9f9;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #ffc400;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 10px;
  font-size: 16px;
  color: #333;
  font-weight: 500;
`;

export default function GameViewSection() {
  const { menuId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const langPath = useLangPath();
  const { language } = useSelector((state) => state.theme);

  const { data, isLoading, isError, errorMessage } = useSelector((state) => state.gameSection);
  const [selectedSubMenu, setSelectedSubMenu] = useState(null);
  const [isAllSelected, setIsAllSelected] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortType, setSortType] = useState(null);

  useEffect(() => {
    dispatch(fetchGameSection());
  }, [dispatch]);

  useEffect(() => {
    if (data.subMenu && menuId) {
      const defaultSubMenu = data.subMenu.find((sub) => sub._id === menuId);
      if (defaultSubMenu) {
        setSelectedSubMenu(defaultSubMenu);
        setIsAllSelected(false);
      }
    }
  }, [data.subMenu, menuId]);

  const allGames = data.subMenu?.flatMap((sub) => sub.games) || [];
  let displayedGames = isAllSelected ? allGames : selectedSubMenu?.games || [];

  if (sortType) {
    displayedGames = [...displayedGames].sort((a, b) => {
      if (sortType === 'a-z') {
        return a.name.localeCompare(b.name);
      } else if (sortType === 'z-a') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });
  }

  const handleAllClick = () => {
    setIsAllSelected(true);
    setSelectedSubMenu(null);
  };

  const handleSubMenuClick = (subMenu) => {
    setSelectedSubMenu(subMenu);
    setIsAllSelected(false);
  };

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleSort = (type) => {
    setSortType(type);
    setIsFilterOpen(false);
  };

  if (isError) {
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <div>
      <HomeContainer>
        <GameViewWrapper>
          <SubMenuTabs>
            <SubMenuTab isActive={isAllSelected} onClick={handleAllClick}>
              {language === 'bn' ? 'সব' : language === 'pk' ? 'Pakistan' : language === 'in' ? 'India' : language === 'np' ? 'Nepal' : 'All'}
            </SubMenuTab>
            {data.subMenu?.map((sub) => (
              <SubMenuTab
                key={sub._id}
                isActive={!isAllSelected && selectedSubMenu?._id === sub._id}
                onClick={() => handleSubMenuClick(sub)}
              >
                {sub.title}
              </SubMenuTab>
            ))}
          </SubMenuTabs>

          <div className="row g-3">
            {displayedGames.map((game) => (
              <div key={game._id} className="col-6 col-md-2">
                <GameCard to={langPath(`game-page/${game._id}`)}>
                  <GameImage src={`${baseURL_For_IMG_UPLOAD}s/${game.image}`} alt={game.name} />
                  <GameTitle>{game.name}</GameTitle>
                </GameCard>
              </div>
            ))}

            {isLoading && (
              <SpinnerContainer>
                <div>
                  <Spinner />
                  <LoadingText></LoadingText>
                </div>
              </SpinnerContainer>
            )}
          </div>
        </GameViewWrapper>
      </HomeContainer>
    </div>
  );
}