import { SettingsGeneralView } from "@/components/settings/settings-general-view";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function SettingsGeneralPage({ searchParams }: Props) {
  return <SettingsGeneralView searchParams={searchParams} />;
}
