import React, { useEffect, useState } from 'react';
import { ProSidebarProvider } from 'react-pro-sidebar';
import Header from '../Header/Header';
import MobileSidebar from './MobileSidebar';
import CustomSidebar from './Sidebar';
import Sponsor from '../Sponsor';
import BrandAmbassador from '../Brand_Ambassador';
import Official_Partner from '../Official_Partner';
import GamingLicense from '../GamingLicense';
import ResponsibleGambling from '../ResponsibleGambling';
import CommunityWebsite from '../CommunityWebsite';
import PaymentMethod from '../PaymentMethod';
import AboutUs from '../AboutUs';
import styled from 'styled-components';
import { fetchHomeGameMenu } from '../../features/home-game-menu/GameHomeMenuSliceAndThunks';
import { useDispatch } from 'react-redux';
import DepositPopupMenuOption from '../PopupMenuOption/DepositPopupMenuOption';
import Deposit from '../../pages/Deposit/Deposit';
import HeaderPromotionProfileMenu from '../../pages/Promotion/HeaderPromotionProfileMenu';
import Voucher from '../../pages/Voucher/Voucher';
import BettingRecords from '../../pages/BettingRecords/BettingRecords';
import PersonalInformation from '../../pages/PersonalInformation/PersonalInformation';
import Turnover from '../../pages/Turnover/Turnover';
import TransactionRecords from '../../pages/TransactionRecords/TransactionRecords';
import PromotionSideBar from '../../pages/PromotionSideBar/PromotionSideBar';
import PasswordChange from '../../pages/PasswordChange/PasswordChange';

const HomeContainer = styled.div`
  padding: 0px;
  @media (min-width: 769px) {
    padding: 0 40px;
  }
`;

export default function CustomSideBarProvider({ children }) {
  const dispatch = useDispatch();

  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [showPromotionSideBarPopup, setShowPromotionSideBarPopup] = useState(false);
  const [showDepositPopup, setShowDepositPopup] = useState(false);
  const [showPromotionPopup, setShowPromotionPopup] = useState(false);
  const [showVoucherPopup, setShowVoucherPopup] = useState(false);
  const [showHandleBettingRecordsPopup, setShowHandleBettingRecordsPopup] = useState(false);
  const [showPersonalInformationPopup, setShowPersonalInformationPopup] = useState(false);
  const [showTurnoverPopup, setShowTurnoverPopup] = useState(false);
  const [showTransactionRecordsPopup, setShowTransactionRecordsPopup] = useState(false);
  const [showPasswordChangePopup, setShowPasswordChangePopup] = useState(false);

  // Debug: Log showDepositPopup changes
  useEffect(() => {
    console.log('CustomSideBarProvider - showDepositPopup:', showDepositPopup);
  }, [showDepositPopup]);

  useEffect(() => {
    dispatch(fetchHomeGameMenu());
  }, [dispatch]);

  return (
    <div>
      <ProSidebarProvider>
        <div style={{ display: 'flex', height: '100%' }}>
          {window.innerWidth <= 768 ? (
            <MobileSidebar
              collapsed={sideBarCollapsed}
              setSideBarCollapsed={setSideBarCollapsed}
              handleMenuSelect={'handleMenuSelect'}
              showDepositPopup={showDepositPopup}
              setShowDepositPopup={setShowDepositPopup}
              showPromotionPopup={showPromotionPopup}
              setShowPromotionPopup={setShowPromotionPopup}
              showVoucherPopup={showVoucherPopup}
              setShowVoucherPopup={setShowVoucherPopup}
              showHandleBettingRecordsPopup={showHandleBettingRecordsPopup}
              setShowHandleBettingRecordsPopup={setShowHandleBettingRecordsPopup}
              showPersonalInformationPopup={showPersonalInformationPopup}
              setShowPersonalInformationPopup={setShowPersonalInformationPopup}
              showTurnoverPopup={showTurnoverPopup}
              setShowTurnoverPopup={setShowTurnoverPopup}
              showTransactionRecordsPopup={showTransactionRecordsPopup}
              setShowTransactionRecordsPopup={setShowTransactionRecordsPopup}
              showPromotionSideBarPopup={showPromotionSideBarPopup}
              setShowPromotionSideBarPopup={setShowPromotionSideBarPopup}
              showPasswordChangePopup={showPasswordChangePopup}
              setShowPasswordChangePopup={setShowPasswordChangePopup}
            />
          ) : (
            <CustomSidebar
              setShowPromotionSideBarPopup={setShowPromotionSideBarPopup}
              setSideBarCollapsed={setSideBarCollapsed}
              collapsed={sideBarCollapsed}
              handleMenuSelect={'handleMenuSelect'}
            />
          )}
          <main
            style={{
              flex: 1,
              background: '#f5f5f5',
              height: '100vh',
              overflowY: 'auto',
            }}
          >
            <Header
              showPromotionSideBarPopup={showPromotionSideBarPopup}
              setShowPromotionSideBarPopup={setShowPromotionSideBarPopup}
              setSideBarCollapsed={setSideBarCollapsed}
              sideBarCollapsed={sideBarCollapsed}
                   showPasswordChangePopup={showPasswordChangePopup}
              setShowPasswordChangePopup={setShowPasswordChangePopup}
            />
            {children}
            <DepositPopupMenuOption />
            <HomeContainer>
              <Sponsor />
              <BrandAmbassador />
              <Official_Partner />
              <GamingLicense />
              <ResponsibleGambling />
              <CommunityWebsite />
              <PaymentMethod />
              <AboutUs />
            </HomeContainer>
            {/* Render all popups */}
            <Deposit isOpen={showDepositPopup} onClose={() => setShowDepositPopup(false)} />
            <HeaderPromotionProfileMenu isOpen={showPromotionPopup} onClose={() => setShowPromotionPopup(false)} />
            <Voucher isOpen={showVoucherPopup} onClose={() => setShowVoucherPopup(false)} />
            <BettingRecords isOpen={showHandleBettingRecordsPopup} onClose={() => setShowHandleBettingRecordsPopup(false)} />
            <PersonalInformation isOpen={showPersonalInformationPopup} onClose={() => setShowPersonalInformationPopup(false)} />
            <Turnover isOpen={showTurnoverPopup} onClose={() => setShowTurnoverPopup(false)} />
            <TransactionRecords isOpen={showTransactionRecordsPopup} onClose={() => setShowTransactionRecordsPopup(false)} />
            <PromotionSideBar isOpen={showPromotionSideBarPopup} onClose={() => setShowPromotionSideBarPopup(false)} />
            <PasswordChange isOpen={showPasswordChangePopup} onClose={() => setShowPasswordChangePopup(false)} />

            

          </main>
        </div>
      </ProSidebarProvider>
    </div>
  );
}