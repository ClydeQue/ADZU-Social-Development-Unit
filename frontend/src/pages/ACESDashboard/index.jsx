import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import { useAuth } from '@/context/AuthContext';

/**
 * ACES Dashboard
 * AdZU Center for Engagement and Social Development
 * Focus: Community engagement, social development programs
 */
export default function ACESDashboard() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#388E3C"
      basePath="/office/aces"
      officeId={officeId}
    />
  );
}
