import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import AddActivityForm from '@/components/AddActivityForm';
import { useAuth } from '@/context/AuthContext';

export default function ACESAddActivity() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout officeColor="#040195" basePath="/office/aces" officeId={officeId}>
      <AddActivityForm officeId={officeId} basePath="/office/aces" officeColor="#040195" />
    </OfficeDashboardLayout>
  );
}
