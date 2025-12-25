import { mockNetworkContacts, connectionStrengths } from "@/data/mockNetworkData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { 
  Clock, TrendingUp, AlertCircle, Calendar, Users, 
  Zap, Target, ArrowRight 
} from "lucide-react";
import { formatDistanceToNow, parseISO, differenceInDays } from "date-fns";

export function InsightCards() {
  // Calculate insights from mock data
  const now = new Date();
  
  const dormantContacts = mockNetworkContacts.filter(c => 
    differenceInDays(now, parseISO(c.lastInteraction)) > 60
  );
  
  const gainingMomentum = mockNetworkContacts.filter(c => 
    c.connectionStrength === 'growing' && 
    differenceInDays(now, parseISO(c.lastInteraction)) < 30
  );
  
  const highValueContacts = mockNetworkContacts.filter(c => 
    (c.networkInfluence === 'high' || c.networkInfluence === 'very_high') &&
    c.connectionStrength !== 'thick'
  );

  const contactsWithStrategies = mockNetworkContacts.filter(c => c.strategy);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Connection Health Overview */}
      <Card className="glass-card col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Network Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {connectionStrengths.map(strength => {
              const count = mockNetworkContacts.filter(c => c.connectionStrength === strength.id).length;
              return (
                <div key={strength.id} className="text-center p-4 rounded-lg bg-card/40">
                  <div 
                    className="text-3xl font-bold mb-1"
                    style={{ color: strength.color }}
                  >
                    {count}
                  </div>
                  <div className="text-sm text-muted-foreground">{strength.label}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Haven't Spoken To */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-400">
            <Clock className="h-5 w-5" />
            Need Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Haven't connected in 60+ days
          </p>
          <div className="space-y-3">
            {dormantContacts.slice(0, 4).map(contact => (
              <Link 
                key={contact.id}
                to={`/rel8/actv8/${contact.id}/profile`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-card/60 transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={contact.avatar} />
                  <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(parseISO(contact.lastInteraction), { addSuffix: true })}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
            {dormantContacts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                All caught up! 🎉
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gaining Momentum */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <TrendingUp className="h-5 w-5" />
            Gaining Momentum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Growing relationships with recent activity
          </p>
          <div className="space-y-3">
            {gainingMomentum.slice(0, 4).map(contact => (
              <Link 
                key={contact.id}
                to={`/rel8/actv8/${contact.id}/profile`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-card/60 transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={contact.avatar} />
                  <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{contact.name}</p>
                  <Badge variant="outline" className="text-xs text-green-400 border-green-400/30">
                    Growing
                  </Badge>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
            {gainingMomentum.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Start building momentum with your network
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* High Value Opportunities */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Target className="h-5 w-5" />
            High-Value Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Influential contacts to develop
          </p>
          <div className="space-y-3">
            {highValueContacts.slice(0, 4).map(contact => (
              <Link 
                key={contact.id}
                to={`/rel8/actv8/${contact.id}/profile`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-card/60 transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={contact.avatar} />
                  <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{contact.name}</p>
                  <Badge variant="outline" className="text-xs text-purple-400 border-purple-400/30">
                    {contact.networkInfluence === 'very_high' ? 'Very High' : 'High'} Influence
                  </Badge>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Strategies */}
      <Card className="glass-card col-span-full md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Active Relationship Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contactsWithStrategies.map(contact => (
              <Link 
                key={contact.id}
                to={`/rel8/actv8/${contact.id}/strategy`}
                className="p-4 rounded-lg bg-card/40 hover:bg-card/60 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.industry}</p>
                  </div>
                </div>
                <p className="text-sm text-primary mb-2">
                  {contact.strategy?.intention}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Target className="h-3 w-3" />
                  {contact.strategy?.actions.filter(a => a.status === 'planned').length} planned actions
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
