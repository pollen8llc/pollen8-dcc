
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { X, Plus } from 'lucide-react';

// A list of suggested interests to help users
const SUGGESTED_INTERESTS = [
  'Technology', 'Business', 'Marketing', 'Design', 'Education',
  'Health', 'Finance', 'Art', 'Music', 'Travel', 'Science',
  'Environment', 'Photography', 'Fitness', 'Food', 'Literature'
];

const InterestsStep = () => {
  const { setValue, watch } = useFormContext();
  const [newInterest, setNewInterest] = useState('');
  
  // Get current interests from form
  const interests = watch('interests') || [];
  
  const addInterest = (interest: string) => {
    const trimmedInterest = interest.trim();
    if (trimmedInterest && !interests.includes(trimmedInterest)) {
      setValue('interests', [...interests, trimmedInterest]);
    }
    setNewInterest('');
  };
  
  const removeInterest = (index: number) => {
    const updatedInterests = [...interests];
    updatedInterests.splice(index, 1);
    setValue('interests', updatedInterests);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest(newInterest);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    addInterest(suggestion);
  };
  
  return (
    <div className="space-y-6">
      <FormField
        name="interests"
        control={undefined}
        render={() => (
          <FormItem>
            <FormLabel>Interests</FormLabel>
            <FormDescription>
              Add topics that interest you so we can help you connect with like-minded people
            </FormDescription>
            
            <div className="flex gap-2">
              <FormControl>
                <Input 
                  placeholder="Add an interest" 
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </FormControl>
              <Button type="button" onClick={() => addInterest(newInterest)} disabled={!newInterest.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-3">
              {interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest: string, index: number) => (
                    <Badge key={index} variant="secondary" className="px-3 py-2">
                      {interest}
                      <button 
                        type="button" 
                        onClick={() => removeInterest(index)}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No interests added yet</p>
              )}
            </div>
          </FormItem>
        )}
      />
      
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-2">Suggested interests</h4>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_INTERESTS.filter(suggestion => !interests.includes(suggestion))
            .slice(0, 8)
            .map((suggestion, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="cursor-pointer hover:bg-secondary"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default InterestsStep;
