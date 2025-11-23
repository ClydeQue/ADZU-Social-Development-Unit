import OfficeSettings from "@/pages/OfficeSettings";
import { useAuth } from "@/context/AuthContext";

/**
 * CCES Settings Page
 */
export default function CCESSettings() {
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  return (
    <OfficeSettings
      officeColor="#040195"
      basePath="/office/cces"
      officeId={officeId}
    />
  );
}
