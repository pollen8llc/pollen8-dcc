
// Data normalization utilities for contacts

export interface NormalizedContact {
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  organization?: string;
  role?: string;
  location?: string;
  notes?: string;
  // New fields for expanded data model
  preferred_name?: string;
  industry?: string;
  birthday?: string;
  professional_goals?: string;
  how_we_met?: string;
  bio?: string;
  interests?: string[];
  tags?: string[];
  status?: string;
  rapport_status?: string;
  preferred_channel?: string;
  next_followup_date?: string;
  last_contact_date?: string;
  anniversary?: string;
  anniversary_type?: string;
  upcoming_event?: string;
  upcoming_event_date?: string;
  events_attended?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ServiceContact {
  name: string;
  email?: string;
  phone?: string;
  organization?: string;
  role?: string;
  notes?: string;
  location?: string;
  category_id?: string;
  tags?: string[];
  // New fields
  preferred_name?: string;
  industry?: string;
  birthday?: string;
  professional_goals?: string;
  how_we_met?: string;
  bio?: string;
  interests?: string[];
  source?: string;
  status?: string;
  rapport_status?: string;
  preferred_channel?: string;
  next_followup_date?: string;
  last_contact_date?: string;
  anniversary?: string;
  anniversary_type?: string;
  upcoming_event?: string;
  upcoming_event_date?: string;
  events_attended?: string[];
}

export class DataNormalizer {
  static normalizeContact(rawData: { [key: string]: string }): NormalizedContact {
    const contact: NormalizedContact = {
      name: '',
      email: '',
      phone: '',
      organization: '',
      role: '',
      location: '',
      notes: ''
    };

    // Normalize name
    if (rawData.name) {
      const nameResult = this.normalizeName(rawData.name);
      contact.name = nameResult.fullName;
      contact.firstName = nameResult.firstName;
      contact.lastName = nameResult.lastName;
    }

    // Normalize email
    if (rawData.email) {
      contact.email = this.normalizeEmail(rawData.email);
    }

    // Normalize phone
    if (rawData.phone) {
      contact.phone = this.normalizePhone(rawData.phone);
    }

    // Normalize other fields
    contact.organization = this.normalizeText(rawData.organization);
    contact.role = this.normalizeText(rawData.role);
    contact.location = this.normalizeText(rawData.location);
    contact.notes = this.normalizeText(rawData.notes);
    contact.preferred_name = this.normalizeText(rawData.preferred_name || rawData.nickname);
    contact.industry = this.normalizeText(rawData.industry);
    contact.birthday = this.normalizeDate(rawData.birthday || rawData.dob);
    contact.professional_goals = this.normalizeText(rawData.professional_goals || rawData.goals);
    contact.how_we_met = this.normalizeText(rawData.how_we_met || rawData.met_at || rawData.source);
    contact.bio = this.normalizeText(rawData.bio || rawData.about);

    // Handle arrays
    contact.interests = this.normalizeArray(rawData.interests);
    contact.tags = this.normalizeArray(rawData.tags);
    contact.events_attended = this.normalizeArray(rawData.events_attended);

    // Handle additional fields
    contact.status = this.normalizeText(rawData.status);
    contact.rapport_status = this.normalizeRapportStatus(rawData.rapport_status);
    contact.preferred_channel = this.normalizeText(rawData.preferred_channel);
    contact.next_followup_date = this.normalizeDate(rawData.next_followup_date);
    contact.last_contact_date = this.normalizeDate(rawData.last_contact_date);
    contact.anniversary = this.normalizeDate(rawData.anniversary);
    contact.anniversary_type = this.normalizeText(rawData.anniversary_type);
    contact.upcoming_event = this.normalizeText(rawData.upcoming_event);
    contact.upcoming_event_date = this.normalizeDate(rawData.upcoming_event_date);

    return contact;
  }

  static transformToServiceContact(normalized: NormalizedContact): ServiceContact {
    // Helper to convert empty strings to undefined
    const cleanValue = (val: string | undefined) => val && val.trim() ? val.trim() : undefined;
    const cleanArray = (arr: string[] | undefined) => arr && arr.length > 0 ? arr : undefined;
    
    return {
      name: normalized.name,
      email: cleanValue(normalized.email),
      phone: cleanValue(normalized.phone),
      organization: cleanValue(normalized.organization),
      role: cleanValue(normalized.role),
      notes: cleanValue(normalized.notes),
      location: cleanValue(normalized.location),
      preferred_name: cleanValue(normalized.preferred_name),
      industry: cleanValue(normalized.industry),
      birthday: cleanValue(normalized.birthday),
      professional_goals: cleanValue(normalized.professional_goals),
      how_we_met: cleanValue(normalized.how_we_met),
      bio: cleanValue(normalized.bio),
      interests: cleanArray(normalized.interests),
      tags: cleanArray(normalized.tags),
      source: 'csv_import',
      status: cleanValue(normalized.status) || 'active',
      rapport_status: cleanValue(normalized.rapport_status),
      preferred_channel: cleanValue(normalized.preferred_channel),
      // Timestamps need ISO format, dates need YYYY-MM-DD
      next_followup_date: this.normalizeTimestamp(normalized.next_followup_date) || undefined,
      last_contact_date: this.normalizeTimestamp(normalized.last_contact_date) || undefined,
      anniversary: this.normalizeDate(normalized.anniversary) || undefined,
      anniversary_type: cleanValue(normalized.anniversary_type),
      upcoming_event: cleanValue(normalized.upcoming_event),
      upcoming_event_date: this.normalizeTimestamp(normalized.upcoming_event_date) || undefined,
      events_attended: cleanArray(normalized.events_attended)
    };
  }

