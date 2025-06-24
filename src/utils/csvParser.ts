
// Enhanced CSV parsing utilities with support for various formats

export interface CSVParseOptions {
  delimiter?: string;
  quote?: string;
  escape?: string;
  skipEmptyLines?: boolean;
  maxFileSize?: number;
}

export interface ParsedCSVData {
  headers: string[];
  rows: string[][];
  delimiter: string;
  totalRows: number;
  skippedRows: number[];
}

export class CSVParser {
  private static readonly DELIMITERS = [',', ';', '\t', '|'];
  private static readonly QUOTES = ['"', "'"];
  private static readonly MAX_SAMPLE_SIZE = 10000; // First 10KB for delimiter detection

  static async parseFile(file: File, options: CSVParseOptions = {}): Promise<ParsedCSVData> {
    const text = await file.text();
    return this.parseText(text, options);
  }

  static parseText(text: string, options: CSVParseOptions = {}): ParsedCSVData {
    // Remove BOM if present
    const cleanText = text.replace(/^\uFEFF/, '');
    
    // Auto-detect delimiter if not provided
    const delimiter = options.delimiter || this.detectDelimiter(cleanText);
    
    // Parse the CSV
    const lines = cleanText.split(/\r?\n/);
    const headers: string[] = [];
    const rows: string[][] = [];
    const skippedRows: number[] = [];

    let headersParsed = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines if option is set
      if (options.skipEmptyLines && !line) {
        skippedRows.push(i);
        continue;
      }

      const parsedRow = this.parseLine(line, delimiter, options.quote);
      
      if (!headersParsed) {
        headers.push(...parsedRow.map(h => h.trim()));
        headersParsed = true;
      } else {
        if (parsedRow.length > 0 && parsedRow.some(cell => cell.trim())) {
          rows.push(parsedRow);
        } else {
          skippedRows.push(i);
        }
      }
    }

    return {
      headers,
      rows,
      delimiter,
      totalRows: lines.length,
      skippedRows
    };
  }

  private static detectDelimiter(text: string): string {
    const sample = text.substring(0, this.MAX_SAMPLE_SIZE);
    const lines = sample.split(/\r?\n/).slice(0, 5); // Check first 5 lines
    
    let bestDelimiter = ',';
    let maxScore = 0;

    for (const delimiter of this.DELIMITERS) {
      let score = 0;
      let columnCounts: number[] = [];

      for (const line of lines) {
        if (line.trim()) {
          const columns = this.parseLine(line, delimiter).length;
          columnCounts.push(columns);
        }
      }

      // Score based on consistency of column counts
      if (columnCounts.length > 1) {
        const avgColumns = columnCounts.reduce((a, b) => a + b, 0) / columnCounts.length;
        const variance = columnCounts.reduce((acc, count) => acc + Math.pow(count - avgColumns, 2), 0) / columnCounts.length;
        
        // Lower variance is better, higher average column count is better
        score = avgColumns / (1 + variance);
      }

      if (score > maxScore) {
        maxScore = score;
        bestDelimiter = delimiter;
      }
    }

    return bestDelimiter;
  }

  private static parseLine(line: string, delimiter: string, quote: string = '"'): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];

      if (char === quote) {
        if (inQuotes && line[i + 1] === quote) {
          // Escaped quote
          current += quote;
          i += 2;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current);
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }

    result.push(current);
    return result;
  }
}
