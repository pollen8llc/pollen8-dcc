import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { mockNetworkContacts, intentionTemplates, actionTemplates, touchpointChannels, touchpointTones } from "@/data/mockNetworkData";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Check, Heart, Brain, Lightbulb, Orbit, Handshake, RefreshCw, Calendar, FileText, MessageSquare, PartyPopper, UserPlus, Coffee, ThumbsUp, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const intentionIcons: Record<string, React.ComponentType<{ className?: string }>> = { orbit: Orbit, friendship: Heart, collaborate: Lightbulb, top_of_mind: Brain, partnership: Handshake, reconnect: RefreshCw };
const actionIcons: Record<string, React.ComponentType<{ className?: string }>> = { attend_event: Calendar, send_resource: FileText, soft_checkin: MessageSquare, invite_mixer: PartyPopper, introduce: UserPlus, coffee: Coffee, compliment: ThumbsUp, post_event: Send, co_create: Lightbulb };

export default function NetworkStrategy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const contact = mockNetworkContacts.find(c => c.id === id);
  
  const [step, setStep] = useState(1);
  const [selectedIntention, setSelectedIntention] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [actionConfigs, setActionConfigs] = useState<Record<string, { date: string; channel: string; tone: string }>>({});

  if (!contact) return <div className="min-h-screen flex items-center justify-center"><p>Contact not found</p></div>;

  const toggleAction = (actionId: string) => {
    if (selectedActions.includes(actionId)) {
      setSelectedActions(selectedActions.filter(a => a !== actionId));
      const newConfigs = { ...actionConfigs };
      delete newConfigs[actionId];
      setActionConfigs(newConfigs);
    } else {
      setSelectedActions([...selectedActions, actionId]);
      setActionConfigs({ ...actionConfigs, [actionId]: { date: '', channel: 'email', tone: 'friendly' } });
    }
  };

  const updateActionConfig = (actionId: string, field: string, value: string) => {
    setActionConfigs({ ...actionConfigs, [actionId]: { ...actionConfigs[actionId], [field]: value } });
  };

  const handleSave = () => {
    toast({ title: "Strategy Saved!", description: `Your relationship strategy for ${contact.name} has been created.` });
    navigate(`/rel8/actv8/${id}/timeline`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="container max-w-3xl mx-auto px-4 py-6 pb-24">
        <Link to={`/rel8/actv8/${id}/profile`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />Back to Profile
        </Link>

        <h1 className="text-2xl font-bold mb-2">Build Strategy for {contact.name}</h1>
        <p className="text-muted-foreground mb-6">Define your intention and plan meaningful touchpoints</p>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={cn("flex-1 h-2 rounded-full", s <= step ? "bg-primary" : "bg-muted")} />
          ))}
        </div>

        {/* Step 1: Intention */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">What's your intention?</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {intentionTemplates.map(intention => {
                const Icon = intentionIcons[intention.id] || Heart;
                return (
                  <Card key={intention.id} className={cn("glass-card cursor-pointer transition-all", selectedIntention === intention.id && "ring-2 ring-primary")} onClick={() => setSelectedIntention(intention.id)}>
                    <CardContent className="p-4 flex items-start gap-3">
                      <Icon className="h-5 w-5 text-primary mt-0.5" />
                      <div><p className="font-medium">{intention.label}</p><p className="text-xs text-muted-foreground">{intention.description}</p></div>
                      {selectedIntention === intention.id && <Check className="h-5 w-5 text-primary ml-auto" />}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Button className="w-full mt-4" disabled={!selectedIntention} onClick={() => setStep(2)}>Continue <ArrowRight className="h-4 w-4 ml-2" /></Button>
          </div>
        )}

        {/* Step 2: Actions */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select connection actions</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {actionTemplates.map(action => {
                const Icon = actionIcons[action.id] || MessageSquare;
                const isSelected = selectedActions.includes(action.id);
                return (
                  <Card key={action.id} className={cn("glass-card cursor-pointer transition-all", isSelected && "ring-2 ring-primary")} onClick={() => toggleAction(action.id)}>
                    <CardContent className="p-4 flex items-start gap-3">
                      <Icon className="h-5 w-5 text-primary mt-0.5" />
                      <div><p className="font-medium text-sm">{action.label}</p><p className="text-xs text-muted-foreground">{action.description}</p></div>
                      {isSelected && <Check className="h-5 w-5 text-primary ml-auto" />}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1" disabled={selectedActions.length === 0} onClick={() => setStep(3)}>Configure Actions <ArrowRight className="h-4 w-4 ml-2" /></Button>
            </div>
          </div>
        )}

        {/* Step 3: Configure */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Configure each action</h2>
            {selectedActions.map(actionId => {
              const action = actionTemplates.find(a => a.id === actionId);
              const config = actionConfigs[actionId];
              return (
                <Card key={actionId} className="glass-card">
                  <CardContent className="p-4 space-y-3">
                    <p className="font-medium">{action?.label}</p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div><label className="text-xs text-muted-foreground">When</label><Input type="date" value={config?.date || ''} onChange={e => updateActionConfig(actionId, 'date', e.target.value)} className="bg-card/40" /></div>
                      <div><label className="text-xs text-muted-foreground">Channel</label>
                        <div className="flex flex-wrap gap-1 mt-1">{touchpointChannels.map(ch => (<Badge key={ch.id} variant={config?.channel === ch.id ? "default" : "outline"} className="cursor-pointer text-xs" onClick={() => updateActionConfig(actionId, 'channel', ch.id)}>{ch.label}</Badge>))}</div>
                      </div>
                      <div><label className="text-xs text-muted-foreground">Tone</label>
                        <div className="flex flex-wrap gap-1 mt-1">{touchpointTones.map(t => (<Badge key={t.id} variant={config?.tone === t.id ? "default" : "outline"} className="cursor-pointer text-xs" onClick={() => updateActionConfig(actionId, 'tone', t.id)}>{t.label}</Badge>))}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1" onClick={handleSave}>Save Strategy <Check className="h-4 w-4 ml-2" /></Button>
            </div>
          </div>
        )}
      </div>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl"><Rel8OnlyNavigation /></div>
    </div>
  );
}
