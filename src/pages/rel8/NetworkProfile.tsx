import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { mockNetworkContacts } from "@/data/mockNetworkData";
import { ConnectionStrengthGauge } from "@/components/rel8t/network/ConnectionStrengthGauge";
import { RelationshipTypeBadge } from "@/components/rel8t/network/RelationshipTypeBadge";
import { InteractionLogModal } from "@/components/rel8t/network/InteractionLogModal";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Mail, Phone, Users, Star, Target, Clock, Calendar, Trophy, Edit } from "lucide-react";
import { format, parseISO, formatDistanceToNow } from "date-fns";

export default function NetworkProfile() {
  const { id } = useParams();
  const [showLogModal, setShowLogModal] = useState(false);
  
  const contact = mockNetworkContacts.find(c => c.id === id);
  
  if (!contact) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Contact not found</p>
      </div>
    );
  }

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  const influenceLabels: Record<string, string> = {
    low: 'Low', medium: 'Medium', high: 'High', very_high: 'Very High'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Back Button */}
        <Link to="/rel8/network" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Network
        </Link>

        {/* Hero Section */}
        <div className="glass-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24 ring-4 ring-primary/20">
              <AvatarImage src={contact.avatar} />
              <AvatarFallback className="text-2xl">{getInitials(contact.name)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-2xl font-bold">{contact.name}</h1>
                  <p className="text-muted-foreground">{contact.role} at {contact.company}</p>
                </div>
                <Badge variant="secondary">{contact.industry}</Badge>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{contact.location}</span>
                {contact.email && <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{contact.email}</span>}
                {contact.phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{contact.phone}</span>}
              </div>
              
              <div className="mt-4">
                <RelationshipTypeBadge type={contact.relationshipType} />
              </div>
            </div>
          </div>
        </div>

        {/* Social Capital Metrics */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4 text-primary" />Connection Strength</CardTitle></CardHeader>
            <CardContent>
              <ConnectionStrengthGauge strength={contact.connectionStrength} />
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < contact.trustRating ? 'text-amber-400 fill-amber-400' : 'text-muted'}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Trust Rating</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4 text-primary" />Network Influence</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">{influenceLabels[contact.networkInfluence]}</div>
              <p className="text-sm text-muted-foreground mb-4">{contact.mutualConnections} mutual connections</p>
              <div className="text-sm"><Clock className="h-4 w-4 inline mr-1" />Last: {formatDistanceToNow(parseISO(contact.lastInteraction), { addSuffix: true })}</div>
            </CardContent>
          </Card>
        </div>

        {/* How We Met & Vibe */}
        <Card className="glass-card mb-6">
          <CardHeader><CardTitle className="text-base">About This Relationship</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><p className="text-sm text-muted-foreground mb-1">How we met</p><p>{contact.howWeMet}</p></div>
            <div><p className="text-sm text-muted-foreground mb-1">Vibe notes</p><p>{contact.vibeNotes}</p></div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        {contact.recentAchievements.length > 0 && (
          <Card className="glass-card mb-6">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Trophy className="h-4 w-4 text-amber-400" />Recent Achievements</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {contact.recentAchievements.map((achievement, i) => (
                  <Badge key={i} variant="secondary">{achievement}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link to={`/rel8/network/${id}/strategy`}><Button className="gap-2"><Target className="h-4 w-4" />Build Strategy</Button></Link>
          <Link to={`/rel8/network/${id}/timeline`}><Button variant="outline" className="gap-2"><Calendar className="h-4 w-4" />View Timeline</Button></Link>
          <Button variant="outline" className="gap-2" onClick={() => setShowLogModal(true)}><Edit className="h-4 w-4" />Log Interaction</Button>
        </div>
      </div>

      <InteractionLogModal open={showLogModal} onOpenChange={setShowLogModal} contactName={contact.name} />

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
        <Rel8OnlyNavigation />
      </div>
    </div>
  );
}
