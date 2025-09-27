import { AvatarService } from './avatarService';

// Extract avatar data from the gallery component - source of truth from /admin/avatars
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
    name: 'Blue Giant',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="blueGiant-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#06b6d4" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="14" fill="url(#blueGiant-{id})">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="20" fill="url(#blueGiant-{id})" opacity="0.3">
        <animate attributeName="r" values="20;24;20" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>`,
    rarity_tier: 'rare' as const,
    animation_type: 'pulse'
  },
  {
    name: 'Magnetosphere',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="magnetosphere-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--secondary))" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="8" fill="url(#magnetosphere-{id})" />
      <circle cx="32" cy="32" r="16" fill="none" stroke="hsl(var(--primary) / 0.4)" strokeWidth="2">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="12" fill="none" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1">
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
      </circle>
    </svg>`,
    rarity_tier: 'rare' as const,
    animation_type: 'magnetic'
  },
  {
    name: 'Exoplanet',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="exoplanet-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--secondary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="10" fill="url(#exoplanet-{id})">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="16" fill="none" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="12s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="16" r="2" fill="hsl(var(--primary))">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="4s" repeatCount="indefinite" />
      </circle>
    </svg>`,
    rarity_tier: 'epic' as const,
    animation_type: 'orbit'
  },
  {
    name: 'Dark Matter',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="darkMatter-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--foreground) / 0.3)" />
          <stop offset="100%" stopColor="hsl(var(--muted) / 0.5)" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="12" fill="url(#darkMatter-{id})">
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="18" fill="none" stroke="hsl(var(--foreground) / 0.2)" strokeWidth="1">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="8s" repeatCount="indefinite" />
      </circle>
    </svg>`,
    rarity_tier: 'legendary' as const,
    animation_type: 'mystery'
  },
  {
    name: 'Time Dilation',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="timeDilation-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--foreground))" />
          <stop offset="100%" stopColor="hsl(var(--primary))" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="4" fill="url(#timeDilation-{id})" />
      <circle cx="32" cy="32" r="12" fill="none" stroke="hsl(var(--foreground) / 0.4)" strokeWidth="2">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="16" fill="none" stroke="hsl(var(--primary) / 0.6)" strokeWidth="1">
        <animateTransform attributeName="transform" type="rotate" values="360 32 32;0 32 32" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>`,
    rarity_tier: 'legendary' as const,
    animation_type: 'time'
  },
  {
    name: 'Purple Giant',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="purpleGiant-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="12" fill="url(#purpleGiant-{id})">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="18" fill="url(#purpleGiant-{id})" opacity="0.4">
        <animate attributeName="r" values="18;22;18" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="4s" repeatCount="indefinite" />
      </circle>
    </svg>`,
    rarity_tier: 'rare' as const,
    animation_type: 'pulse'
  },
  {
    name: 'Orange Dwarf',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="orangeDwarf-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ef4444" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="10" fill="url(#orangeDwarf-{id})">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="12" fill="none" stroke="#fdba74" strokeWidth="1" opacity="0.4">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="8s" repeatCount="indefinite" />
      </circle>
    </svg>`,
    rarity_tier: 'common' as const,
    animation_type: 'rotate'
  },
  {
    name: 'Hydrogen Atom',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="hydrogenCore-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#3b82f6" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="4" fill="url(#hydrogenCore-{id})" />
      <circle cx="32" cy="32" r="12" fill="none" stroke="#22d3ee" strokeWidth="1">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="44" cy="32" r="2" fill="#3b82f6">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>`,
    rarity_tier: 'common' as const,
    animation_type: 'atomic'
  },
  {
    name: 'Helium Atom',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="heliumCore-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#10b981" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="4" fill="url(#heliumCore-{id})" />
      <circle cx="32" cy="32" r="12" fill="none" stroke="#4ade80" strokeWidth="1">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="44" cy="32" r="2" fill="#10b981">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="20" cy="32" r="2" fill="#10b981">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" begin="1.5s" />
      </circle>
    </svg>`,
    rarity_tier: 'common' as const,
    animation_type: 'atomic'
  },
  {
    name: 'Carbon Atom',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="carbonCore-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#64748b" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="6" fill="url(#carbonCore-{id})" />
      <circle cx="32" cy="32" r="16" fill="none" stroke="#9ca3af" strokeWidth="1">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="48" cy="32" r="2" fill="#64748b">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="16" cy="32" r="2" fill="#64748b">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" begin="1s" />
      </circle>
      <circle cx="32" cy="48" r="2" fill="#64748b">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" begin="2s" />
      </circle>
      <circle cx="32" cy="16" r="2" fill="#64748b">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" begin="3s" />
      </circle>
    </svg>`,
    rarity_tier: 'common' as const,
    animation_type: 'atomic'
  },
  {
    name: 'Oxygen Atom',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="oxygenCore-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#ec4899" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="6" fill="url(#oxygenCore-{id})" />
      <circle cx="32" cy="32" r="18" fill="none" stroke="#f87171" strokeWidth="1">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="32" r="2" fill="#ec4899">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="14" cy="32" r="2" fill="#ec4899">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" begin="1s" />
      </circle>
      <circle cx="32" cy="50" r="2" fill="#ec4899">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" begin="2s" />
      </circle>
      <circle cx="32" cy="14" r="2" fill="#ec4899">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" begin="3s" />
      </circle>
      <circle cx="41" cy="23" r="2" fill="#ec4899">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" begin="4s" />
      </circle>
      <circle cx="23" cy="41" r="2" fill="#ec4899">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" begin="5s" />
      </circle>
    </svg>`,
    rarity_tier: 'rare' as const,
    animation_type: 'atomic'
  },
  {
    name: 'Iron Atom',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="ironCore-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#ea580c" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="8" fill="url(#ironCore-{id})" />
      <circle cx="32" cy="32" r="12" fill="none" stroke="#ca8a04" strokeWidth="1" opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="20" fill="none" stroke="#ea580c" strokeWidth="1" opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" values="360 32 32;0 32 32" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="44" cy="32" r="1.5" fill="#ca8a04">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="20" cy="32" r="1.5" fill="#ca8a04">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="2s" repeatCount="indefinite" begin="1s" />
      </circle>
    </svg>`,
    rarity_tier: 'epic' as const,
    animation_type: 'atomic'
  },
  {
    name: 'Gold Atom',
    svg_definition: `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <radialGradient id="goldCore-{id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="8" fill="url(#goldCore-{id})">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="12" fill="none" stroke="#facc15" strokeWidth="1" opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="16" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.4">
        <animateTransform attributeName="transform" type="rotate" values="360 32 32;0 32 32" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="20" fill="none" stroke="#facc15" strokeWidth="1" opacity="0.3">
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>`,
    rarity_tier: 'legendary' as const,
    animation_type: 'atomic'
  }
];

