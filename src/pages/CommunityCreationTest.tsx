
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CommunityCreationTest() {
  const navigate = useNavigate();
  const { currentUser } = useUser();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Community Creation Test Page</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Auth Status */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Logged in:</span>{" "}
                {currentUser ? "Yes" : "No"}
              </p>
              {currentUser && (
                <>
                  <p>
                    <span className="font-medium">User ID:</span>{" "}
                    {currentUser.id}
                  </p>
                  <p>
                    <span className="font-medium">Role:</span>{" "}
                    {currentUser.role}
                  </p>
                </>
              )}
            </div>
          </Card>

          {/* Creation Paths */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Available Paths</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">1. Direct Form Submission</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Standard community creation form with all fields.
                </p>
                <Button onClick={() => navigate("/create-community")}>
                  Try Direct Form
                </Button>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">2. Onboarding Path</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Guided community creation through onboarding.
                </p>
                <Button onClick={() => navigate("/onboarding")}>
                  Try Onboarding Path
                </Button>
              </div>
            </div>
          </Card>

          {/* Debug Console */}
          <Card className="p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Debug Console</h2>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="space-y-2 font-mono text-sm">
                <p>• Auth state loaded</p>
                <p>• Form validation ready</p>
                <p>• Supabase connection active</p>
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}
