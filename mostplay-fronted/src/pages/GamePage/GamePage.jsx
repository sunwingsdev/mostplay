import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { baseURL } from '../../utils/baseURL';

// Styled Components
const HomeContainer = styled.div`
 // width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

const GameIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  display: block;
`;

const LoadingMessage = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  color: #000000;
`;

const ErrorMessage = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  color: #ff0000;
`;

export default function GamePage() {
  const { gameId } = useParams();
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await fetch(`${baseURL}/game/${gameId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch game data');
        }
        const data = await response.json();
        setGameData(data);
      } catch (error) {
        console.error('Error fetching game data:', error);
        setError('Failed to load game. Please try again later.');
      }
    };

    fetchGameData();
  }, [gameId]);

  return (
    <HomeContainer>
      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : gameData && gameData.link ? (
        <GameIframe
         src={gameData.link}
        //  src={"https://live.mga-1-live-1-grand.com/players/launch/eti?"}
          title="Game"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      ) : (
        <LoadingMessage>Loading...</LoadingMessage>
      )}
    </HomeContainer>
  );
}