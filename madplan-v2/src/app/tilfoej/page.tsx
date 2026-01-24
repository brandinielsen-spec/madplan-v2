import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon, Camera, FileText } from "lucide-react";

export default function TilfoejPage() {
  return (
    <AppShell title="Tilfoej opskrift">
      <div className="space-y-6">
        {/* Info banner */}
        <Card className="bg-terracotta-50 border-terracotta-200">
          <CardContent className="p-3">
            <p className="text-sm text-terracotta-700 text-center">
              Import funktion kommer i Phase 4
            </p>
          </CardContent>
        </Card>

        {/* Import from URL */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <LinkIcon className="size-5 text-primary" />
              Importer fra URL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Indsaet et link til en opskrift, saa importerer vi den automatisk
            </p>
            <div className="space-y-2">
              <input
                type="url"
                placeholder="https://eksempel.dk/opskrift..."
                disabled
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground cursor-not-allowed"
              />
              <Button disabled className="w-full">
                Importer opskrift
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upload image */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <Camera className="size-5 text-primary" />
              Upload billede
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tag et billede af en opskrift, og vi laaser indholdet
            </p>
            <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center gap-2 cursor-not-allowed">
              <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                <Camera className="size-6 text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">
                Tryk for at vaelge billede
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Manual entry */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              Manuel oprettelse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Opret en opskrift fra bunden ved at udfylde alle detaljer
            </p>
            <Button variant="outline" disabled className="w-full">
              Opret manuel opskrift
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
