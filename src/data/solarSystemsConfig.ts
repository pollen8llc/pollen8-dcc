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
  // Special teal base system for new users/members (no sun, no planets)
  UXI8000: {
    name: "Teal Base",
    sunColor: "hsl(180, 100%, 60%)",
    sunSize: 0, // No visible sun
    planets: [], // No planets
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.15) 0%, transparent 50%), rgba(26, 40, 40, 0.7)",
      borderColor: "hsl(180, 100%, 60%)",
      boxShadow: "0 0 8px hsl(180, 100%, 60% / 0.4), inset 0 0 8px hsl(180, 100%, 60% / 0.15)"
    }
  },
  
  // Admin simple system - similar to UXI8008 structure but with white sun
  UXI9000: {
    name: "Admin Avatar",
    sunSize: 12,
    sunColor: "hsl(0, 0%, 95%)",
    planets: [
      { distance: 16, size: 2.5, speed: 8, color: "hsl(280, 100%, 70%)", delay: 0 },
      { distance: 22, size: 2, speed: 12, color: "hsl(280, 100%, 75%)", delay: 2 },
      { distance: 28, size: 1.5, speed: 6, color: "hsl(260, 100%, 70%)", delay: 1 },
    ],
    avatarStyle: {
      background: "linear-gradient(135deg, hsl(280, 30%, 15%), hsl(260, 35%, 20%))",
      borderColor: "hsl(280, 100%, 60%)",
      boxShadow: "0 0 15px hsl(280, 100%, 60% / 0.4)"
    }
  },
  UXI8001: {
    name: "Aquamarine Single",
    sunColor: "hsl(180, 100%, 75%)",
    sunSize: 12,
    planets: [
      { distance: 20, size: 3, speed: 6, color: "hsl(180, 100%, 65%)", delay: 0 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(180, 100%, 75%)",
      boxShadow: "0 0 14px hsl(180, 100%, 75% / 0.5), inset 0 0 14px hsl(180, 100%, 75% / 0.2)"
    }
  },
  UXI8002: {
    name: "Red Giant Void",
    sunColor: "hsl(0, 100%, 65%)",
    sunSize: 16,
    planets: [],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(255, 0, 0, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(0, 100%, 65%)",
      boxShadow: "0 0 18px hsl(0, 100%, 65% / 0.6), inset 0 0 18px hsl(0, 100%, 65% / 0.25)"
    }
  },
  UXI8003: {
    name: "White Dwarf Twin",
    sunColor: "hsl(0, 0%, 95%)",
    sunSize: 8,
    planets: [
      { distance: 16, size: 2, speed: 4, color: "hsl(0, 0%, 85%)", delay: 0 },
      { distance: 22, size: 2, speed: 7, color: "hsl(0, 0%, 80%)", delay: 2 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(0, 0%, 95%)",
      boxShadow: "0 0 14px hsl(0, 0%, 95% / 0.5), inset 0 0 14px hsl(0, 0%, 95% / 0.2)"
    }
  },
  UXI8004: {
    name: "Purple Nebula",
    sunColor: "hsl(280, 100%, 75%)",
    sunSize: 11,
    planets: [
      { distance: 19, size: 2.5, speed: 5, color: "hsl(280, 100%, 65%)", delay: 0 },
      { distance: 26, size: 3, speed: 9, color: "hsl(280, 100%, 60%)", delay: 3 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(220, 20, 255, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(280, 100%, 75%)",
      boxShadow: "0 0 16px hsl(280, 100%, 75% / 0.5), inset 0 0 16px hsl(280, 100%, 75% / 0.2)"
    }
  },
  UXI8005: {
    name: "Golden Binary",
    sunColor: "hsl(45, 100%, 70%)",
    sunSize: 13,
    planets: [
      { distance: 17, size: 2, speed: 3, color: "hsl(45, 100%, 60%)", delay: 0 },
      { distance: 23, size: 2.5, speed: 6, color: "hsl(45, 100%, 55%)", delay: 1 },
      { distance: 29, size: 3, speed: 10, color: "hsl(45, 100%, 50%)", delay: 4 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(45, 100%, 70%)",
      boxShadow: "0 0 17px hsl(45, 100%, 70% / 0.5), inset 0 0 17px hsl(45, 100%, 70% / 0.2)"
    }
  },
  UXI8006: {
    name: "Emerald Cluster",
    sunColor: "hsl(140, 100%, 65%)",
    sunSize: 10,
    planets: [
      { distance: 15, size: 1.5, speed: 3, color: "hsl(140, 100%, 55%)", delay: 0 },
      { distance: 20, size: 2, speed: 5, color: "hsl(140, 100%, 50%)", delay: 1 },
      { distance: 25, size: 2.5, speed: 8, color: "hsl(140, 100%, 45%)", delay: 2 },
      { distance: 31, size: 3, speed: 12, color: "hsl(140, 100%, 40%)", delay: 4 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(0, 255, 100, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(140, 100%, 65%)",
      boxShadow: "0 0 14px hsl(140, 100%, 65% / 0.5), inset 0 0 14px hsl(140, 100%, 65% / 0.2)"
    }
  },
  UXI8007: {
    name: "Crimson Wanderer",
    sunColor: "hsl(350, 100%, 70%)",
    sunSize: 9,
    planets: [
      { distance: 24, size: 4, speed: 15, color: "hsl(350, 100%, 60%)", delay: 0 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(255, 20, 60, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(350, 100%, 70%)",
      boxShadow: "0 0 15px hsl(350, 100%, 70% / 0.5), inset 0 0 15px hsl(350, 100%, 70% / 0.2)"
    }
  },
  UXI8008: {
    name: "Violet Storm",
    sunColor: "hsl(260, 100%, 78%)",
    sunSize: 14,
    planets: [
      { distance: 18, size: 2, speed: 4, color: "hsl(260, 100%, 70%)", delay: 0 },
      { distance: 27, size: 3.5, speed: 11, color: "hsl(260, 100%, 60%)", delay: 3 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(130, 40, 255, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(260, 100%, 78%)",
      boxShadow: "0 0 18px hsl(260, 100%, 78% / 0.5), inset 0 0 18px hsl(260, 100%, 78% / 0.2)"
    }
  },
  UXI8009: {
    name: "Azure Void",
    sunColor: "hsl(200, 100%, 75%)",
    sunSize: 15,
    planets: [],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(0, 150, 255, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(200, 100%, 75%)",
      boxShadow: "0 0 19px hsl(200, 100%, 75% / 0.6), inset 0 0 19px hsl(200, 100%, 75% / 0.25)"
    }
  },
  UXI8010: {
    name: "Amber Trinity",
    sunColor: "hsl(35, 100%, 65%)",
    sunSize: 12,
    planets: [
      { distance: 16, size: 2, speed: 4, color: "hsl(35, 100%, 60%)", delay: 0 },
      { distance: 22, size: 2.5, speed: 7, color: "hsl(35, 100%, 55%)", delay: 2 },
      { distance: 28, size: 3, speed: 11, color: "hsl(35, 100%, 50%)", delay: 5 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(255, 165, 0, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(35, 100%, 65%)",
      boxShadow: "0 0 16px hsl(35, 100%, 65% / 0.5), inset 0 0 16px hsl(35, 100%, 65% / 0.2)"
    }
  },
  UXI8011: {
    name: "Sapphire Ring",
    sunColor: "hsl(220, 100%, 70%)",
    sunSize: 10,
    planets: [
      { distance: 19, size: 1.5, speed: 3, color: "hsl(220, 100%, 60%)", delay: 0 },
      { distance: 19, size: 1.5, speed: 3, color: "hsl(220, 100%, 55%)", delay: 1.5 },
      { distance: 19, size: 1.5, speed: 3, color: "hsl(220, 100%, 50%)", delay: 3 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(0, 100, 255, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(220, 100%, 70%)",
      boxShadow: "0 0 15px hsl(220, 100%, 70% / 0.5), inset 0 0 15px hsl(220, 100%, 70% / 0.2)"
    }
  },
  UXI8012: {
    name: "Magenta Pulse",
    sunColor: "hsl(300, 100%, 75%)",
    sunSize: 8,
    planets: [
      { distance: 21, size: 3.5, speed: 8, color: "hsl(300, 100%, 65%)", delay: 0 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(255, 0, 255, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(300, 100%, 75%)",
      boxShadow: "0 0 14px hsl(300, 100%, 75% / 0.5), inset 0 0 14px hsl(300, 100%, 75% / 0.2)"
    }
  },
  UXI8013: {
    name: "Lime Spiral",
    sunColor: "hsl(80, 100%, 65%)",
    sunSize: 11,
    planets: [
      { distance: 17, size: 2, speed: 4, color: "hsl(80, 100%, 55%)", delay: 0 },
      { distance: 23, size: 2.5, speed: 6, color: "hsl(80, 100%, 50%)", delay: 1 },
      { distance: 29, size: 3, speed: 9, color: "hsl(80, 100%, 45%)", delay: 3 },
      { distance: 35, size: 3.5, speed: 13, color: "hsl(80, 100%, 40%)", delay: 6 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(150, 255, 0, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(80, 100%, 65%)",
      boxShadow: "0 0 16px hsl(80, 100%, 65% / 0.5), inset 0 0 16px hsl(80, 100%, 65% / 0.2)"
    }
  },
  UXI8014: {
    name: "Coral Drift",
    sunColor: "hsl(15, 100%, 70%)",
    sunSize: 13,
    planets: [
      { distance: 20, size: 2.5, speed: 7, color: "hsl(15, 100%, 60%)", delay: 0 },
      { distance: 28, size: 3.5, speed: 12, color: "hsl(15, 100%, 55%)", delay: 4 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(255, 100, 50, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(15, 100%, 70%)",
      boxShadow: "0 0 17px hsl(15, 100%, 70% / 0.5), inset 0 0 17px hsl(15, 100%, 70% / 0.2)"
    }
  },
  UXI8015: {
    name: "Teal Comet",
    sunColor: "hsl(160, 100%, 65%)",
    sunSize: 9,
    planets: [
      { distance: 26, size: 4, speed: 16, color: "hsl(160, 100%, 55%)", delay: 0 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(0, 255, 180, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(160, 100%, 65%)",
      boxShadow: "0 0 14px hsl(160, 100%, 65% / 0.5), inset 0 0 14px hsl(160, 100%, 65% / 0.2)"
    }
  },
  UXI8016: {
    name: "Silver Cascade",
    sunColor: "hsl(0, 0%, 88%)",
    sunSize: 12,
    planets: [
      { distance: 15, size: 1.5, speed: 3, color: "hsl(0, 0%, 78%)", delay: 0 },
      { distance: 19, size: 2, speed: 5, color: "hsl(0, 0%, 73%)", delay: 1 },
      { distance: 24, size: 2.5, speed: 8, color: "hsl(0, 0%, 68%)", delay: 2 },
      { distance: 30, size: 3, speed: 12, color: "hsl(0, 0%, 63%)", delay: 4 },
      { distance: 37, size: 3.5, speed: 18, color: "hsl(0, 0%, 58%)", delay: 7 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(200, 200, 200, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(0, 0%, 88%)",
      boxShadow: "0 0 16px hsl(0, 0%, 88% / 0.5), inset 0 0 16px hsl(0, 0%, 88% / 0.2)"
    }
  },
  UXI8017: {
    name: "Rose Binary",
    sunColor: "hsl(330, 100%, 75%)",
    sunSize: 10,
    planets: [
      { distance: 18, size: 2.5, speed: 5, color: "hsl(330, 100%, 65%)", delay: 0 },
      { distance: 25, size: 3, speed: 9, color: "hsl(330, 100%, 60%)", delay: 3 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(255, 50, 150, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(330, 100%, 75%)",
      boxShadow: "0 0 15px hsl(330, 100%, 75% / 0.5), inset 0 0 15px hsl(330, 100%, 75% / 0.2)"
    }
  },
  UXI8018: {
    name: "Indigo Void",
    sunColor: "hsl(240, 100%, 75%)",
    sunSize: 17,
    planets: [],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(75, 0, 255, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(240, 100%, 75%)",
      boxShadow: "0 0 20px hsl(240, 100%, 75% / 0.6), inset 0 0 20px hsl(240, 100%, 75% / 0.25)"
    }
  },
  UXI8019: {
    name: "Peach Orbit",
    sunColor: "hsl(25, 100%, 75%)",
    sunSize: 11,
    planets: [
      { distance: 22, size: 3, speed: 8, color: "hsl(25, 100%, 65%)", delay: 0 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(255, 150, 100, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(25, 100%, 75%)",
      boxShadow: "0 0 16px hsl(25, 100%, 75% / 0.5), inset 0 0 16px hsl(25, 100%, 75% / 0.2)"
    }
  },
  UXI8020: {
    name: "Mint Cluster",
    sunColor: "hsl(150, 100%, 70%)",
    sunSize: 9,
    planets: [
      { distance: 16, size: 2, speed: 4, color: "hsl(150, 100%, 60%)", delay: 0 },
      { distance: 21, size: 2.5, speed: 6, color: "hsl(150, 100%, 55%)", delay: 1 },
      { distance: 27, size: 3, speed: 9, color: "hsl(150, 100%, 50%)", delay: 3 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(0, 255, 150, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(150, 100%, 70%)",
      boxShadow: "0 0 14px hsl(150, 100%, 70% / 0.5), inset 0 0 14px hsl(150, 100%, 70% / 0.2)"
    }
  },
  UXI8021: {
    name: "Lavender Drift",
    sunColor: "hsl(270, 100%, 78%)",
    sunSize: 12,
    planets: [
      { distance: 19, size: 2.5, speed: 6, color: "hsl(270, 100%, 70%)", delay: 0 },
      { distance: 26, size: 3.5, speed: 10, color: "hsl(270, 100%, 65%)", delay: 3 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(180, 100, 255, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(270, 100%, 78%)",
      boxShadow: "0 0 16px hsl(270, 100%, 78% / 0.5), inset 0 0 16px hsl(270, 100%, 78% / 0.2)"
    }
  },
  UXI8022: {
    name: "Bronze Ring",
    sunColor: "hsl(30, 100%, 60%)",
    sunSize: 10,
    planets: [
      { distance: 20, size: 1.8, speed: 4, color: "hsl(30, 100%, 50%)", delay: 0 },
      { distance: 20, size: 1.8, speed: 4, color: "hsl(30, 100%, 45%)", delay: 2 },
      { distance: 20, size: 1.8, speed: 4, color: "hsl(30, 100%, 40%)", delay: 4 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(205, 127, 50, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(30, 100%, 60%)",
      boxShadow: "0 0 14px hsl(30, 100%, 60% / 0.5), inset 0 0 14px hsl(30, 100%, 60% / 0.2)"
    }
  },
  UXI8023: {
    name: "Turquoise Wanderer",
    sunColor: "hsl(170, 100%, 65%)",
    sunSize: 8,
    planets: [
      { distance: 25, size: 4.5, speed: 18, color: "hsl(170, 100%, 55%)", delay: 0 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(64, 224, 208, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(170, 100%, 65%)",
      boxShadow: "0 0 13px hsl(170, 100%, 65% / 0.5), inset 0 0 13px hsl(170, 100%, 65% / 0.2)"
    }
  },
  UXI8024: {
    name: "Chartreuse Storm",
    sunColor: "hsl(70, 100%, 65%)",
    sunSize: 14,
    planets: [
      { distance: 17, size: 2, speed: 4, color: "hsl(70, 100%, 55%)", delay: 0 },
      { distance: 24, size: 3, speed: 7, color: "hsl(70, 100%, 50%)", delay: 2 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(127, 255, 0, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(70, 100%, 65%)",
      boxShadow: "0 0 18px hsl(70, 100%, 65% / 0.5), inset 0 0 18px hsl(70, 100%, 65% / 0.2)"
    }
  },
  UXI8025: {
    name: "Plum Void",
    sunColor: "hsl(290, 100%, 70%)",
    sunSize: 16,
    planets: [],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(221, 160, 221, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(290, 100%, 70%)",
      boxShadow: "0 0 19px hsl(290, 100%, 70% / 0.6), inset 0 0 19px hsl(290, 100%, 70% / 0.25)"
    }
  },
  UXI8026: {
    name: "Tangerine Binary",
    sunColor: "hsl(20, 100%, 70%)",
    sunSize: 11,
    planets: [
      { distance: 18, size: 2.5, speed: 5, color: "hsl(20, 100%, 60%)", delay: 0 },
      { distance: 25, size: 3, speed: 9, color: "hsl(20, 100%, 55%)", delay: 3 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(255, 165, 0, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(20, 100%, 70%)",
      boxShadow: "0 0 15px hsl(20, 100%, 70% / 0.5), inset 0 0 15px hsl(20, 100%, 70% / 0.2)"
    }
  },
  UXI8027: {
    name: "Cyan Pulse",
    sunColor: "hsl(190, 100%, 75%)",
    sunSize: 9,
    planets: [
      { distance: 21, size: 3.5, speed: 8, color: "hsl(190, 100%, 65%)", delay: 0 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(190, 100%, 75%)",
      boxShadow: "0 0 14px hsl(190, 100%, 75% / 0.5), inset 0 0 14px hsl(190, 100%, 75% / 0.2)"
    }
  },
  UXI8028: {
    name: "Olive Cascade",
    sunColor: "hsl(60, 100%, 50%)",
    sunSize: 13,
    planets: [
      { distance: 15, size: 1.5, speed: 3, color: "hsl(60, 100%, 40%)", delay: 0 },
      { distance: 19, size: 2, speed: 5, color: "hsl(60, 100%, 35%)", delay: 1 },
      { distance: 24, size: 2.5, speed: 8, color: "hsl(60, 100%, 30%)", delay: 2 },
      { distance: 30, size: 3, speed: 12, color: "hsl(60, 100%, 25%)", delay: 4 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(128, 128, 0, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(60, 100%, 50%)",
      boxShadow: "0 0 17px hsl(60, 100%, 50% / 0.5), inset 0 0 17px hsl(60, 100%, 50% / 0.2)"
    }
  },
  UXI8029: {
    name: "Fuchsia Orbit",
    sunColor: "hsl(320, 100%, 75%)",
    sunSize: 10,
    planets: [
      { distance: 22, size: 3, speed: 7, color: "hsl(320, 100%, 65%)", delay: 0 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(255, 0, 255, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(320, 100%, 75%)",
      boxShadow: "0 0 15px hsl(320, 100%, 75% / 0.5), inset 0 0 15px hsl(320, 100%, 75% / 0.2)"
    }
  },
  UXI8030: {
    name: "Navy Cluster",
    sunColor: "hsl(210, 100%, 45%)",
    sunSize: 8,
    planets: [
      { distance: 16, size: 2, speed: 4, color: "hsl(210, 100%, 35%)", delay: 0 },
      { distance: 21, size: 2.5, speed: 6, color: "hsl(210, 100%, 30%)", delay: 1 },
      { distance: 27, size: 3, speed: 9, color: "hsl(210, 100%, 25%)", delay: 3 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(0, 0, 255, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(210, 100%, 45%)",
      boxShadow: "0 0 13px hsl(210, 100%, 45% / 0.5), inset 0 0 13px hsl(210, 100%, 45% / 0.2)"
    }
  },
  UXI8031: {
    name: "Maroon Drift",
    sunColor: "hsl(340, 100%, 55%)",
    sunSize: 12,
    planets: [
      { distance: 19, size: 2.5, speed: 6, color: "hsl(340, 100%, 45%)", delay: 0 },
      { distance: 26, size: 3.5, speed: 10, color: "hsl(340, 100%, 40%)", delay: 3 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(255, 0, 50, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(340, 100%, 55%)",
      boxShadow: "0 0 16px hsl(340, 100%, 55% / 0.5), inset 0 0 16px hsl(340, 100%, 55% / 0.2)"
    }
  },
  UXI8032: {
    name: "Platinum Ring",
    sunColor: "hsl(0, 0%, 90%)",
    sunSize: 9,
    planets: [
      { distance: 18, size: 1.8, speed: 4, color: "hsl(0, 0%, 82%)", delay: 0 },
      { distance: 18, size: 1.8, speed: 4, color: "hsl(0, 0%, 78%)", delay: 2 },
      { distance: 18, size: 1.8, speed: 4, color: "hsl(0, 0%, 74%)", delay: 4 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(229, 228, 226, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(0, 0%, 90%)",
      boxShadow: "0 0 14px hsl(0, 0%, 90% / 0.5), inset 0 0 14px hsl(0, 0%, 90% / 0.2)"
    }
  },
  UXI8033: {
    name: "Jade Wanderer",
    sunColor: "hsl(130, 100%, 55%)",
    sunSize: 7,
    planets: [
      { distance: 23, size: 4, speed: 15, color: "hsl(130, 100%, 45%)", delay: 0 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(0, 255, 100, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(130, 100%, 55%)",
      boxShadow: "0 0 12px hsl(130, 100%, 55% / 0.5), inset 0 0 12px hsl(130, 100%, 55% / 0.2)"
    }
  },
  UXI8034: {
    name: "Rust Storm",
    sunColor: "hsl(10, 100%, 60%)",
    sunSize: 15,
    planets: [
      { distance: 17, size: 2, speed: 4, color: "hsl(10, 100%, 50%)", delay: 0 },
      { distance: 24, size: 3, speed: 7, color: "hsl(10, 100%, 45%)", delay: 2 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(255, 100, 50, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(10, 100%, 60%)",
      boxShadow: "0 0 19px hsl(10, 100%, 60% / 0.5), inset 0 0 19px hsl(10, 100%, 60% / 0.2)"
    }
  },
  UXI8035: {
    name: "Steel Void",
    sunColor: "hsl(0, 0%, 70%)",
    sunSize: 18,
    planets: [],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(70, 130, 180, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(0, 0%, 70%)",
      boxShadow: "0 0 21px hsl(0, 0%, 70% / 0.6), inset 0 0 21px hsl(0, 0%, 70% / 0.25)"
    }
  },
  UXI8036: {
    name: "Sunset Binary",
    sunColor: "hsl(25, 100%, 65%)",
    sunSize: 13,
    planets: [
      { distance: 18, size: 2.5, speed: 5, color: "hsl(25, 100%, 55%)", delay: 0 },
      { distance: 25, size: 3, speed: 9, color: "hsl(25, 100%, 50%)", delay: 3 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(255, 140, 0, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(25, 100%, 65%)",
      boxShadow: "0 0 17px hsl(25, 100%, 65% / 0.5), inset 0 0 17px hsl(25, 100%, 65% / 0.2)"
    }
  },
  UXI8037: {
    name: "Forest Pulse",
    sunColor: "hsl(120, 100%, 50%)",
    sunSize: 10,
    planets: [
      { distance: 20, size: 3.5, speed: 8, color: "hsl(120, 100%, 40%)", delay: 0 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(34, 255, 34, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(120, 100%, 50%)",
      boxShadow: "0 0 15px hsl(120, 100%, 50% / 0.5), inset 0 0 15px hsl(120, 100%, 50% / 0.2)"
    }
  },
  UXI8038: {
    name: "Ocean Cascade",
    sunColor: "hsl(195, 100%, 60%)",
    sunSize: 11,
    planets: [
      { distance: 15, size: 1.5, speed: 3, color: "hsl(195, 100%, 50%)", delay: 0 },
      { distance: 19, size: 2, speed: 5, color: "hsl(195, 100%, 45%)", delay: 1 },
      { distance: 24, size: 2.5, speed: 8, color: "hsl(195, 100%, 40%)", delay: 2 },
      { distance: 30, size: 3, speed: 12, color: "hsl(195, 100%, 35%)", delay: 4 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(0, 191, 255, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(195, 100%, 60%)",
      boxShadow: "0 0 16px hsl(195, 100%, 60% / 0.5), inset 0 0 16px hsl(195, 100%, 60% / 0.2)"
    }
  },
  UXI8039: {
    name: "Burgundy Orbit",
    sunColor: "hsl(345, 100%, 50%)",
    sunSize: 12,
    planets: [
      { distance: 21, size: 3, speed: 7, color: "hsl(345, 100%, 40%)", delay: 0 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(255, 0, 80, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(345, 100%, 50%)",
      boxShadow: "0 0 16px hsl(345, 100%, 50% / 0.5), inset 0 0 16px hsl(345, 100%, 50% / 0.2)"
    }
  },
  UXI8040: {
    name: "Scarlet Storm",
    sunColor: "hsl(355, 100%, 65%)",
    sunSize: 16,
    planets: [
      { distance: 18, size: 2.5, speed: 5, color: "hsl(355, 100%, 55%)", delay: 0 },
      { distance: 26, size: 3.5, speed: 10, color: "hsl(355, 100%, 50%)", delay: 4 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, rgba(220, 20, 60, 0.2) 0%, transparent 50%), rgba(26, 26, 46, 0.7)",
      borderColor: "hsl(355, 100%, 65%)",
      boxShadow: "0 0 20px hsl(355, 100%, 65% / 0.5), inset 0 0 20px hsl(355, 100%, 65% / 0.2)"
    }
  }
};