// Solar Systems Configuration - 40 unique animated systems (UXI8001 - UXI8040)
export interface Planet {
  distance: number;
  size: number;
  speed: number;
  color: string;
  delay: number;
}

export interface SolarSystemConfig {
  name: string;
  sunColor: string;
  sunSize: number;
  planets: Planet[];
  avatarStyle: {
    background: string;
    borderColor: string;
    boxShadow: string;
  };
}

export const SOLAR_SYSTEMS: Record<string, SolarSystemConfig> = {
  UXI8001: {
    name: "Aquamarine Single",
    sunColor: "hsl(180, 100%, 70%)",
    sunSize: 10,
    planets: [
      { distance: 18, size: 2.5, speed: 8, color: "hsl(180, 80%, 60%)", delay: 0 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(180, 100%, 70% / 0.3), hsl(180, 60%, 40% / 0.1))",
      borderColor: "hsl(180, 100%, 70%)",
      boxShadow: "0 0 12px hsl(180, 100%, 70% / 0.4)"
    }
  },
  UXI8002: {
    name: "Red Giant Void",
    sunColor: "hsl(0, 100%, 60%)",
    sunSize: 16,
    planets: [],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(0, 100%, 60% / 0.4), hsl(0, 60%, 30% / 0.1))",
      borderColor: "hsl(0, 100%, 60%)",
      boxShadow: "0 0 16px hsl(0, 100%, 60% / 0.5)"
    }
  },
  UXI8003: {
    name: "White Dwarf Twin",
    sunColor: "hsl(0, 0%, 90%)",
    sunSize: 8,
    planets: [
      { distance: 16, size: 2, speed: 6, color: "hsl(0, 0%, 80%)", delay: 0 },
      { distance: 22, size: 2, speed: 10, color: "hsl(0, 0%, 75%)", delay: 3 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(0, 0%, 90% / 0.3), hsl(0, 0%, 60% / 0.1))",
      borderColor: "hsl(0, 0%, 90%)",
      boxShadow: "0 0 10px hsl(0, 0%, 90% / 0.6)"
    }
  },
  UXI8004: {
    name: "Purple Nebula",
    sunColor: "hsl(280, 100%, 70%)",
    sunSize: 12,
    planets: [
      { distance: 19, size: 3, speed: 7, color: "hsl(280, 80%, 60%)", delay: 0 },
      { distance: 25, size: 2.5, speed: 11, color: "hsl(280, 70%, 50%)", delay: 2 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(280, 100%, 70% / 0.3), hsl(280, 60%, 40% / 0.1))",
      borderColor: "hsl(280, 100%, 70%)",
      boxShadow: "0 0 14px hsl(280, 100%, 70% / 0.5)"
    }
  },
  UXI8005: {
    name: "Golden Binary",
    sunColor: "hsl(45, 100%, 65%)",
    sunSize: 11,
    planets: [
      { distance: 17, size: 2.5, speed: 5, color: "hsl(45, 90%, 55%)", delay: 0 },
      { distance: 21, size: 2, speed: 8, color: "hsl(45, 80%, 50%)", delay: 1.5 },
      { distance: 26, size: 3, speed: 12, color: "hsl(45, 85%, 60%)", delay: 4 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(45, 100%, 65% / 0.3), hsl(45, 60%, 35% / 0.1))",
      borderColor: "hsl(45, 100%, 65%)",
      boxShadow: "0 0 12px hsl(45, 100%, 65% / 0.4)"
    }
  },
  UXI8006: {
    name: "Emerald Ring",
    sunColor: "hsl(120, 100%, 60%)",
    sunSize: 9,
    planets: [
      { distance: 20, size: 1.5, speed: 6, color: "hsl(120, 80%, 50%)", delay: 0 },
      { distance: 20, size: 1.5, speed: 6, color: "hsl(120, 80%, 50%)", delay: 2 },
      { distance: 20, size: 1.5, speed: 6, color: "hsl(120, 80%, 50%)", delay: 4 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(120, 100%, 60% / 0.3), hsl(120, 60%, 30% / 0.1))",
      borderColor: "hsl(120, 100%, 60%)",
      boxShadow: "0 0 12px hsl(120, 100%, 60% / 0.4)"
    }
  },
  UXI8007: {
    name: "Sapphire Cluster",
    sunColor: "hsl(240, 100%, 65%)",
    sunSize: 13,
    planets: [
      { distance: 18, size: 2.5, speed: 9, color: "hsl(240, 80%, 55%)", delay: 0 },
      { distance: 23, size: 2, speed: 12, color: "hsl(240, 70%, 45%)", delay: 2.5 },
      { distance: 27, size: 3, speed: 15, color: "hsl(240, 85%, 60%)", delay: 5 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(240, 100%, 65% / 0.3), hsl(240, 60%, 35% / 0.1))",
      borderColor: "hsl(240, 100%, 65%)",
      boxShadow: "0 0 14px hsl(240, 100%, 65% / 0.5)"
    }
  },
  UXI8008: {
    name: "Crimson Echo",
    sunColor: "hsl(340, 100%, 60%)",
    sunSize: 10,
    planets: [
      { distance: 16, size: 2, speed: 4, color: "hsl(340, 80%, 50%)", delay: 0 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(340, 100%, 60% / 0.3), hsl(340, 60%, 30% / 0.1))",
      borderColor: "hsl(340, 100%, 60%)",
      boxShadow: "0 0 12px hsl(340, 100%, 60% / 0.4)"
    }
  },
  UXI8009: {
    name: "Amber Storm",
    sunColor: "hsl(35, 100%, 55%)",
    sunSize: 14,
    planets: [
      { distance: 19, size: 3.5, speed: 7, color: "hsl(35, 90%, 45%)", delay: 0 },
      { distance: 24, size: 2.5, speed: 10, color: "hsl(35, 80%, 40%)", delay: 3 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(35, 100%, 55% / 0.4), hsl(35, 60%, 25% / 0.1))",
      borderColor: "hsl(35, 100%, 55%)",
      boxShadow: "0 0 15px hsl(35, 100%, 55% / 0.5)"
    }
  },
  UXI8010: {
    name: "Cyan Whisper",
    sunColor: "hsl(190, 100%, 70%)",
    sunSize: 7,
    planets: [
      { distance: 15, size: 1.5, speed: 5, color: "hsl(190, 80%, 60%)", delay: 0 },
      { distance: 20, size: 2, speed: 8, color: "hsl(190, 70%, 50%)", delay: 1 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(190, 100%, 70% / 0.3), hsl(190, 60%, 40% / 0.1))",
      borderColor: "hsl(190, 100%, 70%)",
      boxShadow: "0 0 10px hsl(190, 100%, 70% / 0.4)"
    }
  },
  UXI8011: {
    name: "Violet Cascade",
    sunColor: "hsl(270, 100%, 65%)",
    sunSize: 12,
    planets: [
      { distance: 17, size: 2.5, speed: 6, color: "hsl(270, 80%, 55%)", delay: 0 },
      { distance: 22, size: 2, speed: 9, color: "hsl(270, 70%, 45%)", delay: 2 },
      { distance: 26, size: 3, speed: 13, color: "hsl(270, 85%, 60%)", delay: 4.5 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(270, 100%, 65% / 0.3), hsl(270, 60%, 35% / 0.1))",
      borderColor: "hsl(270, 100%, 65%)",
      boxShadow: "0 0 13px hsl(270, 100%, 65% / 0.5)"
    }
  },
  UXI8012: {
    name: "Lime Spark",
    sunColor: "hsl(75, 100%, 60%)",
    sunSize: 8,
    planets: [
      { distance: 16, size: 2, speed: 4, color: "hsl(75, 80%, 50%)", delay: 0 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(75, 100%, 60% / 0.3), hsl(75, 60%, 30% / 0.1))",
      borderColor: "hsl(75, 100%, 60%)",
      boxShadow: "0 0 10px hsl(75, 100%, 60% / 0.4)"
    }
  },
  UXI8013: {
    name: "Rose Quartz",
    sunColor: "hsl(320, 100%, 75%)",
    sunSize: 11,
    planets: [
      { distance: 18, size: 2.5, speed: 7, color: "hsl(320, 80%, 65%)", delay: 0 },
      { distance: 23, size: 2, speed: 11, color: "hsl(320, 70%, 55%)", delay: 3 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(320, 100%, 75% / 0.3), hsl(320, 60%, 45% / 0.1))",
      borderColor: "hsl(320, 100%, 75%)",
      boxShadow: "0 0 12px hsl(320, 100%, 75% / 0.4)"
    }
  },
  UXI8014: {
    name: "Teal Horizon",
    sunColor: "hsl(170, 100%, 55%)",
    sunSize: 10,
    planets: [
      { distance: 19, size: 3, speed: 8, color: "hsl(170, 80%, 45%)", delay: 0 },
      { distance: 24, size: 2.5, speed: 12, color: "hsl(170, 70%, 40%)", delay: 4 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(170, 100%, 55% / 0.3), hsl(170, 60%, 25% / 0.1))",
      borderColor: "hsl(170, 100%, 55%)",
      boxShadow: "0 0 12px hsl(170, 100%, 55% / 0.4)"
    }
  },
  UXI8015: {
    name: "Indigo Vortex",
    sunColor: "hsl(230, 100%, 60%)",
    sunSize: 15,
    planets: [
      { distance: 20, size: 4, speed: 6, color: "hsl(230, 80%, 50%)", delay: 0 },
      { distance: 26, size: 3, speed: 10, color: "hsl(230, 70%, 40%)", delay: 2.5 },
      { distance: 30, size: 2.5, speed: 14, color: "hsl(230, 85%, 55%)", delay: 5 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(230, 100%, 60% / 0.4), hsl(230, 60%, 30% / 0.1))",
      borderColor: "hsl(230, 100%, 60%)",
      boxShadow: "0 0 16px hsl(230, 100%, 60% / 0.5)"
    }
  },
  UXI8016: {
    name: "Coral Reef",
    sunColor: "hsl(15, 100%, 65%)",
    sunSize: 9,
    planets: [
      { distance: 17, size: 2, speed: 5, color: "hsl(15, 80%, 55%)", delay: 0 },
      { distance: 21, size: 2.5, speed: 8, color: "hsl(15, 70%, 45%)", delay: 1.5 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(15, 100%, 65% / 0.3), hsl(15, 60%, 35% / 0.1))",
      borderColor: "hsl(15, 100%, 65%)",
      boxShadow: "0 0 11px hsl(15, 100%, 65% / 0.4)"
    }
  },
  UXI8017: {
    name: "Mint Breeze",
    sunColor: "hsl(150, 100%, 70%)",
    sunSize: 8,
    planets: [
      { distance: 16, size: 2, speed: 6, color: "hsl(150, 80%, 60%)", delay: 0 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(150, 100%, 70% / 0.3), hsl(150, 60%, 40% / 0.1))",
      borderColor: "hsl(150, 100%, 70%)",
      boxShadow: "0 0 10px hsl(150, 100%, 70% / 0.4)"
    }
  },
  UXI8018: {
    name: "Magenta Pulse",
    sunColor: "hsl(300, 100%, 60%)",
    sunSize: 13,
    planets: [
      { distance: 18, size: 3, speed: 7, color: "hsl(300, 80%, 50%)", delay: 0 },
      { distance: 24, size: 2, speed: 11, color: "hsl(300, 70%, 40%)", delay: 3.5 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(300, 100%, 60% / 0.3), hsl(300, 60%, 30% / 0.1))",
      borderColor: "hsl(300, 100%, 60%)",
      boxShadow: "0 0 14px hsl(300, 100%, 60% / 0.5)"
    }
  },
  UXI8019: {
    name: "Bronze Glow",
    sunColor: "hsl(30, 100%, 50%)",
    sunSize: 11,
    planets: [
      { distance: 19, size: 2.5, speed: 8, color: "hsl(30, 80%, 40%)", delay: 0 },
      { distance: 25, size: 3, speed: 12, color: "hsl(30, 70%, 35%)", delay: 4 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(30, 100%, 50% / 0.3), hsl(30, 60%, 20% / 0.1))",
      borderColor: "hsl(30, 100%, 50%)",
      boxShadow: "0 0 12px hsl(30, 100%, 50% / 0.4)"
    }
  },
  UXI8020: {
    name: "Steel Blue",
    sunColor: "hsl(210, 100%, 55%)",
    sunSize: 10,
    planets: [
      { distance: 17, size: 2, speed: 5, color: "hsl(210, 80%, 45%)", delay: 0 },
      { distance: 22, size: 2.5, speed: 9, color: "hsl(210, 70%, 35%)", delay: 2 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(210, 100%, 55% / 0.3), hsl(210, 60%, 25% / 0.1))",
      borderColor: "hsl(210, 100%, 55%)",
      boxShadow: "0 0 12px hsl(210, 100%, 55% / 0.4)"
    }
  },
  UXI8021: {
    name: "Plum Shadow",
    sunColor: "hsl(285, 100%, 55%)",
    sunSize: 12,
    planets: [
      { distance: 18, size: 2.5, speed: 6, color: "hsl(285, 80%, 45%)", delay: 0 },
      { distance: 23, size: 2, speed: 10, color: "hsl(285, 70%, 35%)", delay: 3 },
      { distance: 27, size: 3, speed: 14, color: "hsl(285, 85%, 55%)", delay: 6 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(285, 100%, 55% / 0.3), hsl(285, 60%, 25% / 0.1))",
      borderColor: "hsl(285, 100%, 55%)",
      boxShadow: "0 0 13px hsl(285, 100%, 55% / 0.5)"
    }
  },
  UXI8022: {
    name: "Chartreuse Flash",
    sunColor: "hsl(90, 100%, 60%)",
    sunSize: 9,
    planets: [
      { distance: 16, size: 2, speed: 4, color: "hsl(90, 80%, 50%)", delay: 0 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(90, 100%, 60% / 0.3), hsl(90, 60%, 30% / 0.1))",
      borderColor: "hsl(90, 100%, 60%)",
      boxShadow: "0 0 11px hsl(90, 100%, 60% / 0.4)"
    }
  },
  UXI8023: {
    name: "Burgundy Deep",
    sunColor: "hsl(345, 100%, 40%)",
    sunSize: 14,
    planets: [
      { distance: 20, size: 3.5, speed: 9, color: "hsl(345, 80%, 30%)", delay: 0 },
      { distance: 26, size: 2.5, speed: 13, color: "hsl(345, 70%, 25%)", delay: 4.5 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(345, 100%, 40% / 0.4), hsl(345, 60%, 10% / 0.1))",
      borderColor: "hsl(345, 100%, 40%)",
      boxShadow: "0 0 15px hsl(345, 100%, 40% / 0.5)"
    }
  },
  UXI8024: {
    name: "Turquoise Tide",
    sunColor: "hsl(165, 100%, 65%)",
    sunSize: 10,
    planets: [
      { distance: 18, size: 2.5, speed: 7, color: "hsl(165, 80%, 55%)", delay: 0 },
      { distance: 23, size: 2, speed: 11, color: "hsl(165, 70%, 45%)", delay: 3.5 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(165, 100%, 65% / 0.3), hsl(165, 60%, 35% / 0.1))",
      borderColor: "hsl(165, 100%, 65%)",
      boxShadow: "0 0 12px hsl(165, 100%, 65% / 0.4)"
    }
  },
  UXI8025: {
    name: "Lavender Mist",
    sunColor: "hsl(260, 100%, 75%)",
    sunSize: 8,
    planets: [
      { distance: 16, size: 2, speed: 5, color: "hsl(260, 80%, 65%)", delay: 0 },
      { distance: 20, size: 1.5, speed: 8, color: "hsl(260, 70%, 55%)", delay: 2 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(260, 100%, 75% / 0.3), hsl(260, 60%, 45% / 0.1))",
      borderColor: "hsl(260, 100%, 75%)",
      boxShadow: "0 0 10px hsl(260, 100%, 75% / 0.4)"
    }
  },
  UXI8026: {
    name: "Peach Sunset",
    sunColor: "hsl(25, 100%, 70%)",
    sunSize: 13,
    planets: [
      { distance: 19, size: 3, speed: 6, color: "hsl(25, 80%, 60%)", delay: 0 },
      { distance: 24, size: 2.5, speed: 10, color: "hsl(25, 70%, 50%)", delay: 3 },
      { distance: 28, size: 2, speed: 14, color: "hsl(25, 85%, 65%)", delay: 6 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(25, 100%, 70% / 0.3), hsl(25, 60%, 40% / 0.1))",
      borderColor: "hsl(25, 100%, 70%)",
      boxShadow: "0 0 14px hsl(25, 100%, 70% / 0.5)"
    }
  },
  UXI8027: {
    name: "Forest Canopy",
    sunColor: "hsl(110, 100%, 45%)",
    sunSize: 11,
    planets: [
      { distance: 17, size: 2.5, speed: 7, color: "hsl(110, 80%, 35%)", delay: 0 },
      { distance: 22, size: 2, speed: 11, color: "hsl(110, 70%, 30%)", delay: 3.5 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(110, 100%, 45% / 0.3), hsl(110, 60%, 15% / 0.1))",
      borderColor: "hsl(110, 100%, 45%)",
      boxShadow: "0 0 12px hsl(110, 100%, 45% / 0.4)"
    }
  },
  UXI8028: {
    name: "Fuchsia Bloom",
    sunColor: "hsl(315, 100%, 65%)",
    sunSize: 12,
    planets: [
      { distance: 18, size: 2.5, speed: 8, color: "hsl(315, 80%, 55%)", delay: 0 },
      { distance: 24, size: 3, speed: 12, color: "hsl(315, 70%, 45%)", delay: 4 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(315, 100%, 65% / 0.3), hsl(315, 60%, 35% / 0.1))",
      borderColor: "hsl(315, 100%, 65%)",
      boxShadow: "0 0 13px hsl(315, 100%, 65% / 0.5)"
    }
  },
  UXI8029: {
    name: "Olive Grove",
    sunColor: "hsl(60, 100%, 40%)",
    sunSize: 9,
    planets: [
      { distance: 16, size: 2, speed: 5, color: "hsl(60, 80%, 30%)", delay: 0 },
      { distance: 20, size: 2.5, speed: 9, color: "hsl(60, 70%, 25%)", delay: 2.5 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(60, 100%, 40% / 0.3), hsl(60, 60%, 10% / 0.1))",
      borderColor: "hsl(60, 100%, 40%)",
      boxShadow: "0 0 11px hsl(60, 100%, 40% / 0.4)"
    }
  },
  UXI8030: {
    name: "Slate Storm",
    sunColor: "hsl(200, 20%, 50%)",
    sunSize: 15,
    planets: [
      { distance: 21, size: 4, speed: 8, color: "hsl(200, 15%, 40%)", delay: 0 },
      { distance: 27, size: 3, speed: 12, color: "hsl(200, 10%, 30%)", delay: 4 },
      { distance: 31, size: 2.5, speed: 16, color: "hsl(200, 25%, 55%)", delay: 8 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(200, 20%, 50% / 0.4), hsl(200, 10%, 20% / 0.1))",
      borderColor: "hsl(200, 20%, 50%)",
      boxShadow: "0 0 16px hsl(200, 20%, 50% / 0.5)"
    }
  },
  UXI8031: {
    name: "Maroon Depth",
    sunColor: "hsl(350, 100%, 35%)",
    sunSize: 10,
    planets: [
      { distance: 17, size: 2.5, speed: 6, color: "hsl(350, 80%, 25%)", delay: 0 },
      { distance: 22, size: 2, speed: 10, color: "hsl(350, 70%, 20%)", delay: 3 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(350, 100%, 35% / 0.3), hsl(350, 60%, 5% / 0.1))",
      borderColor: "hsl(350, 100%, 35%)",
      boxShadow: "0 0 12px hsl(350, 100%, 35% / 0.4)"
    }
  },
  UXI8032: {
    name: "Sky Blue",
    sunColor: "hsl(195, 100%, 75%)",
    sunSize: 8,
    planets: [
      { distance: 15, size: 1.5, speed: 4, color: "hsl(195, 80%, 65%)", delay: 0 },
      { distance: 19, size: 2, speed: 7, color: "hsl(195, 70%, 55%)", delay: 1.5 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(195, 100%, 75% / 0.3), hsl(195, 60%, 45% / 0.1))",
      borderColor: "hsl(195, 100%, 75%)",
      boxShadow: "0 0 10px hsl(195, 100%, 75% / 0.4)"
    }
  },
  UXI8033: {
    name: "Orchid Garden",
    sunColor: "hsl(290, 100%, 70%)",
    sunSize: 11,
    planets: [
      { distance: 18, size: 2.5, speed: 7, color: "hsl(290, 80%, 60%)", delay: 0 },
      { distance: 23, size: 2, speed: 11, color: "hsl(290, 70%, 50%)", delay: 3.5 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(290, 100%, 70% / 0.3), hsl(290, 60%, 40% / 0.1))",
      borderColor: "hsl(290, 100%, 70%)",
      boxShadow: "0 0 12px hsl(290, 100%, 70% / 0.4)"
    }
  },
  UXI8034: {
    name: "Citrus Burst",
    sunColor: "hsl(50, 100%, 60%)",
    sunSize: 12,
    planets: [
      { distance: 19, size: 3, speed: 6, color: "hsl(50, 80%, 50%)", delay: 0 },
      { distance: 24, size: 2.5, speed: 10, color: "hsl(50, 70%, 40%)", delay: 3 },
      { distance: 28, size: 2, speed: 14, color: "hsl(50, 85%, 55%)", delay: 6 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(50, 100%, 60% / 0.3), hsl(50, 60%, 30% / 0.1))",
      borderColor: "hsl(50, 100%, 60%)",
      boxShadow: "0 0 13px hsl(50, 100%, 60% / 0.5)"
    }
  },
  UXI8035: {
    name: "Navy Depths",
    sunColor: "hsl(220, 100%, 30%)",
    sunSize: 13,
    planets: [
      { distance: 20, size: 3.5, speed: 9, color: "hsl(220, 80%, 20%)", delay: 0 },
      { distance: 25, size: 2.5, speed: 13, color: "hsl(220, 70%, 15%)", delay: 4.5 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(220, 100%, 30% / 0.4), hsl(220, 60%, 0% / 0.1))",
      borderColor: "hsl(220, 100%, 30%)",
      boxShadow: "0 0 14px hsl(220, 100%, 30% / 0.5)"
    }
  },
  UXI8036: {
    name: "Pink Blossom",
    sunColor: "hsl(330, 100%, 80%)",
    sunSize: 9,
    planets: [
      { distance: 16, size: 2, speed: 5, color: "hsl(330, 80%, 70%)", delay: 0 },
      { distance: 21, size: 2.5, speed: 8, color: "hsl(330, 70%, 60%)", delay: 2 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(330, 100%, 80% / 0.3), hsl(330, 60%, 50% / 0.1))",
      borderColor: "hsl(330, 100%, 80%)",
      boxShadow: "0 0 11px hsl(330, 100%, 80% / 0.4)"
    }
  },
  UXI8037: {
    name: "Jade Emperor",
    sunColor: "hsl(140, 100%, 55%)",
    sunSize: 14,
    planets: [
      { distance: 20, size: 3.5, speed: 7, color: "hsl(140, 80%, 45%)", delay: 0 },
      { distance: 26, size: 3, speed: 11, color: "hsl(140, 70%, 35%)", delay: 3.5 },
      { distance: 30, size: 2.5, speed: 15, color: "hsl(140, 85%, 50%)", delay: 7 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(140, 100%, 55% / 0.4), hsl(140, 60%, 25% / 0.1))",
      borderColor: "hsl(140, 100%, 55%)",
      boxShadow: "0 0 15px hsl(140, 100%, 55% / 0.5)"
    }
  },
  UXI8038: {
    name: "Electric Purple",
    sunColor: "hsl(275, 100%, 60%)",
    sunSize: 10,
    planets: [
      { distance: 17, size: 2.5, speed: 6, color: "hsl(275, 80%, 50%)", delay: 0 },
      { distance: 22, size: 2, speed: 10, color: "hsl(275, 70%, 40%)", delay: 3 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(275, 100%, 60% / 0.3), hsl(275, 60%, 30% / 0.1))",
      borderColor: "hsl(275, 100%, 60%)",
      boxShadow: "0 0 12px hsl(275, 100%, 60% / 0.4)"
    }
  },
  UXI8039: {
    name: "Honey Gold",
    sunColor: "hsl(40, 100%, 65%)",
    sunSize: 11,
    planets: [
      { distance: 18, size: 2.5, speed: 8, color: "hsl(40, 80%, 55%)", delay: 0 },
      { distance: 23, size: 2, speed: 12, color: "hsl(40, 70%, 45%)", delay: 4 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(40, 100%, 65% / 0.3), hsl(40, 60%, 35% / 0.1))",
      borderColor: "hsl(40, 100%, 65%)",
      boxShadow: "0 0 12px hsl(40, 100%, 65% / 0.4)"
    }
  },
  UXI8040: {
    name: "Scarlet Storm",
    sunColor: "hsl(5, 100%, 55%)",
    sunSize: 16,
    planets: [
      { distance: 21, size: 4, speed: 9, color: "hsl(5, 80%, 45%)", delay: 0 },
      { distance: 27, size: 3, speed: 13, color: "hsl(5, 70%, 35%)", delay: 4.5 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle, hsl(5, 100%, 55% / 0.4), hsl(5, 60%, 25% / 0.1))",
      borderColor: "hsl(5, 100%, 55%)",
      boxShadow: "0 0 16px hsl(5, 100%, 55% / 0.5)"
    }
  }
};