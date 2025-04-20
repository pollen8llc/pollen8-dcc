
import React from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export function WelcomeStep({ onNext }) {
  return (
    <div className="text-center animate-fade-in">
      <div className="flex flex-col items-center space-y-2">
        <HelpCircle className="h-10 w-10 text-primary mx-auto mb-2" />
        <h2 className="text-2xl font-semibold mb-1">Welcome to Community Creation!</h2>
        <p className="text-muted-foreground mb-6">
          We'll guide you step-by-step to help you build a strong and discoverable community presence.<br />
          Click "Get Started" to begin.
        </p>
        <Button className="mt-4" onClick={onNext}>
          Get Started
        </Button>
      </div>
    </div>
  );
}