export class AvatarDataService {
  static async populateDatabase(): Promise<void> {
    console.log('Populating avatar database from /admin/avatars source of truth...');
    
    for (const avatarDef of AVATAR_DEFINITIONS) {
      try {
        // Check if avatar already exists
        const existingAvatars = await AvatarService.getAllActiveAvatars();
        const exists = existingAvatars.find(a => a.name === avatarDef.name);
        
        if (exists) {
          // Update existing avatar with the latest SVG definition from gallery
          await AvatarService.updateAvatar(exists.id, {
            svg_definition: avatarDef.svg_definition,
            rarity_tier: avatarDef.rarity_tier,
            animation_type: avatarDef.animation_type,
            updated_at: new Date().toISOString()
          });
          console.log(`Updated avatar: ${avatarDef.name}`);
        } else {
          // Create new avatar
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
        }
      } catch (error) {
        console.error(`Failed to process avatar ${avatarDef.name}:`, error);
      }
    }
    
    console.log('Avatar database population complete');
  }

  static async clearAndPopulateDatabase(): Promise<void> {
    console.log('Clearing and repopulating avatar database from /admin/avatars...');
    
    try {
      // Get all existing avatars and deactivate them
      const existingAvatars = await AvatarService.getAllActiveAvatars();
      for (const avatar of existingAvatars) {
        await AvatarService.updateAvatar(avatar.id, { is_active: false });
      }
      
      // Now populate with fresh data
      await this.populateDatabase();
      
      console.log('Avatar database cleared and repopulated successfully');
    } catch (error) {
      console.error('Failed to clear and populate avatar database:', error);
    }
  }
}