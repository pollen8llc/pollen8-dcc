import { useParams, Link } from "react-router-dom";
import { mockNetworkContacts } from "@/data/mockNetworkData";
import { TimelineCard } from "@/components/rel8t/network/TimelineCard";
import { ConnectionStrengthGauge } from "@/components/rel8t/network/ConnectionStrengthGauge";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Clock, Star, Target, Plus } from "lucide-react";

export default function NetworkTimeline() {
  const { id } = useParams();
  const contact = mockNetworkContacts.find(c => c.id === id);
  
  if (!contact) return <div className="min-h-screen flex items-center justify-center"><p>Contact not found</p></div>;

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');
  const pastInteractions = [...contact.interactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const futureActions = contact.strategy?.actions.filter(a => a.status !== 'completed') || [];
  const completedActions = contact.strategy?.actions.filter(a => a.status === 'completed') || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
        <Link to={`/rel8/network/${id}/profile`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />Back to Profile
        </Link>

        {/* Contact Header */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-16 w-16">
            <AvatarImage src={contact.avatar} />
            <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{contact.name}</h1>
            <p className="text-muted-foreground">Professional Relationship Timeline</p>
          </div>
        </div>

        {/* Current Status */}
        <Card className="glass-card mb-8 border-l-4 border-l-primary">
          <CardHeader><CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-primary" />Present</CardTitle></CardHeader>
          <CardContent>
            <ConnectionStrengthGauge strength={contact.connectionStrength} />
            {contact.strategy && (
              <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-primary font-medium flex items-center gap-2"><Target className="h-4 w-4" />Active Strategy: {contact.strategy.intention}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Past Interactions */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Clock className="h-5 w-5 text-muted-foreground" />Past Interactions</h2>
            <div className="space-y-4">
              {pastInteractions.map(interaction => (
                <TimelineCard key={interaction.id} type="past" data={interaction} />
              ))}
              {completedActions.map(action => (
                <TimelineCard key={action.id} type="future" data={action} />
              ))}
              {pastInteractions.length === 0 && completedActions.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-8">No past interactions logged</p>
              )}
            </div>
          </div>

          {/* Future Planned */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Target className="h-5 w-5 text-primary" />Planned Touchpoints</h2>
            <div className="space-y-4">
              {futureActions.map(action => (
                <TimelineCard key={action.id} type="future" data={action} />
              ))}
              {futureActions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm mb-4">No planned actions yet</p>
                  <Link to={`/rel8/network/${id}/strategy`}>
                    <Button variant="outline" size="sm" className="gap-2"><Plus className="h-4 w-4" />Create Strategy</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl"><Rel8OnlyNavigation /></div>
    </div>
  );
}
