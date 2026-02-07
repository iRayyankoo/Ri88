"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

import ComingSoonOverlay from '@/components/Pages/ComingSoonOverlay';

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
