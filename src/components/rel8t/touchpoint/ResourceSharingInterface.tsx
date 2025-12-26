import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  touchpointChannels,
  MockNetworkContact,
  DevelopmentPathStep 
} from "@/data/mockNetworkData";
import { cn } from "@/lib/utils";

interface ResourceSharingInterfaceProps {
  contact: MockNetworkContact;
  step: DevelopmentPathStep;
  onSave: (data: ResourceData) => void;
  onCancel: () => void;
}

export interface ResourceData {
  resourceType: string;
  resourceUrl: string;
  resourceTitle: string;
  personalNote: string;
  channel: string;
}

const resourceTypes = [
  { id: 'article', label: 'Article', description: 'Blog post or news piece' },
  { id: 'video', label: 'Video', description: 'YouTube, TED talk, etc.' },
  { id: 'podcast', label: 'Podcast', description: 'Episode or show' },
  { id: 'book', label: 'Book', description: 'Book recommendation' },
  { id: 'tool', label: 'Tool', description: 'App, software, service' },
  { id: 'event', label: 'Event', description: 'Conference, meetup' },
];

function getResourceSuggestions(contact: MockNetworkContact): string[] {
  const suggestions: string[] = [];
  
  // Industry-specific suggestions
  suggestions.push(`Articles about trends in ${contact.industry}`);
  suggestions.push(`Podcasts featuring ${contact.industry} leaders`);
  
  // Role-based suggestions
  if (contact.role.toLowerCase().includes('director') || contact.role.toLowerCase().includes('lead')) {
    suggestions.push("Leadership and management insights");
  }
  
  // Based on achievements
  if (contact.recentAchievements && contact.recentAchievements.length > 0) {
    suggestions.push(`Content related to: "${contact.recentAchievements[0]}"`);
  }
  
  // General relationship building
  suggestions.push("Something you genuinely found valuable");
  suggestions.push("Content that sparked a thought about them");
  
  return suggestions.slice(0, 5);
}

function getIntroNotes(contact: MockNetworkContact): string[] {
  const firstName = contact.name.split(' ')[0];
  return [
    `Saw this and thought of you, ${firstName}!`,
    `Given your work at ${contact.company}, thought you'd find this interesting.`,
    `This reminded me of our conversation about...`,
    `I found this really valuable and wanted to share it with you.`,
  ];
}

export function ResourceSharingInterface({ contact, step, onSave, onCancel }: ResourceSharingInterfaceProps) {
  const [resourceType, setResourceType] = useState("article");
  const [resourceUrl, setResourceUrl] = useState("");
  const [resourceTitle, setResourceTitle] = useState("");
  const [personalNote, setPersonalNote] = useState("");
  const [channel, setChannel] = useState(step.suggestedChannel || 'email');
  
  const resourceSuggestions = getResourceSuggestions(contact);
  const introNotes = getIntroNotes(contact);
  
  // Channels for sharing resources
  const sharingChannels = touchpointChannels.filter(c => 
    ['dm', 'email'].includes(c.id)
  );

  const handleSave = () => {
    onSave({
      resourceType,
      resourceUrl,
      resourceTitle,
      personalNote,
      channel
    });
  };

  return (
    <div className="space-y-6">
      {/* Step Context */}
      <div className="border-b border-border/40 pb-4">
        <h3 className="font-semibold text-lg">{step.name}</h3>
        <p className="text-sm text-muted-foreground">{step.description}</p>
      </div>

      {/* Resource Ideas */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <h4 className="text-sm font-medium mb-3">What to Share</h4>
        <p className="text-xs text-muted-foreground mb-3">
          Based on {contact.name.split(' ')[0]}'s profile and interests:
        </p>
        <ul className="space-y-2">
          {resourceSuggestions.map((suggestion, idx) => (
            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Resource Type */}
      <div>
        <Label className="text-sm mb-2 block">Resource Type</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {resourceTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setResourceType(type.id)}
              className={cn(
                "p-3 rounded-lg border text-center transition-all",
                resourceType === type.id
                  ? "border-primary bg-primary/10"
                  : "border-border/40 hover:border-border"
              )}
            >
              <span className="text-sm font-medium block">{type.label}</span>
              <span className="text-xs text-muted-foreground hidden sm:block">{type.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Resource Details */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm mb-2 block">Resource Title</Label>
          <Input
            value={resourceTitle}
            onChange={(e) => setResourceTitle(e.target.value)}
            placeholder="Name of the article, video, etc."
          />
        </div>
        <div>
          <Label className="text-sm mb-2 block">Link (Optional)</Label>
          <Input
            value={resourceUrl}
            onChange={(e) => setResourceUrl(e.target.value)}
            placeholder="https://..."
            type="url"
          />
        </div>
      </div>

      {/* Personal Note Templates */}
      <div>
        <Label className="text-sm mb-2 block">Quick Intros</Label>
        <div className="flex flex-wrap gap-2">
          {introNotes.map((note, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              className="text-xs h-auto py-2"
              onClick={() => setPersonalNote(note)}
            >
              {note.substring(0, 40)}...
            </Button>
          ))}
        </div>
      </div>

      {/* Personal Note */}
      <div>
        <Label className="text-sm mb-2 block">Personal Note</Label>
        <Textarea
          value={personalNote}
          onChange={(e) => setPersonalNote(e.target.value)}
          placeholder="Add a personal message explaining why you're sharing this..."
          className="min-h-[100px] resize-none"
        />
      </div>

      {/* Channel Selection */}
      <div>
        <Label className="text-sm mb-2 block">Share Via</Label>
        <div className="flex gap-2">
          {sharingChannels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setChannel(ch.id)}
              className={cn(
                "flex-1 p-3 rounded-lg border text-center transition-all",
                channel === ch.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/40 hover:border-border"
              )}
            >
              <span className="text-sm font-medium">{ch.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border/40">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={!resourceTitle.trim() || !personalNote.trim()} 
          className="flex-1"
        >
          Save Resource
        </Button>
      </div>
    </div>
  );
}
