
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ExtendedProfile } from "@/services/profileService";

interface BasicInfoStepProps {
  formData: Partial<ExtendedProfile>;
  updateFormData: (data: Partial<ExtendedProfile>) => void;
}

const BasicInfoStep = ({ formData, updateFormData }: BasicInfoStepProps) => {
  const [firstName, setFirstName] = useState(formData.first_name || "");
  const [lastName, setLastName] = useState(formData.last_name || "");
  const [bio, setBio] = useState(formData.bio || "");

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
    updateFormData({ first_name: e.target.value });
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    updateFormData({ last_name: e.target.value });
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
            <AvatarFallback userId={formData.user_id} useDynamicAvatar={true}>{getInitials() || "??"}</AvatarFallback>
          </Avatar>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Your avatar is managed through the dynamic avatar system
        </p>
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
