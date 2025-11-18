import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import AddActivityForm from '@/components/AddActivityForm';
import { useAuth } from '@/context/AuthContext';

export default function ACCAAddActivity() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout officeColor="#040195" basePath="/office/acca" officeId={officeId}>
      <AddActivityForm officeId={officeId} basePath="/office/acca" officeColor="#040195" />
    </OfficeDashboardLayout>
  );
}
