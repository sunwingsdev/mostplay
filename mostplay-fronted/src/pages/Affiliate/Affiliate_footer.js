import React from "react";
import styled from "styled-components";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaTelegram, FaWhatsapp, FaSkype, FaFacebook, FaInstagram } from "react-icons/fa";
import bg_image from "../../assets/footer_affiliate_bg.png";

const StyledFooter = styled.footer`
  background-image: url(${bg_image});
  background-size: cover;
  background-position: center;
  padding: 50px 0;
  text-align: center;
  color: white;
`;

const Title = styled.h2`
  font-weight: bold;
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  background: #f1b40f;
  border: none;
  padding: 10px 20px;
  font-size: 18px;
  font-weight: bold;
  margin: 10px;
  color:black;
  &:hover {
    background: #e0a800;
  }
`;

const SocialIcons = styled.div`
  margin: 20px 0;
  font-size: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;

  a {
    color: white;
    transition: 0.3s;
    &:hover {
      color: #f1b40f;
    }
  }
`;

const FooterLinks = styled.div`
  margin-top: 20px;
  font-size: 16px;
  a {
    color: white;
    text-decoration: none;
    margin: 0 10px;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function AffiliateFooter() {
  return (
    <StyledFooter>
      <Container>
        <Row>
          <Col md={12}>
            <Title>আজই মোস্টপ্লে অ্যাফিলিয়েটে যোগ দিন!</Title>
            <StyledButton>নিবন্ধন করুন</StyledButton>
            <StyledButton>প্রবেশ করুন</StyledButton>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <h4 className="mt-4">আমাদের কাছে পৌঁছান</h4>
            <SocialIcons>
              <a href="#"><FaTelegram /></a>
              <a href="#"><FaWhatsapp /></a>
              <a href="#"><FaSkype /></a>
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaInstagram /></a>
            </SocialIcons>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <FooterLinks>
              <a href="#">প্রশ্ন</a> | 
              <a href="#">বিধি - নিষেধ এবং শর্তাবলী</a>
            </FooterLinks>
          </Col>
        </Row>
      </Container>
    </StyledFooter>
  );
}
