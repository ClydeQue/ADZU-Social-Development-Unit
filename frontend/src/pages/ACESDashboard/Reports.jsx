import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import OfficeReports from '@/components/OfficeReports';
import { useAuth } from '@/context/AuthContext';

/**
 * ACES Reports Page
 * AdZU Center for Engagement and Social Development
 */
export default function ACESReports() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#388E3C"
      basePath="/office/aces"
      officeId={officeId}
    >
      <div className="p-6 overflow-auto">
        <OfficeReports 
          officeId={officeId} 
          officeColor="#388E3C" 
          officeLogo="/images/aces_logo_small.webp"
        />
      </div>
    </OfficeDashboardLayout>
  );
}
