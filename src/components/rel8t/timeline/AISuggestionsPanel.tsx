import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MockNetworkContact, 
  getRelationshipType,
  actionTemplates 
} from "@/data/mockNetworkData";
import { Lightbulb, Target, Calendar, Coffee, Gift, Users, MessageSquare } from "lucide-react";
import { differenceInDays } from "date-fns";

export interface Suggestion {
  id: string;
  type: 'time_based' | 'event_based' | 'pattern_based' | 'seasonal' | 'milestone';
  icon: React.ReactNode;
  title: string;
  description: string;
  actionType: string;
  channel: string;
  tone: string;
}

interface AISuggestionsPanelProps {
  contact: MockNetworkContact;
  onApplySuggestion: (suggestion: Suggestion) => void;
}

export function AISuggestionsPanel({ contact, onApplySuggestion }: AISuggestionsPanelProps) {
  const daysSinceLastContact = differenceInDays(new Date(), new Date(contact.lastInteraction));
  const relationshipType = getRelationshipType(contact.relationshipType);
  
  // Generate contextual suggestions based on contact data
  const suggestions: Suggestion[] = [];

  // Time-based suggestion
  if (daysSinceLastContact > 30) {
    suggestions.push({
      id: 'time-1',
      type: 'time_based',
      icon: <Target className="h-4 w-4 text-primary" />,
      title: `It's been ${daysSinceLastContact} days`,
      description: `Consider a soft check-in via ${contact.email ? 'email' : 'DM'} to stay connected.`,
      actionType: 'soft_checkin',
      channel: contact.email ? 'email' : 'dm',
      tone: 'friendly',
    });
  }

  // Relationship type based suggestions
  switch (contact.relationshipType) {
    case 'mentor':
      suggestions.push({
        id: 'type-mentor',
        type: 'pattern_based',
        icon: <Coffee className="h-4 w-4 text-orange-500" />,
        title: 'Schedule a mentorship catch-up',
        description: 'Regular check-ins strengthen mentor relationships. Book a formal 1:1.',
        actionType: 'coffee',
        channel: 'in_person',
        tone: 'professional',
      });
      break;
    case 'socialite':
      suggestions.push({
        id: 'type-socialite',
        type: 'event_based',
        icon: <Users className="h-4 w-4 text-purple-500" />,
        title: 'Invite to upcoming event',
        description: 'Connectors thrive on events. Include them in your next industry gathering.',
        actionType: 'invite_mixer',
        channel: 'dm',
        tone: 'friendly',
      });
      break;
    case 'creative_peer':
      suggestions.push({
        id: 'type-creative',
        type: 'pattern_based',
        icon: <Lightbulb className="h-4 w-4 text-yellow-500" />,
        title: 'Share an inspiring resource',
        description: 'Creative peers appreciate thoughtful content. Send something that sparks ideas.',
        actionType: 'send_resource',
        channel: 'email',
        tone: 'collaborative',
      });
      break;
    case 'career_ally':
      suggestions.push({
        id: 'type-ally',
        type: 'pattern_based',
        icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
        title: 'Quick professional check-in',
        description: 'Keep the professional rapport strong with a brief update exchange.',
        actionType: 'soft_checkin',
        channel: 'email',
        tone: 'professional',
      });
      break;
    default:
      break;
  }

  // Connection strength based
  if (contact.connectionStrength === 'thin') {
    suggestions.push({
      id: 'strength-thin',
      type: 'pattern_based',
      icon: <Target className="h-4 w-4 text-red-500" />,
      title: 'Strengthen this connection',
      description: 'Thin connections need more frequent light touches. Start with a DM.',
      actionType: 'soft_checkin',
      channel: 'dm',
      tone: 'friendly',
    });
  }

  // Seasonal suggestion (check if December-January for holidays)
  const currentMonth = new Date().getMonth();
  if (currentMonth === 11 || currentMonth === 0) {
    suggestions.push({
      id: 'seasonal-holiday',
      type: 'seasonal',
      icon: <Gift className="h-4 w-4 text-red-500" />,
      title: 'Holiday season greeting',
      description: 'Send a warm holiday message to strengthen the personal connection.',
      actionType: 'soft_checkin',
      channel: 'email',
      tone: 'friendly',
    });
  }

  // Recent achievements celebration
  if (contact.recentAchievements && contact.recentAchievements.length > 0) {
    suggestions.push({
      id: 'milestone-1',
      type: 'milestone',
      icon: <Gift className="h-4 w-4 text-green-500" />,
      title: 'Celebrate their achievement',
      description: `Acknowledge: "${contact.recentAchievements[0]}" - a thoughtful congrats goes a long way.`,
      actionType: 'compliment',
      channel: 'dm',
      tone: 'friendly',
    });
  }

  // Calculate pattern-based suggestion from past interactions
  const interactions = contact.interactions || [];
  if (interactions.length >= 2) {
    const dates = interactions.map(i => new Date(i.date).getTime()).sort((a, b) => b - a);
    let totalDays = 0;
    for (let i = 0; i < dates.length - 1; i++) {
      totalDays += (dates[i] - dates[i + 1]) / (1000 * 60 * 60 * 24);
    }
    const avgInterval = Math.round(totalDays / (dates.length - 1));
    
    if (daysSinceLastContact > avgInterval) {
      suggestions.push({
        id: 'pattern-1',
        type: 'pattern_based',
        icon: <Calendar className="h-4 w-4 text-blue-500" />,
        title: `You usually connect every ${avgInterval} days`,
        description: `It's been ${daysSinceLastContact} days - schedule your next touchpoint.`,
        actionType: 'coffee',
        channel: 'in_person',
        tone: 'friendly',
      });
    }
  }

  // Limit to top 4 suggestions
  const displayedSuggestions = suggestions.slice(0, 4);

  return (
    <Card className="bg-card/60 backdrop-blur-md border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayedSuggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No suggestions at this time. Keep nurturing this relationship!
          </p>
        ) : (
          displayedSuggestions.map((suggestion) => (
            <div 
              key={suggestion.id}
              className="p-3 rounded-lg bg-muted/30 border border-border/30 space-y-2"
            >
              <div className="flex items-start gap-2">
                {suggestion.icon}
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{suggestion.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{suggestion.description}</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full text-xs h-7"
                onClick={() => onApplySuggestion(suggestion)}
              >
                Apply Suggestion
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
