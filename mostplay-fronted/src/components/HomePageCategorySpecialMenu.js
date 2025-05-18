import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { baseURL, baseURL_For_IMG_UPLOAD } from '../utils/baseURL';

const CategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const VerticalLine = styled.div`
  width: 2px;
  height: 30px;
  background-color: #F7DC6F;
  margin: 0 10px;
`;

const Title = styled.h2`
  font-size: 18px;
`;

const ImageMap = styled.div`
  display: flex;
  overflow-x: scroll;
  justify-content: start;
  width: 100%;
  padding-left: 10px;
  padding: 5px;

  /* WebKit-based browsers (Chrome, Safari) */
  &::-webkit-scrollbar {
    height: 2px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: red;
    border-radius: 10px;
  }

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #F8B704;
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  background-color: white;
  border-radius: 10px;
`;

const Image = styled.img`
  width: 200px;
  height: auto;
  border-radius: 10px;
  cursor: pointer; /* Add cursor pointer to indicate clickability */

  @media (min-width: 768px) {
    width: 250px;
  }
`;

const ImageText = styled.p`
  margin-top: 5px;
  font-size: 14px;
  padding-left: 10px;
  color: #333;
`;

export default function HomePageCategorySpecial() {
  const [games, setGames] = useState({ titleBD: '', items: [] });

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${baseURL}/featured-games`);
        const data = await response.json();
        if (data.success) {
          setGames({
            titleBD: data.data.titleBD,
            items: data.data.items,
          });
        } else {
          console.error('Failed to fetch Featured Games:', data.message);
        }
      } catch (error) {
        console.error('Error fetching Featured Games:', error);
      }
    };

    fetchGames();
  }, []);

  return (
    <CategoryContainer>
      <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', marginBottom: '20px' }}>
        <VerticalLine style={{ marginLeft: '10px', height: '30px', border: '2px solid #F7DC6F' }} />
        <Title style={{ textAlign: 'center', margin: '0px' }}>
          {games.titleBD || 'বৈশিষ্ট্যযুক্ত গেম'}
        </Title>
      </div>
      <ImageMap>
        {games.items.length > 0 ? (
          games.items.map((item, index) => (
            <ImageWrapper key={index}>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                <Image src={`${baseURL_For_IMG_UPLOAD}s/${item.image}`} alt={item.titleBD} />
              </a>
              <ImageText>{item.titleBD}</ImageText>
            </ImageWrapper>
          ))
        ) : (
          <p>No games available</p>
        )}
      </ImageMap>
    </CategoryContainer>
  );
}