import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import logo_white from '../../assets/logo_white.png';
import bd_flag from '../../assets/bd_flag.png';
import HeaderLanguageBox from './HeaderLanguageBox';
import { useDispatch, useSelector } from 'react-redux';
import { FaBars, FaMoneyBillWave, FaSync, FaUserCircle } from 'react-icons/fa';
import useLangPath from '../../hooks/useLangPath';
import HeaderDesktopProfileMenu from './HeaderDesktopProfileMenu/HeaderDesktopProfileMenu';
import { getBalance } from '../../features/auth/authThunks';
import { baseURL_For_IMG_UPLOAD } from '../../utils/baseURL';

// Define keyframes for slide animations
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

const slideInDesktop = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOutDesktop = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(20px);
    opacity: 0;
  }
`;

// Define keyframes for spinning animation
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: ${props => props.theme.primaryColor || '#163E91'};
  padding: 20px;
  color: ${props => props.theme.whiteColor || '#FFFFFF'};

  @media (min-width: 769px) {
    padding: 0 30px;
  }
`;

const Logo = styled.img`
  width: 120px;
`;

const Button = styled.button`
  margin-left: 10px;
  background-color: ${props => props.theme.whiteColor || '#FFFFFF'};
  color: darkblue;
  border: none;
  padding: 7px 10px;
  @media (min-width: 769px) {
    padding: 10px 35px;
  }
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: ${props => props.theme.whiteColor ? `rgba(${parseHexToRgb(props.theme.whiteColor)}, 0.8)` : 'lightgray'};
  }
`;

const LanguageContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const FlagImage = styled.img`
  width: 30px;
  height: 30px;
  margin-left: 10px;
  cursor: pointer;
`;

const PopupMenu = styled.div`
  background-color: ${props => props.theme.whiteColor || '#FFFFFF'};
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 1000;

  @media (min-width: 769px) {
    position: absolute;
    right: 0;
    top: 35px;
    min-width: 400px;
    animation: ${props => props.isClosing ? slideOutDesktop : slideInDesktop} 0.3s ease-out forwards;
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
    animation: ${props => props.isClosing ? slideOut : slideIn} 0.3s ease-out forwards;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(2px);
  background-color: rgba(57, 57, 57, 0.26);
  z-index: 500;
`;

const ProfileIcon = styled(FaUserCircle)`
  color: ${props => props.theme.whiteColor || '#FFFFFF'};
  font-size: 30px;
  margin-left: 15px;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.whiteColor ? `rgba(${parseHexToRgb(props.theme.whiteColor)}, 0.8)` : 'lightgray'};
  }
`;

const DepositButton = styled(Button)`
  background-color: ${props => props.theme.secondaryColor || '#F4B600'};
  color: black;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 5px 20px !important;

  &:hover {
    background-color: ${props => props.theme.secondaryColor ? darkenColor(props.theme.secondaryColor, 0.2) : '#A67C00'};
  }
`;

const BalanceBtn = styled(Button)`
  background-color: ${props => props.theme.whiteColor || '#FFFFFF'};
  color: black;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 5px 20px !important;

  &:hover {
    background-color: ${props => props.theme.whiteColor ? `rgba(${parseHexToRgb(props.theme.whiteColor)}, 0.7)` : 'rgb(164, 164, 164)'};
  }
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  font-size: 24px;
  color: ${props => props.theme.whiteColor || '#FFFFFF'};
  cursor: pointer;
  transition: color 0.3s ease;
  margin-right: 15px;

  &:hover {
    color: ${props => props.theme.whiteColor ? `rgba(${parseHexToRgb(props.theme.whiteColor)}, 0.8)` : '#d0d0d0'};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const SpinningSyncIconLoading = styled(FaSync)`
  margin-right: 10px;
  font-size: 13px;
  text-align: center;
  animation: ${spin} 1s linear infinite;
`;

const SpinningSyncIcon = styled(FaSync)`
  margin-right: 10px;
  font-size: 13px;
  text-align: center;
