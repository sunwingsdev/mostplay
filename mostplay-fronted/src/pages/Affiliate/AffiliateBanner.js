import React from 'react'
import styled from 'styled-components';
import banner from '../../assets/affiliate_banner.jpg';


const BannerImage = styled.img`
  width: 100%;
  height: auto;
`;

export default function AffiliateBanner() {
  return (
    <BannerImage src={banner} alt="Banner" />
  )
}

