import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import { useAuth } from '@/context/AuthContext';

/**
 * ALTEC Dashboard
 * AdZU Language and Technology Center
 */
export default function ALTECDashboard() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/altec"
      officeId={officeId}
    />
  );
}
