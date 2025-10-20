import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import { useAuth } from '@/context/AuthContext';

/**
 * ACCA Dashboard
 * AdZU Center for Culture and the Arts
 * Focus: Cultural events, arts programs, performances
 */
export default function ACCADashboard() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/acca"
      officeId={officeId}
    />
  );
}
