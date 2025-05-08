
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Facebook, Instagram, Globe, Trash2 } from "lucide-react";
import { ExtendedProfile } from "@/services/profileService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface SocialLinksStepProps {
  formData?: Partial<ExtendedProfile>;
  updateFormData?: (data: Partial<ExtendedProfile>) => void;
  form?: UseFormReturn<any>;
}

const platformOptions = [
  { value: "twitter", label: "Twitter", icon: Twitter },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "website", label: "Website", icon: Globe }
];

const SocialLinksStep = ({ formData, updateFormData, form }: SocialLinksStepProps) => {
  // Use form values if form is provided, otherwise fall back to formData
  const socialLinksData = form?.getValues('socialLinks') || (formData?.social_links as Record<string, string>) || {};
  
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(socialLinksData);
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");

  const handleAddLink = () => {
    if (platform && url) {
      const updatedLinks = {
        ...socialLinks,
        [platform]: url
      };
      setSocialLinks(updatedLinks);
      
      // Update form if available
      if (form) {
        form.setValue('socialLinks', updatedLinks);
      } else if (updateFormData) {
        updateFormData({ social_links: updatedLinks });
      }
      
      setPlatform("");
      setUrl("");
    }
  };

  const handleRemoveLink = (key: string) => {
    const { [key]: removed, ...updatedLinks } = socialLinks;
    setSocialLinks(updatedLinks);
    
    // Update form if available
    if (form) {
      form.setValue('socialLinks', updatedLinks);
    } else if (updateFormData) {
      updateFormData({ social_links: updatedLinks });
    }
  };

  const getPlatformIcon = (platformKey: string) => {
    const found = platformOptions.find(opt => opt.value === platformKey);
    if (found) {
      const Icon = found.icon;
      return <Icon className="h-4 w-4" />;
    }
    return <Globe className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Connect Your Social Accounts</h3>
        <p className="text-sm text-muted-foreground">
          Add links to your social media profiles or website
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 items-end">
        <div>
          <Label htmlFor="platform">Platform</Label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {platformOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <div className="flex items-center">
                    <opt.icon className="h-4 w-4 mr-2" />
                    {opt.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="url">Profile URL</Label>
          <Input
            id="url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <Button 
          type="button" 
          onClick={handleAddLink}
          disabled={!platform || !url}
        >
          Add Link
        </Button>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Your Social Links</h4>
        
        {Object.keys(socialLinks).length === 0 ? (
          <p className="text-sm text-muted-foreground">No social links added yet</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(socialLinks).map(([key, value]) => (
              <div 
                key={key} 
                className="flex items-center justify-between bg-muted p-3 rounded-md"
              >
                <div className="flex items-center gap-2">
                  {getPlatformIcon(key)}
                  <span className="font-medium capitalize">{key}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {value}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveLink(key)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialLinksStep;
