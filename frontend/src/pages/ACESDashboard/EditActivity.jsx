import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import EditActivityForm from '@/components/EditActivityForm';
import { useAuth } from '@/context/AuthContext';

/**
 * ACES Edit Activity Page
 */
export default function ACESEditActivity() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/aces"
      officeId={officeId}
    >
      <EditActivityForm 
        officeId={officeId}
        basePath="/office/aces"
        officeColor="#040195"
      />
    </OfficeDashboardLayout>
  );
}
