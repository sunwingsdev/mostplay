import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Navbar, Button, Container, Offcanvas, Dropdown } from "react-bootstrap";
import { ChevronDown } from "lucide-react";
import logo from "../../assets/affiliate_logo.png";
import bd_flag from "../../assets/bd_flag.png";
import us_flag from "../../assets/us_flag.png";

const StyledNavbar = styled(Navbar)`
  height: 80px;
  background-color: ${({ bg }) => bg};
  padding: 0.8rem 1.5rem;

  @media (min-width: 768px) {
    height: 100px;
    padding: 1rem 2rem;
  }
`;

const StyledLogo = styled.img`
  height: 35px;

  @media (min-width: 768px) {
    height: 50px;
  }
`;

const LanguageContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  //padding: 5px;
  border: 1px solid ${({ primaryColor }) => primaryColor};
  border-radius: 5px;
  text-decoration: none;
  button {
    text-decoration: none;
  }
`;

const FlagImage = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 10px;
  border-radius: 50%;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 767px) {
    flex-direction: column;
    width: 100%;
    align-items: flex-start;
    padding: 20px;
  }
`;

export default function AffiliateHeader() {
  const primaryColor = useSelector((state) => state.theme.primaryColor);
  const secondaryColor = useSelector((state) => state.theme.secondaryColor);
  const [show, setShow] = useState(false);
  const [language, setLanguage] = useState("Bangla");

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  return (
    <>
      <StyledNavbar expand="md" variant="dark" bg={primaryColor}>
        <Container>
          <Navbar.Brand href="#">
            <StyledLogo src={logo} alt="Logo" />
          </Navbar.Brand>

          <Navbar.Toggle onClick={() => setShow(true)} />

          <Navbar.Collapse className="justify-content-end d-none d-md-flex">
            {/* Language Dropdown */}
            <LanguageContainer className="mx-4" primaryColor={secondaryColor}>
              <Dropdown>
                <Dropdown.Toggle variant="link" id="dropdown-language" className="text-white d-flex align-items-center">
                  {language === "Bangla" ? <FlagImage src={bd_flag} alt="Bangla flag" /> : <FlagImage src={us_flag} alt="English flag" />}
                  {language}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleLanguageChange("Bangla")}>
                    <FlagImage src={bd_flag} alt="Bangla flag" />
                    Bangla
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleLanguageChange("English")}>
                    <FlagImage src={us_flag} alt="English flag" />
                    English
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </LanguageContainer>

            <ButtonContainer>
              <Button variant="outline-light">Login</Button>
              <Button variant="warning" className="text-dark d-flex align-items-center">
                Sign Up 
              </Button>
            </ButtonContainer>
          </Navbar.Collapse>
        </Container>
      </StyledNavbar>

      {/* Sidebar for Mobile */}
      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        placement="start"
        style={{
          backgroundColor: primaryColor,
          width: "60%", // Set the width to 60% for mobile screens
        }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <StyledLogo src={logo} alt="Logo" />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <LanguageContainer className="my-4 mx-4" primaryColor={secondaryColor}>
            <Dropdown>
              <Dropdown.Toggle variant="link" id="dropdown-language" className="text-white d-flex align-items-center">
                {language === "Bangla" ? <FlagImage src={bd_flag} alt="Bangla flag" /> : <FlagImage src={us_flag} alt="English flag" />}
                {language}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleLanguageChange("Bangla")}>
                  <FlagImage src={bd_flag} alt="Bangla flag" />
                  Bangla
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleLanguageChange("English")}>
                  <FlagImage src={us_flag} alt="English flag" />
                  English
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </LanguageContainer>
          <ButtonContainer>
            <Button variant="outline-light" className="w-100 d-flex align-items-center justify-content-center">Login</Button>
            <Button variant="warning" className="text-dark w-100 d-flex align-items-center justify-content-center">
              Sign Up
            </Button>
          </ButtonContainer>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

