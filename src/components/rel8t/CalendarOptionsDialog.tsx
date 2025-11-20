import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Download, ExternalLink } from "lucide-react";
import { downloadICS } from "@/utils/icsDownload";
import { toast } from "@/hooks/use-toast";

interface CalendarOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  icsContent: string;
  startDate: string;
}

export function CalendarOptionsDialog({ 
  open, 
  onOpenChange, 
  title, 
  description,
  icsContent,
  startDate
}: CalendarOptionsDialogProps) {
  
  const handleDownloadICS = () => {
    const filename = `${title.replace(/\s+/g, '-').toLowerCase()}.ics`;
    downloadICS(icsContent, filename);
    toast({
      title: "Calendar file downloaded",
      description: "Import this file into your calendar app."
    });
  };

  const handleGoogleCalendar = () => {
    // Create Google Calendar URL
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(startDateObj.getTime() + 60 * 60 * 1000); // 1 hour duration
    
    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const googleUrl = new URL('https://calendar.google.com/calendar/render');
    googleUrl.searchParams.append('action', 'TEMPLATE');
    googleUrl.searchParams.append('text', title);
    if (description) googleUrl.searchParams.append('details', description);
    googleUrl.searchParams.append('dates', `${formatGoogleDate(startDateObj)}/${formatGoogleDate(endDateObj)}`);
    
    window.open(googleUrl.toString(), '_blank');
    
    toast({
      title: "Opening Google Calendar",
      description: "Add this event to your Google Calendar."
    });
  };

  const handleOutlookCalendar = () => {
    // Create Outlook.com calendar URL
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(startDateObj.getTime() + 60 * 60 * 1000);
    
    const outlookUrl = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
    outlookUrl.searchParams.append('subject', title);
    if (description) outlookUrl.searchParams.append('body', description);
    outlookUrl.searchParams.append('startdt', startDateObj.toISOString());
    outlookUrl.searchParams.append('enddt', endDateObj.toISOString());
    outlookUrl.searchParams.append('path', '/calendar/action/compose');
    
    window.open(outlookUrl.toString(), '_blank');
    
    toast({
      title: "Opening Outlook Calendar",
      description: "Add this event to your Outlook Calendar."
    });
  };

  const handleOffice365Calendar = () => {
    // Create Office 365 calendar URL (similar to Outlook but different domain)
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(startDateObj.getTime() + 60 * 60 * 1000);
    
    const office365Url = new URL('https://outlook.office.com/calendar/0/deeplink/compose');
    office365Url.searchParams.append('subject', title);
    if (description) office365Url.searchParams.append('body', description);
    office365Url.searchParams.append('startdt', startDateObj.toISOString());
    office365Url.searchParams.append('enddt', endDateObj.toISOString());
    office365Url.searchParams.append('path', '/calendar/action/compose');
    
    window.open(office365Url.toString(), '_blank');
    
    toast({
      title: "Opening Office 365 Calendar",
      description: "Add this event to your Office 365 Calendar."
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-sm border-primary/20">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-6 w-6 text-primary" />
            <DialogTitle>Add to Calendar</DialogTitle>
          </div>
          <DialogDescription className="space-y-3 pt-2">
            <div>
              <p className="font-medium text-foreground">{title}</p>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Choose how you'd like to add this event to your calendar:
          </p>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-auto py-3"
            onClick={handleGoogleCalendar}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.894 14.693c0 1.453-1.185 2.638-2.638 2.638H8.744c-1.453 0-2.638-1.185-2.638-2.638V9.307c0-1.453 1.185-2.638 2.638-2.638h6.512c1.453 0 2.638 1.185 2.638 2.638v5.386z"/>
            </svg>
            <div className="text-left">
              <p className="font-medium">Google Calendar</p>
              <p className="text-xs text-muted-foreground">Add to your Google Calendar</p>
            </div>
            <ExternalLink className="h-4 w-4 ml-auto" />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-auto py-3"
            onClick={handleOutlookCalendar}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 7.387v9.226c0 .68-.547 1.23-1.223 1.23h-8.47l-1.066 2.668c-.134.335-.464.552-.828.552H5.587c-.364 0-.694-.217-.828-.552L3.693 17.843H1.223C.547 17.843 0 17.293 0 16.613V7.387c0-.68.547-1.23 1.223-1.23h21.554c.676 0 1.223.55 1.223 1.23zm-11.5 4.478c0-1.75-1.373-3.17-3.065-3.17S6.37 10.115 6.37 11.865c0 1.75 1.373 3.17 3.065 3.17s3.065-1.42 3.065-3.17z"/>
            </svg>
            <div className="text-left">
              <p className="font-medium">Outlook Calendar</p>
              <p className="text-xs text-muted-foreground">Add to Outlook.com</p>
            </div>
            <ExternalLink className="h-4 w-4 ml-auto" />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-auto py-3"
            onClick={handleOffice365Calendar}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.17 0H2.83A2.831 2.831 0 0 0 0 2.83v18.34A2.831 2.831 0 0 0 2.83 24h18.34A2.831 2.831 0 0 0 24 21.17V2.83A2.831 2.831 0 0 0 21.17 0zM11.4 18.76L3.6 16.8V7.2l7.8-1.96v13.52zm1.2 0V5.24l8.4 1.96v9.6l-8.4 1.96z"/>
            </svg>
            <div className="text-left">
              <p className="font-medium">Office 365</p>
              <p className="text-xs text-muted-foreground">Add to Office 365 Calendar</p>
            </div>
            <ExternalLink className="h-4 w-4 ml-auto" />
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-auto py-3"
            onClick={handleDownloadICS}
          >
            <Download className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium">Download ICS File</p>
              <p className="text-xs text-muted-foreground">For Apple Calendar, Thunderbird, etc.</p>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
