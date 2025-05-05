
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface InterestsStepProps {
  form: UseFormReturn<any>;
}

const InterestsStep = ({ form }: InterestsStepProps) => {
  const [newInterest, setNewInterest] = React.useState('');
  
  const interests = form.watch('interests') || [];

  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    
    const updatedInterests = [...interests, newInterest.trim()];
    form.setValue('interests', updatedInterests);
    setNewInterest('');
  };

  const handleRemoveInterest = (index: number) => {
    const updatedInterests = [...interests];
    updatedInterests.splice(index, 1);
    form.setValue('interests', updatedInterests);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInterest();
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="interests"
        render={() => (
          <FormItem>
            <FormLabel>Your Interests</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Enter an interest and press Enter"
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddInterest}>Add</Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {interests.map((interest: string, index: number) => (
                    <div 
                      key={index} 
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      <span>{interest}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveInterest(index)}
                        className="text-secondary-foreground/70 hover:text-secondary-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <p className="text-sm text-muted-foreground">
        Add interests to connect with like-minded community members
      </p>
    </div>
  );
};

export default InterestsStep;
