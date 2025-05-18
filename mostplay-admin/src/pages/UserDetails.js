import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserInfo } from '../redux/userFrontend/userFrontendAPI';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaPhone, FaGlobe, FaMoneyBill, FaEdit, FaUserShield, FaChartLine, FaChevronRight } from 'react-icons/fa';
import UserDetailsEditProfile from './../components/userDetailsEditProfile/userDetailsEditProfile';
import { baseURL_For_IMG_UPLOAD } from '../utils/baseURL';

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  padding: 1.5rem;
  gap: 1rem;
  background: #f9fafb;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`;

const Sidebar = styled.div`
  flex: 0 0 20rem;
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    flex: none;
    width: 100%;
    padding: 1rem;
  }
`;

const MainContent = styled.div`
  flex: 1;
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1.5rem;
  background: #1c2937;
  border-radius: 0.375rem;
  color: #ffffff;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.75rem;
    margin-bottom: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #ffffff;

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const SummaryCard = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgb(26, 44, 65);
  border-radius: 0.375rem;
  text-align: center;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: rgb(61, 88, 118);
  }
`;

const SummaryLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 400;
`;

const SummaryValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
`;

const StatusBadge = styled.span`
  padding: 0.375rem 0.875rem;
  border-radius: 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  ${({ status }) => {
    switch (status) {
      case 'active':
        return `
          background: #16a34a;
          color: #ffffff;
        `;
      case 'banned':
        return `
          background: #dc2626;
          color: #ffffff;
        `;
      default:
        return `
          background: #6b7280;
          color: #ffffff;
        `;
    }
  }}
`;

const InfoSection = styled.div`
  margin-bottom: 1.5rem;

  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(17.5rem, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem;
  border-radius: 0.375rem;
  background: #f9fafb;
  border: 1px solid #d1d5db;
`;

const IconWrapper = styled.span`
  color: #1c2937;
  font-size: 1.25rem;
  padding: 0.5rem;
  border-radius: 50%;
  background: #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Label = styled.span`
  font-weight: 600;
  color: #000000;
  min-width: 5.625rem;
