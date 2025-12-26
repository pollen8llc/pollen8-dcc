import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  MockNetworkContact,
  DevelopmentPathStep 
} from "@/data/mockNetworkData";
import { cn } from "@/lib/utils";

interface MeetingSchedulerInterfaceProps {
  contact: MockNetworkContact;
  step: DevelopmentPathStep;
  onSave: (data: MeetingData) => void;
  onCancel: () => void;
}

export interface MeetingData {
  meetingType: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  platform?: string;
  agenda: string;
  talkingPoints: string[];
  sendCalendarInvite: boolean;
}

const meetingTypes = [
  { id: 'coffee', label: 'Coffee Chat', description: 'Casual in-person meetup', duration: '30' },
  { id: 'lunch', label: 'Lunch', description: 'Meal together', duration: '60' },
  { id: 'call', label: 'Phone Call', description: 'Voice conversation', duration: '30' },
  { id: 'video', label: 'Video Call', description: 'Zoom, Meet, etc.', duration: '45' },
  { id: 'walk', label: 'Walk & Talk', description: 'Active conversation', duration: '45' },
  { id: 'event', label: 'Event Meetup', description: 'Connect at an event', duration: '30' },
];

const durationOptions = ['15', '30', '45', '60', '90'];

const videoPlatforms = [
  { id: 'zoom', label: 'Zoom' },
  { id: 'meet', label: 'Google Meet' },
  { id: 'teams', label: 'MS Teams' },
  { id: 'facetime', label: 'FaceTime' },
];

function getTalkingPointSuggestions(contact: MockNetworkContact, step: DevelopmentPathStep): string[] {
  const points: string[] = [];
  
  // Based on relationship type
  if (contact.relationshipType === 'mentor') {
    points.push("Ask for advice on your current challenges");
    points.push("Discuss your career goals and get feedback");
  } else if (contact.relationshipType === 'thought_partner') {
    points.push("Explore ideas you've been working on");
    points.push("Get their perspective on industry trends");
  } else if (contact.relationshipType === 'career_ally') {
    points.push("Share what you're working on professionally");
    points.push("Discuss potential collaboration opportunities");
  }
  
  // Based on their achievements
  if (contact.recentAchievements && contact.recentAchievements.length > 0) {
    points.push(`Ask about: "${contact.recentAchievements[0]}"`);
  }
  
  // Based on connection strength
  if (contact.connectionStrength === 'thin') {
    points.push("Learn more about their background");
    points.push("Find common ground and shared interests");
  } else if (contact.connectionStrength === 'thick') {
    points.push("Check in on personal life updates");
    points.push("Discuss deeper professional topics");
  }
  
  // Industry-specific
  points.push(`Discuss ${contact.industry} trends and news`);
  
  // General
  points.push("Share what you've been excited about lately");
  points.push("Ask how you can be helpful to them");
  
  return points.slice(0, 6);
}

function getRapportTips(contact: MockNetworkContact): string[] {
  const tips: string[] = [];
  
  if (contact.vibeNotes) {
    tips.push(contact.vibeNotes);
  }
  
  if (contact.connectionStrength === 'thin') {
    tips.push("This is still a new connection - focus on listening and learning");
  }
  
  if (contact.connectionStrength === 'thin') {
    tips.push("Keep it professional and don't overstay");
  }
  
  tips.push(`Last interaction: ${contact.lastInteraction}`);
  
  if (contact.mutualConnections > 5) {
    tips.push(`You have ${contact.mutualConnections} mutual connections to reference`);
  }
  
  return tips.slice(0, 3);
}

