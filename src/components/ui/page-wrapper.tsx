interface Props {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children }: Props) {
  return <div className="p-4 sm:p-6 lg:p-8">{children}</div>;
}
