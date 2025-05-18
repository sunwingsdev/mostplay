import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { getNotices } from '../features/notice/NoticeControlThunk';

const scroll = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const NoticeTextStyled = styled.div`
  overflow: hidden;
  div {
    white-space: nowrap;
    animation: ${scroll} 10s linear infinite;
    display: flex;
    align-items: center;
  }
`;

export default function NoticeText() {
  const dispatch = useDispatch();
  
  const { language } = useSelector((state) => state.theme);

  const { title,titleBD, emoji, active, isLoading, isSuccess, isError, errorMessage, successMessage } = useSelector((state) => state.noticeControl);




  useEffect(() => {
    dispatch(getNotices());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{errorMessage}</div>;
  }

  if (!active) {
    return null;
  }

  return (
    <div className='d-flex mt-4'>
      <div className='px-2'>{emoji}</div>
      <NoticeTextStyled>
        <div>
          {language === "bd" ? (titleBD ? <span>{titleBD}</span> : 'No notices available') : (title ? <span>{title}</span> : 'No notices available')}
        </div>
      </NoticeTextStyled>
    </div>
  );
}

