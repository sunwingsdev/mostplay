import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import StatCard from './StatCard';
import { FaClock, FaGamepad, FaHourglass, FaMoneyBill, FaMoneyBillWave, FaMoneyCheck, FaMoneyCheckAlt, FaPlay, FaRobot, FaShieldAlt, FaStop, FaUserCheck, FaUserFriends, FaUserPlus, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCustomer } from '../../redux/userFrontend/userFrontendAPI';
import { baseURL } from '../../utils/baseURL';

const Card = styled.div`
  background: linear-gradient(to right, #000000, #333333);
  color: #ffff00;
  padding: 20px;
  border-radius: 16px;
  min-height: 120px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  font-family: 'Segoe UI', sans-serif;

  &:hover {
    transform: scale(1.03);
  }
`;

const Value = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
`;

const Title = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-top: 6px;
`;

const Icon = styled.div`
  font-size: 2.4rem;
  margin-bottom: 10px;
`;

export default function DashboardLayout() {
  const navigate = useNavigate();

  const [allUserValue,setAllUserValue] = useState(0)

  const { isLoading, isError, customerInfo, errorMessage } = useSelector(state => state.userCustomer);

  useEffect(() => {
    if (isLoading) {
      setAllUserValue('Loading...')
    } else if (isError) {
      setAllUserValue(errorMessage)
    } else {
      setAllUserValue(customerInfo?.length || 0)
    }
  }, [isLoading, isError, customerInfo, errorMessage])

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCustomer());
  }, [dispatch])

  const [pendingDepositTransactions, setPendingDepositTransactions] = useState(0);
  const [pendingWithdrawTransactions, setPendingWithdrawTransactions] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [todayDeposit, setTodayDeposit] = useState(0);
  const [todayWithdraw, setTodayWithdraw] = useState(0);

  useEffect(() => {
    const fetchAllDepositTransactions = async () => {
      setPendingDepositTransactions('Loading...');
      setTotalDeposit('Loading...');
      setTodayDeposit('Loading...');
      try {
        const response = await fetch(`${baseURL}/deposit-transaction`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch deposit transactions');
        }
        const data = await response.json();
        const filteredData = data.data.filter((transaction) => transaction.status === 'pending');
        setPendingDepositTransactions(filteredData.length);
        
        const totalAmount = data.data
          .filter((transaction) => transaction.status === 'completed')
          .reduce((sum, transaction) => {
            let promotionValue = 0;
            if (transaction.promotionBonus) {
              if (transaction.promotionBonus.bonus_type === 'Fix') {
                promotionValue = transaction.promotionBonus.bonus;
              } else if (transaction.promotionBonus.bonus_type === 'Percentage') {
                promotionValue = (transaction.amount * transaction.promotionBonus.bonus) / 100;
              }
            }
            return sum + transaction.amount + promotionValue;
          }, 0);
        setTotalDeposit(totalAmount);

        const last24Hours = new Date();
        last24Hours.setHours(last24Hours.getHours() - 24);
        const todayAmount = data.data
          .filter((transaction) => transaction.status === 'completed' && new Date(transaction.createdAt) >= last24Hours)
          .reduce((sum, transaction) => {
            let promotionValue = 0;
            if (transaction.promotionBonus) {
              if (transaction.promotionBonus.bonus_type === 'Fix') {
                promotionValue = transaction.promotionBonus.bonus;
              } else if (transaction.promotionBonus.bonus_type === 'Percentage') {
                promotionValue = (transaction.amount * transaction.promotionBonus.bonus) / 100;
              }
            }
            return sum + transaction.amount + promotionValue;
          }, 0);
        setTodayDeposit(todayAmount);
        
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch deposit transactions';
        setPendingDepositTransactions(errorMessage);
        setTotalDeposit(errorMessage);
        setTodayDeposit(errorMessage);
      }
    };

    const fetchAllWithdrawTransactions = async () => {
      setPendingWithdrawTransactions('Loading...');
      setTotalWithdraw('Loading...');
      setTodayWithdraw('Loading...');
      try {
        const response = await fetch(`${baseURL}/withdraw-transaction`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch withdraw transactions');
        }
        const data = await response.json();
        const filteredData = data.data.filter((transaction) => transaction.status === 'pending');
        setPendingWithdrawTransactions(filteredData.length);
        const totalAmount = data.data
          .filter((transaction) => transaction.status === 'completed')
          .reduce((sum, transaction) => sum + transaction.amount, 0);
        setTotalWithdraw(totalAmount);

        const last24Hours = new Date();
        last24Hours.setHours(last24Hours.getHours() - 24);
        const todayAmount = data.data
          .filter((transaction) => transaction.status === 'completed' && new Date(transaction.createdAt) >= last24Hours)
          .reduce((sum, transaction) => sum + transaction.amount, 0);
        setTodayWithdraw(todayAmount);
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch withdraw transactions';
        setPendingWithdrawTransactions(errorMessage);
        setTotalWithdraw(errorMessage);
        setTodayWithdraw(errorMessage)
      }
    };

    fetchAllDepositTransactions();
    fetchAllWithdrawTransactions();
  }, []);


  const statsDataForUserRow = [
    { title: 'Total User', value: allUserValue, icon: <FaUsers />, route: '/all-user' },

    { title: 'Total Affiliator', value: '0', icon: <FaUserFriends />, route: '/' },
    { title: 'Total Wallet Agent', value: '0', icon: <FaUserCheck />, route: '/' },
    { title: 'Total White Lebel', value: '0', icon: <FaShieldAlt />, route: '/' },
  ];

  const statsDataForGameRow = [

    { title: 'Total Game', value: '0', icon: <FaGamepad />, route: '/' },
    { title: 'Active Game', value: '0', icon: <FaPlay />, route: '/' },
    { title: 'Dative Game', value: '0', icon: <FaStop />, route: '/' },
    { title: 'Total Game API', value: '0', icon: <FaRobot />, route: '/' },
  ];

  const statsDataForMoneyRow = [
    { title: 'Total Deposit', value: totalDeposit, icon: <FaMoneyCheck />, route: '/Deposit-transaction' },
    { title: 'Today Deposit', value:  todayDeposit, icon: <FaMoneyCheckAlt />, route: '/Deposit-transaction' },
    { title: 'Total Withdraw', value: totalWithdraw, icon: <FaMoneyBill />, route: '/Withdraw-transaction' },
    { title: 'Today Withdraw', value: todayWithdraw, icon: <FaMoneyBillWave />, route: '/Withdraw-transaction' },
  ];

  const statsPendingDepositRequestRow = [
    { title: 'Deposit Request', value: pendingDepositTransactions, icon: <FaClock />, route: '/Deposit-transaction' },
    { title: 'Withdraw Request', value: pendingWithdrawTransactions, icon: <FaHourglass />, route: '/Withdraw-transaction' },
    { title: 'Affiliate Signup req', value: '0', icon: <FaUserPlus />, route: '/' },
    { title: 'Wallet Agent Signup req', value: '0', icon: <FaUserFriends />, route: '/' },
  ];

  const handleCardClick = (route) => {

    console.log(route);
    

    navigate(route);
  };

  return (
    <div>
      <div className='my-3' style={{ border: '5px dotted red', margin: '5px', padding: '10px', borderRadius: '8px' }}>
        <div className='row p-0 m-0'>
          {statsDataForUserRow.map((stat, index) => (
            <StatCard
              key={index}
              themeColor={"#b81e2d"}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              onClick={() => handleCardClick(stat.route)}
            />
          ))}
        </div>
      </div>
      <div className='my-3' style={{ border: '5px dotted red', margin: '5px', padding: '10px', borderRadius: '8px' }}>
        <div className='row p-0 m-0'>
          {statsDataForGameRow.map((stat, index) => (
            <StatCard
              key={index}
              themeColor={"#45f82a"}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              onClick={() => handleCardClick(stat.route)}
            />
          ))}
        </div>
      </div>
      <div className='my-3' style={{ border: '5px dotted red', margin: '5px', padding: '10px', borderRadius: '8px' }}>
        <div className='row p-0 m-0'>
          {statsDataForMoneyRow.map((stat, index) => (
            <StatCard
              key={index}
              themeColor={"#010fe5"}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              onClick={() => handleCardClick(stat.route)}
            />
          ))}
        </div>
      </div>
      <div className='my-3' style={{ border: '5px dotted red', margin: '5px', padding: '10px', borderRadius: '8px' }}>
        <div className='row p-0 m-0'>
          {statsPendingDepositRequestRow.map((stat, index) => (
            <StatCard
              key={index}
              themeColor={"#e91e63"}
              title={stat.title.length > 20 ? `${stat.title.slice(0, 17)}...` : stat.title}
              value={stat.value}
              icon={stat.icon}
              onClick={() => handleCardClick(stat.route)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

