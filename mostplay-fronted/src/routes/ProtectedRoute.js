// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   return isAuthenticated ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;


// components/PrivateRoute.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    // যদি লগইন এর প্রসেস চলছে, তাহলে লডিং এর এনিমেশন দেখাও
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    console.log(error);
    
    // যদি লগইন এর সময় কোন এরর হয়, তাহলে টোস্ট দেখাও
    //toast.error(error);
  }

  if (!isAuthenticated) {
    // যদি লগইন না করা থাকে, তাহলে current location রাখো এবং লগইন এ পাঠাও
    return <Navigate to={`/${location.pathname.split("/")[1]}/login`} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
