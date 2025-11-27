/**
 * Generate ICS update/cancel content for an outreach item
 * Used for sending calendar updates when tasks are modified
 */

import { Outreach } from "@/services/rel8t/outreachService";
import { getLocationFromChannel } from "./channelLocationHelper";

const formatICSDate = (date: Date): string => {
  const pad = (num: number) => String(num).padStart(2, '0');
  
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
};

// Fold long lines at 75 characters per RFC 5545
const foldLine = (line: string): string => {
  if (line.length <= 75) return line;
  
  const result: string[] = [];
  let remaining = line;
  result.push(remaining.substring(0, 75));
  remaining = remaining.substring(75);
  
  while (remaining.length > 0) {
    result.push(' ' + remaining.substring(0, 74)); // Leading space + 74 chars
    remaining = remaining.substring(74);
  }
  
  return result.join('\r\n');
};

// Sanitize names to ASCII-only characters for ICS compatibility
const sanitizeName = (name: string): string => {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII characters
};

type UpdateType = 'update' | 'reschedule' | 'cancel';

export const generateOutreachICSUpdate = (
  outreach: Outreach, 
  systemEmail: string, 
  userEmail: string,
  updateType: UpdateType,
  newSequence: number,
  outreachChannel?: string | null,
  channelDetails?: Record<string, any> | null,
  outreachId?: string,
  userFullName?: string
): string => {
  const now = new Date();
  const startDate = new Date(outreach.due_date);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
  
  const uid = `outreach-${outreach.id}@rel8.app`;
  const timestamp = formatICSDate(now);
  const startDateFormatted = formatICSDate(startDate);
  const endDateFormatted = formatICSDate(endDate);
  
  const contactNames = outreach.contacts?.map(c => c.name).join(', ') || 'contacts';
  const description = outreach.description || `Follow up with ${contactNames}`;
  
  // Get location from channel information
  const location = getLocationFromChannel(outreachChannel, channelDetails);
  
  // Escape special characters for ICS format
  const escapeICSText = (text: string) => {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  };

  // Format summary with user name and task ID at the end
  const shortId = outreachId ? outreachId.slice(0, 8) : '';
  const userName = sanitizeName(userFullName || 'User');
  const summaryText = shortId 
    ? `${userName}: Follow up with - ${contactNames} #${shortId}`
    : `${userName}: Follow up with - ${contactNames}`;

  // Determine METHOD and STATUS based on update type
  const method = updateType === 'cancel' ? 'CANCEL' : 'REQUEST';
  const status = updateType === 'cancel' ? 'CANCELLED' : 'CONFIRMED';

  // Build ICS using array for proper line endings
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//REL8//Outreach Task//EN',
    'CALSCALE:GREGORIAN',
    `METHOD:${method}`,
    'X-WR-CALNAME:REL8 - Outreach Tasks',
    'X-WR-TIMEZONE:UTC',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${startDateFormatted}`,
    `DTEND:${endDateFormatted}`,
    foldLine(`SUMMARY:${escapeICSText(summaryText)}`),
    foldLine(`DESCRIPTION:${escapeICSText(description)}`),
    foldLine(`LOCATION:${escapeICSText(location)}`),
    `STATUS:${status}`,
    `SEQUENCE:${newSequence}`,
    `PRIORITY:${outreach.priority === 'high' ? '1' : outreach.priority === 'medium' ? '5' : '9'}`,
    foldLine(`ORGANIZER;CN=REL8 Notifications:mailto:${systemEmail}`),
    foldLine(`ATTENDEE;CN=REL8 Notification System;ROLE=NON-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${systemEmail}`)
  ];

  // Only add user attendee if email exists
  if (userEmail) {
    lines.push(foldLine(`ATTENDEE;CN=User;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${userEmail}`));
  }

  // Add alarm only for non-cancelled events
  if (updateType !== 'cancel') {
    lines.push(
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      foldLine(`DESCRIPTION:Reminder: ${escapeICSText(summaryText)}`),
      'END:VALARM'
    );
  }

  lines.push(
    'END:VEVENT',
    'END:VCALENDAR'
  );

  return lines.join('\r\n') + '\r\n';
};
