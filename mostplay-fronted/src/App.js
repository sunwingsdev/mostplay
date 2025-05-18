import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AppRoutes from './routes/AppRoutes';
import GlobalStyles from './styles/GlobalStyles';
import { useDispatch, useSelector } from 'react-redux';
import { checkToken } from './features/auth/authThunks';
import { fetchThemeConfig } from './features/theme/themeSlice';
import styled, { keyframes } from 'styled-components';
import icon_2 from './assets/14061.ico';
// Loading animation keyframes
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled components for loading screen
const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease-in;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 6px solid #e2e8f0;
  border-top: 6px solid #5a67d8;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: 1.5rem;
  color: #4a5568;
  font-size: 1.1rem;
  font-weight: 500;
`;

function App() {
  const { token, tokenLoading } = useSelector((state) => state.auth);
  const { loading, websiteTitle, favicon } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(checkToken());
      
    }
  }, [token, dispatch]);

  useEffect(() => {
    dispatch(fetchThemeConfig());
  }, [dispatch]);




  if (tokenLoading || loading) {
    return (
      <LoadingOverlay>
        <Spinner />
        <LoadingText>Loading...</LoadingText>
      </LoadingOverlay>
    );
  }

  return (
    <>
    <Helmet>
      <title>{websiteTitle || 'My Website'}</title>
      <link
        rel="icon"
      //  type="image/x-icon"
        href={`${favicon}?v=${Date.now()}`}
      />
    </Helmet>
  
  
      <GlobalStyles />
      <AppRoutes />
    </>
  );
}

export default App;