import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import AddActivityForm from '@/components/AddActivityForm';
import { useAuth } from '@/context/AuthContext';

/**
 * APC Add Activity Page
 */
export default function APCAddActivity() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/apc"
      officeId={officeId}
    >
      <AddActivityForm 
        officeId={officeId}
        basePath="/office/apc"
        officeColor="#040195"
      />
    </OfficeDashboardLayout>
  );
}
