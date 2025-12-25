import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  TouchpointEvent, 
  generateGoogleCalendarUrl, 
  generateOutlookUrl,
  downloadICS 
} from "@/utils/calendarGenerator";
import { Calendar, Download, ExternalLink } from "lucide-react";

interface CalendarInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: TouchpointEvent | null;
  contactName: string;
}

export function CalendarInviteDialog({ 
  open, 
  onOpenChange, 
  event,
  contactName 
}: CalendarInviteDialogProps) {
  if (!event) return null;

  const handleGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl(event);
    window.open(url, '_blank');
  };

  const handleOutlookCalendar = () => {
    const url = generateOutlookUrl(event);
    window.open(url, '_blank');
  };

  const handleDownloadICS = () => {
    downloadICS(event);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Add to Calendar
          </DialogTitle>
          <DialogDescription>
            Choose how you'd like to add this touchpoint with {contactName} to your calendar.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {/* Event Summary */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
            <p className="font-medium text-foreground">{event.title}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {event.startDate.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </p>
            {event.location && (
              <p className="text-sm text-muted-foreground">📍 {event.location}</p>
            )}
            {event.attendeeEmail && (
              <p className="text-sm text-primary mt-1">
                ✉️ Invite will be sent to {event.attendeeEmail}
              </p>
            )}
          </div>

          {/* Calendar Options */}
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-12"
              onClick={handleGoogleCalendar}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded bg-blue-500/10">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div className="text-left flex-1">
                <p className="font-medium">Google Calendar</p>
                <p className="text-xs text-muted-foreground">Opens in new tab</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-12"
              onClick={handleOutlookCalendar}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded bg-blue-600/10">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#0078D4">
                  <path d="M24 7.387v10.478c0 .23-.08.424-.238.576-.16.154-.352.23-.578.23h-8.547v-6.96l1.606 1.229c.101.063.22.094.358.094.138 0 .257-.031.356-.094L24 7.387zm-.238-1.16c.155.153.238.343.238.568 0 .224-.083.414-.238.568l-7.02 5.372c-.1.062-.218.094-.353.094-.136 0-.254-.032-.354-.094L8.637 6.227v-.001l7.02-5.373c.1-.062.218-.093.353-.093.136 0 .254.031.354.093l7.398 5.374zm-15.114.78v10.322c0 .295-.104.549-.312.762-.21.214-.462.32-.758.32H.758c-.296 0-.549-.106-.758-.32C0 17.878 0 17.624 0 17.33V7.007c0-.295.104-.549.312-.762.21-.214.462-.32.758-.32h6.82c.296 0 .549.106.758.32.208.213.312.467.312.762zm-2.302 8.96V8.505L4.003 12.76l2.343 4.207z"/>
                </svg>
              </div>
              <div className="text-left flex-1">
                <p className="font-medium">Outlook Calendar</p>
                <p className="text-xs text-muted-foreground">Opens in new tab</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-12"
              onClick={handleDownloadICS}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded bg-gray-500/10">
                <Calendar className="h-5 w-5 text-gray-600" />
              </div>
              <div className="text-left flex-1">
                <p className="font-medium">Download .ics File</p>
                <p className="text-xs text-muted-foreground">Works with Apple Calendar & others</p>
              </div>
              <Download className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
