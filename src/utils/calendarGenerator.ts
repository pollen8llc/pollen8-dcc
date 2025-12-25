// Calendar generation utilities for touchpoint planning

export interface TouchpointEvent {
  title: string;
  description: string;
  startDate: Date;
  duration: number; // minutes
  location?: string;
  attendeeEmail?: string;
  attendeeName?: string;
}

// Format date for ICS (YYYYMMDDTHHMMSSZ)
const formatICSDate = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
};

// Format date for Google Calendar URL (YYYYMMDDTHHmmss)
const formatGoogleDate = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
};

// Generate ICS file content
export const generateICS = (event: TouchpointEvent): string => {
  const endDate = new Date(event.startDate.getTime() + event.duration * 60000);
  
  let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Rel8//Touchpoint Planner//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${Date.now()}@rel8.app
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(event.startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`;

  if (event.location) {
    icsContent += `\nLOCATION:${event.location}`;
  }

  if (event.attendeeEmail) {
    const name = event.attendeeName || event.attendeeEmail;
    icsContent += `\nATTENDEE;CN=${name};RSVP=TRUE:mailto:${event.attendeeEmail}`;
    icsContent += `\nORGANIZER;CN=You:mailto:you@example.com`;
  }

  icsContent += `
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

  return icsContent;
};

// Download ICS file
export const downloadICS = (event: TouchpointEvent, filename?: string): void => {
  const icsContent = generateICS(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${event.title.replace(/\s+/g, '-')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generate Google Calendar URL
export const generateGoogleCalendarUrl = (event: TouchpointEvent): string => {
  const endDate = new Date(event.startDate.getTime() + event.duration * 60000);
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatGoogleDate(event.startDate)}/${formatGoogleDate(endDate)}`,
    details: event.description,
  });

  if (event.location) {
    params.append('location', event.location);
  }

  if (event.attendeeEmail) {
    params.append('add', event.attendeeEmail);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// Generate Outlook Calendar URL
export const generateOutlookUrl = (event: TouchpointEvent): string => {
  const endDate = new Date(event.startDate.getTime() + event.duration * 60000);
  
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: event.startDate.toISOString(),
    enddt: endDate.toISOString(),
    body: event.description,
  });

  if (event.location) {
    params.append('location', event.location);
  }

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};

// Generate Apple Calendar URL (webcal scheme)
export const generateAppleCalendarUrl = (event: TouchpointEvent): string => {
  // Apple Calendar works best with ICS files, so we'll create a data URL
  const icsContent = generateICS(event);
  const base64 = btoa(unescape(encodeURIComponent(icsContent)));
  return `data:text/calendar;base64,${base64}`;
};

// Calendar URL generators object
export const calendarUrls = {
  google: generateGoogleCalendarUrl,
  outlook: generateOutlookUrl,
  apple: generateAppleCalendarUrl,
};

// Duration options for forms
export const durationOptions = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
  { value: 240, label: '4 hours' },
];

// Recurring frequency options
export const recurringFrequencyOptions = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
];
