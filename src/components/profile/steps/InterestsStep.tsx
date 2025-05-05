
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { X, Plus } from "lucide-react";

interface InterestsStepProps {
  form: UseFormReturn<any>;
}

const InterestsStep = ({ form }: InterestsStepProps) => {
  const [newInterest, setNewInterest] = useState("");

  // Get current interests from form
  const interests = form.watch('interests') || [];

  // Add new interest
  const handleAddInterest = () => {
    if (!newInterest.trim() || interests.includes(newInterest.trim())) {
      return;
    }
    
    const updatedInterests = [...interests, newInterest.trim()];
    form.setValue('interests', updatedInterests);
    setNewInterest("");
  };

  // Remove an interest
  const handleRemoveInterest = (interest: string) => {
    const updatedInterests = interests.filter((i: string) => i !== interest);
    form.setValue('interests', updatedInterests);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="interests"
        render={() => (
          <FormItem>
            <FormLabel>Interests</FormLabel>
            <div className="flex flex-wrap gap-2 mb-4">
              {interests.length === 0 ? (
                <p className="text-sm text-muted-foreground">Add some interests to help connect with like-minded people</p>
              ) : (
                interests.map((interest: string, index: number) => (
                  <Badge key={index} className="px-2 py-1">
                    {interest}
                    <button 
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="ml-1 text-xs"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <Input 
                value={newInterest}
                onChange={e => setNewInterest(e.target.value)}
                placeholder="Add an interest..."
                className="flex-1"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInterest();
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={handleAddInterest}
                size="sm"
                variant="secondary"
              >
                <Plus size={16} className="mr-1" />
                Add
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default InterestsStep;
