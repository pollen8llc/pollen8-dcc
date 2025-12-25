import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { WarmthSlider } from "./WarmthSlider";
import { useToast } from "@/hooks/use-toast";
import { MapPin, MessageSquare, Lightbulb, ArrowRight } from "lucide-react";

interface InteractionLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactName: string;
}

export function InteractionLogModal({ 
  open, 
  onOpenChange, 
  contactName 
}: InteractionLogModalProps) {
  const { toast } = useToast();
  const [location, setLocation] = useState('');
  const [topics, setTopics] = useState('');
  const [warmth, setWarmth] = useState<'cold' | 'neutral' | 'warm' | 'enthusiastic'>('neutral');
  const [strengthened, setStrengthened] = useState<'yes' | 'no' | 'unsure'>('unsure');
  const [opportunities, setOpportunities] = useState('');
  const [followUp, setFollowUp] = useState('');

  const handleSubmit = () => {
    toast({
      title: "Interaction Logged",
      description: `Your interaction with ${contactName} has been recorded.`,
    });
    onOpenChange(false);
    // Reset form
    setLocation('');
    setTopics('');
    setWarmth('neutral');
    setStrengthened('unsure');
    setOpportunities('');
    setFollowUp('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg glass-morphism border-border/30">
        <DialogHeader>
          <DialogTitle className="text-xl">Log Interaction with {contactName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Location/Venue */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Where did you meet?
            </Label>
            <Input
              placeholder="e.g., Coffee at Blue Bottle, Industry mixer, Video call"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-card/40 border-border/30"
            />
          </div>

          {/* Topics Discussed */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              What did you talk about?
            </Label>
            <Textarea
              placeholder="Key topics, shared interests, insights..."
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              className="bg-card/40 border-border/30 min-h-[80px]"
            />
          </div>

          {/* Warmth Level */}
          <WarmthSlider value={warmth} onChange={setWarmth} />

          {/* Relationship Strengthened */}
          <div className="space-y-3">
            <Label>Did the relationship strengthen?</Label>
            <RadioGroup
              value={strengthened}
              onValueChange={(val) => setStrengthened(val as typeof strengthened)}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes" className="text-green-400 cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no" className="text-red-400 cursor-pointer">No</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="unsure" id="unsure" />
                <Label htmlFor="unsure" className="text-muted-foreground cursor-pointer">Unsure</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Future Opportunities */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Future opportunities mentioned?
            </Label>
            <Textarea
              placeholder="Any collaborations, introductions, or opportunities discussed..."
              value={opportunities}
              onChange={(e) => setOpportunities(e.target.value)}
              className="bg-card/40 border-border/30"
            />
          </div>

          {/* Follow-up Recommended */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-primary" />
              Recommended follow-up?
            </Label>
            <Input
              placeholder="e.g., Send article, Schedule coffee, Intro to Alex"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              className="bg-card/40 border-border/30"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Log Interaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
