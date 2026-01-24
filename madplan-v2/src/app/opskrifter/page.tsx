import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export default function OpskrifterPage() {
  return (
    <AppShell title="Opskrifter">
      <div className="space-y-4">
        {/* Search input placeholder */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Soeg i opskrifter..."
            disabled
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Info banner */}
        <Card className="bg-terracotta-50 border-terracotta-200">
          <CardContent className="p-3">
            <p className="text-sm text-terracotta-700 text-center">
              Opskriftliste kommer i Phase 2
            </p>
          </CardContent>
        </Card>

        {/* Recipe cards skeleton */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-card border-border overflow-hidden">
              <Skeleton className="h-32 w-full rounded-none" />
              <CardContent className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Categories placeholder */}
        <div className="space-y-2">
          <h3 className="font-heading font-semibold text-foreground">
            Kategorier
          </h3>
          <div className="flex flex-wrap gap-2">
            {["Alle", "Hurtige", "Vegetar", "Kylling", "Pasta"].map(
              (category) => (
                <span
                  key={category}
                  className="px-3 py-1.5 bg-sand-200 text-sand-700 rounded-full text-sm cursor-not-allowed"
                >
                  {category}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
