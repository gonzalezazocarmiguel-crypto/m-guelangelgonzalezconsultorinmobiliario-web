import { getSettings } from "@/lib/db";
import AjustesClient from "@/components/crm/AjustesClient";

export const dynamic = "force-dynamic";

export default async function AjustesPage() {
  const settings = await getSettings();
  return <AjustesClient initialSettings={settings} />;
}
