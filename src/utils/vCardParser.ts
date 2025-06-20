
// vCard parsing utilities for mobile contact imports

export interface VCardContact {
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  organization?: string;
  role?: string;
  notes?: string;
}

export class VCardParser {
  static parseVCard(vCardContent: string): VCardContact[] {
    const contacts: VCardContact[] = [];
    const vCards = this.splitVCards(vCardContent);

    for (const vCard of vCards) {
      const contact = this.parseIndividualVCard(vCard);
      if (contact.name || contact.email || contact.phone) {
        contacts.push(contact);
      }
    }

    return contacts;
  }

  private static splitVCards(content: string): string[] {
    const vCards: string[] = [];
    const lines = content.split(/\r?\n/);
    let currentVCard: string[] = [];
    let inVCard = false;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine === 'BEGIN:VCARD') {
        inVCard = true;
        currentVCard = [trimmedLine];
      } else if (trimmedLine === 'END:VCARD') {
        currentVCard.push(trimmedLine);
        vCards.push(currentVCard.join('\n'));
        currentVCard = [];
        inVCard = false;
      } else if (inVCard) {
        currentVCard.push(trimmedLine);
      }
    }

    return vCards;
  }

  private static parseIndividualVCard(vCard: string): VCardContact {
    const contact: VCardContact = {
      name: '',
      email: '',
      phone: '',
      organization: '',
      role: '',
      notes: ''
    };

    const lines = vCard.split(/\r?\n/);
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Parse name fields
      if (trimmedLine.startsWith('FN:')) {
        contact.name = this.unescapeVCardValue(trimmedLine.substring(3));
      } else if (trimmedLine.startsWith('N:')) {
        const nameParts = this.unescapeVCardValue(trimmedLine.substring(2)).split(';');
        if (nameParts.length >= 2) {
          contact.lastName = nameParts[0];
          contact.firstName = nameParts[1];
          if (!contact.name && (contact.firstName || contact.lastName)) {
            contact.name = [contact.firstName, contact.lastName].filter(Boolean).join(' ');
          }
        }
      }
      
      // Parse email
      else if (trimmedLine.includes('EMAIL')) {
        const emailMatch = trimmedLine.match(/EMAIL[^:]*:(.*)/);
        if (emailMatch && !contact.email) {
          contact.email = this.unescapeVCardValue(emailMatch[1]);
        }
      }
      
      // Parse phone
      else if (trimmedLine.includes('TEL')) {
        const phoneMatch = trimmedLine.match(/TEL[^:]*:(.*)/);
        if (phoneMatch && !contact.phone) {
          contact.phone = this.unescapeVCardValue(phoneMatch[1]);
        }
      }
      
      // Parse organization
      else if (trimmedLine.startsWith('ORG:')) {
        contact.organization = this.unescapeVCardValue(trimmedLine.substring(4));
      }
      
      // Parse title/role
      else if (trimmedLine.startsWith('TITLE:')) {
        contact.role = this.unescapeVCardValue(trimmedLine.substring(6));
      }
      
      // Parse notes
      else if (trimmedLine.startsWith('NOTE:')) {
        contact.notes = this.unescapeVCardValue(trimmedLine.substring(5));
      }
    }

    return contact;
  }

  private static unescapeVCardValue(value: string): string {
    return value
      .replace(/\\n/g, '\n')
      .replace(/\\,/g, ',')
      .replace(/\\;/g, ';')
      .replace(/\\\\/g, '\\');
  }

  static convertToCSVFormat(contacts: VCardContact[]): string {
    const headers = ['Name', 'Email', 'Phone', 'Organization', 'Role', 'Notes'];
    const csvLines = [headers.join(',')];

    for (const contact of contacts) {
      const row = [
        this.escapeCSVValue(contact.name || ''),
        this.escapeCSVValue(contact.email || ''),
        this.escapeCSVValue(contact.phone || ''),
        this.escapeCSVValue(contact.organization || ''),
        this.escapeCSVValue(contact.role || ''),
        this.escapeCSVValue(contact.notes || '')
      ];
      csvLines.push(row.join(','));
    }

    return csvLines.join('\n');
  }

  private static escapeCSVValue(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
