-- Update the Magnetosphere avatar to match the avatar gallery version
UPDATE ions_avatar 
SET svg_definition = '<svg width="100%" height="100%" viewBox="0 0 64 64" className="w-full h-full">
        <defs>
            <radialGradient id="magnetosphere" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--secondary))" />
            </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="8" fill="url(#magnetosphere)" />
        <circle cx="32" cy="32" r="16" fill="none" stroke="hsl(var(--primary) / 0.4)" strokeWidth="2">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="32" cy="32" r="12" fill="none" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
        </circle>
    </svg>',
    updated_at = now()
WHERE name = 'Magnetosphere';