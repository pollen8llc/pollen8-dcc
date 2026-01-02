import { useState, useRef } from "react";
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
import { OutreachTimelineAccordion } from "@/components/rel8t/OutreachTimelineAccordion";
import { motion } from "framer-motion";
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
  MessageSquare,
  Activity
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

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function OutreachDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notesRef = useRef<HTMLDivElement>(null);
  const [showNotesAlert, setShowNotesAlert] = useState(false);

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

  // Scroll to notes and show alert
  const scrollToNotes = () => {
    setShowNotesAlert(true);
    notesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Auto-hide the alert after 5 seconds
    setTimeout(() => setShowNotesAlert(false), 5000);
  };

  // Complete mutation
  const completeMutation = useMutation({
    mutationFn: () => {
      // Check if notes are complete before allowing completion
      const structuredNotes = (outreach as any)?.structured_notes || {};
      if (!areNotesComplete(structuredNotes)) {
        scrollToNotes();
        throw new Error('Please complete the required feedback fields before marking as complete.');
      }
      return updateOutreachStatus(id!, 'completed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach', id] });
      queryClient.invalidateQueries({ queryKey: ['actv8-contact'] });
      toast.success('Outreach marked as complete!');
    },
    onError: (error) => {
      // Only show toast if it's not the notes validation error (we handle that with the scroll)
      if (error instanceof Error && !error.message.includes('required feedback')) {
        toast.error(error.message);
      }
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <motion.div 
        className="container max-w-4xl mx-auto px-4 py-6 pb-32"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Back Button */}
        <motion.div variants={fadeInUp}>
          <Link 
            to="/rel8/actv8?task" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Outreach Tasks
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div 
          variants={fadeInUp}
          className="relative overflow-hidden rounded-2xl bg-card/80 backdrop-blur-md border border-primary/20 p-6 mb-6 shadow-lg shadow-primary/5"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          <div className="relative flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {getStatusBadge()}
                  {getPriorityBadge()}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{outreach.title}</h1>
                {outreach.description && (
                  <p className="text-muted-foreground mt-2 leading-relaxed">{outreach.description}</p>
                )}
              </div>
            </div>

            {/* Actv8 Build Rapport Badge */}
            {actv8Contact && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl bg-primary/10 border border-primary/30 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 font-semibold">
                    Build Rapport
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Step {(outreach.actv8_step_index ?? 0) + 1}: {stepInfo?.name || 'Unknown Step'}
                  </span>
                </div>
                <Link 
                  to={`/rel8/actv8/${outreach.actv8_contact_id}/profile`}
                  className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group"
                >
                  View {actv8Contact.contact?.name}'s development path
                  <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            )}

            {/* Due Date */}
            <div className="flex items-center gap-2 text-sm">
              <div className={`p-2 rounded-lg ${isOverdue ? 'bg-destructive/20' : 'bg-muted/50'}`}>
                <Calendar className={`h-4 w-4 ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`} />
              </div>
              <span className={isOverdue ? 'text-destructive font-medium' : 'text-foreground'}>
                Due: {format(dueDate, 'PPP')} at {format(dueDate, 'p')}
              </span>
              {isOverdue && <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />}
            </div>
          </div>
        </motion.div>

        {/* Contacts */}
        {outreach.contacts && outreach.contacts.length > 0 && (
          <motion.div variants={fadeInUp}>
            <Card className="bg-card/80 backdrop-blur-md border-border/50 mb-6 shadow-lg overflow-hidden">
              <CardHeader className="pb-3 border-b border-border/30">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {outreach.contacts.map((contact, index) => (
                    <motion.div 
                      key={contact.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{contact.name}</p>
                        {contact.organization && (
                          <p className="text-sm text-muted-foreground truncate">{contact.organization}</p>
                        )}
                      </div>
                      {contact.email && (
                        <a href={`mailto:${contact.email}`} className="text-primary hover:text-primary/80 transition-colors text-sm hidden sm:block">
                          {contact.email}
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Channel Details */}
        {outreach.outreach_channel && (
          <motion.div variants={fadeInUp}>
            <Card className="bg-card/80 backdrop-blur-md border-border/50 mb-6 shadow-lg overflow-hidden">
              <CardHeader className="pb-3 border-b border-border/30">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    {getChannelIcon()}
                  </div>
                  Outreach Channel
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <p className="font-medium capitalize">{outreach.outreach_channel.replace('_', ' ')}</p>
                  {outreach.channel_details && (
                    <div className="text-sm text-muted-foreground space-y-1">
                      {Object.entries(outreach.channel_details).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className="capitalize text-muted-foreground/70">{key.replace('_', ' ')}:</span>
                          <span className="text-foreground">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Calendar Sync Status & Timeline */}
        <motion.div variants={fadeInUp}>
          <Card className="bg-card/80 backdrop-blur-md border-border/50 mb-6 shadow-lg overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/30">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                Calendar Sync & Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {outreach.calendar_sync_enabled ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Sync Enabled
                    </Badge>
                    {outreach.last_calendar_update && (
                      <span className="text-xs text-muted-foreground">
                        Last sync: {format(parseISO(outreach.last_calendar_update), 'PPp')}
                      </span>
                    )}
                  </div>
                  {outreach.system_email && (
                    <p className="text-sm text-muted-foreground">
                      Synced via: <span className="text-foreground/80 font-mono text-xs">{outreach.system_email}</span>
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Calendar sync not enabled</span>
                </div>
              )}
            </CardContent>
            
            {/* Timeline Accordion */}
            <OutreachTimelineAccordion outreachId={id!} />
          </Card>
        </motion.div>

        {/* Structured Notes Form */}
        <motion.div variants={fadeInUp} ref={notesRef} className="relative scroll-mt-6">
          {showNotesAlert && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-2 left-0 right-0 z-10 flex items-center justify-center"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive text-destructive-foreground text-sm font-medium shadow-lg animate-pulse">
                <AlertTriangle className="h-4 w-4" />
                Complete required fields below
              </div>
            </motion.div>
          )}
          <Card className="bg-card/80 backdrop-blur-md border-border/50 mb-6 shadow-lg overflow-hidden">
            <StructuredNotesForm
              initialNotes={(outreach as any).structured_notes || {}}
              onSave={async (notes) => {
                await structuredNotesMutation.mutateAsync(notes);
                setShowNotesAlert(false);
              }}
              isSaving={structuredNotesMutation.isPending}
              disabled={false}
            />
          </Card>
        </motion.div>

        {/* Metadata */}
        <motion.div variants={fadeInUp}>
          <Card className="bg-card/80 backdrop-blur-md border-border/50 mb-6 shadow-lg overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/30">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-muted/50">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-sm">
              {outreach.created_at && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-mono text-xs">{format(parseISO(outreach.created_at), 'PPp')}</span>
                </div>
              )}
              {outreach.updated_at && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Last updated</span>
                  <span className="font-mono text-xs">{format(parseISO(outreach.updated_at), 'PPp')}</span>
                </div>
              )}
              {outreach.contacts_notified_at && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Contacts notified</span>
                  <span className="font-mono text-xs">{format(parseISO(outreach.contacts_notified_at), 'PPp')}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <Separator className="my-6 bg-border/30" />

        {/* Actions */}
        <motion.div 
          variants={fadeInUp}
          className="flex flex-wrap gap-3"
        >
          {outreach.status === 'pending' && (
            <Button 
              onClick={() => completeMutation.mutate()}
              disabled={completeMutation.isPending}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20"
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
              className="flex items-center gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all"
            >
              <Edit className="h-4 w-4" />
              Edit Outreach
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card/95 backdrop-blur-md border-border/50">
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
        </motion.div>
      </motion.div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
        <Rel8OnlyNavigation />
      </div>
    </div>
  );
}
