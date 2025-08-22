import React from 'react';
import Navbar from "@/components/Navbar";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { CategoryManagement } from "@/components/rel8t/CategoryManagement";

import { Card, CardContent } from "@/components/ui/card";

const Categories = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
        <Rel8OnlyNavigation />
        
        {/* Header Card */}
        <Card className="overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background border-border/50 shadow-2xl mb-8">
          <CardContent className="p-0">
            <div className="relative bg-gradient-to-r from-background via-background/50 to-background p-6 lg:p-8">
              <div className="min-w-0">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-2">Categories</h1>
                <p className="text-lg text-muted-foreground">Manage contact categories for better organization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden bg-card/40 backdrop-blur-md border-0 shadow-xl">
          <CardContent className="p-6">
            <CategoryManagement />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Categories;