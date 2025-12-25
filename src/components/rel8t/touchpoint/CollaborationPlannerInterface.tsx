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

interface CollaborationPlannerInterfaceProps {
  contact: MockNetworkContact;
  step: DevelopmentPathStep;
  onSave: (data: CollaborationData) => void;
  onCancel: () => void;
}

export interface CollaborationData {
  collaborationType: string;
  title: string;
  description: string;
  goals: string[];
  timeline: string;
  actionItems: ActionItem[];
  notes: string;
}

interface ActionItem {
  id: string;
  task: string;
  owner: 'me' | 'them' | 'both';
  dueDate?: string;
}

const collaborationTypes = [
  { id: 'project', label: 'Joint Project', description: 'Work together on something' },
  { id: 'introduction', label: 'Mutual Introductions', description: 'Connect each other to contacts' },
  { id: 'content', label: 'Content Collaboration', description: 'Co-create content together' },
  { id: 'mentorship', label: 'Mentorship', description: 'Ongoing guidance relationship' },
  { id: 'partnership', label: 'Business Partnership', description: 'Formal business relationship' },
  { id: 'referral', label: 'Referral Exchange', description: 'Send opportunities to each other' },
];

const timelineOptions = [
  { id: 'immediate', label: 'This Week' },
  { id: 'short', label: '1-2 Weeks' },
  { id: 'medium', label: '1 Month' },
  { id: 'long', label: '3+ Months' },
  { id: 'ongoing', label: 'Ongoing' },
];

function getCollaborationIdeas(contact: MockNetworkContact): string[] {
  const ideas: string[] = [];
  
  // Based on their industry and role
  ideas.push(`Explore synergies between ${contact.industry} and your expertise`);
  
  // Based on relationship type
  if (contact.relationshipType === 'creative_peer') {
    ideas.push("Co-create a piece of content or project");
    ideas.push("Collaborate on a creative brief");
  } else if (contact.relationshipType === 'career_ally') {
    ideas.push("Share job opportunities and referrals");
    ideas.push("Provide mutual professional support");
  } else if (contact.relationshipType === 'thought_partner') {
    ideas.push("Write an article or case study together");
    ideas.push("Co-host a workshop or webinar");
  }
  
  // Based on influence
  if (contact.networkInfluence === 'high' || contact.networkInfluence === 'very_high') {
    ideas.push("Leverage their network for introductions");
    ideas.push("Partner on visibility opportunities");
  }
  
  // General ideas
  ideas.push("Identify mutual wins and shared goals");
  ideas.push("Start small, build trust, then expand");
  
  return ideas.slice(0, 5);
}

function getMutualValuePrompts(contact: MockNetworkContact): { forYou: string[]; forThem: string[] } {
  const forYou: string[] = [];
  const forThem: string[] = [];
  
  // What they can offer
  if (contact.networkInfluence === 'high' || contact.networkInfluence === 'very_high') {
    forYou.push("Access to their network");
  }
  forYou.push(`Expertise in ${contact.industry}`);
  forYou.push(`Perspective from ${contact.role} role`);
  
  // What you can offer (general)
  forThem.push("Your unique skills and expertise");
  forThem.push("Connections in your network");
  forThem.push("Fresh perspectives and ideas");
  forThem.push("Active support and collaboration");
  
  return { forYou, forThem };
}

