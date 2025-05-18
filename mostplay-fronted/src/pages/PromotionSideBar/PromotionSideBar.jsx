
import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaCircle, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPromotions } from '../../features/promotion/promotionThunkAndSlice';
import { baseURL_For_IMG_UPLOAD } from '../../utils/baseURL';

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
  background-color: #f1f3f5;
  border-radius: 1rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  max-width: 95vw;
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
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
`;

const TabButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 5px;
  margin: 10px;
  background-color: rgb(255, 255, 255);
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;

  &::-webkit-scrollbar {
    height: 5px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 10px;
  }
`;

const TabButton = styled.button`
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => (props.active ? '#000' : '#666')};
  background-color: ${(props) => (props.active ? '#F4B600' : 'transparent')};
  border-radius: 5px;
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: lighter;
`;

const PromotionCard = styled.div`
  background-color: white;
  margin: 0.5rem 1rem;
  border-radius: 0.75rem;
  overflow: hidden;
`;

const BannerImage = styled.img`
  width: 100%;
 // height: 150px;
  object-fit: cover;
`;

const PromotionContent = styled.div`
  padding: 0.75rem;
`;

const BonusTag = styled.span`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background-color: #00c4b4;
  color: white;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.25rem;
  text-transform: uppercase;
`;

const PromotionTitle = styled.h6`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e2959;
  margin: 0.5rem 0 0.25rem;
  line-height: 1.2;
`;

const LimitedOffer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const JoinedButton = styled.button`
  flex: 1;
  padding: 10px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background-color: #F48F0B;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: lighter;
`;

const DetailsButton = styled.button`
  flex: 1;
  padding: 10px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background-color: #F4B600;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: lighter;
`;

// Styles for the Details View
const DetailsContainer = styled.div`
  padding: 0.5rem;
`;

const DetailsBannerImage = styled.img`
  width: 100%;
//  height: 150px;
//  object-fit: cover;
  border-radius: 0.75rem;
  margin: 0.5rem 0;
`;

const DetailsTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #1e2959;
  margin: 0.5rem 0;
`;

const DetailsDescription = styled.p`
  font-size: 0.8rem;
  color: #666;
  white-space: pre-wrap;
  margin: 0.5rem 0;
`;

const BonusDetails = styled.div`
  background-color: white;
  padding: 0.75rem;
  border-radius: 0.75rem;
  margin: 0.5rem 0;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #1e2959;
`;

const DetailValue = styled.span`
  color: #666;
`;

export default function PromotionSideBar({ isOpen, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const popupRef = useRef();
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const { promotions } = useSelector((state) => state.promotionSlice);
  const dispatch = useDispatch();

  const { language } = useSelector((state) => state.theme);
  useEffect(() => {
    dispatch(fetchPromotions());
  }, [dispatch]);

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
    setActiveTab(tab);
    setSelectedPromotion(null); // Reset to list view when changing tabs
  };

  const handleDetailsClick = (promotion) => {
    setSelectedPromotion(promotion);
  };

  const handleBack = () => {
    setSelectedPromotion(null);
  };

  if (!isOpen) return null;

  // Extract unique game types for tabs, including 'ALL'
  const gameTypes = [
    'ALL',
    ...new Set(promotions.map((promo) => promo?.game_type?.title)),
  ];

  // Filter promotions based on active tab
  const filteredPromotions =
    activeTab === 'ALL'
      ? promotions
      : promotions.filter((promo) => promo?.game_type?.title === activeTab);

  return (
    <>
      <Overlay />
      <PopupContainer ref={popupRef} isClosing={isClosing}>
        <Header>
          {selectedPromotion ? (
            <>
              <BackButton onClick={handleBack}>
                <FaArrowLeft />
              </BackButton>
              <h5>Promotion Details</h5>
              <CloseButton onClick={handleClose}>×</CloseButton>
            </>
          ) : (
            <>
              <h5>Promotion</h5>
              <CloseButton onClick={handleClose}>×</CloseButton>
            </>
          )}
        </Header>

        {!selectedPromotion && (
          <TabButtons>
            {gameTypes.map((tab) => (
              <TabButton
                key={tab}
                active={activeTab === tab}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </TabButton>
            ))}
          </TabButtons>
        )}

        {selectedPromotion ? (
          <DetailsContainer>
            <DetailsBannerImage src={`${baseURL_For_IMG_UPLOAD}s/${selectedPromotion?.img}`} alt="Promotion Banner" />
            <DetailsTitle>{language === 'bd' ? selectedPromotion?.title_bd : selectedPromotion?.title}</DetailsTitle>
            <DetailsDescription>
              {language === 'bd' ? selectedPromotion?.description_bd : selectedPromotion?.description}
            </DetailsDescription>
            <BonusDetails style={{display:"none"}}>
              <p>
                <DetailLabel>Game Type: </DetailLabel>
                <DetailValue>{language === 'bd' ? selectedPromotion?.game_type?.titleBD : selectedPromotion?.game_type.title || 'N/A'}</DetailValue>
              </p>
              <p>
                <DetailLabel>Max Bonus: </DetailLabel>
                <DetailValue>৳{selectedPromotion?.max_bonus || 'N/A'}</DetailValue>
              </p>
              <p>
                <DetailLabel>Bkash Bonus: </DetailLabel>
                <DetailValue>
                  {selectedPromotion?.bkash_bonus_type === 'Percentage'
                    ? `${selectedPromotion?.bkash_bonus}%`
                    : `৳${selectedPromotion?.bkash_bonus}`}
                </DetailValue>
              </p>
              <p>
                <DetailLabel>Nagat Bonus: </DetailLabel>
                <DetailValue>
                  {selectedPromotion?.nagat_bonus_type === 'Percentage'
                    ? `${selectedPromotion?.nagat_bonus}%`
                    : `৳${selectedPromotion?.nagat_bonus}`}
                </DetailValue>
              </p>
              <p>
                <DetailLabel>Rocket Bonus: </DetailLabel>
                <DetailValue>
                  {selectedPromotion?.rocket_bonus_type === 'Percentage'
                    ? `${selectedPromotion?.rocket_bonus}%`
                    : `৳${selectedPromotion?.rocket_bonus}`}
                </DetailValue>
              </p>
              <p>
                <DetailLabel>Created At: </DetailLabel>
                <DetailValue>
                  {new Date(selectedPromotion.createdAt).toLocaleDateString()}
                </DetailValue>
              </p>
            </BonusDetails>
          </DetailsContainer>
        ) : (
          filteredPromotions.map((promo) => (
            <PromotionCard key={promo._id}>
              <div style={{ position: 'relative' }}>
                <BannerImage src={`${baseURL_For_IMG_UPLOAD}s/${promo.img}`} alt="Promotion Banner" />
                <BonusTag>Bonus</BonusTag>
              </div>
              <PromotionContent>
                <PromotionTitle>{language === 'bd' ? promo.title_bd : promo.title}</PromotionTitle>
                <LimitedOffer>
                  <FaCircle size={10} color="#666" />
                  Limited Offer
                </LimitedOffer>
                <ButtonWrapper>
                  <JoinedButton>Joined</JoinedButton>
                  <DetailsButton onClick={() => handleDetailsClick(promo)}>
                    Details
                  </DetailsButton>
                </ButtonWrapper>
              </PromotionContent>
            </PromotionCard>
          ))
        )}
      </PopupContainer>
    </>
  );
}
