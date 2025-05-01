
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ExtendedProfile } from "@/services/profileService";
import { MapPin, Globe, Twitter, Linkedin, Facebook, Instagram, Lock, Users, Network } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ReviewCompleteStepProps {
  formData: Partial<ExtendedProfile>;
}

const ReviewCompleteStep = ({ formData }: ReviewCompleteStepProps) => {
  const getInitials = () => {
    const first = formData.first_name?.charAt(0) || "";
    const last = formData.last_name?.charAt(0) || "";
    return (first + last).toUpperCase();
  };

  const getFullName = () => {
    return [formData.first_name, formData.last_name]
      .filter(Boolean)
      .join(" ") || "Anonymous User";
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getPrivacyIcon = () => {
    switch (formData.privacy_settings?.profile_visibility) {
      case 'public':
        return <Globe className="h-4 w-4 text-blue-500" />;
      case 'connections':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'connections2':
      case 'connections3':
        return <Network className="h-4 w-4 text-purple-500" />;
      case 'private':
        return <Lock className="h-4 w-4 text-red-500" />;
      default:
        return <Users className="h-4 w-4 text-green-500" />;
    }
  };

  const getPrivacyText = () => {
    switch (formData.privacy_settings?.profile_visibility) {
      case 'public':
        return "Everyone can view your profile";
      case 'connections':
        return "Only direct connections can view your profile";
      case 'connections2':
        return "Connections up to 2nd degree can view your profile";
      case 'connections3':
        return "Connections up to 3rd degree can view your profile";
      case 'private':
        return "Only you can view your profile";
      default:
        return "Only direct connections can view your profile";
    }
  };

  const socialLinks = formData.social_links as Record<string, string> || {};
  const hasIncompleteFields = !formData.first_name || !formData.last_name;

  return (
    <div className="space-y-6">
      {hasIncompleteFields && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Missing Information</AlertTitle>
          <AlertDescription>
            Some fields appear to be incomplete. Consider filling them before finalizing your profile.
          </AlertDescription>
        </Alert>
      )}

      <div>
        <h3 className="text-lg font-medium mb-6">Review Your Profile</h3>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={formData.avatar_url} alt={getFullName()} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            
            <div className="flex items-center text-sm gap-1">
              {getPrivacyIcon()}
              <span className="text-muted-foreground">{getPrivacyText()}</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="text-xl font-medium">{getFullName()}</h4>
              {formData.location && (
                <div className="flex items-center text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{formData.location}</span>
                </div>
              )}
            </div>
            
            {formData.bio && (
              <div>
                <span className="font-medium">Bio</span>
                <p className="text-sm mt-1">{formData.bio}</p>
              </div>
            )}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {formData.interests && formData.interests.length > 0 && (
          <div className="space-y-2">
            <span className="font-medium">Interests</span>
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest) => (
                <Badge key={interest} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <Separator className="my-4" />
        
        <div className="space-y-2">
          <span className="font-medium">Social Links</span>
          <div className="flex flex-wrap gap-3">
            {Object.entries(socialLinks).length > 0 ? (
              Object.entries(socialLinks).map(([platform, url]) => (
                <div
                  key={platform}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  {getSocialIcon(platform)}
                  <span className="capitalize">{platform}</span>
                </div>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No social links added</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCompleteStep;
