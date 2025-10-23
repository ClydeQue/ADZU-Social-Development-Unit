import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import OfficeReports from '@/components/OfficeReports';
import { useAuth } from '@/context/AuthContext';

/**
 * ACCA Reports Page
 * AdZU Center for Culture and the Arts
 */
export default function ACCAReports() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/acca"
      officeId={officeId}
    >
      <div className="h-full flex flex-col p-3">
        <OfficeReports 
          officeId={officeId} 
          officeColor="#040195" 
          officeLogo="/images/acca_logo_small.webp"
        />
      </div>
    </OfficeDashboardLayout>
  );
}
