
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to replace "Rel8t" with "REL8" in text
export function rebrandText(text: string): string {
  return text.replace(/Rel8t/g, "REL8").replace(/rel8t/g, "rel8");
}

// Utility for parsing CSV files with various formats
export function parseCSV(text: string): Array<Record<string, string>> {
  const lines = text.split('\n');
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const results: Array<Record<string, string>> = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines
    
    const values = lines[i].split(',').map(v => v.trim());
    const obj: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      obj[header] = index < values.length ? values[index] : '';
    });
    
    results.push(obj);
  }
  
  return results;
}

// Format phone numbers for display
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 10) return phone; // Return original if not enough digits
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }
  
  // Handle international numbers
  return `+${cleaned.slice(0, cleaned.length - 10)} (${cleaned.slice(-10, -7)}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
}

// Check if two contacts might be duplicates
export function areDuplicateContacts(a: any, b: any): boolean {
  // Check by email (most reliable)
  if (a.email && b.email && 
      a.email.toLowerCase().trim() === b.email.toLowerCase().trim()) {
    return true;
  }
  
  // Check by phone (if available and normalized)
  if (a.phone && b.phone) {
    const phoneA = a.phone.replace(/\D/g, '');
    const phoneB = b.phone.replace(/\D/g, '');
    if (phoneA.length >= 10 && phoneB.length >= 10 && 
        phoneA.slice(-10) === phoneB.slice(-10)) {
      return true;
    }
  }
  
  // Check by name (least reliable, only if very specific)
  if (a.name && b.name) {
    const nameA = a.name.toLowerCase().trim();
    const nameB = b.name.toLowerCase().trim();
    
    // Only consider full names with more than one word
    if (nameA.split(' ').length > 1 && nameA === nameB) {
      return true;
    }
  }
  
  return false;
}

// Format distance to now (e.g., "2 days ago")
export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const pastDate = typeof date === 'string' ? new Date(date) : date;
  
  const seconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
  
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
}
