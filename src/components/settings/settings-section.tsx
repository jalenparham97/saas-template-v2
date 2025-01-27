export function SettingsSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
      {children}
    </div>
  );
}
