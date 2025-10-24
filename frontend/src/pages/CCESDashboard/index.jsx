import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import { useAuth } from '@/context/AuthContext';

/**
 * CCES Dashboard
 * Center for Community Engagement and Service
 */
export default function CCESDashboard() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/cces"
      officeId={officeId}
    />
  );
}
