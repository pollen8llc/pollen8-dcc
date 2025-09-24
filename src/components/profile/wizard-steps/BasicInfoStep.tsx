
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExtendedProfile } from "@/services/profileService";

interface BasicInfoStepProps {
  formData: Partial<ExtendedProfile>;
  updateFormData: (data: Partial<ExtendedProfile>) => void;
}

const BasicInfoStep = ({ formData, updateFormData }: BasicInfoStepProps) => {
  const [firstName, setFirstName] = useState(formData.first_name || "");
  const [lastName, setLastName] = useState(formData.last_name || "");
  const [avatarUrl, setAvatarUrl] = useState(formData.avatar_url || "");
  const [bio, setBio] = useState(formData.bio || "");

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
    updateFormData({ first_name: e.target.value });
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    updateFormData({ last_name: e.target.value });
  };

  const handleAvatarUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarUrl(e.target.value);
    updateFormData({ avatar_url: e.target.value });
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
    updateFormData({ bio: e.target.value });
  };

  const getInitials = () => {
    const first = firstName.charAt(0);
    const last = lastName.charAt(0);
    return (first + last).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center mb-6">
        <div className="mb-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback userId={formData.user_id}>{getInitials() || "??"}</AvatarFallback>
          </Avatar>
        </div>
        <div className="w-full max-w-sm">
          <Label htmlFor="avatar">Profile Image URL</Label>
          <Input
            id="avatar"
            placeholder="https://example.com/avatar.jpg"
            value={avatarUrl}
            onChange={handleAvatarUrlChange}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Paste a URL to your profile picture
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="Your first name"
            value={firstName}
            onChange={handleFirstNameChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Your last name"
            value={lastName}
            onChange={handleLastNameChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us a bit about yourself..."
          value={bio}
          onChange={handleBioChange}
          rows={4}
        />
      </div>
    </div>
  );
};

export default BasicInfoStep;
