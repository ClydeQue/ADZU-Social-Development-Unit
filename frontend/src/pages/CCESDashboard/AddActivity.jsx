import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import AddActivityForm from '@/components/AddActivityForm';
import { useAuth } from '@/context/AuthContext';

/**
 * CCES Add Activity Page
 */
export default function CCESAddActivity() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/cces"
      officeId={officeId}
    >
      <AddActivityForm 
        officeId={officeId}
        basePath="/office/cces"
        officeColor="#040195"
      />
    </OfficeDashboardLayout>
  );
}
