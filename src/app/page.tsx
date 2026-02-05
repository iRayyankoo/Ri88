"use client";
import React from 'react';
import ComingSoonOverlay from '@/components/Pages/ComingSoonOverlay';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleUnlock = () => {
    // Redirect to the PRO app
    router.push('/pro');
  };

  return (
    <ComingSoonOverlay onUnlock={handleUnlock} />
  );
}
