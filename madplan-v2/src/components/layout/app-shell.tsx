import { MobileNav } from "./mobile-nav";
import { Header } from "./header";

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
}

export function AppShell({ children, title, actions }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header title={title} actions={actions} />
      <main className="flex-1 pb-20 px-4 pt-4">{children}</main>
      <MobileNav />
    </div>
  );
}
