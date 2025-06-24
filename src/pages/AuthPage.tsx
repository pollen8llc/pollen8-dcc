
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import Auth from '@/pages/Auth';

const AuthPage = () => {
  const { session } = useSession();
  
  // If user is already logged in, redirect to appropriate dashboard
  if (session) {
    return <Navigate to="/" replace />;
  }
  
  return <Auth />;
};

export default AuthPage;
