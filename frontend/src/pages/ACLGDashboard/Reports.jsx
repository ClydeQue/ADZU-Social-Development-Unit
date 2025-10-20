import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import OfficeReports from '@/components/OfficeReports';
import { useAuth } from '@/context/AuthContext';

/**
 * ACLG Reports Page
 * AdZU Center for Local Governance
 */
export default function ACLGReports() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/aclg"
      officeId={officeId}
    >
      <div className="p-6 overflow-auto">
        <OfficeReports 
          officeId={officeId} 
          officeColor="#1976D2" 
          officeLogo="/images/aclg_logo_small.webp"
        />
      </div>
    </OfficeDashboardLayout>
  );
}
