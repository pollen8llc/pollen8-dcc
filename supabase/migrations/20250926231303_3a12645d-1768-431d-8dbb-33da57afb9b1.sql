-- Insert all 20 space-themed avatars into ions_avatar table with correct rarity tiers
INSERT INTO public.ions_avatar (name, svg_definition, network_score_threshold, rarity_tier, animation_type, color_scheme, is_active) VALUES
('Pulsar', '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="pulsar-{id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#00ffff;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#0080ff;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#000080;stop-opacity:0.6" />
    </radialGradient>
    <filter id="glow-{id}">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <circle cx="50" cy="50" r="35" fill="url(#pulsar-{id})" filter="url(#glow-{id})">
    <animate attributeName="r" values="35;40;35" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="50" cy="50" r="15" fill="#ffffff" opacity="0.9">
    <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1s" repeatCount="indefinite"/>
  </circle>
</svg>', 0, 'common', 'pulse', '{"primary": "#00ffff", "secondary": "#0080ff", "accent": "#ffffff"}', true),

('Black Hole', '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="blackhole-{id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
      <stop offset="70%" style="stop-color:#1a1a1a;stop-opacity:0.9" />
      <stop offset="90%" style="stop-color:#ff4500;stop-opacity:0.7" />
      <stop offset="100%" style="stop-color:#ffaa00;stop-opacity:0.5" />
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="40" fill="url(#blackhole-{id})">
    <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="50" cy="50" r="20" fill="#000000"/>
  <circle cx="50" cy="50" r="8" fill="#000000"/>
</svg>', 50, 'rare', 'rotate', '{"primary": "#000000", "secondary": "#ff4500", "accent": "#ffaa00"}', true),

('Supernova', '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="supernova-{id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="30%" style="stop-color:#ffff00;stop-opacity:0.9" />
      <stop offset="60%" style="stop-color:#ff6600;stop-opacity:0.7" />
      <stop offset="100%" style="stop-color:#ff0000;stop-opacity:0.5" />
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="38" fill="url(#supernova-{id})">
    <animate attributeName="r" values="38;45;38" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite"/>
  </circle>
  <g transform="translate(50,50)">
    <path d="M-5,0 L5,0 M0,-5 L0,5 M-3.5,-3.5 L3.5,3.5 M-3.5,3.5 L3.5,-3.5" stroke="#ffffff" stroke-width="2" opacity="0.9">
      <animateTransform attributeName="transform" type="rotate" values="0;360" dur="3s" repeatCount="indefinite"/>
    </path>
  </g>
</svg>', 100, 'legendary', 'explode', '{"primary": "#ffffff", "secondary": "#ffff00", "accent": "#ff0000"}', true),

('Neutron Star', '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="neutron-{id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="40%" style="stop-color:#c0c0c0;stop-opacity:0.9" />
      <stop offset="80%" style="stop-color:#404040;stop-opacity:0.7" />
      <stop offset="100%" style="stop-color:#000000;stop-opacity:0.5" />
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="25" fill="url(#neutron-{id})"/>
  <circle cx="50" cy="50" r="20" fill="none" stroke="#00ffff" stroke-width="1" opacity="0.7">
    <animate attributeName="r" values="20;25;20" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="50" cy="50" r="15" fill="none" stroke="#ffffff" stroke-width="0.5" opacity="0.5">
    <animate attributeName="r" values="15;20;15" dur="2s" repeatCount="indefinite"/>
  </circle>
</svg>', 75, 'epic', 'pulse', '{"primary": "#ffffff", "secondary": "#c0c0c0", "accent": "#00ffff"}', true),

('Magnetosphere', '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mag-{id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00ff88;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#0088ff;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#8800ff;stop-opacity:0.6" />
    </linearGradient>
  </defs>
  <ellipse cx="50" cy="50" rx="35" ry="20" fill="url(#mag-{id})" opacity="0.7">
    <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="6s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="50" cy="50" rx="30" ry="15" fill="none" stroke="#00ff88" stroke-width="1">
    <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" dur="4s" repeatCount="indefinite"/>
  </ellipse>
  <circle cx="50" cy="50" r="8" fill="#ffffff"/>
</svg>', 25, 'rare', 'rotate', '{"primary": "#00ff88", "secondary": "#0088ff", "accent": "#8800ff"}', true),

('Quasar', '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="quasar-{id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="30%" style="stop-color:#00ffff;stop-opacity:0.9" />
      <stop offset="70%" style="stop-color:#0000ff;stop-opacity:0.7" />
      <stop offset="100%" style="stop-color:#000040;stop-opacity:0.5" />
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="30" fill="url(#quasar-{id})"/>
  <rect x="48" y="10" width="4" height="20" fill="#ffffff">
    <animate attributeName="height" values="20;30;20" dur="2s" repeatCount="indefinite"/>
  </rect>
  <rect x="48" y="70" width="4" height="20" fill="#ffffff">
    <animate attributeName="height" values="20;30;20" dur="2s" repeatCount="indefinite"/>
  </rect>
</svg>', 150, 'legendary', 'beam', '{"primary": "#ffffff", "secondary": "#00ffff", "accent": "#0000ff"}', true),

('Galaxy Core', '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="galaxy-{id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#ffff00;stop-opacity:1" />
      <stop offset="40%" style="stop-color:#ff8800;stop-opacity:0.8" />
      <stop offset="70%" style="stop-color:#ff0088;stop-opacity:0.6" />
      <stop offset="100%" style="stop-color:#8800ff;stop-opacity:0.4" />
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="40" fill="url(#galaxy-{id})">
    <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="10s" repeatCount="indefinite"/>
  </circle>
  <ellipse cx="50" cy="50" rx="35" ry="8" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.6">
    <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="8s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="50" cy="50" rx="25" ry="6" fill="none" stroke="#ffff00" stroke-width="1" opacity="0.8">
    <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" dur="6s" repeatCount="indefinite"/>
  </ellipse>
</svg>', 125, 'epic', 'spiral', '{"primary": "#ffff00", "secondary": "#ff8800", "accent": "#8800ff"}', true),

('Cosmic Wind', '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wind-{id}" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" style="stop-color:#00ffff;stop-opacity:0.2" />
      <stop offset="50%" style="stop-color:#0088ff;stop-opacity:0.6" />
      <stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" />
    </linearGradient>
  </defs>
  <path d="M10,30 Q30,20 50,30 T90,25" stroke="url(#wind-{id})" stroke-width="2" fill="none">
    <animate attributeName="d" values="M10,30 Q30,20 50,30 T90,25;M10,25 Q30,35 50,25 T90,30;M10,30 Q30,20 50,30 T90,25" dur="3s" repeatCount="indefinite"/>
  </path>
  <path d="M10,50 Q30,40 50,50 T90,45" stroke="url(#wind-{id})" stroke-width="3" fill="none">
    <animate attributeName="d" values="M10,50 Q30,40 50,50 T90,45;M10,45 Q30,55 50,45 T90,50;M10,50 Q30,40 50,50 T90,45" dur="2.5s" repeatCount="indefinite"/>
  </path>
  <path d="M10,70 Q30,60 50,70 T90,65" stroke="url(#wind-{id})" stroke-width="2" fill="none">
    <animate attributeName="d" values="M10,70 Q30,60 50,70 T90,65;M10,65 Q30,75 50,65 T90,70;M10,70 Q30,60 50,70 T90,65" dur="3.5s" repeatCount="indefinite"/>
  </path>
</svg>', 10, 'common', 'flow', '{"primary": "#00ffff", "secondary": "#0088ff", "accent": "#ffffff"}', true),

('Solar Flare', '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="flare-{id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="30%" style="stop-color:#ffff00;stop-opacity:0.9" />
      <stop offset="60%" style="stop-color:#ff8800;stop-opacity:0.7" />
      <stop offset="100%" style="stop-color:#ff0000;stop-opacity:0.5" />
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="20" fill="url(#flare-{id})"/>
  <path d="M50,30 Q60,20 70,30 Q60,40 50,30" fill="#ffff00" opacity="0.8">
    <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="4s" repeatCount="indefinite"/>
  </path>
  <path d="M70,50 Q80,40 90,50 Q80,60 70,50" fill="#ff8800" opacity="0.7">
    <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="4s" repeatCount="indefinite"/>
  </path>
  <path d="M50,70 Q40,80 30,70 Q40,60 50,70" fill="#ff0000" opacity="0.6">
    <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="4s" repeatCount="indefinite"/>
  </path>
</svg>', 40, 'rare', 'flare', '{"primary": "#ffffff", "secondary": "#ffff00", "accent": "#ff0000"}', true),

('Asteroid Belt', '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="asteroid-{id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B4513;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#A0522D;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#CD853F;stop-opacity:0.6" />
    </linearGradient>
  </defs>
  <circle cx="25" cy="35" r="8" fill="url(#asteroid-{id})">
    <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="12s" repeatCount="indefinite"/>
  </circle>
  <circle cx="60" cy="25" r="6" fill="url(#asteroid-{id})">
    <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="10s" repeatCount="indefinite"/>
  </circle>
  <circle cx="75" cy="60" r="10" fill="url(#asteroid-{id})">
    <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="15s" repeatCount="indefinite"/>
  </circle>
  <circle cx="30" cy="70" r="7" fill="url(#asteroid-{id})">
    <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="55" cy="75" r="5" fill="url(#asteroid-{id})">
    <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="6s" repeatCount="indefinite"/>
  </circle>
</svg>', 15, 'common', 'orbit', '{"primary": "#8B4513", "secondary": "#A0522D", "accent": "#CD853F"}', true),

('Wormhole', '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="wormhole-{id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
      <stop offset="30%" style="stop-color:#4B0082;stop-opacity:0.8" />
      <stop offset="60%" style="stop-color:#8A2BE2;stop-opacity:0.6" />
      <stop offset="100%" style="stop-color:#DA70D6;stop-opacity:0.4" />
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="35" fill="url(#wormhole-{id})">
    <animateTransform attributeName="transform" type="rotate" values="0 50 50;-360 50 50" dur="6s" repeatCount="indefinite"/>
  </circle>
  <circle cx="50" cy="50" r="25" fill="none" stroke="#8A2BE2" stroke-width="1">
    <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" dur="4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="50" cy="50" r="15" fill="none" stroke="#DA70D6" stroke-width="2">
    <animateTransform attributeName="transform" type="rotate" values="0 50 50;-360 50 50" dur="3s" repeatCount="indefinite"/>
  </circle>
  <circle cx="50" cy="50" r="5" fill="#000000"/>
</svg>', 200, 'legendary', 'vortex', '{"primary": "#000000", "secondary": "#4B0082", "accent": "#DA70D6"}', true),

('Plasma Storm', '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="plasma-{id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="40%" style="stop-color:#00ffff;stop-opacity:0.8" />
      <stop offset="70%" style="stop-color:#ff00ff;stop-opacity:0.6" />
      <stop offset="100%" style="stop-color:#8000ff;stop-opacity:0.4" />
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="30" fill="url(#plasma-{id})" opacity="0.8">
    <animate attributeName="r" values="30;40;30" dur="2s" repeatCount="indefinite"/>
  </circle>
  <path d="M30,30 L70,30 L60,50 L70,70 L30,70 L40,50 Z" fill="#ff00ff" opacity="0.6">
    <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
  </path>
</svg>', 60, 'rare', 'storm', '{"primary": "#ffffff", "secondary": "#00ffff", "accent": "#ff00ff"}', true),

('Comet Trail', '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="comet-{id}" x1="80%" y1="20%" x2="20%" y2="80%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="30%" style="stop-color:#00ffff;stop-opacity:0.8" />
      <stop offset="70%" style="stop-color:#0080ff;stop-opacity:0.4" />
      <stop offset="100%" style="stop-color:#000080;stop-opacity:0.1" />
    </linearGradient>
  </defs>
  <circle cx="75" cy="25" r="8" fill="#ffffff"/>
  <path d="M75,25 Q60,40 45,55 T15,85" stroke="url(#comet-{id})" stroke-width="12" fill="none">
    <animate attributeName="stroke-width" values="12;8;12" dur="3s" repeatCount="indefinite"/>
  </path>
  <path d="M75,25 Q65,35 55,45 T35,65" stroke="#ffffff" stroke-width="4" fill="none" opacity="0.8">
    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite"/>
  </path>
</svg>', 20, 'common', 'streak', '{"primary": "#ffffff", "secondary": "#00ffff", "accent": "#0080ff"}', true),

('Dark Matter', '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="dark-{id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:0.9" />
      <stop offset="50%" style="stop-color:#16213e;stop-opacity:0.7" />
      <stop offset="100%" style="stop-color:#0f3460;stop-opacity:0.5" />
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="35" fill="url(#dark-{id})" stroke="#4a5568" stroke-width="1"/>
  <circle cx="35" cy="35" r="3" fill="#64748b" opacity="0.7">
    <animate attributeName="opacity" values="0.7;0.3;0.7" dur="4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="65" cy="40" r="2" fill="#64748b" opacity="0.5">
    <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite"/>
  </circle>
  <circle cx="45" cy="65" r="4" fill="#64748b" opacity="0.6">
    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="60" cy="60" r="2" fill="#64748b" opacity="0.8">
    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2.5s" repeatCount="indefinite"/>
  </circle>
</svg>', 80, 'epic', 'fade', '{"primary": "#1a1a2e", "secondary": "#16213e", "accent": "#64748b"}', true),

('Stellar Nursery', '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="nursery-{id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#ff69b4;stop-opacity:0.8" />
      <stop offset="40%" style="stop-color:#da70d6;stop-opacity:0.6" />
      <stop offset="80%" style="stop-color:#9370db;stop-opacity:0.4" />
      <stop offset="100%" style="stop-color:#4b0082;stop-opacity:0.2" />
    </radialGradient>
  </defs>
  <ellipse cx="50" cy="50" rx="40" ry="25" fill="url(#nursery-{id})" opacity="0.7">
    <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="20s" repeatCount="indefinite"/>
  </ellipse>
  <circle cx="40" cy="45" r="3" fill="#ffffff" opacity="0.9">
    <animate attributeName="opacity" values="0.9;0.3;0.9" dur="3s" repeatCount="indefinite"/>
  </circle>
  <circle cx="60" cy="35" r="2" fill="#ffff00" opacity="0.8">
    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="55" cy="65" r="4" fill="#ffffff" opacity="0.7">
    <animate attributeName="opacity" values="0.7;0.2;0.7" dur="5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="30" cy="60" r="2" fill="#ffff00" opacity="0.9">
    <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite"/>
  </circle>
</svg>', 35, 'common', 'birth', '{"primary": "#ff69b4", "secondary": "#da70d6", "accent": "#ffffff"}', true),

('Cosmic Ray', '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ray-{id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="30%" style="stop-color:#00ff00;stop-opacity:0.8" />
      <stop offset="70%" style="stop-color:#0080ff;stop-opacity:0.6" />
      <stop offset="100%" style="stop-color:#8000ff;stop-opacity:0.3" />
    </linearGradient>
  </defs>
  <path d="M10,10 L90,90" stroke="url(#ray-{id})" stroke-width="3" fill="none">
    <animate attributeName="stroke-width" values="3;6;3" dur="2s" repeatCount="indefinite"/>
  </path>
  <path d="M20,10 L90,80" stroke="url(#ray-{id})" stroke-width="2" fill="none" opacity="0.7">
    <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.5s" repeatCount="indefinite"/>
  </path>
  <path d="M10,20 L80,90" stroke="url(#ray-{id})" stroke-width="2" fill="none" opacity="0.5">
    <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" repeatCount="indefinite"/>
  </path>
  <circle cx="85" cy="85" r="5" fill="#ffffff">
    <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite"/>
  </circle>
</svg>', 30, 'common', 'ray', '{"primary": "#ffffff", "secondary": "#00ff00", "accent": "#8000ff"}', true),

('Binary System', '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="binary1-{id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#ffff00;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#ff8800;stop-opacity:0.6" />
    </radialGradient>
    <radialGradient id="binary2-{id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#00ffff;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#0088ff;stop-opacity:0.6" />
    </radialGradient>
  </defs>
  <circle cx="35" cy="50" r="15" fill="url(#binary1-{id})">
    <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="65" cy="50" r="12" fill="url(#binary2-{id})">
    <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="8s" repeatCount="indefinite"/>
  </circle>
  <ellipse cx="50" cy="50" rx="20" ry="5" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.4">
    <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="4s" repeatCount="indefinite"/>
  </ellipse>
</svg>', 45, 'rare', 'orbit', '{"primary": "#ffff00", "secondary": "#00ffff", "accent": "#ffffff"}', true),

('Vacuum Decay', '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="vacuum-{id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
      <stop offset="30%" style="stop-color:#2d1b69;stop-opacity:0.8" />
      <stop offset="60%" style="stop-color:#8a2be2;stop-opacity:0.6" />
      <stop offset="90%" style="stop-color:#da70d6;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.1" />
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="40" fill="url(#vacuum-{id})">
    <animate attributeName="r" values="40;35;40" dur="4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="50" cy="50" r="30" fill="none" stroke="#8a2be2" stroke-width="2" opacity="0.6" stroke-dasharray="5,5">
    <animateTransform attributeName="transform" type="rotate" values="0 50 50;-360 50 50" dur="6s" repeatCount="indefinite"/>
  </circle>
  <circle cx="50" cy="50" r="20" fill="none" stroke="#da70d6" stroke-width="1" opacity="0.8" stroke-dasharray="3,3">
    <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" dur="4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="50" cy="50" r="8" fill="#000000"/>
</svg>', 300, 'legendary', 'decay', '{"primary": "#000000", "secondary": "#2d1b69", "accent": "#da70d6"}', true),

('Hypernova', '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="hypernova-{id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="20%" style="stop-color:#ffff00;stop-opacity:1" />
      <stop offset="40%" style="stop-color:#ff8800;stop-opacity:0.9" />
      <stop offset="70%" style="stop-color:#ff0000;stop-opacity:0.7" />
      <stop offset="100%" style="stop-color:#8000ff;stop-opacity:0.5" />
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="42" fill="url(#hypernova-{id})">
    <animate attributeName="r" values="42;50;42" dur="1s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.9;1;0.9" dur="1s" repeatCount="indefinite"/>
  </circle>
  <g transform="translate(50,50)">
    <path d="M-8,0 L8,0 M0,-8 L0,8 M-6,-6 L6,6 M-6,6 L6,-6" stroke="#ffffff" stroke-width="3" opacity="1">
      <animateTransform attributeName="transform" type="rotate" values="0;360" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="stroke-width" values="3;6;3" dur="1s" repeatCount="indefinite"/>
    </path>
  </g>
  <circle cx="50" cy="50" r="25" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.7">
    <animate attributeName="r" values="25;35;25" dur="2s" repeatCount="indefinite"/>
  </circle>
</svg>', 500, 'legendary', 'hypernova', '{"primary": "#ffffff", "secondary": "#ffff00", "accent": "#8000ff"}', true)

ON CONFLICT (name) DO UPDATE SET
  svg_definition = EXCLUDED.svg_definition,
  network_score_threshold = EXCLUDED.network_score_threshold,
  rarity_tier = EXCLUDED.rarity_tier,
  animation_type = EXCLUDED.animation_type,
  color_scheme = EXCLUDED.color_scheme,
  is_active = EXCLUDED.is_active,
  updated_at = now();