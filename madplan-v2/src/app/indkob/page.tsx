import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Plus, Trash2 } from "lucide-react";

const placeholderItems = [
  { id: 1, name: "Mælk", category: "Mejeri", checked: false },
  { id: 2, name: "Æg", category: "Mejeri", checked: false },
  { id: 3, name: "Brød", category: "Bageri", checked: true },
  { id: 4, name: "Tomater", category: "Grønt", checked: false },
  { id: 5, name: "Løg", category: "Grønt", checked: true },
];

export default function IndkobPage() {
  return (
    <AppShell
      title="Indkobsliste"
      actions={
        <Button size="sm" variant="ghost" disabled>
          <Trash2 className="size-4" />
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Info banner */}
        <Card className="bg-terracotta-50 border-terracotta-200">
          <CardContent className="p-3">
            <p className="text-sm text-terracotta-700 text-center">
              Indkobsliste kommer i Phase 2
            </p>
          </CardContent>
        </Card>

        {/* Add item placeholder */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tilfoej vare..."
            disabled
            className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground cursor-not-allowed"
          />
          <Button size="icon" disabled>
            <Plus className="size-4" />
          </Button>
        </div>

        {/* Shopping list */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base flex items-center justify-between">
              <span>Varer (5)</span>
              <span className="text-sm font-normal text-muted-foreground">
                2 afkrydset
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {placeholderItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  item.checked ? "bg-olive-50" : "bg-muted"
                }`}
              >
                <div
                  className={`size-6 rounded-full border-2 flex items-center justify-center cursor-not-allowed ${
                    item.checked
                      ? "bg-olive-500 border-olive-500"
                      : "border-border"
                  }`}
                >
                  {item.checked && <Check className="size-4 text-white" />}
                </div>
                <div className="flex-1">
                  <span
                    className={`${
                      item.checked
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {item.category}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Categories summary */}
        <div className="flex gap-2 flex-wrap">
          {["Mejeri (2)", "Bageri (1)", "Grønt (2)"].map((cat) => (
            <span
              key={cat}
              className="px-3 py-1.5 bg-sand-200 text-sand-700 rounded-full text-xs"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
