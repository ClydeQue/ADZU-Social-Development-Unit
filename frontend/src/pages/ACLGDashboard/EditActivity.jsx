import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import EditActivityForm from '@/components/EditActivityForm';
import { useAuth } from '@/context/AuthContext';

/**
 * ACLG Edit Activity Page
 */
export default function ACLGEditActivity() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/aclg"
      officeId={officeId}
    >
      <EditActivityForm 
        officeId={officeId}
        basePath="/office/aclg"
        officeColor="#040195"
      />
    </OfficeDashboardLayout>
  );
}
