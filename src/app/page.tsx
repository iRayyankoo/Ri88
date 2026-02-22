"use client";
import AppShell from '@/components/Navigation/AppShell';
import { useNavigation } from '@/context/NavigationContext';
import VisitorLanding from '@/components/Pages/VisitorLanding';
import UserDashboard from '@/components/Pages/UserDashboard';

export default function Home() {
  const { userRole } = useNavigation();

  return (
    <AppShell>
      {userRole === 'visitor' ? <VisitorLanding /> : <UserDashboard />}
    </AppShell>
  );
}
