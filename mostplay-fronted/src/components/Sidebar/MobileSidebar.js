import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaTimes, FaFacebookF, FaTelegramPlane, FaEnvelope, FaHome, FaMoneyBillAlt, FaChevronRight } from 'react-icons/fa';
import { MdOutlineSupportAgent } from 'react-icons/md';
import { RiArrowRightSLine, RiLoginCircleLine, RiUserAddLine } from 'react-icons/ri';
import home_menu_1_blue from '../../assets/home_menu_1_blue.png';
import sidebarCoin from '../../assets/mobileSideBarImage.png';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useLangPath from '../../hooks/useLangPath';
import { logout } from '../../features/auth/authSlice';
import MobileSidebarProfilePage from './MobileSidebarProfilePage';
import { baseURL_For_IMG_UPLOAD } from '../../utils/baseURL';

const CloseButton = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 26px;
  margin-bottom: 10px;
  color: #fff;
  cursor: pointer;
`;

const SidebarOverlay = styled.div`
  position: fixed;
  top: 0;
  opacity: ${({ open }) => (open ? '1' : '0')};
  background-color: ${({ open }) => (open ? '#06152378' : 'transparent')};
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  z-index: 998;
  display: ${({ open }) => (open ? 'block' : 'none')};
`;

const SidebarContent = styled.div`
  position: fixed;
  top: 0;
  left: ${({ open }) => (open ? '0' : '-100%')};
  width: 100%;
  height: 100%;
  z-index: 999;
  transition: 0.3s;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const Header = styled.div`
  background: #054ea1;
  color: white;
  text-align: center;
  font-weight: bold;
  border-radius: 5px 5px 0px 0px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  background: #4b6cb6;
  color: white;
  padding: 10px 0;
  border-radius: 0px 0px 5px 5px;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 5px;
  padding: 10px 0px;
`;