export function CollaborationPlannerInterface({ contact, step, onSave, onCancel }: CollaborationPlannerInterfaceProps) {
  const [collaborationType, setCollaborationType] = useState("project");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [goalInput, setGoalInput] = useState("");
  const [timeline, setTimeline] = useState("medium");
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [actionInput, setActionInput] = useState("");
  const [actionOwner, setActionOwner] = useState<'me' | 'them' | 'both'>('me');
  const [notes, setNotes] = useState("");
  
  const collaborationIdeas = getCollaborationIdeas(contact);
  const mutualValue = getMutualValuePrompts(contact);

  const addGoal = () => {
    if (goalInput.trim()) {
      setGoals([...goals, goalInput.trim()]);
      setGoalInput("");
    }
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const addActionItem = () => {
    if (actionInput.trim()) {
      setActionItems([...actionItems, {
        id: Date.now().toString(),
        task: actionInput.trim(),
        owner: actionOwner
      }]);
      setActionInput("");
    }
  };

  const removeActionItem = (id: string) => {
    setActionItems(actionItems.filter(a => a.id !== id));
  };

  const handleSave = () => {
    onSave({
      collaborationType,
      title,
      description,
      goals,
      timeline,
      actionItems,
      notes
    });
  };

  return (
    <div className="space-y-6">
      {/* Step Context */}
      <div className="border-b border-border/40 pb-4">
        <h3 className="font-semibold text-lg">{step.name}</h3>
        <p className="text-sm text-muted-foreground">{step.description}</p>
      </div>

      {/* Collaboration Ideas */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <h4 className="text-sm font-medium mb-3">Collaboration Ideas</h4>
        <ul className="space-y-2">
          {collaborationIdeas.map((idea, idx) => (
            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>{idea}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Mutual Value */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-muted/30 border-border/40">
          <h4 className="text-sm font-medium mb-2">What they bring</h4>
          <ul className="space-y-1">
            {mutualValue.forYou.map((item, idx) => (
              <li key={idx} className="text-xs text-muted-foreground">• {item}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-4 bg-muted/30 border-border/40">
          <h4 className="text-sm font-medium mb-2">What you bring</h4>
          <ul className="space-y-1">
            {mutualValue.forThem.map((item, idx) => (
              <li key={idx} className="text-xs text-muted-foreground">• {item}</li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Collaboration Type */}
      <div>
        <Label className="text-sm mb-2 block">Type of Collaboration</Label>
        <div className="grid grid-cols-2 gap-2">
          {collaborationTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setCollaborationType(type.id)}
              className={cn(
                "p-3 rounded-lg border text-left transition-all",
                collaborationType === type.id
                  ? "border-primary bg-primary/10"
                  : "border-border/40 hover:border-border"
              )}
            >
              <span className="text-sm font-medium block">{type.label}</span>
              <span className="text-xs text-muted-foreground">{type.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm mb-2 block">Collaboration Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`e.g., "${contact.name.split(' ')[0]} x You: Project Name"`}
          />
        </div>
        <div>
          <Label className="text-sm mb-2 block">Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What are you exploring together?"
            className="min-h-[80px] resize-none"
          />
        </div>
      </div>

      {/* Goals */}
      <div>
        <Label className="text-sm mb-2 block">Goals</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            placeholder="Add a goal..."
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
          />
          <Button variant="outline" onClick={addGoal}>Add</Button>
        </div>
        {goals.length > 0 && (
          <div className="space-y-2">
            {goals.map((goal, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/30">
                <span className="text-sm flex-1">{goal}</span>
                <button 
                  onClick={() => removeGoal(idx)}
                  className="text-muted-foreground hover:text-destructive text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div>
        <Label className="text-sm mb-2 block">Timeline</Label>
        <div className="flex gap-2 flex-wrap">
          {timelineOptions.map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeline(t.id)}
              className={cn(
                "px-4 py-2 rounded-lg border text-sm transition-all",
                timeline === t.id
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border/40 hover:border-border"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div>
        <Label className="text-sm mb-2 block">Action Items</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={actionInput}
            onChange={(e) => setActionInput(e.target.value)}
            placeholder="Add an action item..."
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addActionItem())}
          />
          <select
            value={actionOwner}
            onChange={(e) => setActionOwner(e.target.value as 'me' | 'them' | 'both')}
            className="px-3 py-2 rounded-lg border border-border/40 bg-background text-sm"
          >
            <option value="me">Me</option>
            <option value="them">Them</option>
            <option value="both">Both</option>
          </select>
          <Button variant="outline" onClick={addActionItem}>Add</Button>
        </div>
        {actionItems.length > 0 && (
          <div className="space-y-2">
            {actionItems.map((item) => (
              <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/30">
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded",
                  item.owner === 'me' ? 'bg-primary/20 text-primary' :
                  item.owner === 'them' ? 'bg-amber-500/20 text-amber-600' :
                  'bg-muted text-muted-foreground'
                )}>
                  {item.owner === 'me' ? 'You' : item.owner === 'them' ? contact.name.split(' ')[0] : 'Both'}
                </span>
                <span className="text-sm flex-1">{item.task}</span>
                <button 
                  onClick={() => removeActionItem(item.id)}
                  className="text-muted-foreground hover:text-destructive text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <Label className="text-sm mb-2 block">Additional Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any other thoughts, concerns, or context..."
          className="min-h-[80px] resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border/40">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={!title.trim()} 
          className="flex-1"
        >
          Save Collaboration Plan
        </Button>
      </div>
    </div>
  );
}
