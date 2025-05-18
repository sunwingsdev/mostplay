import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import AllUser from '../pages/AllUser';
import UserDetails from '../pages/UserDetails';
import CarouselControl from '../pages/CarouselControl';
import NoticeControl from '../pages/NoticeControl';
import GameNavControl from '../pages/GameNavControl';
import GameControl from '../pages/GameControl';
import Promotion from '../pages/Promotion';
import AddDepositMethods from '../pages/AddDepositMethods';
import DepositTransaction from '../pages/DepositTransaction';
import TransactionDetails from '../pages/TransactionDetails';
import AddWithdrawMethods from './../pages/AddWithdrawMethods';
import WithdrawTransaction from '../pages/WithdrawTransaction';
import SingleWithdrawTransaction from '../pages/SingleWithdrawTransaction';
import FeaturedGame from '../pages/FeaturedGame';
import FavoritesPoster from '../pages/FavoritesPoster';

import SiteControl from '../pages/SiteControl';


const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/all-user" element={<AllUser />} />
    <Route path="/user/:userId" element={<UserDetails />} />
    <Route path="/carousel-control" element={<CarouselControl />} />
    <Route path="/notice-control" element={<NoticeControl />} />
    <Route path="/game-nav-control" element={<GameNavControl />} />
    <Route path="/game-control" element={<GameControl />} />
    <Route path="/promotion" element={<Promotion />} />
    <Route path="/Add-Deposit-Methods" element={<AddDepositMethods />} />
    <Route path="/deposit-transaction" element={<DepositTransaction />} />
    <Route path="/transaction/:id" element={<TransactionDetails />} />
    <Route path="/Add-Withdraw-Methods" element={<AddWithdrawMethods />} />
    <Route path="/Withdraw-transaction" element={<WithdrawTransaction />} />
    <Route path="/Withdraw-transaction/:id" element={<SingleWithdrawTransaction />} />
    <Route path="/favorites-poster-control" element={<FavoritesPoster />} />
    <Route path="/featured-game-control" element={<FeaturedGame />} />
    <Route path="/site-title" element={<SiteControl />} />
  </Routes>
);

export default AppRoutes;

