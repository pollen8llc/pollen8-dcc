import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { mockNetworkContacts, MockStrategyAction, getActionTemplate } from "@/data/mockNetworkData";
import { RelationshipContextPanel } from "@/components/rel8t/timeline/RelationshipContextPanel";
import { AISuggestionsPanel, Suggestion } from "@/components/rel8t/timeline/AISuggestionsPanel";
import { TouchpointForm, TouchpointFormData } from "@/components/rel8t/timeline/TouchpointForm";
import { UpcomingTouchpoints } from "@/components/rel8t/timeline/UpcomingTouchpoints";
import { PastInteractions } from "@/components/rel8t/timeline/PastInteractions";
import { CalendarInviteDialog } from "@/components/rel8t/timeline/CalendarInviteDialog";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarPlus } from "lucide-react";
import { TouchpointEvent } from "@/utils/calendarGenerator";
import { useToast } from "@/hooks/use-toast";

export default function NetworkTimeline() {
  const { id } = useParams();
  const { toast } = useToast();
  const contact = mockNetworkContacts.find(c => c.id === id);
  
  const [showForm, setShowForm] = useState(false);
  const [formInitialData, setFormInitialData] = useState<Partial<TouchpointFormData>>({});
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const [calendarEvent, setCalendarEvent] = useState<TouchpointEvent | null>(null);
  const [actions, setActions] = useState<MockStrategyAction[]>(
    contact?.strategy?.actions || []
  );

  if (!contact) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Contact not found</p>
      </div>
    );
  }

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  // Handle applying an AI suggestion
  const handleApplySuggestion = (suggestion: Suggestion) => {
    setFormInitialData({
      actionType: suggestion.actionType,
      channel: suggestion.channel,
      tone: suggestion.tone,
      description: suggestion.title,
    });
    setShowForm(true);
  };

  // Create touchpoint event for calendar
  const createCalendarEvent = (data: TouchpointFormData): TouchpointEvent => {
    const actionLabel = data.customAction || getActionTemplate(data.actionType)?.label || data.actionType;
    const [hours, minutes] = data.time.split(':').map(Number);
    const startDate = new Date(data.date);
    startDate.setHours(hours, minutes, 0, 0);

    return {
      title: `${actionLabel} with ${contact.name}`,
      description: data.intention || `Touchpoint: ${data.description || actionLabel}`,
      startDate,
      duration: data.duration,
      location: data.location || undefined,
      attendeeEmail: data.calendarOption !== 'self' ? contact.email : undefined,
      attendeeName: data.calendarOption !== 'self' ? contact.name : undefined,
    };
  };

  // Save touchpoint
  const handleSave = (data: TouchpointFormData) => {
    const newAction: MockStrategyAction = {
      id: `action-${Date.now()}`,
      type: data.customAction || data.actionType,
      scheduledDate: data.date.toISOString().split('T')[0],
      channel: data.channel,
      tone: data.tone,
      status: 'planned',
      notes: data.description || data.intention,
    };
    
    setActions(prev => [...prev, newAction]);
    setShowForm(false);
    setFormInitialData({});
    
    toast({
      title: "Touchpoint saved",
      description: `Scheduled for ${data.date.toLocaleDateString()}`,
    });
  };

  // Create calendar invite
  const handleCreateInvite = (data: TouchpointFormData) => {
    const event = createCalendarEvent(data);
    setCalendarEvent(event);
    setCalendarDialogOpen(true);
    
    // Also save the touchpoint
    handleSave(data);
  };

  // Edit existing action
  const handleEdit = (action: MockStrategyAction) => {
    setFormInitialData({
      actionType: action.type,
      channel: action.channel,
      tone: action.tone,
      description: action.notes || '',
      date: new Date(action.scheduledDate),
    });
    setShowForm(true);
    // Remove the action being edited
    setActions(prev => prev.filter(a => a.id !== action.id));
  };

  // Mark action as complete
  const handleComplete = (actionId: string) => {
    setActions(prev => 
      prev.map(a => a.id === actionId ? { ...a, status: 'completed' as const } : a)
    );
    toast({
      title: "Touchpoint completed",
      description: "Great job nurturing this relationship!",
    });
  };

  // Send invite for existing action
  const handleSendInvite = (action: MockStrategyAction) => {
    const actionLabel = getActionTemplate(action.type)?.label || action.type;
    const event: TouchpointEvent = {
      title: `${actionLabel} with ${contact.name}`,
      description: action.notes || `Touchpoint: ${actionLabel}`,
      startDate: new Date(action.scheduledDate + 'T14:00:00'),
      duration: 60,
      attendeeEmail: contact.email,
      attendeeName: contact.name,
    };
    setCalendarEvent(event);
    setCalendarDialogOpen(true);
  };

  // Delete action
  const handleDelete = (actionId: string) => {
    setActions(prev => prev.filter(a => a.id !== actionId));
    toast({
      title: "Touchpoint deleted",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="container max-w-6xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            to={`/rel8/network/${id}/profile`} 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
        </div>

        {/* Contact Header */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-14 w-14 ring-2 ring-primary/20">
            <AvatarImage src={contact.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(contact.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              Plan Touchpoints with {contact.name}
            </h1>
            <p className="text-muted-foreground">
              {contact.role} at {contact.company}
            </p>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <CalendarPlus className="h-4 w-4" />
              New Touchpoint
            </Button>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Context & Suggestions */}
          <div className="space-y-6">
            <RelationshipContextPanel contact={contact} />
            <AISuggestionsPanel 
              contact={contact} 
              onApplySuggestion={handleApplySuggestion}
            />
          </div>

          {/* Right Column - Form & Lists */}
          <div className="lg:col-span-2 space-y-6">
            {/* Touchpoint Form */}
            {showForm && (
              <TouchpointForm
                contact={contact}
                initialData={formInitialData}
                onSave={handleSave}
                onCancel={() => {
                  setShowForm(false);
                  setFormInitialData({});
                }}
                onCreateInvite={handleCreateInvite}
              />
            )}

            {/* Upcoming Touchpoints */}
            <UpcomingTouchpoints
              actions={actions}
              onEdit={handleEdit}
              onComplete={handleComplete}
              onSendInvite={handleSendInvite}
              onDelete={handleDelete}
            />

            {/* Past Interactions */}
            <PastInteractions interactions={contact.interactions} />
          </div>
        </div>
      </div>

      {/* Calendar Invite Dialog */}
      <CalendarInviteDialog
        open={calendarDialogOpen}
        onOpenChange={setCalendarDialogOpen}
        event={calendarEvent}
        contactName={contact.name}
      />

      {/* Navigation */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
        <Rel8OnlyNavigation />
      </div>
    </div>
  );
}
