import OfficeSettings from "@/pages/OfficeSettings";
import { useAuth } from "@/context/AuthContext";

/**
 * ACES Settings Page
 */
export default function ACESSettings() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeSettings
      officeColor="#040195"
      basePath="/office/aces"
      officeId={officeId}
    />
  );
}
