// Simple client-side avatar service with no database dependencies
export class SimpleAvatarService {
  
  // Generate initials from a name
  static getInitials(firstName?: string, lastName?: string, email?: string): string {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    
    return '?';
  }

  // Generate a simple color based on user ID or name
  static getAvatarColor(seed: string = ''): string {
    const colors = [
      'hsl(var(--primary))',
      'hsl(var(--secondary))',
      'hsl(var(--accent))',
      'hsl(220, 70%, 50%)', // blue
      'hsl(280, 70%, 50%)', // purple  
      'hsl(160, 70%, 50%)', // green
      'hsl(30, 70%, 50%)',  // orange
      'hsl(340, 70%, 50%)', // pink
    ];
    
    // Simple hash to pick a color consistently for the same seed
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }

  // Generate a simple SVG avatar with initials
  static generateInitialsAvatar(
    initials: string,
    size: number = 40,
    userId?: string
  ): string {
    const color = this.getAvatarColor(userId || initials);
    
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${color}" />
        <text 
          x="50%" 
          y="50%" 
          text-anchor="middle" 
          dy="0.35em" 
          font-family="system-ui, sans-serif" 
          font-size="${size * 0.4}" 
          font-weight="600" 
          fill="white"
        >
          ${initials}
        </text>
      </svg>
    `;
  }
}