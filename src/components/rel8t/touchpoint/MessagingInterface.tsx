import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  touchpointChannels, 
  touchpointTones,
  MockNetworkContact,
  DevelopmentPathStep 
} from "@/data/mockNetworkData";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Mail, Send } from "lucide-react";

interface MessagingInterfaceProps {
  contact: MockNetworkContact;
  step: DevelopmentPathStep;
  onSave: (data: MessagingData) => void;
  onCancel: () => void;
}

export interface MessagingData {
  message: string;
  channel: string;
  tone: string;
  scheduledDate?: string;
  emailSent?: boolean;
}

// Rapport-building prompts based on contact context
function getConversationStarters(contact: MockNetworkContact, step: DevelopmentPathStep): string[] {
  const starters: string[] = [];
  
  // Based on how we met
  if (contact.howWeMet) {
    starters.push(`Reference when you first connected: "${contact.howWeMet.split(',')[0]}"`);
  }
  
  // Based on recent achievements
  if (contact.recentAchievements && contact.recentAchievements.length > 0) {
    starters.push(`Congratulate them on: "${contact.recentAchievements[0]}"`);
  }
  
  // Based on their industry
  starters.push(`Ask about trends in ${contact.industry}`);
  
  // Based on relationship warmth
  if (contact.connectionStrength === 'thin') {
    starters.push("Remind them briefly who you are");
    starters.push("Keep it short and low-pressure");
  } else if (contact.connectionStrength === 'thick') {
    starters.push("Be personal and reference shared experiences");
  }
  
  // Based on vibe notes
  if (contact.vibeNotes) {
    starters.push(`Keep in mind: "${contact.vibeNotes.substring(0, 60)}..."`);
  }
  
  return starters.slice(0, 4);
}

function getMessageTemplates(step: DevelopmentPathStep, contact: MockNetworkContact): string[] {
  const templates: string[] = [];
  const firstName = contact.name.split(' ')[0];
  
  switch (step.suggestedAction) {
    case 'soft_checkin':
      templates.push(
        `Hey ${firstName}, hope you're doing well! Just wanted to check in and see how things are going.`,
        `Hi ${firstName}! Been thinking about our last conversation and wanted to touch base.`,
        `Hey ${firstName}, saw something that reminded me of you and wanted to reach out!`
      );
      break;
    case 'send_resource':
      templates.push(
        `Hey ${firstName}, thought you might find this interesting given your work in ${contact.industry}...`,
        `Hi ${firstName}! Came across this and immediately thought of our conversation about...`
      );
      break;
    case 'post_event':
      templates.push(
        `Great meeting you at the event! Would love to continue our conversation about...`,
        `Hey ${firstName}, it was wonderful connecting with you. Let's stay in touch!`
      );
      break;
    default:
      templates.push(
        `Hey ${firstName}, hope you're well!`,
        `Hi ${firstName}! Wanted to reach out and...`
      );
  }
  
  return templates;
}

function generateSubjectFromTone(tone: string, contactName: string, step: DevelopmentPathStep): string {
  const firstName = contactName.split(' ')[0];
  
  switch (tone) {
    case 'professional':
      return `Following up - ${step.name}`;
    case 'friendly':
      return `Hey ${firstName}! Quick note`;
    case 'casual':
      return `Touching base`;
    case 'formal':
      return `Re: ${step.name}`;
    default:
      return `A note from a connection`;
  }
}

