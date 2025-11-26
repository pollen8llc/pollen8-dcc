import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { format } from "date-fns";

interface OutreachEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  outreach: Outreach;
  onSave: (updates: Partial<Outreach>) => Promise<void>;
}

export const OutreachEditDialog: React.FC<OutreachEditDialogProps> = ({
  open,
  onOpenChange,
  outreach,
  onSave,
}) => {
  const [title, setTitle] = useState(outreach.title);
  const [description, setDescription] = useState(outreach.description || "");
  const [dueDate, setDueDate] = useState(
    format(new Date(outreach.due_date), "yyyy-MM-dd")
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    outreach.priority
  );
  const [outreachChannel, setOutreachChannel] = useState(
    outreach.outreach_channel || ""
  );
  const [channelDetails, setChannelDetails] = useState<Record<string, any>>(
    outreach.channel_details || {}
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTitle(outreach.title);
    setDescription(outreach.description || "");
    setDueDate(format(new Date(outreach.due_date), "yyyy-MM-dd"));
    setPriority(outreach.priority);
    setOutreachChannel(outreach.outreach_channel || "");
    setChannelDetails(outreach.channel_details || {});
  }, [outreach]);

  const handleChannelChange = (value: string) => {
    setOutreachChannel(value);
    // Reset channel details when channel type changes
    setChannelDetails({});
  };

  const handleChannelDetailChange = (key: string, value: string) => {
    setChannelDetails((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const updates: Partial<Outreach> = {
        title,
        description: description || null,
        due_date: new Date(dueDate).toISOString(),
        priority,
        outreach_channel: outreachChannel || null,
        channel_details: Object.keys(channelDetails).length > 0 ? channelDetails : null,
      };

      await onSave(updates);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-md bg-card/95 border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Edit Outreach Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this outreach task..."
              rows={4}
            />
          </div>

          {/* Due Date & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Follow-up Channel Section */}
          <div className="space-y-4 pt-4 border-t border-border/20">
            <h3 className="text-lg font-semibold">Follow-up Channel</h3>
            
            <div className="space-y-2">
              <Label htmlFor="channel">Channel</Label>
              <Select value={outreachChannel} onValueChange={handleChannelChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
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
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
