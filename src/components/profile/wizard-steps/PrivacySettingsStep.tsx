
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ExtendedProfile } from "@/types/profiles";
import { Lock, Users, Globe, Network } from "lucide-react";

interface PrivacySettingsStepProps {
  formData: Partial<ExtendedProfile>;
  updateFormData: (data: Partial<ExtendedProfile>) => void;
}

const PrivacySettingsStep = ({ formData, updateFormData }: PrivacySettingsStepProps) => {
  const initialVisibility = formData.privacy_settings?.profile_visibility || "connections";
  const [profileVisibility, setProfileVisibility] = useState<string>(initialVisibility);

  const handleVisibilityChange = (value: string) => {
    setProfileVisibility(value);
    updateFormData({
      privacy_settings: {
        ...formData.privacy_settings,
        profile_visibility: value as "public" | "connections" | "connections2" | "connections3" | "private"
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Privacy Settings</h3>
        <p className="text-sm text-muted-foreground">
          Control who can view your profile information
        </p>
      </div>

      <div className="space-y-4">
        <Label>Who can see your profile?</Label>
        
        <RadioGroup 
          value={profileVisibility}
          onValueChange={handleVisibilityChange}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent transition-colors">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="public" className="flex items-center gap-2 font-normal cursor-pointer flex-1">
              <Globe className="h-4 w-4 text-blue-500" />
              <div>
                <p>Everyone (Public)</p>
                <p className="text-xs text-muted-foreground">Anyone can view your full profile</p>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent transition-colors">
            <RadioGroupItem value="connections" id="connections" />
            <Label htmlFor="connections" className="flex items-center gap-2 font-normal cursor-pointer flex-1">
              <Users className="h-4 w-4 text-green-500" />
              <div>
                <p>Direct Connections Only</p>
                <p className="text-xs text-muted-foreground">Only people directly connected to you can view your profile</p>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent transition-colors">
            <RadioGroupItem value="connections2" id="connections2" />
            <Label htmlFor="connections2" className="flex items-center gap-2 font-normal cursor-pointer flex-1">
              <Network className="h-4 w-4 text-purple-500" />
              <div>
                <p>2nd Degree Connections</p>
                <p className="text-xs text-muted-foreground">Your connections and their connections can view your profile</p>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent transition-colors">
            <RadioGroupItem value="connections3" id="connections3" />
            <Label htmlFor="connections3" className="flex items-center gap-2 font-normal cursor-pointer flex-1">
              <Network className="h-4 w-4 text-orange-500" />
              <div>
                <p>Extended Network (3rd degree)</p>
                <p className="text-xs text-muted-foreground">Connections up to 3 degrees away can view your profile</p>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent transition-colors">
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private" className="flex items-center gap-2 font-normal cursor-pointer flex-1">
              <Lock className="h-4 w-4 text-red-500" />
              <div>
                <p>Only You (Private)</p>
                <p className="text-xs text-muted-foreground">Only you can see your profile information</p>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default PrivacySettingsStep;
