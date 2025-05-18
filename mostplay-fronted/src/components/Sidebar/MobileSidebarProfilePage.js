import React from 'react';
import styled from 'styled-components';
import {
  RiMoneyDollarCircleLine,
  RiBankCardLine,
  RiCouponLine,
  RiGiftLine,
  RiFileList2Line,
  RiBarChartLine,
  RiFileCheckLine,
  RiUserLine,
  RiLockLine,
  RiMailLine,
  RiUserAddLine,
  RiTelegramLine,
  RiFacebookLine,
  RiInstagramLine,
  RiTwitterLine,
  RiPinterestLine,
  RiYoutubeLine,
  RiTeamLine,
  RiCustomerService2Line,
  RiMailSendLine,
  RiChat1Line,
} from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const PageContainer = styled.div`
  max-width: 28rem;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #fff;
  font-family: sans-serif;
  font-size: 11px;
  color: #2f4f6f;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h2`
  font-size: 11px;
  font-weight: normal;
  margin-bottom: 0.5rem;
`;

const Card = styled.div`
  background-color: #f9f9f9;
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  width: ${props => props.width || 'auto'};
  min-width: ${props => props.minWidth || 'auto'};
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
    border-radius: 0.25rem;
  }
`;

const ItemIcon = styled.div`
  font-size: 1.5rem;
  color: #2f4f6f;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #e0e0e0;
`;

const ItemText = styled.span`
  font-size: 10px;
  color: #2f4f6f;
  text-align: center;
`;

const LogoutButton = styled.button`
  width: 100%;
  background-color: #f5b800;
  color: #000;
  font-size: 11px;
  font-weight: normal;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  margin-top: 0.5rem;
