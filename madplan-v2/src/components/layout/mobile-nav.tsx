"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Book, Plus, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/ugeplan", icon: Calendar, label: "Ugeplan" },
  { href: "/opskrifter", icon: Book, label: "Opskrifter" },
  { href: "/tilfoej", icon: Plus, label: "Tilfoej" },
  { href: "/indkob", icon: ShoppingCart, label: "Indkob" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-pb">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg",
                "transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
