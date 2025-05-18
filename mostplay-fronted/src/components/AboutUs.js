import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Row, Col } from 'react-bootstrap';
import bkash_image from '../assets/bkash.png';
import bank_deposit from '../assets/bank_deposit.png';
import rocket from '../assets/rocket.png';
import nagat from '../assets/nagat.png';
import useLangPath from '../hooks/useLangPath';

const StyledContainer = styled(Container)`
 // background-color: #f8f9fa;
  // padding: 40px;
  // border-radius: 10px;
 // box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledRow = styled(Row)`
  align-items: center;
  text-align: left;
`;

const StyledTitle = styled.h2`
  font-size: 16px;
 // font-weight: bold;
  color: #333;
 // margin-bottom: 20px;
  text-transform: uppercase;
`;

const StyledImageWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const StyledImage = styled.img`
  height: ${({ height }) => height || '100%'};
  width: ${({ width }) => width || '100%'};
  //border-radius: 50%;
`;

const StyledTextWrapper = styled.div`
  display: flex;
  background-color: #fff;
  //flex-direction: column;


  display: flex;
  align-items: center;
 // gap: 15px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

`;


const SponsorName = styled.h4`
  font-size: 12px;
  color: #222;
  margin: 5px;
  text-decoration: underline;
  cursor: pointer;
`;

const SponsorTagline = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

export default function AboutUs() {

    const langPath = useLangPath();
  const navigate = useNavigate();


  return (
    <StyledContainer className="mt-4">
      <StyledTitle>মুল্য পরিশোধ পদ্ধতি</StyledTitle>
      <StyledRow>
        <Col Col='2'>
          <StyledTextWrapper>
            <SponsorName>আমাদের সম্পর্কে</SponsorName>
            <SponsorName>যোগাযোগ করুন</SponsorName>
            <SponsorName>শর্তাবলী</SponsorName>
            <SponsorName>দায়িত্বশীল গেম্বলিং</SponsorName>
            <SponsorName>প্রশ্ন</SponsorName>
            <Link to={langPath(`affiliate`)} >
              <SponsorName>এফিলিয়েট</SponsorName>
            </Link>
          </StyledTextWrapper>
          
        </Col>
        
      </StyledRow>
    </StyledContainer>
  );
}

