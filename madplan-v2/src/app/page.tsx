"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Book, ShoppingCart, ChefHat, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEjere } from "@/hooks/use-ejere";
import { useUgeplan } from "@/hooks/use-ugeplan";
import { useIndkobsliste } from "@/hooks/use-indkobsliste";
import { getCurrentWeek } from "@/lib/week-utils";
import { DAGE, type DagNavn } from "@/lib/types";

function getTodayDagNavn(): DagNavn {
  const dayIndex = new Date().getDay();
  // getDay(): 0=Sunday, 1=Monday, ..., 6=Saturday
  // DAGE: 0=mandag, 1=tirsdag, ..., 6=soendag
  return DAGE[(dayIndex + 6) % 7];
}

const DAG_DISPLAY: Record<DagNavn, string> = {
  mandag: "Mandag",
  tirsdag: "Tirsdag",
  onsdag: "Onsdag",
  torsdag: "Torsdag",
  fredag: "Fredag",
  loerdag: "Lørdag",
  soendag: "Søndag",
};

export default function Home() {
  const { ejere, isLoading: ejereLoading } = useEjere();
  const ejerId = ejere[0]?.id ?? null;
  const { aar, uge } = getCurrentWeek();

  const { ugeplan, isLoading: ugeplanLoading } = useUgeplan(ejerId, aar, uge);
  const { items, isLoading: indkobLoading } = useIndkobsliste(ejerId, aar, uge);

  const todayDag = getTodayDagNavn();
  const todayEntry = ugeplan?.dage[todayDag];
  const todayRet = todayEntry?.ret;
  const todayOpskriftId = todayEntry?.opskriftId;

  const uncheckedItems = items.filter((item) => !item.afkrydset);
  const isLoading = ejereLoading || ugeplanLoading;

  return (
    <AppShell title="Madplan">
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="text-center py-4">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
            Velkommen til Madplan
          </h2>
          <p className="text-muted-foreground">
            Planlæg ugens måltider nemt og hurtigt
          </p>
        </div>

        {/* Today's meal card */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <ChefHat className="size-5 text-primary" />
              Dagens ret — {DAG_DISPLAY[todayDag]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-24 bg-muted rounded-lg">
                <Loader2 className="size-6 text-muted-foreground animate-spin" />
              </div>
            ) : todayRet ? (
              <Link
                href={todayOpskriftId ? `/opskrifter/${todayOpskriftId}` : "/ugeplan"}
                className="block"
              >
                <div className="flex items-center justify-center h-24 bg-olive-50 rounded-lg hover:bg-olive-100 transition-colors">
                  <p className="font-medium text-foreground text-lg">
                    {todayRet}
                  </p>
                </div>
              </Link>
            ) : (
              <Link href="/ugeplan" className="block">
                <div className="flex items-center justify-center h-24 bg-muted rounded-lg hover:bg-sand-100 transition-colors">
                  <p className="text-muted-foreground text-sm">
                    Ingen ret planlagt endnu
                  </p>
                </div>
              </Link>
            )}
            {!isLoading && !todayRet && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Tryk for at tilføje en ret
              </p>
            )}
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
                <span className="font-medium text-foreground">Indkøb</span>
                <span className="text-xs text-muted-foreground">
                  {indkobLoading
                    ? "..."
                    : uncheckedItems.length === 0
                      ? "Listen er tom"
                      : `${uncheckedItems.length} vare${uncheckedItems.length === 1 ? "" : "r"} på listen`}
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
                <span className="font-medium text-foreground">Tilføj</span>
                <span className="text-xs text-muted-foreground">
                  Ny opskrift
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>

      </div>
    </AppShell>
  );
}
