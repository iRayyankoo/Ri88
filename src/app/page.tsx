"use client";
import React from 'react';
import ComingSoonOverlay from '@/components/Pages/ComingSoonOverlay';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace('/pro');
  }, [router]);

  return null;
}