export function MessagingInterface({ contact, step, onSave, onCancel }: MessagingInterfaceProps) {
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState(step.suggestedChannel || 'email');
  const [tone, setTone] = useState(step.suggestedTone || 'friendly');
  const [scheduledDate, setScheduledDate] = useState("");
  const [sendNow, setSendNow] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const conversationStarters = getConversationStarters(contact, step);
  const templates = getMessageTemplates(step, contact);
  
  // Filter relevant channels for messaging
  const messagingChannels = touchpointChannels.filter(c => 
    ['email', 'text'].includes(c.id)
  );

  const hasEmail = !!contact.email;
  const canSendEmail = channel === 'email' && hasEmail;

  const handleSendEmail = async (): Promise<boolean> => {
    if (!contact.email) {
      toast({
        title: "No email address",
        description: "This contact doesn't have an email address on file.",
        variant: "destructive",
      });
      return false;
    }

    setIsSending(true);
    try {
      const subject = generateSubjectFromTone(tone, contact.name, step);
      
      // Convert message to HTML (basic formatting)
      const htmlMessage = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          ${message.split('\n').map(p => `<p style="margin: 0 0 12px 0;">${p}</p>`).join('')}
        </div>
      `;

      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: contact.email,
          toName: contact.name,
          subject,
          html: htmlMessage,
        }
      });

      if (error) throw error;

      toast({
        title: "Email sent!",
        description: `Your message to ${contact.name} has been delivered.`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast({
        title: "Failed to send email",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const handleSave = async () => {
    let emailSent = false;
    
    // If send now is enabled and channel is email, send the email
    if (sendNow && channel === 'email') {
      emailSent = await handleSendEmail();
      if (!emailSent) return; // Don't save if email failed
    }
    
    onSave({
      message,
      channel,
      tone,
      scheduledDate: scheduledDate || undefined,
      emailSent,
    });
  };

  return (
    <div className="space-y-6">
      {/* Step Context */}
      <div className="border-b border-border/40 pb-4">
        <h3 className="font-semibold text-lg">{step.name}</h3>
        <p className="text-sm text-muted-foreground">{step.description}</p>
      </div>

      {/* Rapport Building Prompts */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <h4 className="text-sm font-medium mb-3">Conversation Starters</h4>
        <ul className="space-y-2">
          {conversationStarters.map((starter, idx) => (
            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>{starter}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Channel Selection */}
      <div>
        <Label className="text-sm mb-2 block">Channel</Label>
        <div className="flex gap-2">
          {messagingChannels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setChannel(ch.id)}
              className={cn(
                "flex-1 p-3 rounded-lg border text-center transition-all",
                channel === ch.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/40 hover:border-border"
              )}
            >
              <span className="text-sm font-medium">{ch.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Email Status / Send Now Option */}
      {channel === 'email' && (
        <Card className={cn(
          "p-4 border",
          hasEmail ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className={cn(
                "h-5 w-5",
                hasEmail ? "text-primary" : "text-destructive"
              )} />
              <div>
                <p className="text-sm font-medium">
                  {hasEmail ? contact.email : "No email on file"}
                </p>
                {hasEmail && (
                  <p className="text-xs text-muted-foreground">
                    Send email directly via Resend
                  </p>
                )}
              </div>
            </div>
            {hasEmail && (
              <div className="flex items-center gap-2">
                <Label htmlFor="send-now" className="text-sm">Send Now</Label>
                <Switch
                  id="send-now"
                  checked={sendNow}
                  onCheckedChange={setSendNow}
                />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Tone Selection */}
      <div>
        <Label className="text-sm mb-2 block">Tone</Label>
        <div className="grid grid-cols-2 gap-2">
          {touchpointTones.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={cn(
                "p-3 rounded-lg border text-center transition-all",
                tone === t.id
                  ? "border-primary bg-primary/10"
                  : "border-border/40 hover:border-border"
              )}
            >
              <span className="text-sm font-medium">{t.label}</span>
              <p className="text-xs text-muted-foreground mt-1 hidden sm:block">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Message Templates */}
      <div>
        <Label className="text-sm mb-2 block">Quick Templates</Label>
        <div className="flex flex-wrap gap-2">
          {templates.map((template, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              className="text-xs h-auto py-2 px-3 text-left whitespace-normal"
              onClick={() => setMessage(template)}
            >
              {template.substring(0, 50)}...
            </Button>
          ))}
        </div>
      </div>

      {/* Message Composition */}
      <div>
        <Label className="text-sm mb-2 block">Your Message</Label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Write your message to ${contact.name.split(' ')[0]}...`}
          className="min-h-[150px] resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {message.length} characters
        </p>
      </div>

      {/* Schedule Option - only show if not sending now */}
      {!sendNow && (
        <div>
          <Label className="text-sm mb-2 block">Schedule for Later (Optional)</Label>
          <input
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border/40 bg-background text-sm"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border/40">
        <Button variant="outline" onClick={onCancel} className="flex-1" disabled={isSending}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={!message.trim() || isSending || (sendNow && !canSendEmail)} 
          className="flex-1"
        >
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : sendNow && channel === 'email' ? (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </>
          ) : (
            'Save Message'
          )}
        </Button>
      </div>
    </div>
  );
}