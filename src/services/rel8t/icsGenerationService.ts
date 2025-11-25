/**
 * ICS Calendar File Generation Service
 * Creates iCalendar (.ics) files for trigger events
 */

import { getLocationFromChannel } from "@/utils/channelLocationHelper";

export interface ICSEventData {
  uid: string;
  summary: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  organizer: {
    email: string;
    name?: string;
  };
  attendees: Array<{
    email: string;
    name?: string;
    role?: 'REQ-PARTICIPANT' | 'NON-PARTICIPANT';
  }>;
  recurrenceRule?: string;
  sequence?: number;
  status?: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
}

/**
 * Format a date for ICS format (YYYYMMDDTHHMMSSZ)
 */
const formatICSDate = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
};

/**
 * Generate an ICS file content from event data
 */
export const generateICSFile = (event: ICSEventData): string => {
  const now = new Date();
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ecosystem Builder//REL8 Trigger System//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${event.uid}`,
    `DTSTAMP:${formatICSDate(now)}`,
    `DTSTART:${formatICSDate(event.startDate)}`,
  ];

  // Add optional end date
  if (event.endDate) {
    lines.push(`DTEND:${formatICSDate(event.endDate)}`);
  }

  // Add summary (required)
  lines.push(`SUMMARY:${event.summary}`);

  // Add description if provided
  if (event.description) {
    // Escape special characters and handle line breaks
    const escapedDescription = event.description
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
    lines.push(`DESCRIPTION:${escapedDescription}`);
  }

  // Add location if provided
  if (event.location) {
    lines.push(`LOCATION:${event.location}`);
  }

  // Add organizer
  const organizerName = event.organizer.name ? `;CN=${event.organizer.name}` : '';
  lines.push(`ORGANIZER${organizerName}:mailto:${event.organizer.email}`);

  // Add attendees
  event.attendees.forEach(attendee => {
    const attendeeName = attendee.name ? `;CN=${attendee.name}` : '';
    const role = attendee.role || 'REQ-PARTICIPANT';
    lines.push(`ATTENDEE;ROLE=${role};PARTSTAT=NEEDS-ACTION;RSVP=TRUE${attendeeName}:mailto:${attendee.email}`);
  });

  // Add recurrence rule if provided
  if (event.recurrenceRule) {
    lines.push(`RRULE:${event.recurrenceRule}`);
  }

  // Add sequence number (for updates)
  lines.push(`SEQUENCE:${event.sequence || 0}`);

  // Add status
  lines.push(`STATUS:${event.status || 'CONFIRMED'}`);

  // Close the event and calendar
  lines.push('END:VEVENT', 'END:VCALENDAR');

  // Join with proper line endings
  return lines.join('\r\n');
};

/**
 * Convert trigger recurrence pattern to RRULE format
 */
