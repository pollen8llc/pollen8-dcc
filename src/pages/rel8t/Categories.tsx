
import React from 'react';
import Navbar from "@/components/Navbar";
import { CategoryManagement } from "@/components/rel8t/CategoryManagement";

const Categories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6 mt-4 sm:mt-6">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">Categories</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage contact categories for better organization</p>
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