  private static normalizeName(name: string): { fullName: string; firstName?: string; lastName?: string } {
    if (!name) return { fullName: '' };

    const cleaned = name.trim().replace(/\s+/g, ' ');
    
    // Handle "Last, First" format
    if (cleaned.includes(',')) {
      const parts = cleaned.split(',').map(p => p.trim());
      if (parts.length === 2) {
        const lastName = this.capitalizeWords(parts[0]);
        const firstName = this.capitalizeWords(parts[1]);
        return {
          fullName: `${firstName} ${lastName}`,
          firstName,
          lastName
        };
      }
    }

    // Handle "First Last" or multiple words
    const words = cleaned.split(/\s+/).map(word => this.capitalizeWords(word));
    
    if (words.length === 1) {
      return { fullName: words[0] };
    } else if (words.length === 2) {
      return {
        fullName: words.join(' '),
        firstName: words[0],
        lastName: words[1]
      };
    } else {
      // Multiple words - assume first is first name, rest is last name
      return {
        fullName: words.join(' '),
        firstName: words[0],
        lastName: words.slice(1).join(' ')
      };
    }
  }

  private static normalizeEmail(email: string): string {
    if (!email) return '';
    
    return email.toLowerCase().trim();
  }

  private static normalizePhone(phone: string): string {
    if (!phone) return '';

    // Remove all non-digit characters except + at the beginning
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // Handle extensions (common patterns: ext, x, extension)
    const originalPhone = phone.toLowerCase();
    let extension = '';
    
    const extMatches = originalPhone.match(/(?:ext|x|extension)\.?\s*(\d+)/);
    if (extMatches) {
      extension = ` ext ${extMatches[1]}`;
    }

    // Format based on length and pattern
    if (cleaned.startsWith('+')) {
      // International format
      return cleaned + extension;
    } else if (cleaned.length === 10) {
      // US format: (XXX) XXX-XXXX
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}${extension}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      // US format with country code: +1 (XXX) XXX-XXXX
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}${extension}`;
    } else {
      // Keep as-is for other formats
      return cleaned + extension;
    }
  }

  private static normalizeText(text?: string): string {
    if (!text) return '';
    return text.trim().replace(/\s+/g, ' ');
  }

  private static capitalizeWords(text: string): string {
    return text.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase());
  }

  private static normalizeDate(date?: string): string {
    if (!date || !date.trim()) return '';
    const parsed = new Date(date.trim());
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0]; // YYYY-MM-DD for date columns
    }
    return ''; // Empty if invalid - DB won't accept bad dates
  }

  private static normalizeTimestamp(date?: string): string {
    if (!date || !date.trim()) return '';
    const parsed = new Date(date.trim());
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString(); // Full ISO format for timestamp with time zone
    }
    return ''; // Empty if invalid - DB won't accept bad timestamps
  }

  private static normalizeArray(value?: string | string[]): string[] {
    if (!value) return [];
    
    // If it's already an array, return it
    if (Array.isArray(value)) return value.map(v => v.trim()).filter(Boolean);
    
    // If it's a string, split by common delimiters
    return value
      .split(/[,;|]/)
      .map(item => item.trim())
      .filter(Boolean);
  }

  static validateContact(contact: NormalizedContact): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Name validation (only required field)
    if (!contact.name || contact.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    // Email validation (optional but validate if provided)
    if (contact.email && contact.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contact.email)) {
        errors.push('Invalid email format');
      }
    }

    // Phone validation (optional but validate if provided)
    if (contact.phone && contact.phone.trim()) {
      const phoneRegex = /^[\d\s\-\(\)\+\.ext]+$/;
      if (!phoneRegex.test(contact.phone)) {
        errors.push('Invalid phone number format');
      } else if (contact.phone.replace(/\D/g, '').length < 7) {
        warnings.push('Phone number seems too short');
      }
    }

    // Warn if both email and phone are missing (but don't error)
    if (!contact.email && !contact.phone) {
      warnings.push('Contact has no email or phone number');
    }

    // Validate rapport_status if provided
    if (contact.rapport_status && !['red', 'yellow', 'green'].includes(contact.rapport_status.toLowerCase())) {
      errors.push('Rapport status must be red, yellow, or green');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private static normalizeRapportStatus(value?: string): string | undefined {
    if (!value) return undefined;
    const normalized = value.trim().toLowerCase();
    if (['red', 'yellow', 'green'].includes(normalized)) {
      return normalized;
    }
    return undefined;
  }

  static generateContactHash(contact: NormalizedContact): string {
    // Create a hash for duplicate detection
    const key = [
      contact.name?.toLowerCase(),
      contact.email?.toLowerCase(),
      contact.phone?.replace(/\D/g, '')
    ].filter(Boolean).join('|');
    
    return btoa(key);
  }
}
