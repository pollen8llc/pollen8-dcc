/**
 * Generate ICS content for an outreach item
 */

import { Outreach } from "@/services/rel8t/outreachService";

const formatICSDate = (date: Date): string => {
  const pad = (num: number) => String(num).padStart(2, '0');
  
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
};

export const generateOutreachICS = (outreach: Outreach, userEmail?: string): string => {
  const now = new Date();
  const startDate = new Date(outreach.due_date);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
  
  const uid = `outreach-${outreach.id}@rel8.app`;
  const timestamp = formatICSDate(now);
  const startDateFormatted = formatICSDate(startDate);
  const endDateFormatted = formatICSDate(endDate);
  
  const contactNames = outreach.contacts?.map(c => c.name).join(', ') || 'contacts';
  const description = outreach.description || `Follow up with ${contactNames}`;
  
  // Escape special characters for ICS format
  const escapeICSText = (text: string) => {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  };

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//REL8//Outreach Task//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
X-WR-CALNAME:REL8 - Outreach Tasks
X-WR-TIMEZONE:UTC
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${timestamp}
DTSTART:${startDateFormatted}
DTEND:${endDateFormatted}
SUMMARY:${escapeICSText(outreach.title)}
DESCRIPTION:${escapeICSText(description)}
LOCATION:REL8 Platform
STATUS:CONFIRMED
SEQUENCE:0
PRIORITY:${outreach.priority === 'high' ? '1' : outreach.priority === 'medium' ? '5' : '9'}
ORGANIZER;CN=REL8 Notifications:mailto:notifications@rel8.app
${userEmail ? `ATTENDEE;CN=${escapeICSText(userEmail)};RSVP=TRUE:mailto:${userEmail}` : ''}
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Reminder: ${escapeICSText(outreach.title)}
END:VALARM
END:VEVENT
END:VCALENDAR`;
};
