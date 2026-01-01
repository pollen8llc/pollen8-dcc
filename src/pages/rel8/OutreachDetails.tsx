import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOutreachById, updateOutreachStatus, deleteOutreach, updateOutreachStructuredNotes, Outreach, StructuredNotes } from "@/services/rel8t/outreachService";
import { areNotesComplete } from "@/components/rel8t/StructuredNotesForm";
import { getActv8Contact } from "@/services/actv8Service";
import { getDevelopmentPath } from "@/data/mockNetworkData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { StructuredNotesForm } from "@/components/rel8t/StructuredNotesForm";
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  Mail, 
  Phone, 
  Trash2, 
  Edit,
  AlertTriangle,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { format, parseISO, isPast, isToday } from "date-fns";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function OutreachDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch outreach details
  const { data: outreach, isLoading, error } = useQuery({
    queryKey: ['outreach', id],
    queryFn: () => getOutreachById(id!),
    enabled: !!id,
  });

  // Fetch linked Actv8 contact if exists
  const { data: actv8Contact } = useQuery({
    queryKey: ['actv8-contact', outreach?.actv8_contact_id],
    queryFn: () => getActv8Contact(outreach!.actv8_contact_id!),
    enabled: !!outreach?.actv8_contact_id,
  });

  // Complete mutation
  const completeMutation = useMutation({
    mutationFn: () => {
      // Check if notes are complete before allowing completion
      const structuredNotes = (outreach as any)?.structured_notes || {};
      if (!areNotesComplete(structuredNotes)) {
        throw new Error('Please complete the required feedback fields (How did it go? and Rapport Progress) before marking as complete.');
      }
      return updateOutreachStatus(id!, 'completed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach', id] });
      queryClient.invalidateQueries({ queryKey: ['actv8-contact'] });
      toast.success('Outreach marked as complete!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to complete outreach');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteOutreach(id!),
    onSuccess: () => {
      toast.success('Outreach deleted');
      navigate('/rel8');
    },
  });

  // Structured notes mutation
  const structuredNotesMutation = useMutation({
    mutationFn: (notes: StructuredNotes) => updateOutreachStructuredNotes(id!, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach', id] });
      toast.success('Feedback saved!');
    },
    onError: () => {
      toast.error('Failed to save feedback');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !outreach) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Outreach not found</p>
        <Link to="/rel8">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const dueDate = parseISO(outreach.due_date);
  const isOverdue = outreach.status === 'pending' && isPast(dueDate) && !isToday(dueDate);
  const isDueToday = isToday(dueDate);

  const getStatusBadge = () => {
    if (outreach.status === 'completed') {
      return <Badge className="bg-emerald-500">Completed</Badge>;
    }
    if (isOverdue) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    if (isDueToday) {
      return <Badge className="bg-amber-500">Due Today</Badge>;
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  const getPriorityBadge = () => {
    const colors = {
      high: 'bg-red-500/20 text-red-500',
      medium: 'bg-amber-500/20 text-amber-500',
      low: 'bg-emerald-500/20 text-emerald-500',
    };
    return (
      <Badge variant="outline" className={colors[outreach.priority]}>
        {outreach.priority.charAt(0).toUpperCase() + outreach.priority.slice(1)} Priority
      </Badge>
    );
  };

  const getChannelIcon = () => {
    switch (outreach.outreach_channel) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'in_person': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  // Get step info from actv8 path
  const stepInfo = actv8Contact?.path?.steps?.[outreach.actv8_step_index ?? 0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="container max-w-4xl mx-auto px-4 py-6 pb-32">
        {/* Back Button */}
        <Link 
          to={outreach.actv8_contact_id ? `/rel8/actv8/${outreach.actv8_contact_id}/profile` : '/rel8'} 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {outreach.actv8_contact_id ? 'Back to Profile' : 'Back to Dashboard'}
        </Link>

        {/* Header */}
        <div className="glass-card p-6 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusBadge()}
                  {getPriorityBadge()}
                </div>
                <h1 className="text-2xl font-bold">{outreach.title}</h1>
                {outreach.description && (
                  <p className="text-muted-foreground mt-2">{outreach.description}</p>
                )}
              </div>
            </div>

            {/* Actv8 Build Rapport Badge */}
            {actv8Contact && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                    Build Rapport
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Step {(outreach.actv8_step_index ?? 0) + 1}: {stepInfo?.name || 'Unknown Step'}
                  </span>
                </div>
                <Link 
                  to={`/rel8/actv8/${outreach.actv8_contact_id}/profile`}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  View {actv8Contact.contact?.name}'s development path
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            )}

            {/* Due Date */}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className={isOverdue ? 'text-destructive font-medium' : ''}>
                Due: {format(dueDate, 'PPP')} at {format(dueDate, 'p')}
              </span>
              {isOverdue && <AlertTriangle className="h-4 w-4 text-destructive" />}
            </div>
          </div>
        </div>

        {/* Contacts */}
        {outreach.contacts && outreach.contacts.length > 0 && (
          <Card className="glass-card mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {outreach.contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{contact.name}</p>
                      {contact.organization && (
                        <p className="text-sm text-muted-foreground">{contact.organization}</p>
                      )}
                    </div>
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} className="text-primary hover:underline text-sm">
                        {contact.email}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Channel Details */}
        {outreach.outreach_channel && (
          <Card className="glass-card mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {getChannelIcon()}
                Outreach Channel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium capitalize">{outreach.outreach_channel.replace('_', ' ')}</p>
                {outreach.channel_details && (
                  <div className="text-sm text-muted-foreground">
                    {Object.entries(outreach.channel_details).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="capitalize">{key.replace('_', ' ')}:</span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Structured Notes Form - always editable for updates */}
        <StructuredNotesForm
          initialNotes={(outreach as any).structured_notes || {}}
          onSave={async (notes) => {
            await structuredNotesMutation.mutateAsync(notes);
          }}
          isSaving={structuredNotesMutation.isPending}
          disabled={false}
        />

        {/* Calendar Sync Status */}
        <Card className="glass-card mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar Sync
            </CardTitle>
          </CardHeader>
          <CardContent>
            {outreach.calendar_sync_enabled ? (
              <div className="space-y-2">
                <Badge className="bg-emerald-500">Calendar Sync Enabled</Badge>
                {outreach.system_email && (
                  <p className="text-sm text-muted-foreground">
                    Synced to: {outreach.system_email}
                  </p>
                )}
                {outreach.last_calendar_update && (
                  <p className="text-sm text-muted-foreground">
                    Last updated: {format(parseISO(outreach.last_calendar_update), 'PPp')}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Calendar sync not enabled for this outreach</p>
            )}
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card className="glass-card mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {outreach.created_at && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{format(parseISO(outreach.created_at), 'PPp')}</span>
              </div>
            )}
            {outreach.updated_at && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last updated</span>
                <span>{format(parseISO(outreach.updated_at), 'PPp')}</span>
              </div>
            )}
            {outreach.contacts_notified_at && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contacts notified</span>
                <span>{format(parseISO(outreach.contacts_notified_at), 'PPp')}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {outreach.status === 'pending' && (
            <Button 
              onClick={() => completeMutation.mutate()}
              disabled={completeMutation.isPending}
              className="flex items-center gap-2"
            >
              {completeMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Mark Complete
            </Button>
          )}
          
          {outreach.status !== 'completed' && (
            <Button
              variant="outline"
              onClick={() => navigate(`/rel8/wizard?mode=edit&id=${id}`)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Outreach
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Outreach?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the outreach
                  and remove it from your calendar if synced.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMutation.mutate()}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
        <Rel8OnlyNavigation />
      </div>
    </div>
  );
}
