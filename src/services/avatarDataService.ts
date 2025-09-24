import { AvatarService } from './avatarService';

// Extract avatar data from the gallery component
export const AVATAR_DEFINITIONS = [
  {
    name: 'Pulsar',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="pulsar-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="8" fill="url(#pulsar-{id})">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="20" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" opacity="0.3">
        <animate attributeName="r" values="20;30;20" dur="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="1s" repeatCount="indefinite" />
      </circle>
    </svg>`,
    rarity_tier: 'rare' as const,
    animation_type: 'pulse'
  },
  {
    name: 'Black Hole',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="blackHole-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--foreground))" />
          <stop offset="80%" stopColor="hsl(var(--foreground))" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="12" fill="url(#blackHole-{id})" />
      <circle cx="32" cy="32" r="18" fill="none" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="22" fill="none" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1">
        <animateTransform attributeName="transform" type="rotate" values="360 32 32;0 32 32" dur="1s" repeatCount="indefinite" />
      </circle>
    </svg>`,
    rarity_tier: 'legendary' as const,
    animation_type: 'rotate'
  },
  {
    name: 'Supernova',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="supernova-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--destructive))" />
          <stop offset="50%" stopColor="hsl(var(--accent))" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="4" fill="hsl(var(--destructive))">
        <animate attributeName="opacity" values="1;0.6;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="16" fill="url(#supernova-{id})" opacity="0.5">
        <animate attributeName="r" values="16;24;16" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="20" fill="url(#supernova-{id})" opacity="0.3">
        <animate attributeName="r" values="20;28;20" dur="3s" repeatCount="indefinite" begin="0.5s" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" begin="0.5s" />
      </circle>
    </svg>`,
    rarity_tier: 'epic' as const,
    animation_type: 'explosion'
  },
  {
    name: 'Nebula Swirl',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="nebula-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="50%" stopColor="hsl(var(--accent))" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.3)" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="16" fill="url(#nebula-{id})">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="6s" repeatCount="indefinite" />
      </circle>
    </svg>`,
    rarity_tier: 'rare' as const,
    animation_type: 'swirl'
  },
  {
    name: 'Red Giant',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="redGiant-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--destructive))" />
          <stop offset="100%" stopColor="hsl(var(--primary))" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="14" fill="url(#redGiant-{id})">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="20" fill="hsl(var(--destructive) / 0.3)">
        <animate attributeName="r" values="20;24;20" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="4s" repeatCount="indefinite" />
      </circle>
    </svg>`,
    rarity_tier: 'common' as const,
    animation_type: 'pulse'
  },
  {
    name: 'White Dwarf',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="whiteDwarf-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--background))" />
          <stop offset="100%" stopColor="hsl(var(--primary))" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="6" fill="url(#whiteDwarf-{id})">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="12" fill="none" stroke="hsl(var(--background) / 0.6)" strokeWidth="1">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="10s" repeatCount="indefinite" />
      </circle>
    </svg>`,
    rarity_tier: 'common' as const,
    animation_type: 'rotate'
  }
  // Add more avatars as needed - truncated for brevity
];

export class AvatarDataService {
  static async populateDatabase(): Promise<void> {
    console.log('Populating avatar database...');
    
    for (const avatarDef of AVATAR_DEFINITIONS) {
      try {
        await AvatarService.createAvatar({
          name: avatarDef.name,
          svg_definition: avatarDef.svg_definition,
          network_score_threshold: 0, // All avatars available for now
          rarity_tier: avatarDef.rarity_tier,
          animation_type: avatarDef.animation_type,
          color_scheme: {},
          is_active: true
        });
        console.log(`Created avatar: ${avatarDef.name}`);
      } catch (error) {
        console.error(`Failed to create avatar ${avatarDef.name}:`, error);
      }
    }
    
    console.log('Avatar database population complete');
  }
}