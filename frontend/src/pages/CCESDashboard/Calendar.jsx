import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import { useAuth } from '@/context/AuthContext';

/**
 * CCES Calendar Page
 * Center for Community Engagement and Service
 */
export default function CCESCalendar() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/cces"
      officeId={officeId}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Calendar</h1>
        <p className="text-gray-600">Calendar content coming soon...</p>
      </div>
    </OfficeDashboardLayout>
  );
}