export const generateRRULE = (recurrenceType: string, recurrencePattern?: any): string | undefined => {
  if (!recurrencePattern || recurrenceType === 'once') {
    return undefined;
  }

  const rules: string[] = [];

  switch (recurrenceType) {
    case 'hourly':
      rules.push('FREQ=HOURLY');
      if (recurrencePattern.interval) {
        rules.push(`INTERVAL=${recurrencePattern.interval}`);
      }
      break;

    case 'daily':
      rules.push('FREQ=DAILY');
      if (recurrencePattern.interval) {
        rules.push(`INTERVAL=${recurrencePattern.interval}`);
      }
      break;

    case 'weekly':
      rules.push('FREQ=WEEKLY');
      if (recurrencePattern.days_of_week && recurrencePattern.days_of_week.length > 0) {
        const days = recurrencePattern.days_of_week.map((d: string) => d.toUpperCase().substring(0, 2));
        rules.push(`BYDAY=${days.join(',')}`);
      }
      break;

    case 'biweekly':
      rules.push('FREQ=WEEKLY');
      rules.push('INTERVAL=2');
      if (recurrencePattern.days_of_week && recurrencePattern.days_of_week.length > 0) {
        const days = recurrencePattern.days_of_week.map((d: string) => d.toUpperCase().substring(0, 2));
        rules.push(`BYDAY=${days.join(',')}`);
      }
      break;

    case 'monthly':
      rules.push('FREQ=MONTHLY');
      if (recurrencePattern.day_of_month) {
        rules.push(`BYMONTHDAY=${recurrencePattern.day_of_month}`);
      }
      break;

    case 'quarterly':
      rules.push('FREQ=MONTHLY');
      rules.push('INTERVAL=3');
      if (recurrencePattern.day_of_month) {
        rules.push(`BYMONTHDAY=${recurrencePattern.day_of_month}`);
      }
      break;

    case 'yearly':
      rules.push('FREQ=YEARLY');
      if (recurrencePattern.month && recurrencePattern.day_of_month) {
        rules.push(`BYMONTH=${recurrencePattern.month}`);
        rules.push(`BYMONTHDAY=${recurrencePattern.day_of_month}`);
      }
      break;
  }

  // Add end date if specified
  if (recurrencePattern.end_date) {
    const endDate = new Date(recurrencePattern.end_date);
    rules.push(`UNTIL=${formatICSDate(endDate)}`);
  }

  return rules.length > 0 ? rules.join(';') : undefined;
};

/**
 * Convert a trigger object to ICS event data
 */
export const triggerToICSEventData = (
  trigger: any,
  userEmail: string,
  userName?: string
): ICSEventData => {
  const startDate = new Date(trigger.next_execution_at || trigger.execution_time || trigger.created_at);
  
  // End date is 30 minutes after start for calendar blocking
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

  // Format channel details for description
  let channelInfo = "";
  if (trigger.outreach_channel && trigger.channel_details) {
    const channelLabels: Record<string, string> = {
      text: "📱 Text/SMS",
      call: "📞 Phone Call",
      email: "✉️ Email",
      dm: "💬 Direct Message",
      meeting: "🎥 Virtual Meeting",
      irl: "🤝 In-Person Meeting"
    };

    channelInfo = `\n\n${channelLabels[trigger.outreach_channel] || "Follow-up Method"}\n`;

    const details = trigger.channel_details;
    if (details.phone) channelInfo += `📱 Phone: ${details.phone}\n`;
    if (details.email) channelInfo += `✉️ Email: ${details.email}\n`;
    if (details.platform && details.handle) channelInfo += `💬 ${details.platform}: ${details.handle}\n`;
    if (details.meetingPlatform && details.link) {
      channelInfo += `🔗 ${details.meetingPlatform} Meeting: ${details.link}\n`;
    }
    if (details.address) channelInfo += `📍 Location: ${details.address}\n`;
  }

  const description = `${trigger.description || "Automated reminder from Ecosystem Builder REL8"}${channelInfo}`;

  // Get location from channel information
  const location = getLocationFromChannel(trigger.outreach_channel, trigger.channel_details);

  return {
    uid: trigger.calendar_event_uid || `trigger-${trigger.id}@ecosystembuilder.app`,
    summary: trigger.name,
    description,
    startDate,
    endDate,
    location,
    organizer: {
      email: trigger.system_email || 'notifications@ecosystembuilder.app',
      name: 'Ecosystem Builder REL8 System',
    },
    attendees: [
      {
        email: trigger.system_email || 'notifications@ecosystembuilder.app',
        name: 'REL8 Notification System',
        role: 'NON-PARTICIPANT',
      },
      {
        email: userEmail,
        name: userName || 'User',
        role: 'REQ-PARTICIPANT',
      },
    ],
    recurrenceRule: generateRRULE(trigger.time_trigger_type, trigger.recurrence_pattern),
    sequence: 0,
    status: trigger.is_active ? 'CONFIRMED' : 'CANCELLED',
  };
};
