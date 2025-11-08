import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Upload, UserPlus, Search, Link2 } from "lucide-react";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";

const ConnectHub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Rel8OnlyNavigation />
        
        <div className="flex items-center gap-3 mb-6 mt-6">
          <Users className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">
              Choose how you want to add contacts to your network
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className="relative overflow-hidden transition-all hover:scale-[1.01] cursor-pointer group bg-card/40 backdrop-blur-md border-border/50 hover:shadow-lg hover:shadow-primary/10"
            onClick={() => navigate('/rel8/connect/create')}
          >
            <CardHeader className="space-y-2 p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <UserPlus className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Create Contact</CardTitle>
              </div>
              <CardDescription className="text-sm">
                Add a new contact manually by entering their details
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="relative overflow-hidden transition-all hover:scale-[1.01] cursor-pointer group bg-card/40 backdrop-blur-md border-border/50 hover:shadow-lg hover:shadow-primary/10"
            onClick={() => navigate('/rel8/connect/import')}
          >
            <CardHeader className="space-y-2 p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Upload className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Import Contacts</CardTitle>
              </div>
              <CardDescription className="text-sm">
                Upload contacts from CSV or import from external platforms
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="relative overflow-hidden transition-all hover:scale-[1.01] cursor-pointer group bg-card/40 backdrop-blur-md border-border/50 hover:shadow-lg hover:shadow-primary/10"
            onClick={() => navigate('/rel8/invites')}
          >
            <CardHeader className="space-y-2 p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Link2 className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Invite Links</CardTitle>
              </div>
              <CardDescription className="text-sm">
                Generate and manage personalized invite links for contacts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="relative overflow-hidden transition-all hover:scale-[1.01] cursor-pointer group bg-card/40 backdrop-blur-md border-border/50 hover:shadow-lg hover:shadow-primary/10"
            onClick={() => navigate('/rel8/connect/find')}
          >
            <CardHeader className="space-y-2 p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Search className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Find Contacts</CardTitle>
              </div>
              <CardDescription className="text-sm">
                Search and discover contacts in the network
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConnectHub;
