import React, { useEffect } from "react";
import { styled } from "styled-components";
import Header from "../components/Header/Header";
import HomePageSlider from "../components/HomePageSlider";
import NoticeText from "../components/NoticeText";
import HomeMenu from '../components/HomePageMenu/HomeMenu';
import Category from "../components/Category";
import HomePageMenuOption from "../components/HomePageMenu/HomePageMenuOption";
import HomePageCategorySpecial from "../components/HomePageCategorySpecialMenu";
import Sponsor from "../components/Sponsor";
import BrandAmbassador from "../components/Brand_Ambassador";
import Official_Partner from './../components/Official_Partner';
import GamingLicense from "../components/GamingLicense";
import ResponsibleGambling from "../components/ResponsibleGambling";
import CommunityWebsite from "../components/CommunityWebsite";
import PaymentMethod from "../components/PaymentMethod";
import AboutUs from "../components/AboutUs";
import MobileSidebar from "../components/Sidebar/MobileSidebar";
import CustomSidebar from "../components/Sidebar/Sidebar";
import { Helmet } from 'react-helmet';
import { useSelector } from "react-redux";
const HomeContainer = styled.div`
  padding: 0px;
  @media (min-width: 769px) {
    padding: 0 40px;
  }
`;

const Home = () => {
  


  const { loading, websiteTitle, favicon } = useSelector((state) => state.theme);


  useEffect(() => {
    console.log("5555",favicon);
    
  }, [favicon]);

  return (
   
    <div >
    <Helmet>
    <title>{websiteTitle || 'My Website'}</title>
    <link
      rel="icon"
      type="image/x-icon"
      href={`${favicon}`}
    />
  </Helmet>

    
                <HomePageSlider />
                <HomeContainer>
                  <NoticeText />
                  <HomeMenu />
                  <Category />
                 <HomePageCategorySpecial/>
                </HomeContainer>
   </div>
  );
};

export default Home;



/**
 *  <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
    {window.innerWidth <= 768 ? (
      <div style={{ position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 1000 }}>
        <MobileSidebar handleMenuSelect={"handleMenuSelect"} />
      </div>
    ) : (
      <div style={{ position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 1000 }}>
        <CustomSidebar handleMenuSelect={"handleMenuSelect"} />
      </div>
    )}
  
    <main style={{
      flex: 1,
      marginLeft: window.innerWidth <= 768 ? '0px' : '250px', // Adjust based on sidebar width
      background: '#f5f5f5',
      paddingTop: window.innerWidth <= 768 ? '60px' : '0px',
      height: '100vh',
      overflowY: 'auto'
    }}>
    <Header />
    <HomePageSlider />
                <HomeContainer>
                  <NoticeText />
                  <HomeMenu />
                  <Category />
                 <HomePageCategorySpecial/>
                 <Sponsor />
                 <BrandAmbassador />
                 <Official_Partner />
                 <GamingLicense />
                 <ResponsibleGambling />
                 <CommunityWebsite />
                 <PaymentMethod />
                 <AboutUs />
                </HomeContainer>

    </main>
  </div>
  
 */



/**
 *         <div className="pb-5 mb-5">
                <Header />
                <HomeContainer>
                  <HomePageSlider />
                  <NoticeText />
                  <HomeMenu />
                  <Category />
                 <HomePageCategorySpecial/>
                 <Sponsor />
                 <BrandAmbassador />
                 <Official_Partner />
                 <GamingLicense />
                 <ResponsibleGambling />
                 <CommunityWebsite />
                 <PaymentMethod />
                 <AboutUs />
                </HomeContainer>
              </div>
 */