`;

const MobileSidebarProfilePage = ({
  setShowDepositPopup,
  setShowPromotionPopup,
  setShowVoucherPopup,
  setShowHandleBettingRecordsPopup,
  setShowPersonalInformationPopup,
  setShowTurnoverPopup,
  setShowTransactionRecordsPopup,
    setProfilePage,
            setSideBarCollapsed,
            collapsed,
             showPasswordChangePopup,
              setShowPasswordChangePopup,
}) => {
  const dispatch = useDispatch();

  const fundsItems = [
    { icon: <RiMoneyDollarCircleLine />, text: 'Deposit', path: 'deposit', alt: 'Icon representing Deposit' },
    { icon: <RiBankCardLine />, text: 'Withdraw', path: 'deposit', alt: 'Icon representing Withdraw' },
    { icon: <RiCouponLine />, text: 'My Promotion', path: 'promotions', alt: 'Icon representing My Promotion' },
    { icon: <RiGiftLine />, text: 'Voucher', path: 'voucher', alt: 'Icon representing Voucher' },
  ];

  const historyItems = [
    { icon: <RiFileList2Line />, text: 'Betting Records', path: 'bet-records', alt: 'Icon representing Betting Records' },
    { icon: <RiBarChartLine />, text: 'Turnover', path: 'turnover', alt: 'Icon representing Turnover' },
    { icon: <RiFileCheckLine />, text: 'Transaction Records', path: 'transaction-records', alt: 'Icon representing Transaction Records' },
  ];

  const myItems = [
    { icon: <RiUserLine />, text: 'Personal Info', path: 'personal-info', alt: 'Icon representing Personal Info' },
    { icon: <RiLockLine />, text: 'Reset Password', path: 'reset-password', alt: 'Icon representing Reset Password' },
    { icon: <RiMailLine />, text: 'Inbox', path: 'inbox', alt: 'Icon representing Inbox' },
    { icon: <RiUserAddLine />, text: 'Refer Bonus', path: 'refer-bonus', alt: 'Icon representing Refer Bonus' },
  ];

  const socialItems = [
    { icon: <RiTelegramLine />, text: 'Telegram', path: 'telegram', alt: 'Icon representing Telegram' },
    { icon: <RiFacebookLine />, text: 'Facebook', path: 'facebook', alt: 'Icon representing Facebook' },
    { icon: <RiInstagramLine />, text: 'Instagram', path: 'instagram', alt: 'Icon representing Instagram' },
    { icon: <RiTwitterLine />, text: 'Twitter', path: 'twitter', alt: 'Icon representing Twitter' },
    { icon: <RiPinterestLine />, text: 'Pinterest', path: 'pinterest', alt: 'Icon representing Pinterest' },
    { icon: <RiYoutubeLine />, text: 'Youtube', path: 'youtube', alt: 'Icon representing Youtube' },
  ];

  const contactItems = [
    { icon: <RiTeamLine />, text: 'About Us', path: 'about-us', alt: 'Icon representing About Us' },
    { icon: <RiCustomerService2Line />, text: 'Contact Us', path: 'contact-us', alt: 'Icon representing Contact Us' },
    { icon: <RiTelegramLine />, text: 'Telegram Support', path: 'telegram-support', alt: 'Icon representing Telegram Support' },
    { icon: <RiFacebookLine />, text: 'Facebook', path: 'facebook-contact', alt: 'Icon representing Facebook' },
    { icon: <RiChat1Line />, text: 'Channel', path: 'channel', alt: 'Icon representing Channel' },
    { icon: <RiMailSendLine />, text: 'Email', path: 'email', alt: 'Icon representing Email' },
  ];

  const handleItemClick = (path) => {
    console.log(`MobileSidebarProfilePage - Clicked: ${path}`);
    if (path === 'deposit') {
        setProfilePage(false);
            setSideBarCollapsed(!collapsed);
      const { protocol, host, pathname } = window.location;
      const pathnameArr = pathname.split('/');
      if (pathnameArr[2] !== 'deposit') {
        pathnameArr.splice(2, 0, 'deposit');
         setProfilePage(false);
            setSideBarCollapsed(!collapsed);
      }
      const depositPath = pathnameArr.join('/');
      const newUrl = `${protocol}//${host}${depositPath}`;
      window.history.replaceState({}, '', newUrl);
      setShowDepositPopup(true);
    } else if (path === 'promotions') {
           setProfilePage(false);
            setSideBarCollapsed(!collapsed);
      setShowPromotionPopup(true);
    } else if (path === 'voucher') {
        setProfilePage(false);
            setSideBarCollapsed(!collapsed);
      setShowVoucherPopup(true);
    } else if (path === 'bet-records') {
        setProfilePage(false);
            setSideBarCollapsed(!collapsed);
      setShowHandleBettingRecordsPopup(true);
    } else if (path === 'personal-info') {
        setProfilePage(false);
            setSideBarCollapsed(!collapsed);
      setShowPersonalInformationPopup(true);
    } else if (path === 'turnover') {
        setProfilePage(false);
            setSideBarCollapsed(!collapsed);
      setShowTurnoverPopup(true);
    } else if (path === 'transaction-records') {
        setProfilePage(false);
            setSideBarCollapsed(!collapsed);
      setShowTransactionRecordsPopup(true);
    }
     else if (path === 'reset-password') {
        setProfilePage(false);
            setSideBarCollapsed(!collapsed);
              setShowPasswordChangePopup(true);
    }
    // Add navigation or other actions for social/contact items if needed
  };

  return (
    <PageContainer>
      <Section>
        <SectionTitle>Funds</SectionTitle>
        <Card>
          {fundsItems.map((item, index) => (
            <Item key={index} width="25%" onClick={() => handleItemClick(item.path)}>
              <ItemIcon>{item.icon}</ItemIcon>
              <ItemText>{item.text}</ItemText>
            </Item>
          ))}
        </Card>
      </Section>

      <Section>
        <SectionTitle>History</SectionTitle>
        <Card>
          {historyItems.map((item, index) => (
            <Item key={index} width="25%" onClick={() => handleItemClick(item.path)}>
              <ItemIcon>{item.icon}</ItemIcon>
              <ItemText>{item.text}</ItemText>
            </Item>
          ))}
        </Card>
      </Section>

      <Section>
        <SectionTitle>My</SectionTitle>
        <Card>
          {myItems.map((item, index) => (
            <Item key={index} width="20%" onClick={() => handleItemClick(item.path)}>
              <ItemIcon>{item.icon}</ItemIcon>
              <ItemText>{item.text}</ItemText>
            </Item>
          ))}
        </Card>
      </Section>

      <Section>
        <SectionTitle>Social</SectionTitle>
        <Card>
          {socialItems.map((item, index) => (
            <Item key={index} width="20%" minWidth="56px" onClick={() => handleItemClick(item.path)}>
              <ItemIcon>{item.icon}</ItemIcon>
              <ItemText>{item.text}</ItemText>
            </Item>
          ))}
        </Card>
      </Section>

      <Section>
        <SectionTitle>Contact Us</SectionTitle>
        <Card>
          {contactItems.map((item, index) => (
            <Item key={index} width="20%" minWidth="72px" onClick={() => handleItemClick(item.path)}>
              <ItemIcon>{item.icon}</ItemIcon>
              <ItemText>{item.text}</ItemText>
            </Item>
          ))}
        </Card>
      </Section>

      <LogoutButton onClick={() => dispatch(logout())}>Log out</LogoutButton>
    </PageContainer>
  );
};

export default MobileSidebarProfilePage;