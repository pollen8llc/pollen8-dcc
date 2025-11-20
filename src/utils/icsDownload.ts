/**
 * Download ICS file utility
 * Creates a downloadable calendar file from ICS content
 */

export const downloadICS = (icsContent: string, filename: string = 'event.ics'): void => {
  // Ensure filename has .ics extension
  const icsFilename = filename.endsWith('.ics') ? filename : `${filename}.ics`;
  
  // Create a Blob with the ICS content
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  
  // Create a temporary download link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = icsFilename;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
