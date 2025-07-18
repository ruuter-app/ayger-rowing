import React from 'react';
import { useAuth } from '../components/auth/AuthContext';
import { LoginForm } from '../components/auth/LoginForm';
import { Navbar } from '../components/layout/Navbar';
import { Navigate } from 'react-router-dom';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <>
      <Navbar />
      <Navigate to={user.role === 'athlete' ? '/athlete/dashboard' : '/coach/dashboard'} replace />
    </>
  );
};

export default Index;
