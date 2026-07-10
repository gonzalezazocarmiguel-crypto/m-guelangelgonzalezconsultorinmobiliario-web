import { getSettings } from "@/lib/db";
import AjustesClient from "@/components/crm/AjustesClient";

export const dynamic = "force-dynamic";

export default function AjustesPage() {
  const settings = getSettings();
  return <AjustesClient initialSettings={settings} />;
}
