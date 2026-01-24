interface HeaderProps {
  title: string;
  actions?: React.ReactNode;
  headerLeft?: React.ReactNode;
}

export function Header({ title, actions, headerLeft }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          {headerLeft}
          <h1 className="font-heading text-xl font-semibold text-foreground">
            {title}
          </h1>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
