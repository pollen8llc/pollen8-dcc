import React from 'react';
import { Rel8Header } from "@/components/rel8t/Rel8Header";
import { CategoryManagement } from "@/components/rel8t/CategoryManagement";

const Categories = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Rel8Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-4 sm:py-8 space-y-6">
        
        <div className="flex items-center gap-3 mb-4 sm:mb-6 mt-4 sm:mt-6">
          <div>
            <p className="text-sm text-muted-foreground">Manage contact categories for better organization</p>
          </div>
        </div>

        <div className="space-y-6">
          <CategoryManagement />
        </div>
      </div>
    </div>
  );
};

export default Categories;