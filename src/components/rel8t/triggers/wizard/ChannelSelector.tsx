import { MessageSquare, Phone, Mail, Send, Video, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface ChannelDetails {
  phone?: string;
  email?: string;
  platform?: string;
  handle?: string;
  meetingLink?: string;
  address?: string;
}

interface ChannelSelectorProps {
  selectedChannel: string;
  channelDetails: ChannelDetails;
  onChannelChange: (channel: string) => void;
  onDetailsChange: (details: ChannelDetails) => void;
}

const CHANNEL_OPTIONS = [
  { value: "text", label: "Text", icon: MessageSquare, color: "text-green-500" },
  { value: "call", label: "Call", icon: Phone, color: "text-blue-500" },
  { value: "email", label: "Email", icon: Mail, color: "text-purple-500" },
  { value: "dm", label: "DM", icon: Send, color: "text-pink-500" },
  { value: "virtual", label: "Virtual", icon: Video, color: "text-teal-500" },
  { value: "irl", label: "In Person", icon: MapPin, color: "text-orange-500" },
];

export function ChannelSelector({ 
  selectedChannel, 
  channelDetails, 
  onChannelChange, 
  onDetailsChange 
}: ChannelSelectorProps) {
  
  const handleDetailChange = (field: keyof ChannelDetails, value: string) => {
    onDetailsChange({ ...channelDetails, [field]: value });
  };

  const renderDetailFields = () => {
    switch (selectedChannel) {
      case "text":
      case "call":
        return (
          <div className="animate-fade-in">
            <Input
              placeholder="Phone number"
              value={channelDetails.phone || ""}
              onChange={(e) => handleDetailChange("phone", e.target.value)}
              className="h-12 rounded-xl border-2 border-border/50 bg-background/60 backdrop-blur-sm focus:border-primary/50"
            />
          </div>
        );
      case "email":
        return (
          <div className="animate-fade-in">
            <Input
              type="email"
              placeholder="Email address"
              value={channelDetails.email || ""}
              onChange={(e) => handleDetailChange("email", e.target.value)}
              className="h-12 rounded-xl border-2 border-border/50 bg-background/60 backdrop-blur-sm focus:border-primary/50"
            />
          </div>
        );
      case "dm":
        return (
          <div className="animate-fade-in space-y-3">
            <Input
              placeholder="Platform (e.g., Twitter, Instagram)"
              value={channelDetails.platform || ""}
              onChange={(e) => handleDetailChange("platform", e.target.value)}
              className="h-12 rounded-xl border-2 border-border/50 bg-background/60 backdrop-blur-sm focus:border-primary/50"
            />
            <Input
              placeholder="Handle or username"
              value={channelDetails.handle || ""}
              onChange={(e) => handleDetailChange("handle", e.target.value)}
              className="h-12 rounded-xl border-2 border-border/50 bg-background/60 backdrop-blur-sm focus:border-primary/50"
            />
          </div>
        );
      case "virtual":
        return (
          <div className="animate-fade-in space-y-3">
            <Input
              placeholder="Platform (e.g., Zoom, Google Meet)"
              value={channelDetails.platform || ""}
              onChange={(e) => handleDetailChange("platform", e.target.value)}
              className="h-12 rounded-xl border-2 border-border/50 bg-background/60 backdrop-blur-sm focus:border-primary/50"
            />
            <Input
              placeholder="Meeting link (optional)"
              value={channelDetails.meetingLink || ""}
              onChange={(e) => handleDetailChange("meetingLink", e.target.value)}
              className="h-12 rounded-xl border-2 border-border/50 bg-background/60 backdrop-blur-sm focus:border-primary/50"
            />
          </div>
        );
      case "irl":
        return (
          <div className="animate-fade-in">
            <Input
              placeholder="Meeting location or address"
              value={channelDetails.address || ""}
              onChange={(e) => handleDetailChange("address", e.target.value)}
              className="h-12 rounded-xl border-2 border-border/50 bg-background/60 backdrop-blur-sm focus:border-primary/50"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-foreground/80">How will you follow up?</label>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {CHANNEL_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedChannel === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => onChannelChange(option.value)}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-xl",
                "border-2 transition-all duration-200",
                "hover:scale-[1.02]",
                isSelected
                  ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
                  : "bg-background/60 backdrop-blur-sm border-border/50 hover:border-primary/50"
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                isSelected ? "text-primary" : option.color
              )} />
              <span className={cn(
                "text-xs font-medium",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {selectedChannel && (
        <div className="pt-2">
          {renderDetailFields()}
        </div>
      )}
    </div>
  );
}
