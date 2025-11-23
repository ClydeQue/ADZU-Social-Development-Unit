import OfficeSettings from "@/pages/OfficeSettings";
import { useAuth } from "@/context/AuthContext";

/**
 * ACLG Settings Page
 */
export default function ACLGSettings() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeSettings
      officeColor="#040195"
      basePath="/office/aclg"
      officeId={officeId}
    />
  );
}
