import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
        Madplan
      </h1>
      <p className="text-muted-foreground mb-8">
        Test af styling - denne tekst bruger Nunito
      </p>

      <div className="flex flex-wrap gap-4 mb-8">
        <Button>Primary Button</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </div>

      <Card className="max-w-md mb-8">
        <CardHeader>
          <CardTitle className="font-heading">Test Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card content with earth tone styling</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">Farvepalet</h2>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Sand</p>
          <div className="flex gap-2">
            <div className="w-12 h-12 rounded bg-sand-50" title="sand-50" />
            <div className="w-12 h-12 rounded bg-sand-100" title="sand-100" />
            <div className="w-12 h-12 rounded bg-sand-200" title="sand-200" />
            <div className="w-12 h-12 rounded bg-sand-300" title="sand-300" />
            <div className="w-12 h-12 rounded bg-sand-500" title="sand-500" />
            <div className="w-12 h-12 rounded bg-sand-700" title="sand-700" />
            <div className="w-12 h-12 rounded bg-sand-900" title="sand-900" />
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Terracotta</p>
          <div className="flex gap-2">
            <div className="w-12 h-12 rounded bg-terracotta-50" title="terracotta-50" />
            <div className="w-12 h-12 rounded bg-terracotta-100" title="terracotta-100" />
            <div className="w-12 h-12 rounded bg-terracotta-200" title="terracotta-200" />
            <div className="w-12 h-12 rounded bg-terracotta-300" title="terracotta-300" />
            <div className="w-12 h-12 rounded bg-terracotta-500" title="terracotta-500" />
            <div className="w-12 h-12 rounded bg-terracotta-700" title="terracotta-700" />
            <div className="w-12 h-12 rounded bg-terracotta-900" title="terracotta-900" />
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Olive</p>
          <div className="flex gap-2">
            <div className="w-12 h-12 rounded bg-olive-50" title="olive-50" />
            <div className="w-12 h-12 rounded bg-olive-100" title="olive-100" />
            <div className="w-12 h-12 rounded bg-olive-200" title="olive-200" />
            <div className="w-12 h-12 rounded bg-olive-300" title="olive-300" />
            <div className="w-12 h-12 rounded bg-olive-500" title="olive-500" />
            <div className="w-12 h-12 rounded bg-olive-700" title="olive-700" />
            <div className="w-12 h-12 rounded bg-olive-900" title="olive-900" />
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Semantiske farver</p>
          <div className="flex gap-2">
            <div className="w-12 h-12 rounded bg-primary" title="primary" />
            <div className="w-12 h-12 rounded bg-secondary" title="secondary" />
            <div className="w-12 h-12 rounded bg-accent" title="accent" />
            <div className="w-12 h-12 rounded bg-muted" title="muted" />
          </div>
        </div>
      </div>
    </main>
  );
}
