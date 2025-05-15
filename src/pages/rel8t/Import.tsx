
import React from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Rel8Navigation } from "@/components/rel8t/Rel8TNavigation";

const Import = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2" 
            onClick={() => navigate("/rel8")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
        </div>
        
        <Rel8Navigation />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-6">
          <div>
            <h1 className="text-3xl font-bold">Import Contacts</h1>
            <p className="text-muted-foreground">Import your contacts from external sources</p>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-8 text-center">
          <h2 className="text-xl font-medium mb-4">Import Your Data</h2>
          <p className="text-muted-foreground mb-6">
            Import your contacts from CSV files, Google Contacts, or other sources.
            This feature is coming soon!
          </p>
          <Button className="mr-2" variant="outline" disabled>
            Import from CSV
          </Button>
          <Button variant="outline" disabled>
            Import from Google Contacts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Import;
