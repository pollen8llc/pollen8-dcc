import { Link } from "react-router-dom";
import { InsightCards } from "@/components/rel8t/network/InsightCards";
import { SmartLists } from "@/components/rel8t/network/SmartLists";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BarChart3, PieChart } from "lucide-react";

export default function Insights() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="container max-w-7xl mx-auto px-4 py-6 pb-32">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/rel8/actv8" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="h-4 w-4" />Back to Actv8
            </Link>
            <h1 className="text-3xl font-bold">Relationship Insights</h1>
            <p className="text-muted-foreground">Understand and nurture your professional network</p>
          </div>
        </div>

        <Tabs defaultValue="health" className="space-y-6">
          <TabsList className="glass-morphism">
            <TabsTrigger value="health" className="gap-2"><BarChart3 className="h-4 w-4" />Connection Health</TabsTrigger>
            <TabsTrigger value="distribution" className="gap-2"><PieChart className="h-4 w-4" />Network Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="health"><InsightCards /></TabsContent>
          <TabsContent value="distribution"><SmartLists /></TabsContent>
        </Tabs>
      </div>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl"><Rel8OnlyNavigation /></div>
    </div>
  );
}
