import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import useLangPath from '../../hooks/useLangPath';
import { useSelector } from 'react-redux';
import { baseURL_For_IMG_UPLOAD } from '../../utils/baseURL';

const OptionWrapper = styled(Link)`
  // height: 50px;
  background-color: white;
  border-radius: 5px;
  margin-bottom: 5px; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: black;

  &:hover {
    background-color: ${props => props.hoverColor };
    color:  white
  }

  @media (max-width: 768px) {
    padding: 10px;
    img {
      width: 50px;
    }
  }
  @media (min-width: 769px) {
    padding: 10px;
    img {
      width: 30px;
    }
  }
`;

const OptionText = styled.span`
  text-align: center;
`;

export default function HomePageMenuOption({subMenu,hoverColor}) {

  const langPath = useLangPath();

  const { language } = useSelector((state) => state.theme);


  return (
    <div className='row mt-2 m-0 p-0'>
      {subMenu.map((item, index) => (
        <div className='col-4 col-md-2 p-1 m-0' key={index}>
          <OptionWrapper 
          to={langPath(`game/${item._id}`)}
      
            hoverColor={hoverColor}
          >
            <img src={`${baseURL_For_IMG_UPLOAD}s/${item.image}`} alt={`Menu option `} />
            <OptionText>{language === "bd" ? item.titleBD : item.title}</OptionText>
          </OptionWrapper>
        </div>
      ))}
    </div>
  );
}

