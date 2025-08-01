import { NavButton } from "@/components/ui/nav-button";
import { PageTitle, PageWrapper } from "@/components/ui/page-structure";

export function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageWrapper>
      <PageTitle>Settings</PageTitle>

      <main className="mt-8">
        <div className="overflow-x-scroll border-b border-gray-200 pb-4 sm:overflow-x-auto">
          <div className="flex items-center space-x-2">
            <NavButton href={`/settings`}>General</NavButton>
            <NavButton href={`/settings/security`}>Security</NavButton>
            <NavButton href={`/settings/subscription`}>Subscription</NavButton>
          </div>
        </div>

        <div className="mt-6">{children}</div>
      </main>
    </PageWrapper>
  );
}