export function MeetingSchedulerInterface({ contact, step, onSave, onCancel }: MeetingSchedulerInterfaceProps) {
  const [meetingType, setMeetingType] = useState(
    step.suggestedChannel === 'call' ? 'call' : 
    step.suggestedChannel === 'in_person' ? 'coffee' : 'video'
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(
    meetingTypes.find(m => m.id === meetingType)?.duration || '30'
  );
  const [location, setLocation] = useState("");
  const [platform, setPlatform] = useState("zoom");
  const [agenda, setAgenda] = useState("");
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [sendCalendarInvite, setSendCalendarInvite] = useState(true);
  
  const talkingPointSuggestions = getTalkingPointSuggestions(contact, step);
  const rapportTips = getRapportTips(contact);
  
  const isVirtual = ['call', 'video'].includes(meetingType);

  const togglePoint = (point: string) => {
    setSelectedPoints(prev => 
      prev.includes(point) 
        ? prev.filter(p => p !== point)
        : [...prev, point]
    );
  };

  const handleSave = () => {
    onSave({
      meetingType,
      date,
      time,
      duration,
      location,
      platform: isVirtual ? platform : undefined,
      agenda,
      talkingPoints: selectedPoints,
      sendCalendarInvite
    });
  };

  return (
    <div className="space-y-6">
      {/* Step Context */}
      <div className="border-b border-border/40 pb-4">
        <h3 className="font-semibold text-lg">{step.name}</h3>
        <p className="text-sm text-muted-foreground">{step.description}</p>
      </div>

      {/* Rapport Tips */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <h4 className="text-sm font-medium mb-3">Know Before You Meet</h4>
        <ul className="space-y-2">
          {rapportTips.map((tip, idx) => (
            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Meeting Type */}
      <div>
        <Label className="text-sm mb-2 block">Meeting Type</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {meetingTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setMeetingType(type.id);
                setDuration(type.duration);
              }}
              className={cn(
                "p-3 rounded-lg border text-center transition-all",
                meetingType === type.id
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

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm mb-2 block">Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-sm mb-2 block">Time</Label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      {/* Duration */}
      <div>
        <Label className="text-sm mb-2 block">Duration</Label>
        <div className="flex flex-wrap gap-2">
          {durationOptions.map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={cn(
                "flex-1 min-w-[60px] py-2 rounded-lg border text-sm transition-all",
                duration === d
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border/40 hover:border-border"
              )}
            >
              {d} min
            </button>
          ))}
        </div>
      </div>

      {/* Location or Platform */}
      {isVirtual ? (
        <div>
          <Label className="text-sm mb-2 block">Platform</Label>
          <div className="grid grid-cols-2 sm:flex gap-2">
            {videoPlatforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={cn(
                  "sm:flex-1 py-2 rounded-lg border text-sm transition-all",
                  platform === p.id
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border/40 hover:border-border"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <Label className="text-sm mb-2 block">Location</Label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Coffee shop, restaurant, office..."
          />
        </div>
      )}

      {/* Talking Points */}
      <div>
        <Label className="text-sm mb-2 block">Talking Points (Select to add)</Label>
        <div className="space-y-2">
          {talkingPointSuggestions.map((point, idx) => (
            <button
              key={idx}
              onClick={() => togglePoint(point)}
              className={cn(
                "w-full p-3 rounded-lg border text-left text-sm transition-all flex items-center gap-2",
                selectedPoints.includes(point)
                  ? "border-primary bg-primary/10"
                  : "border-border/40 hover:border-border"
              )}
            >
              <span className={cn(
                "h-4 w-4 rounded border flex items-center justify-center shrink-0",
                selectedPoints.includes(point)
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-border"
              )}>
                {selectedPoints.includes(point) && "✓"}
              </span>
              <span>{point}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Agenda */}
      <div>
        <Label className="text-sm mb-2 block">Agenda / Notes</Label>
        <Textarea
          value={agenda}
          onChange={(e) => setAgenda(e.target.value)}
          placeholder="What do you want to accomplish in this meeting?"
          className="min-h-[80px] resize-none"
        />
      </div>

      {/* Calendar Invite Toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/40">
        <div>
          <span className="text-sm font-medium">Send Calendar Invite</span>
          <p className="text-xs text-muted-foreground">
            {contact.email ? `To: ${contact.email}` : 'No email on file'}
          </p>
        </div>
        <button
          onClick={() => setSendCalendarInvite(!sendCalendarInvite)}
          className={cn(
            "h-6 w-11 rounded-full transition-colors",
            sendCalendarInvite ? "bg-primary" : "bg-muted"
          )}
        >
          <div className={cn(
            "h-5 w-5 rounded-full bg-white shadow transition-transform",
            sendCalendarInvite ? "translate-x-5" : "translate-x-0.5"
          )} />
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border/40">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={!date || !time} 
          className="flex-1"
        >
          {sendCalendarInvite ? 'Schedule & Send Invite' : 'Save Meeting'}
        </Button>
      </div>
    </div>
  );
}
