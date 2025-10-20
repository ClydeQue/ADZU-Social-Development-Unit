import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import OfficeReports from '@/components/OfficeReports';
import { useAuth } from '@/context/AuthContext';

/**
 * ALTEC Reports Page
 * AdZU Language and Technology Center
 */
export default function ALTECReports() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#7B1FA2"
      basePath="/office/altec"
      officeId={officeId}
    >
      <div className="p-6 overflow-auto">
        <OfficeReports 
          officeId={officeId} 
          officeColor="#7B1FA2" 
          officeLogo="/images/altec_logo_small.webp"
        />
      </div>
    </OfficeDashboardLayout>
  );
}