const MenuGridOption = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  padding: 10px 0px;
`;

const MenuItem = styled.div`
  background-color: #fff;
  padding: 0.5rem;
  border-radius: 0.25rem;
  text-align: center;
  font-size: 0.75rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  opacity: ${({ open }) => (open ? '1' : '0')};
  transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-20px)')};
  animation: ${({ open }) => (open ? 'slideInLeft 0.5s ease forwards' : 'none')};
  animation-delay: ${({ index }) => (index ? `${index * 0.1}s` : '0s')};

  &:hover {
    background-color: #f0f0f0;
    box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.2);
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const Section = styled.div`
  background: #e9e9e9;
  border-radius: 5px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 15px 0;
  background: #e9e9e9;
  color: black;
  margin-top: 10px;
  border-radius: 5px;

  & > div {
    opacity: ${({ open }) => (open ? '1' : '0')};
    transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-20px)')};
    animation: ${({ open }) => (open ? 'slideInLeft 0.5s ease forwards' : 'none')};
    animation-delay: ${({ index }) => (index ? `${index * 0.1}s` : '0s')};
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const SubOption = styled.div`
  background-color: #ffffff57;
  padding: 0.5rem;
  border-radius: 0.25rem;
  text-align: center;
  font-size: 0.75rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
  overflow-y: auto;
  max-height: 700px;

  & > div {
    opacity: ${({ open }) => (open ? '1' : '0')};
    transform: ${({ open }) => (open ? 'translateY(0)' : 'translateY(-20px)')};
    animation: ${({ open }) => (open ? 'slideInTop 0.5s ease forwards' : 'none')};
    animation-delay: ${({ index }) => (index ? `${index * 0.1}s` : '0s')};
  }

  &:hover {
    box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.2);
  }

  @keyframes slideInTop {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MobileSidebar = ({
  collapsed,
  setSideBarCollapsed,
  handleMenuSelect,
  showDepositPopup,
  setShowDepositPopup,
  showPromotionPopup,
  setShowPromotionPopup,
  showVoucherPopup,
  setShowVoucherPopup,
  showHandleBettingRecordsPopup,
  setShowHandleBettingRecordsPopup,
  showPersonalInformationPopup,
  setShowPersonalInformationPopup,
  showTurnoverPopup,
  setShowTurnoverPopup,
  showTransactionRecordsPopup,
  setShowTransactionRecordsPopup,
  showPromotionSideBarPopup,
  setShowPromotionSideBarPopup,


       showPasswordChangePopup,
              setShowPasswordChangePopup,
  
}) => {
  const { homeGameMenu, isLoading, isError } = useSelector((state) => state.homeGameMenu);
  const langPath = useLangPath();
  const dispatch = useDispatch();
  const { language } = useSelector((state) => state.theme);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [profilePage, setProfilePage] = useState(false);
  const [activeOption, setActiveOption] = useState([]);
  const [animateSubOptions, setAnimateSubOptions] = useState(false);

  // Debug: Log props
  useEffect(() => {
    console.log('MobileSidebar - Props:', { showDepositPopup, setShowDepositPopup });
  }, [showDepositPopup, setShowDepositPopup]);

  useEffect(() => {
    if (activeOption.length > 0) {
      setAnimateSubOptions(false);
      setTimeout(() => setAnimateSubOptions(true), 10);
    } else {
      setAnimateSubOptions(false);
    }
  }, [activeOption]);

  const handlePopupOpen = (setPopupState, path) => () => {
    console.log(`MobileSidebar - handlePopupOpen called for: ${path}`);
    setSideBarCollapsed(false); // Close the sidebar
    if (path === 'deposit') {
      // Update URL for Deposit
      const { protocol, host, pathname } = window.location;
      const pathnameArr = pathname.split('/');
      if (pathnameArr[2] !== 'deposit') {
        pathnameArr.splice(2, 0, 'deposit');
      }
      const depositPath = pathnameArr.join('/');
      const newUrl = `${protocol}//${host}${depositPath}`;
      window.history.replaceState({}, '', newUrl);
    }
    setPopupState(true);
    console.log(`MobileSidebar - Set ${path} popup state to true`);
  };

  return (
    <>
      <SidebarOverlay open={collapsed} onClick={() => setSideBarCollapsed(!collapsed)} />
      <SidebarContent open={collapsed}>
        <CloseButton
          onClick={() => {
            setProfilePage(false);
            setSideBarCollapsed(!collapsed);
          }}
        >
          <FaTimes />
        </CloseButton>

        <div className="row m-0 p-0">
          <div className={`col-${profilePage ? '12' : '8'}`}>
            {isAuthenticated ? (
              <Header style={{ display: 'flex', alignItems: 'center' }}>
                <img src={sidebarCoin} alt="sports" style={{ width: '100px', marginLeft: '10px', color: '#F4B600' }} />
                {!profilePage && (
                  <span style={{ color: '#f4b600' }} onClick={() => setProfilePage(true)}>
                    {language === 'en' && 'Profile'}
                    {language === 'bd' && 'প্রোফাইল'}
                    {language === 'in' && 'प्रोफाइल'}
                    {language === 'pk' && 'پروفائل'}
                    {language === 'np' && 'प्रोफाइल'}
                    <FaChevronRight style={{ fontSize: '1rem', marginLeft: '10px' }} />
                  </span>
                )}
              </Header>
            ) : (
              <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <img src={sidebarCoin} alt="sports" style={{ width: '100px' }} />
                <span style={{ color: '#f4b600' }}>
                  {language === 'en' && 'Hi, Welcome'}
                  {language === 'bd' && 'হাই স্বাগতম'}
                  {language === 'in' && 'नमस्ते, स्वागत है'}
                  {language === 'pk' && 'ہیلو، خوش آمدید'}
                  {language === 'np' && 'नमस्ते, स्वागत छ'}
                  <RiArrowRightSLine />
                </span>
              </Header>
            )}

            {isAuthenticated ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#4b6cb6',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '0px 0px 5px 5px',
                }}
              >
                <div>
                  <div>
                    {language === 'en' && 'Main Wallet'}
                    {language === 'bd' && 'মেইন ওয়ালেট'}
                    {language === 'in' && 'मुख्य वॉलेट'}
                    {language === 'pk' && 'مین والیٹ'}
                    {language === 'np' && 'मुख्य वालेट'}
                  </div>
                  <div>
                    {language === 'en' && `$ ${user?.balance || 0}`}
                    {language === 'bd' && `৳ ${user?.balance || 0}`}
                    {language === 'in' && `₹ ${user?.balance || 0}`}
                    {language === 'pk' && `₨ ${user?.balance || 0}`}
                    {language === 'np' && `रु ${user?.balance || 0}`}
                  </div>
                </div>
                <div>
                  {profilePage ? (
                    <div>
                      <div>
                        {language === 'en' && 'Bonus Wallet'}
                        {language === 'bd' && 'বনাস ওয়ালেট'}
                        {language === 'in' && 'बोनस वॉलेट'}
                        {language === 'pk' && 'بونس والیٹ'}
                        {language === 'np' && 'बोनस वालेट'}
                      </div>
                      <div>
                        {language === 'en' && '$ 0'}
                        {language === 'bd' && '৳ 0'}
                        {language === 'in' && '₹ 0'}
                        {language === 'pk' && '₨ 0'}
                        {language === 'np' && 'रु 0'}
                      </div>
                    </div>
                  ) : (
                    <FaMoneyBillAlt style={{ fontSize: '1.5rem' }} />
                  )}
                </div>
              </div>
            ) : (
              <ButtonGroup>
                <Link to={langPath('login')} style={{ color: 'white', textDecoration: 'none' }}>
                  <div>
                    <RiLoginCircleLine />
                    {language === 'en' && 'Log In'}
                    {language === 'bd' && 'লগ ইন'}
                    {language === 'in' && 'लॉग इन'}
                    {language === 'pk' && 'لاگ ان'}
                    {language === 'np' && 'लग इन'}
                  </div>
                </Link>
                <Link to={langPath('register')}>
                  <div style={{ color: '#f4b600' }}>
                    <RiUserAddLine />
                    {language === 'en' && 'Sign Up'}
                    {language === 'bd' && 'সাইন আপ'}
                    {language === 'in' && 'साइन अप'}
                    {language === 'pk' && 'سائن اپ'}
                    {language === 'np' && 'سाइन अप'}
                  </div>
                </Link>
              </ButtonGroup>
            )}

            {profilePage ? (
              <div>
                <MobileSidebarProfilePage
               
           setProfilePage={setProfilePage}
            setSideBarCollapsed={setSideBarCollapsed}
            collapsed={collapsed}
                  setShowDepositPopup={setShowDepositPopup}
                  setShowPromotionPopup={setShowPromotionPopup}
                  setShowVoucherPopup={setShowVoucherPopup}
                  setShowHandleBettingRecordsPopup={setShowHandleBettingRecordsPopup}
                  setShowPersonalInformationPopup={setShowPersonalInformationPopup}
                  setShowTurnoverPopup={setShowTurnoverPopup}
                  setShowTransactionRecordsPopup={setShowTransactionRecordsPopup}
                   showPasswordChangePopup={showPasswordChangePopup}
              setShowPasswordChangePopup={setShowPasswordChangePopup}
                />
              </div>
            ) : (
              <div>
                {homeGameMenu && !isLoading && !isError && (
                  <MenuGrid>
                    {homeGameMenu?.menuOptions?.map((item, index) => (
                      <MenuItem
                        key={index}
                        open={collapsed}
                        index={index}
                        style={item === '' ? { backgroundColor: 'transparent', boxShadow: 'none' } : {}}
                      >
                        {item !== '' && (
                          <div onClick={() => setActiveOption(item?.subOptions || [])}>
                            <img
                              src={`${baseURL_For_IMG_UPLOAD}s/${item.image}`}
                              alt='sports'
                              style={{
                                width: '25px',
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                marginBottom: '5px',
                              }}
                            />
                            {language === 'bd' ? item.titleBD : item.title}
                          </div>
                        )}
                      </MenuItem>
                    ))}
                  </MenuGrid>
                )}

                {isAuthenticated && (
                  <Section style={{ marginTop: '10px' }}>
                    <MenuGridOption>
                      {[
                        { label: 'ডিপোজিট', path: 'deposit', action: handlePopupOpen(setShowDepositPopup, 'deposit') },
                        { label: 'প্রমোশন', path: 'promotions', action: handlePopupOpen(setShowPromotionPopup, 'promotions') },
                        { label: 'ভাউচার', path: 'voucher', action: handlePopupOpen(setShowVoucherPopup, 'voucher') },
                        { label: 'বেটিং রেকর্ড', path: 'bet-records', action: handlePopupOpen(setShowHandleBettingRecordsPopup, 'bet-records') },
                        { label: 'ব্যক্তিগত তথ্য', path: 'personal-info', action: handlePopupOpen(setShowPersonalInformationPopup, 'personal-info') },
                        { label: 'টার্নওভার', path: 'turnover', action: handlePopupOpen(setShowTurnoverPopup, 'turnover') },
                        { label: 'ট্রানজেকশন রেকর্ড', path: 'transaction-records', action: handlePopupOpen(setShowTransactionRecordsPopup, 'transaction-records') },
                      ].map((item, index) => (
                        <MenuItem
                          key={index}
                          open={collapsed}
                          index={index + 9}
                          onClick={item.action}
                        >
                          <img
                            src={home_menu_1_blue}
                            alt='icon'
                            style={{
                              width: '25px',
                              display: 'block',
                              marginLeft: 'auto',
                              marginRight: 'auto',
                              marginBottom: '5px',
                            }}
                          />
                          {item.label}
                        </MenuItem>
                      ))}
                    </MenuGridOption>
                  </Section>
                )}

                <Section>
                  <MenuGridOption>
                    {['এফিলিয়েট', 'লিডারবোর্ড', 'স্পন্সর', 'ব্লগ'].map((item, index) => (
                      <MenuItem
                        key={index}
                        open={collapsed}
                        index={index + 16}
                        style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
                      >
                        <img
                          src={home_menu_1_blue}
                          alt='sports'
                          style={{
                            width: '25px',
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginBottom: '5px',
                          }}
                        />
                        {item}
                      </MenuItem>
                    ))}
                  </MenuGridOption>
                </Section>

                <Footer open={collapsed}>
                  <div index={19} style={{ marginRight: '0px' }}>
                    <FaHome style={{ fontSize: '20px' }} />
                  </div>
                  <div index={20}>
                    {language === 'bd' && 'হোম'}
                    {language === 'in' && 'होम'}
                    {language === 'pk' && 'ہوم'}
                    {language === 'np' && 'होम'}
                    {language === 'en' && 'Home'}
                  </div>
                  <div index={21} style={{ marginRight: '0px' }}>
                    <FaMoneyBillAlt style={{ fontSize: '20px' }} />
                  </div>
                  {isAuthenticated ? (
                    <div
                      onClick={() => {
                        dispatch(logout());
                      }}
                      index={22}
                    >
                      {language === 'bd' && 'লগ আউট'}
                      {language === 'in' && 'लॉग आउट'}
                      {language === 'pk' && 'لاگ آوٹ'}
                      {language === 'np' && 'लॉگ آउट'}
                      {language === 'en' && 'Log Out'}
                    </div>
                  ) : (
                    <Link style={{ color: 'inherit', textDecoration: 'inherit' }} to={langPath(`login`)} index={22}>
                      {language === 'bd' && 'লগ ইন'}
                      {language === 'in' && 'लॉग इन'}
                      {language === 'pk' && 'لاگ ان'}
                      {language === 'np' && 'लگ इन'}
                      {language === 'en' && 'Log In'}
                    </Link>
                  )}
                </Footer>
              </div>
            )}
          </div>

          <div className={`col-${profilePage ? '0' : '4'}`}>
            {activeOption.length > 0 && (
              <SubOption open={animateSubOptions}>
                {activeOption &&
                  activeOption.map((item, index) => (
                    <Link
                      onClick={() => setSideBarCollapsed(!collapsed)}
                      to={langPath(`game/${item._id}`)}
                      style={{ color: 'inherit', textDecoration: 'inherit' }}
                      key={index}
                    >
                      <div className="my-3" style={{ color: 'white' }} index={index}>
                        <img
                          src={item?.image}
                          alt='sports'
                          style={{
                            width: '50px',
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginBottom: '5px',
                          }}
                        />
                        {item?.title}
                      </div>
                    </Link>
                  ))}
              </SubOption>
            )}
          </div>
        </div>
      </SidebarContent>
    </>
  );
};

export default MobileSidebar;