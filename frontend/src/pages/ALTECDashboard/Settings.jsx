import OfficeSettings from "@/pages/OfficeSettings";
import { useAuth } from "@/context/AuthContext";

/**
 * ALTEC Settings Page
 */
export default function ALTECSettings() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeSettings
      officeColor="#040195"
      basePath="/office/altec"
      officeId={officeId}
    />
  );
}
