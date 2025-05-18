import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import home_menu_1 from "../../assets/home_menu_1.png";
import home_menu_1_blue from "../../assets/home_menu_1_blue.png";
import HomePageMenuOption from './HomePageMenuOption';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeGameMenu } from '../../features/home-game-menu/GameHomeMenuSliceAndThunks';
import { baseURL_For_IMG_UPLOAD } from '../../utils/baseURL';


const MenuContainer = styled.div`
  margin-top: ${props => `${props.marginTop}px` || "20px"};
  width: 100%;
  height: 70px; // Ensure consistent height
  padding: 0 16px;  // Remove extra padding on top/bottom
  background-color: ${props => props.bdColor};
  overflow-x: auto;
  overflow-y: hidden; // Prevent vertical scroll
  scrollbar-width: thin;
  scrollbar-color: ${props => props.bdColor};
  display: flex;
  align-items: center;  // Center items vertically
  border-radius: 5px;
  &::-webkit-scrollbar {
    height: 6px;
  };

  &::-webkit-scrollbar-track {
    background: ${props => props.bdColor};
  }

  &::-webkit-scrollbar-thumb {
    background: #054EA1;
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    height: auto;
    border-radius: 5px;
  }
`;


const MenuWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 0rem;
  max-width: 1200px;
  margin: 0;
  flex-wrap: nowrap;
  white-space: nowrap; // Prevents items from wrapping


  @media (max-width: 768px) {
    justify-content: flex-start;
    gap: 0.5rem;

  }
`;



/**
 *  headerBgColor: '#fbff05',
 *  headerMenuBgColor: '#2ce250',
      headerMenuBgHoverColor: '#ff0000',
      subOptionBgHoverColor: '#ff8b4d',
 */

const MenuItem = styled.div`
  padding: 20px;
  margin: 5px;
  height: 100%; // Ensure it takes full height
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: ${props => props.isActive ? props.bdColor : props.bdColorALL};
  color: ${props => props.isActive ? props.bdColorALL : props.bdColor};
  padding: 0 12px; // Adjust horizontal padding only
  border-radius: 6px;
  min-width: 90px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background-color: ${props => props.hoverColor };
    color: ${props =>  props.bdColor}
  }

  @media (max-width: 768px) {
    padding: 10px;
  }

  @media (max-width: 480px) {
    min-width: 60px;
  }
`;



const MenuImage = styled.img`
  width: 24px;  // Increase for desktop
  height: 24px;
  display: block;
  margin: 0 auto 0.4rem;
  
  margin-top: 5px;

  @media (max-width: 768px) {
    width: 24px;  
    height: 24px;
  }

  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
    margin-bottom: 0.2rem;
  }
`;


const MenuText = styled.div`
  font-size: 12px;  // Make it larger on desktop
  font-family: 'Arial', sans-serif;
  font-weight: 700;
  white-space: nowrap;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 12px;
    font-weight: 700;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    font-weight: 700;
  }
`;


export default function HomeMenu() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [subMenu,setSubmenu] = useState([]);



  const { homeGameMenu, isLoading, isSuccess, isError, errorMessage } = useSelector(
    (state) => state.homeGameMenu
  );

  const { language } = useSelector((state) => state.theme);



  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchHomeGameMenu());
  }, [dispatch]);

  useEffect(() => {
 
    if(homeGameMenu?.menuOptions?.length){
      setSubmenu(homeGameMenu?.menuOptions[0]?.subOptions || [])
    }
   

  }, [homeGameMenu])
  


  if (isLoading) {
    return (
      <div style={{marginBottom : `${homeGameMenu?.gameNavMenuMarginBottom}px`  } }>
        <MenuContainer 
        marginTop={ homeGameMenu?.gameBoxMarginTop }
        marginBottom={ homeGameMenu?.headerMarginBottom }
        bdColor={ homeGameMenu?.headerMenuBgColor }
        >
     
        </MenuContainer>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{marginBottom : `${homeGameMenu?.gameNavMenuMarginBottom}px`  } }>
        <MenuContainer 
        marginTop={ homeGameMenu?.gameBoxMarginTop }
        marginBottom={ homeGameMenu?.headerMarginBottom }
        bdColor={ homeGameMenu?.headerMenuBgColor }
        >
        <div style={{display : 'flex', justifyContent : 'center', alignItems : 'center', color : 'red'}}>Error: {errorMessage}</div>
        </MenuContainer>
      </div>
    );
  }

  const menuItems = [
    { title: "Dashboard" },
    { title: "Analytics" },
    { title: "Reports" },
    { title: "Settings" },
    { title: "Users" },
    { title: "Projects" },
    { title: "Tasks" },
    { title: "Calendar" },
   ];




  return (
    <div style={{marginBottom : `${homeGameMenu?.gameNavMenuMarginBottom}px`  } }>
    <MenuContainer 
    marginTop={ homeGameMenu?.gameBoxMarginTop }
    marginBottom={ homeGameMenu?.headerMarginBottom }
    bdColor={ homeGameMenu?.headerBgColor }
    >
    <MenuWrapper>
      {homeGameMenu && homeGameMenu?.menuOptions?.map((item, index) => (
        <MenuItem 
        bdColor={homeGameMenu?.headerMenuBgColor}
         bdColorALL={ homeGameMenu?.headerBgColor }
         hoverColor = {homeGameMenu?.headerMenuBgHoverColor}
          key={index}
          isActive={index === activeIndex}
          onClick={() =>{
              setActiveIndex(index === activeIndex ? null : index);
              setSubmenu(item.subOptions)
            }}
        >
          <MenuImage 
            src={`${baseURL_For_IMG_UPLOAD}s/${item.image}`}
            alt={`${item.title} icon`}
          />
          <MenuText>{language === "bd" ? item.titleBD : item.title}</MenuText>
        </MenuItem>
      ))}
    </MenuWrapper>
  </MenuContainer>
{ subMenu &&  <HomePageMenuOption hoverColor={homeGameMenu.subOptionBgHoverColor} subMenu={subMenu} /> }
    </div>

  );
}


