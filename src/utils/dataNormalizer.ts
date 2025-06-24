
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

    return contact;
  }

  static transformToServiceContact(normalized: NormalizedContact): ServiceContact {
    return {
      name: normalized.name,
      email: normalized.email || undefined,
      phone: normalized.phone || undefined,
      organization: normalized.organization || undefined,
      role: normalized.role || undefined,
      notes: normalized.notes || undefined,
      location: normalized.location || undefined,
      tags: []
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

  static validateContact(contact: NormalizedContact): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Name validation
    if (!contact.name || contact.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    // Email validation
    if (contact.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contact.email)) {
        errors.push('Invalid email format');
      }
    }

    // Phone validation
    if (contact.phone) {
      const phoneRegex = /^[\d\s\-\(\)\+\.ext]+$/;
      if (!phoneRegex.test(contact.phone)) {
        errors.push('Invalid phone number format');
      } else if (contact.phone.replace(/\D/g, '').length < 7) {
        warnings.push('Phone number seems too short');
      }
    }

    // Require either email or phone
    if (!contact.email && !contact.phone) {
      errors.push('Contact must have either an email address or phone number');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
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
