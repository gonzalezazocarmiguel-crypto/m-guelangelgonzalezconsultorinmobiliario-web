import { getSettings, isMissingDatabaseError, type ApifySettings } from "@/lib/db";
import AjustesClient from "@/components/crm/AjustesClient";
import DatabaseSetupNotice from "@/components/crm/DatabaseSetupNotice";

export const dynamic = "force-dynamic";

export default async function AjustesPage() {
  let settings: ApifySettings | null = null;
  try {
    settings = await getSettings();
  } catch (err) {
    if (!isMissingDatabaseError(err)) throw err;
  }

  if (!settings) return <DatabaseSetupNotice />;
  return <AjustesClient initialSettings={settings} />;
}
