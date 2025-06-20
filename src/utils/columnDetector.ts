
// Advanced column detection with fuzzy matching and confidence scoring

export interface ColumnMapping {
  sourceIndex: number;
  targetField: string;
  confidence: number;
  sourceHeader: string;
}

export interface DetectionResult {
  mappings: ColumnMapping[];
  unmappedColumns: number[];
  suggestions: { [key: string]: string[] };
}

export class ColumnDetector {
  private static readonly FIELD_PATTERNS = {
    name: [
      'name', 'full name', 'fullname', 'contact name', 'display name',
      'first name', 'fname', 'given name', 'last name', 'lname', 'surname',
      'full_name', 'contact_name', 'display_name', 'first_name', 'last_name'
    ],
    email: [
      'email', 'email address', 'e-mail', 'mail', 'primary email', 
      'work email', 'personal email', 'email_address', 'primary_email',
      'work_email', 'personal_email', 'e_mail'
    ],
    phone: [
      'phone', 'phone number', 'mobile', 'cell', 'telephone', 'tel',
      'mobile phone', 'work phone', 'home phone', 'cell phone',
      'phone_number', 'mobile_phone', 'work_phone', 'home_phone',
      'cell_phone', 'telephone_number'
    ],
    organization: [
      'organization', 'company', 'org', 'business', 'employer', 'work',
      'company name', 'organization_name', 'company_name', 'workplace'
    ],
    role: [
      'role', 'title', 'job title', 'position', 'job', 'work title',
      'designation', 'job_title', 'work_title', 'position_title'
    ],
    location: [
      'location', 'address', 'city', 'country', 'region', 'state',
      'street', 'zip', 'postal', 'area', 'place'
    ],
    notes: [
      'notes', 'note', 'comments', 'description', 'memo', 'remarks',
      'comment', 'additional info', 'additional_info', 'extra'
    ]
  };

  static detectColumns(headers: string[]): DetectionResult {
    const mappings: ColumnMapping[] = [];
    const unmappedColumns: number[] = [];
    const suggestions: { [key: string]: string[] } = {};

    const normalizedHeaders = headers.map(h => h.toLowerCase().trim());

    // Track which fields have been mapped to avoid duplicates
    const mappedFields = new Set<string>();

    for (let i = 0; i < normalizedHeaders.length; i++) {
      const header = normalizedHeaders[i];
      let bestMatch: { field: string; confidence: number } | null = null;

      // Find the best matching field
      for (const [field, patterns] of Object.entries(this.FIELD_PATTERNS)) {
        if (mappedFields.has(field)) continue;

        const confidence = this.calculateConfidence(header, patterns);
        
        if (confidence > 0.3 && (!bestMatch || confidence > bestMatch.confidence)) {
          bestMatch = { field, confidence };
        }
      }

      if (bestMatch && bestMatch.confidence > 0.5) {
        mappings.push({
          sourceIndex: i,
          targetField: bestMatch.field,
          confidence: bestMatch.confidence,
          sourceHeader: headers[i]
        });
        mappedFields.add(bestMatch.field);
      } else {
        unmappedColumns.push(i);
        
        // Generate suggestions for unmapped columns
        const fieldSuggestions: string[] = [];
        for (const [field, patterns] of Object.entries(this.FIELD_PATTERNS)) {
          if (!mappedFields.has(field)) {
            const confidence = this.calculateConfidence(header, patterns);
            if (confidence > 0.1) {
              fieldSuggestions.push(field);
            }
          }
        }
        
        if (fieldSuggestions.length > 0) {
          suggestions[headers[i]] = fieldSuggestions.sort();
        }
      }
    }

    return { mappings, unmappedColumns, suggestions };
  }

  private static calculateConfidence(header: string, patterns: string[]): number {
    let maxConfidence = 0;

    for (const pattern of patterns) {
      // Exact match
      if (header === pattern) {
        return 1.0;
      }

      // Contains match
      if (header.includes(pattern) || pattern.includes(header)) {
        maxConfidence = Math.max(maxConfidence, 0.8);
      }

      // Fuzzy match using Levenshtein distance
      const similarity = this.calculateSimilarity(header, pattern);
      maxConfidence = Math.max(maxConfidence, similarity);
    }

    return maxConfidence;
  }

  private static calculateSimilarity(str1: string, str2: string): number {
    const matrix: number[][] = [];
    const len1 = str1.length;
    const len2 = str2.length;

    // Initialize matrix
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    // Calculate Levenshtein distance
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 1 : 1 - matrix[len1][len2] / maxLen;
  }

  static getFieldDisplayName(field: string): string {
    const displayNames: { [key: string]: string } = {
      name: 'Name',
      email: 'Email Address',
      phone: 'Phone Number',
      organization: 'Organization/Company',
      role: 'Job Title/Role',
      location: 'Location/Address',
      notes: 'Notes/Comments'
    };
    return displayNames[field] || field;
  }
}
