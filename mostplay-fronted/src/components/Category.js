import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { baseURL, baseURL_For_IMG_UPLOAD } from '../utils/baseURL';

// Styled components for the popup
const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  border-radius: 10px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: #fff;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 20px;
  z-index: 1001;
`;

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

const Image = styled.img`
  width: 300px;
  height: auto;
  margin-right: 10px;
  border-radius: 10px;
  cursor: pointer; /* Add cursor pointer to indicate clickability */

  @media (min-width: 768px) {
    width: 350px;
  }
`;

export default function Category() {
  const [poster, setPoster] = useState({ titleBD: '', images: [] });
  const [selectedImage, setSelectedImage] = useState(null); // State for the popup image

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        const response = await fetch(`${baseURL}/favorites-poster`);
        const data = await response.json();
        if (data.success) {
          setPoster({
            titleBD: data.data.titleBD,
            images: data.data.images,
          });
        } else {
          console.error('Failed to fetch Favorites Poster:', data.message);
        }
      } catch (error) {
        console.error('Error fetching Favorites Poster:', error);
      }
    };

    fetchPoster();
  }, []);

  // Function to handle image click
  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  // Function to close the popup
  const handleClosePopup = () => {
    setSelectedImage(null);
  };

  return (
    <CategoryContainer>
      <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', marginBottom: '20px' }}>
        <VerticalLine style={{ marginLeft: '10px', height: '30px', border: '2px solid #F7DC6F' }} />
        <Title style={{ textAlign: 'center', margin: '0px' }}>
          {poster.titleBD || 'প্রিয়'}
        </Title>
      </div>
      <ImageMap>
        {poster.images.length > 0 ? (
          poster.images.map((url, index) => (
            <Image
              key={index}
              src={`${baseURL_For_IMG_UPLOAD}s/${url}`}
              alt={`Poster ${index}`}
              onClick={() => handleImageClick(url)} // Add click handler
            />
          ))
        ) : (
          <p>No images available</p>
        )}
      </ImageMap>

      {/* Popup for displaying the full-size image */}
      {selectedImage && (
        <PopupOverlay onClick={handleClosePopup}>
          <PopupImage src={`${baseURL_For_IMG_UPLOAD}s/${selectedImage}`} alt="Full-size poster" />
          <CloseButton onClick={handleClosePopup}>×</CloseButton>
        </PopupOverlay>
      )}
    </CategoryContainer>
  );
}