import React, { useContext, useEffect, lazy, Suspense } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { UserContext } from './Contexts/UserContext';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './Components/ErrorBoundary';
import Loading from './Admin/Components/Loading';

// Lazy load route components for better code splitting
const AdminRoutes = lazy(() => import('./Admin/AdminRoutes'));
const MainRoutes = lazy(() => import('./Content/MainRoutes'));

const AppRoutes = () => {
  const { verifyToken } = useContext(UserContext);
  const { user, isLoading } = useContext(UserContext);

  const fetchData = async () => {
    await verifyToken();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <HelmetProvider>
      <Router
        future={{
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route
            path="/admin/*"
            element={
              user ? (
                <ErrorBoundary context="admin">
                  <Suspense
                    fallback={
                      <div className="loading-status">
                        <div className="loading-wrapper">Loading Admin...</div>
                      </div>
                    }
                  >
                    <AdminRoutes />
                  </Suspense>
                </ErrorBoundary>
              ) : (
                <Navigate to={`/login?redirect=${encodeURIComponent('/admin')}`} replace />
              )
            }
          />
          <Route
            path="/*"
            element={
              <ErrorBoundary context="frontend">
                <Suspense
                  fallback={
                    <div className="loading-status">
                      <div className="loading-wrapper">Loading...</div>
                    </div>
                  }
                >
                  <MainRoutes />
                </Suspense>
              </ErrorBoundary>
            }
          />
        </Routes>
      </Router>
    </HelmetProvider>
  );
};

export default AppRoutes;
