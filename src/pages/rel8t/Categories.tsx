import React from 'react';
import Navbar from "@/components/Navbar";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { CategoryManagement } from "@/components/rel8t/CategoryManagement";

const Categories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Rel8OnlyNavigation />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Categories</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage contact categories for better organization</p>
          </div>
        </div>

        <div className="space-y-6">
          <CategoryManagement />
        </div>
      </div>

      {/* Powered by Footer */}
      <footer className="w-full text-center py-4 text-muted-foreground text-sm">
        <p>Powered by POLLEN8 LABS</p>
      </footer>
    </div>
  );
};

export default Categories;
