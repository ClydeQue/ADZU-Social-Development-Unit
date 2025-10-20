import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import { useAuth } from '@/context/AuthContext';

/**
 * ACLG Dashboard
 * AdZU Center for Local Governance
 * Focus: Local governance programs, community development
 */
export default function ACLGDashboard() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/aclg"
      officeId={officeId}
    />
  );
}
