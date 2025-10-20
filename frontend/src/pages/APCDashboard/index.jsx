import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import { useAuth } from '@/context/AuthContext';

/**
 * APC Dashboard
 * AdZU Peace Center
 * Focus: Peace education, conflict resolution programs
 */
export default function APCDashboard() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/apc"
      officeId={officeId}
    />
  );
}
