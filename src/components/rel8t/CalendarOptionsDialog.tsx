import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import { downloadICS } from "@/utils/icsDownload";

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
  };

  const handleGoogleCalendar = () => {
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
  };

  const handleOutlookCalendar = () => {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(startDateObj.getTime() + 60 * 60 * 1000);
    
    const outlookUrl = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
    outlookUrl.searchParams.append('subject', title);
    if (description) outlookUrl.searchParams.append('body', description);
    outlookUrl.searchParams.append('startdt', startDateObj.toISOString());
    outlookUrl.searchParams.append('enddt', endDateObj.toISOString());
    outlookUrl.searchParams.append('path', '/calendar/action/compose');
    
    window.open(outlookUrl.toString(), '_blank');
  };

  const handleOffice365Calendar = () => {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(startDateObj.getTime() + 60 * 60 * 1000);
    
    const office365Url = new URL('https://outlook.office.com/calendar/0/deeplink/compose');
    office365Url.searchParams.append('subject', title);
    if (description) office365Url.searchParams.append('body', description);
    office365Url.searchParams.append('startdt', startDateObj.toISOString());
    office365Url.searchParams.append('enddt', endDateObj.toISOString());
    office365Url.searchParams.append('path', '/calendar/action/compose');
    
    window.open(office365Url.toString(), '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Calendar</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Event Details</h3>
            <p className="text-sm font-semibold">{title}</p>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Choose your calendar</h3>
            
            <Button
              onClick={handleGoogleCalendar}
              variant="outline"
              className="w-full justify-start gap-2"
            >
              <Calendar className="h-4 w-4" />
              Google Calendar
            </Button>

            <Button
              onClick={handleOutlookCalendar}
              variant="outline"
              className="w-full justify-start gap-2"
            >
              <Calendar className="h-4 w-4" />
              Outlook Calendar
            </Button>

            <Button
              onClick={handleOffice365Calendar}
              variant="outline"
              className="w-full justify-start gap-2"
            >
              <Calendar className="h-4 w-4" />
              Office 365
            </Button>

            <Button
              onClick={handleDownloadICS}
              variant="outline"
              className="w-full justify-start gap-2"
            >
              <Download className="h-4 w-4" />
              Apple Calendar / iPhone & Android
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
