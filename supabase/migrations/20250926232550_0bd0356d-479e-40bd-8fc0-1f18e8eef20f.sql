-- Update existing avatars with the gallery designs (source of truth from /admin/avatars)
-- First set all profiles to NULL avatar temporarily
UPDATE public.profiles SET selected_avatar_id = NULL;

-- Now delete all existing avatars safely
DELETE FROM public.ions_avatar;

-- Insert the exact gallery designs as source of truth
INSERT INTO public.ions_avatar (name, svg_definition, network_score_threshold, rarity_tier, animation_type, color_scheme, is_active) VALUES
('Pulsar', '<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
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
</svg>', 0, 'rare', 'pulse', '{"primary": "hsl(var(--primary))", "secondary": "hsl(var(--primary) / 0.6)", "accent": "hsl(var(--accent))"}', true),

('Black Hole', '<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
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
</svg>', 50, 'legendary', 'rotate', '{"primary": "hsl(var(--foreground))", "secondary": "hsl(var(--primary) / 0.5)", "accent": "hsl(var(--accent) / 0.3)"}', true),

('Supernova', '<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
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
</svg>', 100, 'epic', 'explosion', '{"primary": "hsl(var(--destructive))", "secondary": "hsl(var(--accent))", "accent": "transparent"}', true),

('Nebula Swirl', '<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
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
</svg>', 25, 'rare', 'swirl', '{"primary": "hsl(var(--primary))", "secondary": "hsl(var(--accent))", "accent": "hsl(var(--primary) / 0.3)"}', true),

('Red Giant', '<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
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
</svg>', 15, 'common', 'pulse', '{"primary": "hsl(var(--destructive))", "secondary": "hsl(var(--primary))", "accent": "hsl(var(--destructive) / 0.3)"}', true),

('White Dwarf', '<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
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
</svg>', 10, 'common', 'rotate', '{"primary": "hsl(var(--background))", "secondary": "hsl(var(--primary))", "accent": "hsl(var(--background) / 0.6)"}', true),

('Blue Giant', '<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
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
</svg>', 30, 'rare', 'pulse', '{"primary": "#60a5fa", "secondary": "#06b6d4", "accent": "#60a5fa"}', true),

('Magnetosphere', '<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
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
</svg>', 35, 'rare', 'magnetic', '{"primary": "hsl(var(--primary))", "secondary": "hsl(var(--secondary))", "accent": "hsl(var(--accent))"}', true),

('Exoplanet', '<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
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
</svg>', 60, 'epic', 'orbit', '{"primary": "hsl(var(--primary))", "secondary": "hsl(var(--secondary))", "accent": "hsl(var(--accent))"}', true),

('Dark Matter', '<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
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
</svg>', 80, 'legendary', 'mystery', '{"primary": "hsl(var(--foreground) / 0.3)", "secondary": "hsl(var(--muted) / 0.5)", "accent": "hsl(var(--foreground) / 0.2)"}', true),

('Time Dilation', '<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
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
</svg>', 120, 'legendary', 'time', '{"primary": "hsl(var(--foreground))", "secondary": "hsl(var(--primary))", "accent": "hsl(var(--primary) / 0.6)"}', true),

('Purple Giant', '<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
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
</svg>', 40, 'rare', 'pulse', '{"primary": "#a855f7", "secondary": "#7c3aed", "accent": "#a855f7"}', true),

('Orange Dwarf', '<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
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
</svg>', 20, 'common', 'rotate', '{"primary": "#fb923c", "secondary": "#ef4444", "accent": "#fdba74"}', true),

('Hydrogen Atom', '<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
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
</svg>', 5, 'common', 'atomic', '{"primary": "#22d3ee", "secondary": "#3b82f6", "accent": "#22d3ee"}', true),

('Helium Atom', '<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
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
</svg>', 8, 'common', 'atomic', '{"primary": "#4ade80", "secondary": "#10b981", "accent": "#4ade80"}', true),

('Carbon Atom', '<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
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
</svg>', 12, 'common', 'atomic', '{"primary": "#9ca3af", "secondary": "#64748b", "accent": "#9ca3af"}', true),

('Oxygen Atom', '<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
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
</svg>', 16, 'common', 'atomic', '{"primary": "#f87171", "secondary": "#ec4899", "accent": "#f87171"}', true),

('Golden Ratio', '<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
  <defs>
    <linearGradient id="goldenRatio-{id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#fbbf24" />
      <stop offset="100%" stopColor="#f59e0b" />
    </linearGradient>
  </defs>
  <path d="M16 32 Q32 16 48 32 Q32 48 16 32" fill="url(#goldenRatio-{id})" opacity="0.8">
    <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="8s" repeatCount="indefinite" />
  </path>
  <circle cx="32" cy="32" r="4" fill="#fbbf24">
    <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
  </circle>
</svg>', 161, 'legendary', 'golden', '{"primary": "#fbbf24", "secondary": "#f59e0b", "accent": "#fbbf24"}', true);

-- Set all profiles to use the first avatar (Pulsar) as default
UPDATE public.profiles 
SET selected_avatar_id = (SELECT id FROM public.ions_avatar WHERE name = 'Pulsar' LIMIT 1)
WHERE selected_avatar_id IS NULL;