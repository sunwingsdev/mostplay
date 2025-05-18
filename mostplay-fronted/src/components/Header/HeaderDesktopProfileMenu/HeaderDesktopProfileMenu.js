import React from 'react';
import styled from 'styled-components';
import { FaCreditCard, FaMoneyBillWave, FaBullhorn, FaTicketAlt, FaClipboardList, FaChartBar, FaExchangeAlt, FaUserCircle, FaGem, FaKey, FaInbox, FaUserFriends, FaSignOutAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../features/auth/authSlice';

const ProfileMenu = styled.div`
  position: absolute;
  right: 90px;
  top: 50px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 1000;
  min-width: 230px;
  color: black;
  padding: 1rem 0;
  height: 500px;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c0c0c0;
    border-radius: 4px;
  }

  scrollbar-width: thin;
  scrollbar-color: #c0c0c0 transparent;
`;

const Username = styled.div`
  padding: 15px 20px;
  font-weight: bold;
  font-size: 16px;
  color: #111827;
  border-bottom: 1px solid #e0e0e0;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled.div`
  padding: 10px 20px;
  display: flex;
  flex-direction: ${props => (props.hasSpecialBadge ? 'column' : 'row')};
  align-items: ${props => (props.hasSpecialBadge ? 'flex-start' : 'center')};
  justify-content: ${props => (props.hasSpecialBadge ? 'flex-start' : 'space-between')};
  cursor: pointer;
  font-size: 12px;
  color: black;

  &:hover {
    background-color: #f9fafb;
  }

  i, svg {
    margin-right: 10px;
    color: black;
    font-size: 12px;
  }

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const Badge = styled.div`
  background-color: ${props => (props.isSpecial ? '#F5B600' : '#ef4444')};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  margin-top: ${props => (props.isSpecial ? '6px' : '0')};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgb(108, 108, 108);
  margin: 8px 0;
`;

const iconMap = {
  'vip-points': <FaGem />,
  'bonus-wallet': <FaMoneyBillWave />,
  'deposit': <FaCreditCard />,
  'withdraw': <FaMoneyBillWave />,
  'promotions': <FaBullhorn />,
  'voucher': <FaTicketAlt />,
  'bet-records': <FaClipboardList />,
  'turnover': <FaChartBar />,
  'transaction-records': <FaExchangeAlt />,
  'personal-info': <FaUserCircle />,
  'my-vip': <FaGem />,
  'reset-password': <FaKey />,
  'inbox': <FaInbox />,
  'refer-bonus': <FaUserFriends />,
  'logout': <FaSignOutAlt />,
};

export default function HeaderDesktopProfileMenu({ handleProfileMenuClose,handleDepositPopupOpen,handleMyPromotionPopupClose,handleMyPromotionPopupOpen,handleVoucherPopupOpen,handleBettingRecordsPopupOpen ,handlePersonalInformationPopupOpen , handleTurnoverPopupOpen , handleTransactionRecordsPopupOpen , showPasswordChangePopup , setShowPasswordChangePopup}) {
  const { language } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const menuItems =  [
    { label: 'VIP Points', path: 'vip-points', badge: '0' },
    { label: 'Bonus Wallet', path: 'bonus-wallet', badge: '৳ ০' },
    { label: 'Deposit', path: 'deposit' },
    { label: 'Withdraw', path: 'withdraw' },
    { label: 'My Promotions', path: 'promotions', badge: '0' },
    { label: 'Voucher', path: 'voucher' },

    { label: 'Bet Records', path: 'bet-records' },
    { label: 'Turnover', path: 'turnover' },
    { label: 'Transaction Records', path: 'transaction-records' },
    { label: 'Personal Info', path: 'personal-info' },
    { label: 'My VIP', path: 'my-vip' },
    { label: 'Reset Password', path: 'reset-password' },
    { label: 'Inbox', path: 'inbox', badge: '0' },
    { label: 'Refer Bonus', path: 'refer-bonus' },
    { label: 'Logout', path: 'logout' },
  ];

  const dividerIndices = language === 'bn' ? [5, 10, 13, 15] : [5, 10, 13, 15]; // Indices after 'voucher', 'refer-bonus', 'transaction-records', and 'personal-info'

  const handleMenuItemClick = (e, path) => {
    e.stopPropagation();
    console.log("Clicked path:", path);

    if (path === 'deposit') {
      handleDepositPopupOpen();
    }


    if (path === 'withdraw') {
      handleDepositPopupOpen();
    }

    if (path === 'promotions') {
      handleMyPromotionPopupOpen();
    }

    if (path === 'voucher') {
      handleVoucherPopupOpen();
    }

    if (path === 'bet-records') {
      handleBettingRecordsPopupOpen();
    }

    if (path === 'personal-info') {
      handlePersonalInformationPopupOpen();
    }

    if (path === 'turnover') {
      handleTurnoverPopupOpen();
    }

    if (path === 'transaction-records') {
      handleTransactionRecordsPopupOpen();
    }
    if (path === 'reset-password') {
    
              setShowPasswordChangePopup(true)
    }
    if (path === 'logout') {
   dispatch(logout());
    }

    handleProfileMenuClose();
  };

  return (
    <ProfileMenu onMouseDown={(e) => e.stopPropagation()}>
      <Username>roni9843</Username>
      <MenuList>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <MenuItem
              onMouseDown={(e) => handleMenuItemClick(e, item.path)}
              hasSpecialBadge={item.path === 'vip-points' || item.path === 'bonus-wallet'}
            >
              <span>
                {iconMap[item.path] || <FaUserCircle />}
                {item.label}
              </span>
              {item.badge && (
                <Badge isSpecial={item.path === 'vip-points' || item.path === 'bonus-wallet'}>
                  {item.badge}
                </Badge>
              )}
            </MenuItem>
            {dividerIndices.includes(index) && <Divider />}
          </React.Fragment>
        ))}
      </MenuList>
    </ProfileMenu>
  );
}