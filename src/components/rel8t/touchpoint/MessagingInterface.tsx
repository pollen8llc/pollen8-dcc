import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { 
  touchpointChannels, 
  touchpointTones,
  MockNetworkContact,
  DevelopmentPathStep 
} from "@/data/mockNetworkData";
import { cn } from "@/lib/utils";

interface MessagingInterfaceProps {
  contact: MockNetworkContact;
  step: DevelopmentPathStep;
  onSave: (data: MessagingData) => void;
  onCancel: () => void;
}

export interface MessagingData {
  message: string;
  channel: string;
  tone: string;
  scheduledDate?: string;
}

// Rapport-building prompts based on contact context
function getConversationStarters(contact: MockNetworkContact, step: DevelopmentPathStep): string[] {
  const starters: string[] = [];
  
  // Based on how we met
  if (contact.howWeMet) {
    starters.push(`Reference when you first connected: "${contact.howWeMet.split(',')[0]}"`);
  }
  
  // Based on recent achievements
  if (contact.recentAchievements && contact.recentAchievements.length > 0) {
    starters.push(`Congratulate them on: "${contact.recentAchievements[0]}"`);
  }
  
  // Based on their industry
  starters.push(`Ask about trends in ${contact.industry}`);
  
  // Based on relationship warmth
  if (contact.connectionStrength === 'thin') {
    starters.push("Remind them briefly who you are");
    starters.push("Keep it short and low-pressure");
  } else if (contact.connectionStrength === 'thick') {
    starters.push("Be personal and reference shared experiences");
  }
  
  // Based on vibe notes
  if (contact.vibeNotes) {
    starters.push(`Keep in mind: "${contact.vibeNotes.substring(0, 60)}..."`);
  }
  
  return starters.slice(0, 4);
}

function getMessageTemplates(step: DevelopmentPathStep, contact: MockNetworkContact): string[] {
  const templates: string[] = [];
  const firstName = contact.name.split(' ')[0];
  
  switch (step.suggestedAction) {
    case 'soft_checkin':
      templates.push(
        `Hey ${firstName}, hope you're doing well! Just wanted to check in and see how things are going.`,
        `Hi ${firstName}! Been thinking about our last conversation and wanted to touch base.`,
        `Hey ${firstName}, saw something that reminded me of you and wanted to reach out!`
      );
      break;
    case 'send_resource':
      templates.push(
        `Hey ${firstName}, thought you might find this interesting given your work in ${contact.industry}...`,
        `Hi ${firstName}! Came across this and immediately thought of our conversation about...`
      );
      break;
    case 'post_event':
      templates.push(
        `Great meeting you at the event! Would love to continue our conversation about...`,
        `Hey ${firstName}, it was wonderful connecting with you. Let's stay in touch!`
      );
      break;
    default:
      templates.push(
        `Hey ${firstName}, hope you're well!`,
        `Hi ${firstName}! Wanted to reach out and...`
      );
  }
  
  return templates;
}

export function MessagingInterface({ contact, step, onSave, onCancel }: MessagingInterfaceProps) {
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState(step.suggestedChannel || 'dm');
  const [tone, setTone] = useState(step.suggestedTone || 'friendly');
  const [scheduledDate, setScheduledDate] = useState("");
  
  const conversationStarters = getConversationStarters(contact, step);
  const templates = getMessageTemplates(step, contact);
  
  // Filter relevant channels for messaging
  const messagingChannels = touchpointChannels.filter(c => 
    ['dm', 'email', 'social_reply'].includes(c.id)
  );

  const handleSave = () => {
    onSave({
      message,
      channel,
      tone,
      scheduledDate: scheduledDate || undefined
    });
  };

  return (
    <div className="space-y-6">
      {/* Step Context */}
      <div className="border-b border-border/40 pb-4">
        <h3 className="font-semibold text-lg">{step.name}</h3>
        <p className="text-sm text-muted-foreground">{step.description}</p>
      </div>

      {/* Rapport Building Prompts */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <h4 className="text-sm font-medium mb-3">Conversation Starters</h4>
        <ul className="space-y-2">
          {conversationStarters.map((starter, idx) => (
            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>{starter}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Message Templates */}
      <div>
        <Label className="text-sm mb-2 block">Quick Templates</Label>
        <div className="flex flex-wrap gap-2">
          {templates.map((template, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              className="text-xs h-auto py-2 px-3 text-left whitespace-normal"
              onClick={() => setMessage(template)}
            >
              {template.substring(0, 50)}...
            </Button>
          ))}
        </div>
      </div>

      {/* Channel Selection */}
      <div>
        <Label className="text-sm mb-2 block">Channel</Label>
        <div className="flex gap-2">
          {messagingChannels.map((ch) => (
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

      {/* Tone Selection */}
      <div>
        <Label className="text-sm mb-2 block">Tone</Label>
        <div className="flex gap-2">
          {touchpointTones.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={cn(
                "flex-1 p-3 rounded-lg border text-center transition-all",
                tone === t.id
                  ? "border-primary bg-primary/10"
                  : "border-border/40 hover:border-border"
              )}
            >
              <span className="text-sm font-medium">{t.label}</span>
              <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Message Composition */}
      <div>
        <Label className="text-sm mb-2 block">Your Message</Label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Write your message to ${contact.name.split(' ')[0]}...`}
          className="min-h-[150px] resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {message.length} characters
        </p>
      </div>

      {/* Schedule Option */}
      <div>
        <Label className="text-sm mb-2 block">Schedule for Later (Optional)</Label>
        <input
          type="datetime-local"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-border/40 bg-background text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border/40">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!message.trim()} className="flex-1">
          Save Message
        </Button>
      </div>
    </div>
  );
}
