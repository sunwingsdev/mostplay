import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Styled components for the popup
const PopupWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const PopupContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-in-out;

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

export default function DepositPopupMenuOption() {
  const [show, setShow] = useState(false);
  const { protocol, host, pathname } = window.location;

  useEffect(() => {
    const pathnameArr = pathname.split('/');
    console.log("this is roni ", pathnameArr);

    // Check if "deposit" is already at index 2
    if (pathnameArr[2] === "deposit") {
      setShow(true); // Only insert if not already present
    }
  }, [pathname]);

  return (
    show && (
   <></>
    )
  );
}


//**
//    <PopupWrapper>
   //     <PopupContent>DepositPopupMenuOption</PopupContent>
   //   </PopupWrapper>
//  */