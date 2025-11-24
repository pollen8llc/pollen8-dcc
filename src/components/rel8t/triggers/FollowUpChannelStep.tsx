import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MessageCircle, Video, MapPin, PhoneCall, ChevronDown, ChevronUp } from "lucide-react";
interface ChannelDetails {
  phone?: string;
  email?: string;
  platform?: string;
  handle?: string;
  link?: string;
  meetingPlatform?: string;
  address?: string;
}
interface FollowUpChannelStepProps {
  selectedChannel?: string;
  channelDetails?: ChannelDetails;
  onChannelChange: (channel: string) => void;
  onDetailsChange: (details: ChannelDetails) => void;
}
const channelOptions = [{
  value: "text",
  label: "Text/SMS",
  icon: Phone
}, {
  value: "call",
  label: "Phone Call",
  icon: PhoneCall
}, {
  value: "email",
  label: "Email",
  icon: Mail
}, {
  value: "dm",
  label: "Direct Message",
  icon: MessageCircle
}, {
  value: "meeting",
  label: "Virtual Meeting",
  icon: Video
}, {
  value: "irl",
  label: "In-Person Meeting",
  icon: MapPin
}];
export function FollowUpChannelStep({
  selectedChannel,
  channelDetails = {},
  onChannelChange,
  onDetailsChange
}: FollowUpChannelStepProps) {
  const [localDetails, setLocalDetails] = useState<ChannelDetails>(channelDetails);
  const [isChannelSectionCollapsed, setIsChannelSectionCollapsed] = useState(false);
  const handleChannelSelect = (channel: string) => {
    onChannelChange(channel);
    setIsChannelSectionCollapsed(true);
  };
  const handleDetailChange = (field: keyof ChannelDetails, value: string) => {
    const updated = {
      ...localDetails,
      [field]: value
    };
    setLocalDetails(updated);
    onDetailsChange(updated);
  };
  const renderDetailFields = () => {
    switch (selectedChannel) {
      case "text":
      case "call":
        return <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" value={localDetails.phone || ""} onChange={e => handleDetailChange("phone", e.target.value)} className="bg-background/50" />
          </div>;
      case "email":
        return <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="contact@example.com" value={localDetails.email || ""} onChange={e => handleDetailChange("email", e.target.value)} className="bg-background/50" />
          </div>;
      case "dm":
        return <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={localDetails.platform || ""} onValueChange={value => handleDetailChange("platform", value)}>
                <SelectTrigger id="platform" className="bg-background/50">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="handle">Username/Handle</Label>
              <Input id="handle" placeholder="@username" value={localDetails.handle || ""} onChange={e => handleDetailChange("handle", e.target.value)} className="bg-background/50" />
            </div>
          </div>;
      case "meeting":
        return <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meetingPlatform">Meeting Platform</Label>
              <Select value={localDetails.meetingPlatform || ""} onValueChange={value => handleDetailChange("meetingPlatform", value)}>
                <SelectTrigger id="meetingPlatform" className="bg-background/50">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="google-meet">Google Meet</SelectItem>
                  <SelectItem value="microsoft-teams">Microsoft Teams</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Meeting Link</Label>
              <Input id="link" type="url" placeholder="https://zoom.us/j/..." value={localDetails.link || ""} onChange={e => handleDetailChange("link", e.target.value)} className="bg-background/50" />
            </div>
          </div>;
      case "irl":
        return <div className="space-y-2">
            <Label htmlFor="address">Meeting Address</Label>
            <Input id="address" placeholder="123 Main St, City, State" value={localDetails.address || ""} onChange={e => handleDetailChange("address", e.target.value)} className="bg-background/50" />
          </div>;
      default:
        return null;
    }
  };
  return <div className="space-y-6 animate-fade-in">
      <Card className="p-6 backdrop-blur-sm bg-card/80 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Choose Follow-Up Method
          </h3>
          {selectedChannel && <button type="button" onClick={() => setIsChannelSectionCollapsed(!isChannelSectionCollapsed)} className="text-muted-foreground hover:text-foreground transition-colors">
              {isChannelSectionCollapsed ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
            </button>}
        </div>
        {!isChannelSectionCollapsed && <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {channelOptions.map(option => {
          const Icon = option.icon;
          const isSelected = selectedChannel === option.value;
          return <button key={option.value} type="button" onClick={() => handleChannelSelect(option.value)} className={`
                  p-4 rounded-lg border-2 transition-all duration-200
                  flex flex-col items-center gap-2 text-center
                  ${isSelected ? "border-primary bg-primary/20 shadow-lg shadow-primary/20" : "border-border/50 bg-background/30 hover:border-primary/50 hover:bg-background/50"}
                `}>
                <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-sm font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                  {option.label}
                </span>
              </button>;
        })}
          </div>}
      </Card>

      {selectedChannel && <Card className="p-6 backdrop-blur-sm bg-card/80 border-primary/20 animate-fade-in">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Follow-up Location        
          </h3>
          {renderDetailFields()}
        </Card>}
    </div>;
}