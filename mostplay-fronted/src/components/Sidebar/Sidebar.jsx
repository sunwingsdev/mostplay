import React, { useEffect } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu, ProSidebarProvider } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';


import {
  FaUsers,
  FaCogs,
  FaGamepad,
  FaWallet,
  FaSignOutAlt,
  FaChartLine,
  FaUserPlus,
  FaUserCheck,
  FaUserTimes,
  FaMobileAlt,
  FaEnvelope,
  FaRocket,
  FaPlusCircle,
  FaMoneyBillWave,
  FaHistory,
  FaCog,
  FaSlidersH,
  FaImage,
  FaCopyright,
  FaTrophy,
  FaUserFriends,
  FaCashRegister,
  FaListAlt,
  FaBars,
  FaHome,
} from 'react-icons/fa';

import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeGameMenu } from '../../features/home-game-menu/GameHomeMenuSliceAndThunks';
import useLangPath from '../../hooks/useLangPath';
import { baseURL_For_IMG_UPLOAD } from '../../utils/baseURL';

const SidebarWrapper = styled.div`
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: sticky;
  top: 0;
  //background: linear-gradient(180deg, #2c3e50 0%, #1a2634 100%);
  background-color:#fff !important;
  color: #163E91;


  .submenu-popup {
  position: absolute; /* or fixed depending on your structure */
  z-index: 9999; /* make sure it's higher than carousel */
}


  .css-dip3t8 {
    background-color:#fff !important;
  }
  .ps-sidebar-root {
    border: none;
    transition: all 0.3s ease;
  }

  .ps-menu-button {
    padding: 10px 20px !important;
    transition: all 0.3s ease;
  }

  .ps-menu-button:hover {
    background:rgb(189, 189, 189) !important;
    padding-left: 25px !important;
  }

  .ps-menuitem-root {
    font-size: 1rem;
    font-weight: 500;
  }

  .ps-submenu-content {
    background:#F2F2F2 !important;
  }

  @media (max-width: 768px) {
    .ps-menuitem-root {
      font-size: 0.8rem;
    }
  }
`;

const SidebarHeader = styled.div`
  padding: 0 15px;
 height: 60px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 10px;
  //display: flex;
 // justify-content: space-between;

  display: flex;
  justify-content: center;

  align-items: center;
  background-color: #163E91 !important;

`;

const SidebarFooter = styled.div`
  padding: 10px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
`;

const CustomSidebar = ({ collapsed, toggleSidebar, handleMenuSelect,setSideBarCollapsed ,setShowPromotionSideBarPopup}) => {
  const dispatch = useDispatch();
  const langPath = useLangPath();


  const { homeGameMenu, isLoading, isError, errorMessage } = useSelector(
    (state) => state.homeGameMenu
  );

   const { language } = useSelector((state) => state.theme);




 


  const onMenuSelect = (label) => {
   



  };

  return (
    <SidebarWrapper>
      <Sidebar
      
      collapsed={collapsed} className="sidebar"   >
        <SidebarHeader>
          <span 
            style={{
              textAlign: "center",
              backgroundColor: "white",
              width: "100%",
              padding: "8px",
              borderRadius: "10px",
              color: "black",
              margin: "0px",
              fontSize: collapsed ? "10px" : "16px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis"
            }}
          >
          🥎  { language === "pk" && " پاکستان" }
            { language === "in" && " भ रत" }
            { language === "np" && " न प ल" }
            { language === "en" && " Cricket" }
            { language === "bd" && " ক্রিকেট" }
          </span>
        </SidebarHeader>

        <Menu>
         
          <Link style={{ color: 'inherit', textDecoration: 'inherit' }}  to={langPath(``)}>
          
          <MenuItem
          icon={<FaHome size={16} />}
        
          onClick={() => onMenuSelect('Home')}
        >
          {language === "pk" && "پاکستان"}
          {language === "in" && "भारत"}
          {language === "np" && "नेपाल"}
          {language === "en" && "Home"}
          {language === "bd" && "হোম"}
          </MenuItem>
          </Link>
          

          {
            homeGameMenu && isLoading === false && homeGameMenu?.menuOptions?.map( m => <SubMenu key={m._id} onClick={() => {
              if (collapsed) {
              setSideBarCollapsed(false);
              }
            }}  
            label={language === "bd" ? m.titleBD : m.title}
             icon={<img src={`${baseURL_For_IMG_UPLOAD}s/${m.image}`} alt={m.title} style={{width: "16px", height: "16px"}} />}>
          

            {
              m?.subOptions?.map( s => 
                <Link to={langPath(`game/${s._id}`)} style={{ color: 'inherit', textDecoration: 'inherit' }} >
                <MenuItem key={s._id} icon={<img src={`${baseURL_For_IMG_UPLOAD}s/${s.image}`} alt={m.title} style={{width: "16px", height: "16px"}} />} onClick={() => onMenuSelect(s.title)}>
                {language === "bd" ? s.titleBD : s.title}
              </MenuItem>
                 </Link>
            
            )
            }

         
         
     
            </SubMenu> )
          }

          
       <Link style={{ color: 'inherit', textDecoration: 'inherit' }} 
       
       //to={langPath(`promotion`)}
       onClick={() => setShowPromotionSideBarPopup(true)}
       
       >
          
          <MenuItem
          icon={<FaChartLine size={16} />}
        
          onClick={() => onMenuSelect('Promotion')}
        >
          {language === "pk" && "پروموشن"}
          {language === "in" && "प्रोमोशन"}
          {language === "np" && "प्रोमोसन"}
          {language === "en" && "Promotion"}
          {language === "bd" && "প্রমোশন"}
          </MenuItem>
          </Link>
          

        
            </Menu>
            </Sidebar> 
            </SidebarWrapper> 
  )
}



export default CustomSidebar;
