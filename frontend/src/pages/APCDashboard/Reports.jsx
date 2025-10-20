import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import OfficeReports from '@/components/OfficeReports';
import { useAuth } from '@/context/AuthContext';

/**
 * APC Reports Page
 * AdZU Peace Center
 */
export default function APCReports() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/apc"
      officeId={officeId}
    >
      <div className="p-6 overflow-auto">
        <OfficeReports 
          officeId={officeId} 
          officeColor="#040195" 
          officeLogo="/images/apc_logo_small.webp"
        />
      </div>
    </OfficeDashboardLayout>
  );
}
