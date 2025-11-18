import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import EditActivityForm from '@/components/EditActivityForm';
import { useAuth } from '@/context/AuthContext';

/**
 * CCES Edit Activity Page
 */
export default function CCESEditActivity() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/cces"
      officeId={officeId}
    >
      <EditActivityForm 
        officeId={officeId}
        basePath="/office/cces"
        officeColor="#040195"
      />
    </OfficeDashboardLayout>
  );
}
