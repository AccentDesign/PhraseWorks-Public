import React, { Suspense, useContext } from 'react';
import { UserContext } from './Contexts/UserContext';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Loading from './Admin/Components/Loading';
import AdminRoutes from './Admin/AdminRoutes';
import MainRoutes from './Content/MainRoutes';

const AppRoutes = ({ posts, authors }) => {
  const { user } = useContext(UserContext);

  return (
    <Router>
      <Routes>
        <Route
          path="/admin/*"
          element={user ? <AdminRoutes /> : <Navigate to="/login?redirect=/admin" replace />}
        />
        <Route path="/*" element={<MainRoutes posts={posts} authors={authors} />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
