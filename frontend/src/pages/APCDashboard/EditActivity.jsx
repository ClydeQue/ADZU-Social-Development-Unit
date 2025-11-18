import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import EditActivityForm from '@/components/EditActivityForm';
import { useAuth } from '@/context/AuthContext';

/**
 * APC Edit Activity Page
 */
export default function APCEditActivity() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/apc"
      officeId={officeId}
    >
      <EditActivityForm 
        officeId={officeId}
        basePath="/office/apc"
        officeColor="#040195"
      />
    </OfficeDashboardLayout>
  );
}
