import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { DataTablesSection } from "@/components/settings/DataTablesSection";
import { Table2 } from "lucide-react";
import { useEffect } from "react";

const TablesSettings = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <SettingsLayout 
      title="Data Tables" 
      description="View and manage your data tables"
    >
      <Card className="bg-card/40 backdrop-blur-md border-border/50">
        <CardHeader className="space-y-2 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Table2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Your Data</CardTitle>
              <CardDescription>View contacts, triggers, and other data</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <DataTablesSection />
        </CardContent>
      </Card>
    </SettingsLayout>
  );
};

export default TablesSettings;
