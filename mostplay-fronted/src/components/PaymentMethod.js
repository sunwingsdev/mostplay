import React from 'react';
import styled from 'styled-components';
import { Container, Row, Col } from 'react-bootstrap';
import bkash_image from '../assets/bkash.png';
import bank_deposit from '../assets/bank_deposit.png';
import rocket from '../assets/rocket.png';
import nagat from '../assets/nagat.png';

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
  flex-direction: column;
`;

const SponsorName = styled.h4`
  font-size: 18px;
  color: #222;
  margin: 0;
`;

const SponsorTagline = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

export default function PaymentMethod() {
  return (
    <StyledContainer className="mt-4">
      <StyledTitle>মুল্য পরিশোধ পদ্ধতি</StyledTitle>
      <StyledRow>
        <Col Col='2'>
          <StyledImageWrapper>
            <StyledImage src={bank_deposit} alt="Sponsor" width={50} height="auto" />
            <StyledImage src={bkash_image} alt="Sponsor" width={50} height="auto" />
            <StyledImage src={rocket} alt="Sponsor" width={50} height="auto" />
            <StyledImage src={nagat} alt="Sponsor" width={50} height="auto" />
          </StyledImageWrapper>
          
        </Col>
        
      </StyledRow>
    </StyledContainer>
  );
}
