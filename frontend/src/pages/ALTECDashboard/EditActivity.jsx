import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import EditActivityForm from '@/components/EditActivityForm';
import { useAuth } from '@/context/AuthContext';

/**
 * ALTEC Edit Activity Page
 */
export default function ALTECEditActivity() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/altec"
      officeId={officeId}
    >
      <EditActivityForm 
        officeId={officeId}
        basePath="/office/altec"
        officeColor="#040195"
      />
    </OfficeDashboardLayout>
  );
}
