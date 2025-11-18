import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import AddActivityForm from '@/components/AddActivityForm';
import { useAuth } from '@/context/AuthContext';

/**
 * ACLG Add Activity Page
 */
export default function ACLGAddActivity() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/aclg"
      officeId={officeId}
    >
      <AddActivityForm 
        officeId={officeId}
        basePath="/office/aclg"
        officeColor="#040195"
      />
    </OfficeDashboardLayout>
  );
}