`;

const parseHexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

const darkenColor = (hex, amount) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - (num >> 16) * amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - ((num >> 8) & 0x00ff) * amount);
  const b = Math.max(0, (num & 0x0000ff) - (num & 0x0000ff) * amount);
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
};

export default function Header({ sideBarCollapsed, setSideBarCollapsed, setShowPromotionSideBarPopup, showPromotionSideBarPopup ,     showPasswordChangePopup,
              setShowPasswordChangePopup}) {
  const navigate = useNavigate();
  const langPath = useLangPath();
  const { primaryColor, secondaryColor, whiteColor, websiteLogoWhite } = useSelector((state) => state.theme);

  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const languageRef = useRef(null);
  const profileMenuRef = useRef(null);

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        handleClose();
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        handleProfileMenuClose();
      }
    };

    if (showLanguagePopup || showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguagePopup, showProfileMenu]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowLanguagePopup(false);
      setIsClosing(false);
    }, 300);
  };

  const handleProfileMenuClose = () => {
    setShowProfileMenu(false);
  };

  const handleLoginClick = () => {
    navigate(langPath('login'));
  };

  const handleSignupClick = () => {
    navigate(langPath('register'));
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const balanceLoading = useSelector((state) => state.auth.balanceLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBalance());
  }, [dispatch]);

  const handleGetBalance = () => {
    dispatch(getBalance());
  };

  useEffect(() => {
    console.log('Header - showPromotionSideBarPopup:', showPromotionSideBarPopup);
  }, [showPromotionSideBarPopup]);

  return (
    <HeaderContainer theme={{ primaryColor, secondaryColor, whiteColor }}>
      {showLanguagePopup && <Overlay />}
      <div>
        <IconButton theme={{ whiteColor }} onClick={() => setSideBarCollapsed(!sideBarCollapsed)}>
          <FaBars />
        </IconButton>
        <Logo src={`${baseURL_For_IMG_UPLOAD}s/${websiteLogoWhite}`} alt="Logo" onClick={() => navigate(langPath(''))} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {!isAuthenticated ? (
          <>
            <Button
              theme={{ secondaryColor, whiteColor }}
              style={{ backgroundColor: secondaryColor }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = secondaryColor ? darkenColor(secondaryColor, 0.2) : '#A67C00')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = secondaryColor)}
              onClick={handleLoginClick}
            >
              লগ ইন
            </Button>
            <Button theme={{ whiteColor }} onClick={handleSignupClick}>
              সাইন আপ
            </Button>
          </>
        ) : (
          <>
            <DepositButton
              theme={{ secondaryColor, whiteColor }}
              style={{ display: window.innerWidth > 768 ? 'block' : 'none' }}
              onClick={() => {
                const { protocol, host, pathname } = window.location;
                const pathnameArr = pathname.split('/');
                if (pathnameArr[2] !== 'deposit') {
                  pathnameArr.splice(2, 0, 'deposit');
                }
                const depositPath = pathnameArr.join('/');
                const newUrl = `${protocol}//${host}${depositPath}`;
                window.history.replaceState({}, '', newUrl);
                setShowPromotionSideBarPopup(true); // Temporary for testing; replace with setShowDepositPopup in final version
              }}
            >
              <FaMoneyBillWave style={{ marginRight: '8px' }} />
              Deposit
            </DepositButton>
            <BalanceBtn
              theme={{ whiteColor }}
              style={{ display: window.innerWidth > 768 ? 'block' : 'none' }}
              onClick={handleGetBalance}
            >
              {balanceLoading ? <SpinningSyncIconLoading /> : <SpinningSyncIcon />}
              Main Wallet ৳{user?.balance}
            </BalanceBtn>
            <ProfileIcon
              theme={{ whiteColor }}
              style={{ display: window.innerWidth > 768 ? 'block' : 'none' }}
              onClick={handleProfileClick}
            />
            {showProfileMenu && (
              <div ref={profileMenuRef}>
                <HeaderDesktopProfileMenu
                  handleDepositPopupOpen={() => setShowPromotionSideBarPopup(true)} // Temporary; replace with setShowDepositPopup
                  handleProfileMenuClose={handleProfileMenuClose}
                  handleMyPromotionPopupOpen={() => setShowPromotionSideBarPopup(true)} // Temporary
                  handleMyPromotionPopupClose={() => setShowPromotionSideBarPopup(false)} // Temporary
                  handleVoucherPopupOpen={() => setShowPromotionSideBarPopup(true)} // Temporary
                  handleBettingRecordsPopupOpen={() => setShowPromotionSideBarPopup(true)} // Temporary
                  handlePersonalInformationPopupOpen={() => setShowPromotionSideBarPopup(true)} // Temporary
                  handleTurnoverPopupOpen={() => setShowPromotionSideBarPopup(true)} // Temporary
                  handleTransactionRecordsPopupOpen={() => setShowPromotionSideBarPopup(true)} // Temporary
                       showPasswordChangePopup={showPasswordChangePopup}
              setShowPasswordChangePopup={setShowPasswordChangePopup}
                />
              </div>
            )}
          </>
        )}
        <LanguageContainer ref={languageRef}>
          <FlagImage
            src={bd_flag}
            alt="Bangladesh Flag"
            onClick={() => setShowLanguagePopup(!showLanguagePopup)}
          />
          {showLanguagePopup && (
            <PopupMenu theme={{ whiteColor }} isClosing={isClosing}>
              <HeaderLanguageBox onClose={handleClose} />
            </PopupMenu>
          )}
        </LanguageContainer>
      </div>
    </HeaderContainer>
  );
}