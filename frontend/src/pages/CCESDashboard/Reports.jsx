import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import OfficeReports from '@/components/OfficeReports';
import { useAuth } from '@/context/AuthContext';

/**
 * CCES Reports Page
 * Center for Community Engagement and Service
 */
export default function CCESReports() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/cces"
      officeId={officeId}
    >
      <div className="h-full flex flex-col p-3">
        <OfficeReports 
          officeId={officeId} 
          officeColor="#040195" 
          basePath="/office/cces"
        />
      </div>
    </OfficeDashboardLayout>
  );
}
