
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KnowledgeBaseDebugger from '@/components/debug/KnowledgeBaseDebugger';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const DebuggerDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/admin')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin
        </Button>
        <h1 className="text-3xl font-bold">Component Debugger</h1>
      </div>
      
      <Tabs defaultValue="knowledge" className="w-full">
        <TabsList>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>
        
        <TabsContent value="knowledge">
          <KnowledgeBaseDebugger />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DebuggerDashboard;
