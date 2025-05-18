import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

// Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Affiliate from "../pages/Affiliate/Affiliate";
import GameViewSection from "../pages/Game Menu Page/GameViewSection";

// Components
import ProtectedRoute from "./ProtectedRoute";
import CustomSideBarProvider from "../components/Sidebar/CustomSideBarProvider";
import { setLanguage } from "../features/theme/themeSlice";
import PaymentGetawayPage from "../pages/paymentGetawayPage/PaymentGetawayPage";
import GamePage from "../pages/GamePage/GamePage";

// Lang Syncer: Set lang in Redux from URL param
const LangSyncer = () => {
  const { lang } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLanguage(lang));
  }, [lang, dispatch]);

  return null;
};

const LocalizedRoutes = () => {
  const { lang } = useParams();
  const supportedLangs = ["en", "bd", "in", "pk", "np"];

  if (!supportedLangs.includes(lang)) {
    return <Navigate to="/en/" replace />;
  }

  return (
    <>
      <LangSyncer />
      <Routes>
        <Route
          path=""
          element={
            <CustomSideBarProvider>
              <Home />
            </CustomSideBarProvider>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="affiliate" element={<Affiliate />} />
        <Route
          path="game/:menuId"
          element={
            <ProtectedRoute>
              <CustomSideBarProvider>
                <GameViewSection />
              </CustomSideBarProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="game-page/:gameId"
          element={
            <ProtectedRoute>
              <CustomSideBarProvider>
                <GamePage />
              </CustomSideBarProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-getaway"
          element={
            <ProtectedRoute>
              <PaymentGetawayPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={`/${lang}`} replace />} />
      </Routes>
    </>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/en" />} />
        <Route path="/:lang/*" element={<LocalizedRoutes />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