`;

const Value = styled.span`
  color: #374151;
  word-break: break-word;
  font-weight: 400;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    width: 100%;
    justify-content: space-between;
    margin-top: 0.75rem;
  }
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  background: ${({ primary }) => (primary ? '#dc2626' : '#2563eb')};
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
  outline: none;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ primary }) => (primary ? '#b91c1c' : '#1d4ed8')};
  }

  svg {
    margin-right: 0.5rem;
  }

  @media (max-width: 480px) {
    flex: 1;
    padding: 0.75rem 1rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #1c2937;
  font-size: 1.125rem;
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
`;

const ErrorAlert = styled.div`
  padding: 1rem;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 0.375rem;
  text-align: center;
  margin: 1rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
`;

// Styled Components for Phone Number Display
const PhoneNumberContainer = styled.div`
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PhoneNumberWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f9fafb;
  padding: 12px 16px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  width: 100%;
  justify-content: center;
`;

const CountryCode = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
`;

const PhoneNumber = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
`;



const VerifiedText = styled.span`
  color: #16a34a; /* Green color for verified */
  font-weight: 600;
`;

const NotVerifiedText = styled.span`
  color: #dc2626; /* Red color for not verified */
  font-weight: 600;
`;



export default function UserDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const { userInfo, userLoading, userError } = useSelector((state) => state.userCustomer);

  useEffect(() => {
    dispatch(getUserInfo(userId));
  }, [dispatch, userId]);


  
  useEffect(()=>{

    console.log(`${baseURL_For_IMG_UPLOAD}s/${userInfo?.profileImage}`);
    

  },[baseURL_For_IMG_UPLOAD,userInfo])



  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (userLoading) {
    return (
      <LoadingContainer>
        <FaUser style={{ marginRight: '0.75rem' }} /> Loading User Data...
      </LoadingContainer>
    );
  }

  if (userError) {
    return (
      <DashboardContainer>
        <ErrorAlert>
          <strong style={{ marginRight: '0.5rem' }}>Error:</strong>
          {userError}
        </ErrorAlert>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Sidebar>
        <SummaryCard className="flex items-center justify-center">
          <SummaryLabel>Image</SummaryLabel>
          <div style={{ borderRadius: '50%', width: '2.5rem', height: '2.5rem', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {userInfo?.profileImage === '' ? (
              <FaUser className="text-xl" />
            ) : (
              <img
                src={`${baseURL_For_IMG_UPLOAD}s/${userInfo?.profileImage}`}
                alt="Profile Image"
                style={{ borderRadius: '50%', width: '100%', height: '100%' }}
                onError={(e) => {
                  e.target.src = '/assets/images/user.png';
                }}
              />
            )}
          </div>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>User</SummaryLabel>
          <SummaryValue>{userInfo?.name || '-'}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>Balance</SummaryLabel>
          <SummaryValue>{userInfo?.balance !== undefined ? `${userInfo.balance.toFixed(2)}` : '-'}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>Status</SummaryLabel>
          <StatusBadge status={userInfo?.status}>
            {userInfo?.status === 'active' ? 'Active' : userInfo?.status === 'banned' ? 'Banned' : 'Inactive'}
          </StatusBadge>
        </SummaryCard>
      </Sidebar>
      <MainContent>
        {isEditing ? (
          <UserDetailsEditProfile userInfo={userInfo} onCancel={handleCancelEdit} />
        ) : (
          <>
            <Header>
              <Title>
                <FaChartLine /> User Dashboard
              </Title>
              <ButtonContainer>
                <ActionButton primary onClick={handleEditProfile}>
                  <FaEdit /> Edit Profile
                </ActionButton>
              </ButtonContainer>
            </Header>
            <InfoSection>
              <SectionTitle>Personal Information</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <IconWrapper>
                    <FaUser />
                  </IconWrapper>
                  <Label>ID:</Label>
                  <Value>{userInfo?._id || '-'}</Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaUser />
                  </IconWrapper>
                  <Label>Name:</Label>
                  <Value>{userInfo?.name || '-'}</Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaEnvelope />
                  </IconWrapper>
                  <Label>Email:</Label>
                  <Value>{userInfo?.email || '-'}</Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaPhone />
                  </IconWrapper>
                  <Label>Phone:</Label>
                  <Value>
                    <PhoneNumberContainer>
                      <PhoneNumberWrapper>
                        <CountryCode>
                          {(userInfo?.currency === 'BDT' && '+880') ||
                            (userInfo?.currency === 'INR' && '+91') ||
                            (userInfo?.currency === 'NPR' && '+977') ||
                            (userInfo?.currency === 'PKR' && '+92') ||
                            ''}
                        </CountryCode>
                        <PhoneNumber>{userInfo?.phoneNumber || '-'}</PhoneNumber>
                      </PhoneNumberWrapper>
                    </PhoneNumberContainer>
                  </Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaGlobe />
                  </IconWrapper>
                  <Label>Country:</Label>
                  <Value>{userInfo?.country || '-'}</Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaUserShield />
                  </IconWrapper>
                  <Label>Email Verified:</Label>
                  <Value>
                    {userInfo?.emailVerified ? (
                      <VerifiedText>Verified</VerifiedText>
                    ) : (
                      <NotVerifiedText>
                        <span>Unverified - OTP: {userInfo?.emailVerifyOTP}</span>
                      </NotVerifiedText>
                    )}
                  </Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaUserShield />
                  </IconWrapper>
                  <Label>Phone Verified:</Label>
                  <Value>
                    {userInfo?.phoneNumberVerified ? (
                      <VerifiedText>Verified</VerifiedText>
                    ) : (
                      <NotVerifiedText>
                        <span>Unverified - OTP: {userInfo?.phoneNumberOTP}</span>
                      </NotVerifiedText>
                    )}
                  </Value>
                </InfoItem>
              </InfoGrid>
            </InfoSection>
            <InfoSection>
              <SectionTitle>Account Details</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <IconWrapper>
                    <FaMoneyBill />
                  </IconWrapper>
                  <Label>Currency:</Label>
                  <Value>{userInfo?.currency || '-'}</Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaMoneyBill />
                  </IconWrapper>
                  <Label>Deposit:</Label>
                  <Value>{userInfo?.deposit !== undefined ? `${userInfo.deposit.toFixed(2)}` : '-'}</Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaMoneyBill />
                  </IconWrapper>
                  <Label>Withdraw:</Label>
                  <Value>{userInfo?.withdraw !== undefined ? `${userInfo.withdraw.toFixed(2)}` : '-'}</Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaUserShield />
                  </IconWrapper>
                  <Label>Role:</Label>
                  <Value>{userInfo?.role || '-'}</Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaUser />
                  </IconWrapper>
                  <Label>Player ID:</Label>
                  <Value>{userInfo?.player_id || '-'}</Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaMoneyBill />
                  </IconWrapper>
                  <Label>Promo Code:</Label>
                  <Value>{userInfo?.promoCode || '-'}</Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaMoneyBill />
                  </IconWrapper>
                  <Label>Bonus:</Label>
                  <Value>{userInfo?.bonusSelection || '-'}</Value>
                </InfoItem>
              </InfoGrid>
            </InfoSection>
            <InfoSection>
              <SectionTitle>Activity</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <IconWrapper>
                    <FaUser />
                  </IconWrapper>
                  <Label>Created:</Label>
                  <Value>{userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleString() : '-'}</Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaUser />
                  </IconWrapper>
                  <Label>Updated:</Label>
                  <Value>{userInfo?.updatedAt ? new Date(userInfo.updatedAt).toLocaleString() : '-'}</Value>
                </InfoItem>
              </InfoGrid>
            </InfoSection>
          </>
        )}
      </MainContent>
    </DashboardContainer>
  );
}