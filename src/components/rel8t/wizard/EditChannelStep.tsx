import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Outreach } from "@/services/rel8t/outreachService";

interface EditChannelStepProps {
  outreach: Outreach;
  onNext: (data: {
    outreachChannel: string | null;
    channelDetails: Record<string, any> | null;
  }) => void;
  onPrevious: () => void;
}

export const EditChannelStep: React.FC<EditChannelStepProps> = ({
  outreach,
  onNext,
  onPrevious,
}) => {
  const [outreachChannel, setOutreachChannel] = useState(
    outreach.outreach_channel || "none"
  );
  const [channelDetails, setChannelDetails] = useState<Record<string, any>>(
    outreach.channel_details || {}
  );

  const handleChannelChange = (value: string) => {
    setOutreachChannel(value);
    setChannelDetails({});
  };

  const handleChannelDetailChange = (key: string, value: string) => {
    setChannelDetails((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    onNext({
      outreachChannel: outreachChannel === "none" ? null : outreachChannel,
      channelDetails: Object.keys(channelDetails).length > 0 ? channelDetails : null,
    });
  };

  const renderChannelFields = () => {
    switch (outreachChannel) {
      case "text":
      case "call":
        return (
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={channelDetails.phone || ""}
              onChange={(e) => handleChannelDetailChange("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        );
      case "email":
        return (
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={channelDetails.email || ""}
              onChange={(e) => handleChannelDetailChange("email", e.target.value)}
              placeholder="contact@example.com"
            />
          </div>
        );
      case "dm":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Input
                id="platform"
                value={channelDetails.platform || ""}
                onChange={(e) => handleChannelDetailChange("platform", e.target.value)}
                placeholder="LinkedIn, Twitter, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="handle">Handle/Username</Label>
              <Input
                id="handle"
                value={channelDetails.handle || ""}
                onChange={(e) => handleChannelDetailChange("handle", e.target.value)}
                placeholder="@username"
              />
            </div>
          </>
        );
      case "meeting":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="meetingPlatform">Meeting Platform</Label>
              <Input
                id="meetingPlatform"
                value={channelDetails.meetingPlatform || ""}
                onChange={(e) =>
                  handleChannelDetailChange("meetingPlatform", e.target.value)
                }
                placeholder="Zoom, Google Meet, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Meeting Link</Label>
              <Input
                id="link"
                type="url"
                value={channelDetails.link || ""}
                onChange={(e) => handleChannelDetailChange("link", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </>
        );
      case "irl":
        return (
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={channelDetails.address || ""}
              onChange={(e) => handleChannelDetailChange("address", e.target.value)}
              placeholder="123 Main St, City, State 12345"
              rows={3}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Follow-up Channel</h3>
        
        <div className="space-y-2">
          <Label htmlFor="channel">Channel</Label>
          <Select value={outreachChannel} onValueChange={handleChannelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="text">Text/SMS</SelectItem>
              <SelectItem value="call">Phone Call</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="dm">Direct Message</SelectItem>
              <SelectItem value="meeting">Virtual Meeting</SelectItem>
              <SelectItem value="irl">In-Person Meeting</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {renderChannelFields()}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
};
