import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import { useAuth } from '@/context/AuthContext';

/**
 * ALTEC Dashboard
 * AdZU Language and Technology Center
 * Focus: Language programs, technology initiatives
 */
export default function ALTECDashboard() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#7B1FA2"
      basePath="/office/altec"
      officeId={officeId}
    />
  );
}
