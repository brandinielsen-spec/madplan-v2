import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

const weekdays = [
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Loerdag",
  "Soendag",
];

export default function UgeplanPage() {
  return (
    <AppShell title="Ugeplan">
      <div className="space-y-4">
        {/* Week navigation */}
        <div className="flex items-center justify-between py-2">
          <Button variant="ghost" size="sm" disabled>
            <ChevronLeft className="size-4 mr-1" />
            Forrige
          </Button>
          <span className="font-heading font-semibold text-foreground">
            Uge 4, 2026
          </span>
          <Button variant="ghost" size="sm" disabled>
            Naeste
            <ChevronRight className="size-4 ml-1" />
          </Button>
        </div>

        {/* Info banner */}
        <Card className="bg-terracotta-50 border-terracotta-200">
          <CardContent className="p-3">
            <p className="text-sm text-terracotta-700 text-center">
              Ugeplan funktionalitet kommer i Phase 2
            </p>
          </CardContent>
        </Card>

        {/* Day cards */}
        <div className="space-y-3">
          {weekdays.map((day, index) => (
            <Card key={day} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-semibold text-foreground">
                        {day}
                      </span>
                      {index === 0 && (
                        <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                          I dag
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
