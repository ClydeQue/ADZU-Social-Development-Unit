import OfficeSettings from "@/pages/OfficeSettings";
import { useAuth } from "@/context/AuthContext";

/**
 * ACCA Settings Page
 */
export default function ACCASettings() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeSettings
      officeColor="#040195"
      basePath="/office/acca"
      officeId={officeId}
    />
  );
}
