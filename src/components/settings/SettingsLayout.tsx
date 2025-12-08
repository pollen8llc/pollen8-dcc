import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import { DotConnectorHeader } from "@/components/layout/DotConnectorHeader";
import { SettingsNavigation } from "./SettingsNavigation";
import { Settings } from "lucide-react";

interface SettingsLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export const SettingsLayout = ({ children, title, description }: SettingsLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <DotConnectorHeader />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="mb-6">
          <SettingsNavigation />
        </div>

        <div className="space-y-6 animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
};
