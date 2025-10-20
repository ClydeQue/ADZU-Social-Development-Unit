import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import { useAuth } from '@/context/AuthContext';

/**
 * ALTEC Calendar Page
 * AdZU Language and Technology Center
 */
export default function ALTECCalendar() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#7B1FA2"
      basePath="/office/altec"
      officeId={officeId}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Calendar</h1>
        <p className="text-gray-600">Calendar content coming soon...</p>
      </div>
    </OfficeDashboardLayout>
  );
}
