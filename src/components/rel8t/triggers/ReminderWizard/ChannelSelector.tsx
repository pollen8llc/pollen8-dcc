import { useState, useEffect } from "react";
import { Phone, Mail, MessageCircle, Video, MapPin, PhoneCall } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ChannelDetails {
  phone?: string;
  email?: string;
  platform?: string;
  handle?: string;
  link?: string;
  meetingPlatform?: string;
  address?: string;
}

interface ChannelSelectorProps {
  selectedChannel?: string;
  channelDetails?: ChannelDetails;
  onChannelChange: (channel: string) => void;
  onDetailsChange: (details: ChannelDetails) => void;
  className?: string;
}

const channels = [
  { value: 'text', label: 'Text', icon: Phone },
  { value: 'call', label: 'Call', icon: PhoneCall },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'dm', label: 'DM', icon: MessageCircle },
  { value: 'meeting', label: 'Video', icon: Video },
  { value: 'irl', label: 'In-Person', icon: MapPin },
];

export function ChannelSelector({
  selectedChannel,
  channelDetails = {},
  onChannelChange,
  onDetailsChange,
  className
}: ChannelSelectorProps) {
  const [localDetails, setLocalDetails] = useState<ChannelDetails>(channelDetails);

  useEffect(() => {
    setLocalDetails(channelDetails);
  }, [channelDetails]);

  const handleDetailChange = (field: keyof ChannelDetails, value: string) => {
    const updated = { ...localDetails, [field]: value };
    setLocalDetails(updated);
    onDetailsChange(updated);
  };

  const renderDetailFields = () => {
    const inputClasses = "h-12 bg-secondary/30 border-0 rounded-xl text-base placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-primary";
    
    switch (selectedChannel) {
      case 'text':
      case 'call':
        return (
          <Input
            type="tel"
            placeholder="Phone number"
            value={localDetails.phone || ''}
            onChange={(e) => handleDetailChange('phone', e.target.value)}
            className={inputClasses}
          />
        );
      case 'email':
        return (
          <Input
            type="email"
            placeholder="Email address"
            value={localDetails.email || ''}
            onChange={(e) => handleDetailChange('email', e.target.value)}
            className={inputClasses}
          />
        );
      case 'dm':
        return (
          <div className="space-y-3">
            <Select
              value={localDetails.platform || ''}
              onValueChange={(value) => handleDetailChange('platform', value)}
            >
              <SelectTrigger className={inputClasses}>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="@username"
              value={localDetails.handle || ''}
              onChange={(e) => handleDetailChange('handle', e.target.value)}
              className={inputClasses}
            />
          </div>
        );
      case 'meeting':
        return (
          <div className="space-y-3">
            <Select
              value={localDetails.meetingPlatform || ''}
              onValueChange={(value) => handleDetailChange('meetingPlatform', value)}
            >
              <SelectTrigger className={inputClasses}>
                <SelectValue placeholder="Meeting platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zoom">Zoom</SelectItem>
                <SelectItem value="google-meet">Google Meet</SelectItem>
                <SelectItem value="microsoft-teams">Teams</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="url"
              placeholder="Meeting link"
              value={localDetails.link || ''}
              onChange={(e) => handleDetailChange('link', e.target.value)}
              className={inputClasses}
            />
          </div>
        );
      case 'irl':
        return (
          <Input
            placeholder="Meeting address"
            value={localDetails.address || ''}
            onChange={(e) => handleDetailChange('address', e.target.value)}
            className={inputClasses}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-5", className)}>
      {/* Channel Grid */}
      <div className="grid grid-cols-3 gap-2">
        {channels.map((channel) => {
          const Icon = channel.icon;
          const isSelected = selectedChannel === channel.value;
          
          return (
            <button
              key={channel.value}
              type="button"
              onClick={() => onChannelChange(channel.value)}
              className={cn(
                "flex flex-col items-center gap-2 py-4 px-3 rounded-2xl",
                "transition-all duration-200 active:scale-95",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-semibold">{channel.label}</span>
            </button>
          );
        })}
      </div>

      {/* Detail Fields */}
      {selectedChannel && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
          {renderDetailFields()}
        </div>
      )}
    </div>
  );
}
