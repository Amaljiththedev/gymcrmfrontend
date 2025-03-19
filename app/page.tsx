"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/src/store/hooks';
import HeroSection from '@/components/Hero';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Once loading is finished and the user is authenticated,
    // redirect based on the user role.
    if (!loading && isAuthenticated && user) {
      if (user.role === 'manager') {
        router.push('/admin/dashboard');
      } else if (user.role === 'staff') {
        router.push('/staff/admin');
      }
    }
  }, [isAuthenticated, user, loading, router]);

  // Optionally, display a loader while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, display the landing page (HeroSection)
  return (
    <div>
      <HeroSection />
    </div>
  );
};

export default HomePage;
