
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { ExtendedProfile } from "@/services/profileService";

interface LocationInterestsStepProps {
  formData: Partial<ExtendedProfile>;
  updateFormData: (data: Partial<ExtendedProfile>) => void;
}

const LocationInterestsStep = ({ formData, updateFormData }: LocationInterestsStepProps) => {
  const [location, setLocation] = useState(formData.location || "");
  const [interests, setInterests] = useState<string[]>(formData.interests || []);
  const [newInterest, setNewInterest] = useState("");

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    updateFormData({ location: e.target.value });
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      const updatedInterests = [...interests, newInterest.trim()];
      setInterests(updatedInterests);
      updateFormData({ interests: updatedInterests });
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    const updatedInterests = interests.filter(item => item !== interest);
    setInterests(updatedInterests);
    updateFormData({ interests: updatedInterests });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInterest();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="City, Country"
          value={location}
          onChange={handleLocationChange}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Your general location helps connect you with nearby communities
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interests">Interests</Label>
        <div className="flex gap-2">
          <Input
            id="interests"
            placeholder="Add an interest"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            onClick={handleAddInterest}
            disabled={!newInterest.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Add topics you're interested in to connect with like-minded people
        </p>

        <div className="flex flex-wrap gap-2 mt-3">
          {interests.map((interest) => (
            <Badge key={interest} variant="secondary" className="pr-1">
              {interest}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => handleRemoveInterest(interest)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {interests.length === 0 && (
            <p className="text-sm text-muted-foreground">No interests added yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationInterestsStep;
