import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Book, ShoppingCart, ChefHat } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <AppShell title="Madplan">
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="text-center py-4">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
            Velkommen til Madplan
          </h2>
          <p className="text-muted-foreground">
            Planlaeg ugens maaltider nemt og hurtigt
          </p>
        </div>

        {/* Today's meal card */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <ChefHat className="size-5 text-primary" />
              Dagens ret
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-24 bg-muted rounded-lg">
              <p className="text-muted-foreground text-sm">
                Ingen ret planlagt endnu
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Gaa til Ugeplan for at tilfoeje en ret
            </p>
          </CardContent>
        </Card>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/ugeplan">
            <Card className="bg-card border-border hover:bg-sand-100 transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center gap-2">
                <Calendar className="size-8 text-primary" />
                <span className="font-medium text-foreground">Ugeplan</span>
                <span className="text-xs text-muted-foreground">
                  Se ugens menu
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/opskrifter">
            <Card className="bg-card border-border hover:bg-sand-100 transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center gap-2">
                <Book className="size-8 text-primary" />
                <span className="font-medium text-foreground">Opskrifter</span>
                <span className="text-xs text-muted-foreground">
                  Udforsk opskrifter
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/indkob">
            <Card className="bg-card border-border hover:bg-sand-100 transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center gap-2">
                <ShoppingCart className="size-8 text-accent" />
                <span className="font-medium text-foreground">Indkob</span>
                <span className="text-xs text-muted-foreground">
                  0 varer paa listen
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tilfoej">
            <Card className="bg-terracotta-50 border-terracotta-200 hover:bg-terracotta-100 transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center gap-2">
                <div className="size-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-xl font-bold">+</span>
                </div>
                <span className="font-medium text-foreground">Tilfoej</span>
                <span className="text-xs text-muted-foreground">
                  Ny opskrift
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Status section */}
        <Card className="bg-olive-50 border-olive-200">
          <CardContent className="p-4">
            <p className="text-sm text-olive-700 text-center">
              Phase 1: App shell faerdig. Data og funktioner kommer i Phase 2.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
