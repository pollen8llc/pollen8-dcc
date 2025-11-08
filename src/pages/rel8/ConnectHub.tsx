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
          <Users className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Connect Contacts</h1>
            <p className="text-sm text-muted-foreground">
              Choose how you want to add contacts to your network
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer hover:border-primary transition-all duration-200 hover:shadow-lg"
            onClick={() => navigate('/rel8/connect/create')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <UserPlus className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Create Contact</CardTitle>
                  <CardDescription>Add a new contact manually</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Fill in contact details and add them to your network one by one
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-primary transition-all duration-200 hover:shadow-lg"
            onClick={() => navigate('/rel8/connect/import')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Upload className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <CardTitle>Import Contacts</CardTitle>
                  <CardDescription>Upload from CSV, vCard, or Excel</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Bulk import contacts from files like CSV, vCard, or Excel spreadsheets
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-primary transition-all duration-200 hover:shadow-lg"
            onClick={() => navigate('/rel8/invites')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Link2 className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <CardTitle>Invite Links</CardTitle>
                  <CardDescription>Generate shareable invite links</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create links that anyone can use to share their contact info with you
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-primary transition-all duration-200 hover:shadow-lg"
            onClick={() => navigate('/rel8/connect/find')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Search className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <CardTitle>Find Contacts</CardTitle>
                  <CardDescription>Search and browse your network</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Search through your existing contacts and view their profiles
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConnectHub;
