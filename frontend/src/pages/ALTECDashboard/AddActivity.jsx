import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import AddActivityForm from '@/components/AddActivityForm';
import { useAuth } from '@/context/AuthContext';

/**
 * ALTEC Add Activity Page
 */
export default function ALTECAddActivity() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/altec"
      officeId={officeId}
    >
      <AddActivityForm 
        officeId={officeId}
        basePath="/office/altec"
        officeColor="#040195"
      />
    </OfficeDashboardLayout>
  );
}
