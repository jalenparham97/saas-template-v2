import { SettingsLayout } from "@/components/settings/settings-layout";
import { APP_NAME } from "@/lib/contants";

export const metadata = {
  title: `Settings - ${APP_NAME}`,
};

export default function SettingsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsLayout>
      <div>{children}</div>
    </SettingsLayout>
  );
}
