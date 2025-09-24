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
  },
  {
    name: 'Neutron Star',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="neutronStar-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--accent))" />
          <stop offset="100%" stopColor="hsl(var(--primary))" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="5" fill="url(#neutronStar-{id})">
        <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="10" fill="none" stroke="hsl(var(--accent))" strokeWidth="1">
        <animate attributeName="r" values="10;15;10" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0;0.6" dur="0.8s" repeatCount="indefinite" />
      </circle>
      <line x1="32" y1="10" x2="32" y2="0" stroke="hsl(var(--accent))" strokeWidth="2">
        <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite" />
      </line>
      <line x1="32" y1="54" x2="32" y2="64" stroke="hsl(var(--accent))" strokeWidth="2">
        <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite" />
      </line>
    </svg>`,
    rarity_tier: 'epic' as const,
    animation_type: 'pulse'
  },
  {
    name: 'Quasar',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="quasar-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--destructive))" />
          <stop offset="50%" stopColor="hsl(var(--accent))" />
          <stop offset="100%" stopColor="hsl(var(--primary))" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="6" fill="url(#quasar-{id})">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="1s" repeatCount="indefinite" />
      </circle>
      <ellipse cx="32" cy="32" rx="20" ry="4" fill="hsl(var(--accent) / 0.4)">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="32" cy="32" rx="4" ry="20" fill="hsl(var(--destructive) / 0.3)">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
      </ellipse>
    </svg>`,
    rarity_tier: 'legendary' as const,
    animation_type: 'jet'
  },
  {
    name: 'Binary Star',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="binaryStar1-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.5)" />
        </radialGradient>
        <radialGradient id="binaryStar2-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--destructive))" />
          <stop offset="100%" stopColor="hsl(var(--destructive) / 0.5)" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="32" r="6" fill="url(#binaryStar1-{id})">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="40" cy="32" r="4" fill="url(#binaryStar2-{id})">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="4s" repeatCount="indefinite" />
      </circle>
      <ellipse cx="32" cy="32" rx="16" ry="2" fill="hsl(var(--accent) / 0.3)">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="4s" repeatCount="indefinite" />
      </ellipse>
    </svg>`,
    rarity_tier: 'rare' as const,
    animation_type: 'orbit'
  },
  {
    name: 'Solar Flare',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="solarFlare-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--destructive))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="8" fill="url(#solarFlare-{id})">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
      </circle>
      <path d="M32,24 Q40,16 48,24" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2">
        <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="0s" />
      </path>
      <path d="M32,40 Q40,48 48,40" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2">
        <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="1s" />
      </path>
      <path d="M24,32 Q16,24 24,16" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2">
        <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="2s" />
      </path>
    </svg>`,
    rarity_tier: 'rare' as const,
    animation_type: 'flare'
  },
  {
    name: 'Cosmic Ray',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <linearGradient id="cosmicRay-{id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--accent))" />
          <stop offset="100%" stopColor="hsl(var(--primary))" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="2" fill="hsl(var(--accent))">
        <animateTransform attributeName="transform" type="translate" values="0,0;32,32;0,0" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="48" cy="16" r="2" fill="hsl(var(--primary))">
        <animateTransform attributeName="transform" type="translate" values="0,0;-32,32;0,0" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="16" cy="48" r="2" fill="hsl(var(--destructive))">
        <animateTransform attributeName="transform" type="translate" values="0,0;32,-32;0,0" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="1" fill="hsl(var(--foreground))" opacity="0.5" />
    </svg>`,
    rarity_tier: 'common' as const,
    animation_type: 'particle'
  },
  {
    name: 'Gamma Ray Burst',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="gammaRay-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--accent))" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="3" fill="hsl(var(--accent))">
        <animate attributeName="opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="8" fill="url(#gammaRay-{id})" opacity="0.7">
        <animate attributeName="r" values="8;20;8" dur="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0;0.7" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="12" fill="url(#gammaRay-{id})" opacity="0.5">
        <animate attributeName="r" values="12;25;12" dur="1.5s" repeatCount="indefinite" begin="0.2s" />
        <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite" begin="0.2s" />
      </circle>
      <circle cx="32" cy="32" r="16" fill="url(#gammaRay-{id})" opacity="0.3">
        <animate attributeName="r" values="16;30;16" dur="2s" repeatCount="indefinite" begin="0.4s" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" begin="0.4s" />
      </circle>
    </svg>`,
    rarity_tier: 'legendary' as const,
    animation_type: 'burst'
  },
  {
    name: 'Planetary Nebula',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="planetaryNebula-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="30%" stopColor="hsl(var(--accent))" />
          <stop offset="70%" stopColor="hsl(var(--secondary))" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="4" fill="hsl(var(--primary))">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="4s" repeatCount="indefinite" />
      </circle>
      <ellipse cx="32" cy="32" rx="18" ry="12" fill="url(#planetaryNebula-{id})" opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="10s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="32" cy="32" rx="12" ry="18" fill="url(#planetaryNebula-{id})" opacity="0.4">
        <animateTransform attributeName="transform" type="rotate" values="360 32 32;0 32 32" dur="8s" repeatCount="indefinite" />
      </ellipse>
    </svg>`,
    rarity_tier: 'epic' as const,
    animation_type: 'nebula'
  },
  {
    name: 'Gravitational Wave',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="gravWave-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--foreground) / 0.8)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="2" fill="hsl(var(--foreground))" />
      <circle cx="32" cy="32" r="8" fill="none" stroke="hsl(var(--foreground) / 0.6)" strokeWidth="1">
        <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="12" fill="none" stroke="hsl(var(--foreground) / 0.4)" strokeWidth="1">
        <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite" begin="0.5s" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" begin="0.5s" />
      </circle>
      <circle cx="32" cy="32" r="16" fill="none" stroke="hsl(var(--foreground) / 0.2)" strokeWidth="1">
        <animate attributeName="r" values="16;24;16" dur="2s" repeatCount="indefinite" begin="1s" />
        <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite" begin="1s" />
      </circle>
    </svg>`,
    rarity_tier: 'legendary' as const,
    animation_type: 'wave'
  }
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