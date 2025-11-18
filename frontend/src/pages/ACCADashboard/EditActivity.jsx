import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import EditActivityForm from '@/components/EditActivityForm';
import { useAuth } from '@/context/AuthContext';

/**
 * ACCA Edit Activity Page
 */
export default function ACCAEditActivity() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/acca"
      officeId={officeId}
    >
      <EditActivityForm 
        officeId={officeId}
        basePath="/office/acca"
        officeColor="#040195"
      />
    </OfficeDashboardLayout>
  );
}
