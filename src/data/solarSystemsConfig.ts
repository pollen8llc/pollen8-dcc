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
  // Base system with theme colors
  UXI8000: {
    name: "Base System",
    sunColor: "hsl(174, 100%, 46%)",
    sunSize: 0,
    planets: [
      { distance: 18, size: 2.5, speed: 6, color: "hsl(174, 100%, 46%)", delay: 0 },
      { distance: 25, size: 2, speed: 9, color: "hsl(174, 80%, 60%)", delay: 3 }
    ],
    avatarStyle: {
      background: "radial-gradient(circle at 30% 30%, hsl(174, 100%, 46% / 0.15) 0%, transparent 50%), rgba(26, 26, 46, 0.9)",
      borderColor: "hsl(174, 100%, 46%)",
      boxShadow: "0 0 12px hsl(174, 100%, 46% / 0.4), inset 0 0 12px hsl(174, 100%, 46% / 0.15)"
    }
  },
  "UXI8001": {
    "name": "Aquamarine Single",
    "sunColor": "hsl(180, 100%, 70%)",
    "sunSize": 12,
    "planets": [
      {
        "distance": 20,
        "size": 3,
        "speed": 6,
        "color": "hsl(180, 80%, 60%)",
        "delay": 0
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.15) 0%, transparent 50%), rgba(26, 26, 46, 0.9)",
      "borderColor": "hsl(180, 100%, 70%)",
      "boxShadow": "0 0 12px hsl(180, 100%, 70% / 0.4), inset 0 0 12px hsl(180, 100%, 70% / 0.15)"
    }
  },
  "UXI8002": {
    "name": "Red Giant Void",
    "sunColor": "hsl(0, 100%, 65%)",
    "sunSize": 16,
    "planets": [],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(255, 0, 0, 0.2) 0%, transparent 50%), rgba(46, 26, 26, 0.9)",
      "borderColor": "hsl(0, 100%, 65%)",
      "boxShadow": "0 0 12px hsl(0, 100%, 65% / 0.4), inset 0 0 12px hsl(0, 100%, 65% / 0.15)"
    }
  },
  "UXI8003": {
    "name": "White Dwarf Twin",
    "sunColor": "hsl(0, 0%, 95%)",
    "sunSize": 8,
    "planets": [
      {
        "distance": 18,
        "size": 2.5,
        "speed": 5,
        "color": "hsl(0, 0%, 85%)",
        "delay": 0
      },
      {
        "distance": 28,
        "size": 2.5,
        "speed": 8,
        "color": "hsl(0, 0%, 80%)",
        "delay": 1
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), rgba(36, 36, 36, 0.9)",
      "borderColor": "hsl(0, 0%, 95%)",
      "boxShadow": "0 0 12px hsl(0, 0%, 95% / 0.4), inset 0 0 12px hsl(0, 0%, 95% / 0.15)"
    }
  },
  "UXI8004": {
    "name": "Purple Nebula",
    "sunColor": "hsl(280, 100%, 70%)",
    "sunSize": 14,
    "planets": [
      {
        "distance": 22,
        "size": 4,
        "speed": 7,
        "color": "hsl(260, 80%, 65%)",
        "delay": 0.5
      },
      {
        "distance": 32,
        "size": 3,
        "speed": 10,
        "color": "hsl(300, 70%, 60%)",
        "delay": 1.5
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(138, 43, 226, 0.15) 0%, transparent 50%), rgba(36, 26, 46, 0.9)",
      "borderColor": "hsl(280, 100%, 70%)",
      "boxShadow": "0 0 12px hsl(280, 100%, 70% / 0.4), inset 0 0 12px hsl(280, 100%, 70% / 0.15)"
    }
  },
  "UXI8005": {
    "name": "Golden Binary",
    "sunColor": "hsl(45, 100%, 70%)",
    "sunSize": 10,
    "planets": [
      {
        "distance": 16,
        "size": 2,
        "speed": 4,
        "color": "hsl(35, 90%, 65%)",
        "delay": 0
      },
      {
        "distance": 24,
        "size": 3.5,
        "speed": 6,
        "color": "hsl(55, 85%, 60%)",
        "delay": 0.8
      },
      {
        "distance": 34,
        "size": 2.5,
        "speed": 9,
        "color": "hsl(40, 80%, 55%)",
        "delay": 1.2
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.15) 0%, transparent 50%), rgba(46, 36, 26, 0.9)",
      "borderColor": "hsl(45, 100%, 70%)",
      "boxShadow": "0 0 12px hsl(45, 100%, 70% / 0.4), inset 0 0 12px hsl(45, 100%, 70% / 0.15)"
    }
  },
  "UXI8006": {
    "name": "Green Oasis",
    "sunColor": "hsl(120, 100%, 70%)",
    "sunSize": 11,
    "planets": [
      {
        "distance": 19,
        "size": 3.5,
        "speed": 5,
        "color": "hsl(110, 80%, 60%)",
        "delay": 0
      },
      {
        "distance": 29,
        "size": 2.8,
        "speed": 8,
        "color": "hsl(130, 75%, 55%)",
        "delay": 1
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(0, 255, 0, 0.12) 0%, transparent 50%), rgba(26, 46, 26, 0.9)",
      "borderColor": "hsl(120, 100%, 70%)",
      "boxShadow": "0 0 12px hsl(120, 100%, 70% / 0.4), inset 0 0 12px hsl(120, 100%, 70% / 0.15)"
    }
  },
  "UXI8007": {
    "name": "Orange Storm",
    "sunColor": "hsl(25, 100%, 70%)",
    "sunSize": 15,
    "planets": [
      {
        "distance": 25,
        "size": 4.5,
        "speed": 9,
        "color": "hsl(15, 90%, 65%)",
        "delay": 0
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(255, 165, 0, 0.18) 0%, transparent 50%), rgba(46, 36, 26, 0.9)",
      "borderColor": "hsl(25, 100%, 70%)",
      "boxShadow": "0 0 12px hsl(25, 100%, 70% / 0.4), inset 0 0 12px hsl(25, 100%, 70% / 0.15)"
    }
  },
  "UXI8008": {
    "name": "Blue Supergiant",
    "sunColor": "hsl(220, 100%, 75%)",
    "sunSize": 18,
    "planets": [
      {
        "distance": 30,
        "size": 2,
        "speed": 12,
        "color": "hsl(210, 85%, 70%)",
        "delay": 0
      },
      {
        "distance": 40,
        "size": 3,
        "speed": 15,
        "color": "hsl(230, 80%, 65%)",
        "delay": 2
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(0, 100, 255, 0.2) 0%, transparent 50%), rgba(26, 36, 56, 0.9)",
      "borderColor": "hsl(220, 100%, 75%)",
      "boxShadow": "0 0 12px hsl(220, 100%, 75% / 0.4), inset 0 0 12px hsl(220, 100%, 75% / 0.15)"
    }
  },
  "UXI8009": {
    "name": "Pink Pulsar",
    "sunColor": "hsl(320, 100%, 75%)",
    "sunSize": 6,
    "planets": [
      {
        "distance": 15,
        "size": 1.5,
        "speed": 3,
        "color": "hsl(310, 90%, 70%)",
        "delay": 0
      },
      {
        "distance": 21,
        "size": 2,
        "speed": 5,
        "color": "hsl(330, 85%, 65%)",
        "delay": 0.5
      },
      {
        "distance": 28,
        "size": 1.8,
        "speed": 7,
        "color": "hsl(340, 80%, 60%)",
        "delay": 1
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(255, 20, 147, 0.15) 0%, transparent 50%), rgba(46, 26, 40, 0.9)",
      "borderColor": "hsl(320, 100%, 75%)",
      "boxShadow": "0 0 12px hsl(320, 100%, 75% / 0.4), inset 0 0 12px hsl(320, 100%, 75% / 0.15)"
    }
  },
  "UXI8010": {
    "name": "Violet Compact",
    "sunColor": "hsl(270, 100%, 70%)",
    "sunSize": 9,
    "planets": [
      {
        "distance": 17,
        "size": 2.5,
        "speed": 4,
        "color": "hsl(260, 85%, 65%)",
        "delay": 0
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(138, 43, 226, 0.15) 0%, transparent 50%), rgba(36, 26, 46, 0.9)",
      "borderColor": "hsl(270, 100%, 70%)",
      "boxShadow": "0 0 12px hsl(270, 100%, 70% / 0.4), inset 0 0 12px hsl(270, 100%, 70% / 0.15)"
    }
  },
  "UXI8011": {
    "name": "Crimson Eclipse",
    "sunColor": "hsl(350, 100%, 65%)",
    "sunSize": 13,
    "planets": [
      {
        "distance": 20,
        "size": 3,
        "speed": 6,
        "color": "hsl(340, 90%, 60%)",
        "delay": 0
      },
      {
        "distance": 30,
        "size": 2.5,
        "speed": 9,
        "color": "hsl(360, 85%, 55%)",
        "delay": 1.5
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(220, 20, 60, 0.15) 0%, transparent 50%), rgba(46, 26, 30, 0.9)",
      "borderColor": "hsl(350, 100%, 65%)",
      "boxShadow": "0 0 12px hsl(350, 100%, 65% / 0.4), inset 0 0 12px hsl(350, 100%, 65% / 0.15)"
    }
  },
  "UXI8012": {
    "name": "Teal Cosmos",
    "sunColor": "hsl(180, 80%, 65%)",
    "sunSize": 12,
    "planets": [
      {
        "distance": 18,
        "size": 2.8,
        "speed": 5,
        "color": "hsl(170, 75%, 60%)",
        "delay": 0.3
      },
      {
        "distance": 26,
        "size": 3.2,
        "speed": 7,
        "color": "hsl(190, 70%, 55%)",
        "delay": 1
      },
      {
        "distance": 35,
        "size": 2.2,
        "speed": 10,
        "color": "hsl(175, 65%, 50%)",
        "delay": 1.8
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(0, 128, 128, 0.15) 0%, transparent 50%), rgba(26, 40, 40, 0.9)",
      "borderColor": "hsl(180, 80%, 65%)",
      "boxShadow": "0 0 12px hsl(180, 80%, 65% / 0.4), inset 0 0 12px hsl(180, 80%, 65% / 0.15)"
    }
  },
  "UXI8013": {
    "name": "Amber Solo",
    "sunColor": "hsl(40, 100%, 70%)",
    "sunSize": 14,
    "planets": [
      {
        "distance": 23,
        "size": 4,
        "speed": 8,
        "color": "hsl(35, 95%, 65%)",
        "delay": 0
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(255, 191, 0, 0.15) 0%, transparent 50%), rgba(46, 40, 26, 0.9)",
      "borderColor": "hsl(40, 100%, 70%)",
      "boxShadow": "0 0 12px hsl(40, 100%, 70% / 0.4), inset 0 0 12px hsl(40, 100%, 70% / 0.15)"
    }
  },
  "UXI8014": {
    "name": "Indigo Void",
    "sunColor": "hsl(240, 100%, 65%)",
    "sunSize": 10,
    "planets": [],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(75, 0, 130, 0.2) 0%, transparent 50%), rgba(30, 26, 46, 0.9)",
      "borderColor": "hsl(240, 100%, 65%)",
      "boxShadow": "0 0 12px hsl(240, 100%, 65% / 0.4), inset 0 0 12px hsl(240, 100%, 65% / 0.15)"
    }
  },
  "UXI8015": {
    "name": "Lime Quartet",
    "sunColor": "hsl(80, 100%, 70%)",
    "sunSize": 11,
    "planets": [
      {
        "distance": 16,
        "size": 2,
        "speed": 4,
        "color": "hsl(75, 90%, 65%)",
        "delay": 0
      },
      {
        "distance": 22,
        "size": 2.5,
        "speed": 6,
        "color": "hsl(85, 85%, 60%)",
        "delay": 0.5
      },
      {
        "distance": 29,
        "size": 2.2,
        "speed": 8,
        "color": "hsl(90, 80%, 55%)",
        "delay": 1
      },
      {
        "distance": 37,
        "size": 1.8,
        "speed": 11,
        "color": "hsl(70, 75%, 50%)",
        "delay": 1.8
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(173, 255, 47, 0.15) 0%, transparent 50%), rgba(36, 46, 26, 0.9)",
      "borderColor": "hsl(80, 100%, 70%)",
      "boxShadow": "0 0 12px hsl(80, 100%, 70% / 0.4), inset 0 0 12px hsl(80, 100%, 70% / 0.15)"
    }
  },
  "UXI8016": {
    "name": "Coral Distant",
    "sunColor": "hsl(15, 100%, 70%)",
    "sunSize": 12,
    "planets": [
      {
        "distance": 35,
        "size": 3.5,
        "speed": 12,
        "color": "hsl(10, 90%, 65%)",
        "delay": 0
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(255, 127, 80, 0.15) 0%, transparent 50%), rgba(46, 32, 26, 0.9)",
      "borderColor": "hsl(15, 100%, 70%)",
      "boxShadow": "0 0 12px hsl(15, 100%, 70% / 0.4), inset 0 0 12px hsl(15, 100%, 70% / 0.15)"
    }
  },
  "UXI8017": {
    "name": "Cyan Binary",
    "sunColor": "hsl(190, 100%, 70%)",
    "sunSize": 10,
    "planets": [
      {
        "distance": 19,
        "size": 3,
        "speed": 5,
        "color": "hsl(185, 85%, 65%)",
        "delay": 0
      },
      {
        "distance": 27,
        "size": 3,
        "speed": 7,
        "color": "hsl(195, 80%, 60%)",
        "delay": 1
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.15) 0%, transparent 50%), rgba(26, 40, 46, 0.9)",
      "borderColor": "hsl(190, 100%, 70%)",
      "boxShadow": "0 0 12px hsl(190, 100%, 70% / 0.4), inset 0 0 12px hsl(190, 100%, 70% / 0.15)"
    }
  },
  "UXI8018": {
    "name": "Magenta Storm",
    "sunColor": "hsl(300, 100%, 70%)",
    "sunSize": 15,
    "planets": [
      {
        "distance": 24,
        "size": 4,
        "speed": 8,
        "color": "hsl(295, 90%, 65%)",
        "delay": 0.5
      },
      {
        "distance": 33,
        "size": 3.5,
        "speed": 11,
        "color": "hsl(305, 85%, 60%)",
        "delay": 1.2
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(255, 0, 255, 0.18) 0%, transparent 50%), rgba(46, 26, 46, 0.9)",
      "borderColor": "hsl(300, 100%, 70%)",
      "boxShadow": "0 0 12px hsl(300, 100%, 70% / 0.4), inset 0 0 12px hsl(300, 100%, 70% / 0.15)"
    }
  },
  "UXI8019": {
    "name": "Chartreuse Ring",
    "sunColor": "hsl(90, 100%, 70%)",
    "sunSize": 8,
    "planets": [
      {
        "distance": 16,
        "size": 1.5,
        "speed": 4,
        "color": "hsl(85, 90%, 65%)",
        "delay": 0
      },
      {
        "distance": 20,
        "size": 1.8,
        "speed": 5,
        "color": "hsl(95, 85%, 60%)",
        "delay": 0.3
      },
      {
        "distance": 24,
        "size": 2,
        "speed": 6,
        "color": "hsl(100, 80%, 55%)",
        "delay": 0.6
      },
      {
        "distance": 28,
        "size": 1.6,
        "speed": 7,
        "color": "hsl(80, 75%, 50%)",
        "delay": 0.9
      },
      {
        "distance": 32,
        "size": 1.4,
        "speed": 8,
        "color": "hsl(105, 70%, 45%)",
        "delay": 1.2
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(127, 255, 0, 0.15) 0%, transparent 50%), rgba(32, 46, 26, 0.9)",
      "borderColor": "hsl(90, 100%, 70%)",
      "boxShadow": "0 0 12px hsl(90, 100%, 70% / 0.4), inset 0 0 12px hsl(90, 100%, 70% / 0.15)"
    }
  },
  "UXI8020": {
    "name": "Azure Gem",
    "sunColor": "hsl(210, 100%, 70%)",
    "sunSize": 9,
    "planets": [
      {
        "distance": 18,
        "size": 2.8,
        "speed": 5,
        "color": "hsl(205, 85%, 65%)",
        "delay": 0
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(0, 127, 255, 0.15) 0%, transparent 50%), rgba(26, 32, 46, 0.9)",
      "borderColor": "hsl(210, 100%, 70%)",
      "boxShadow": "0 0 12px hsl(210, 100%, 70% / 0.4), inset 0 0 12px hsl(210, 100%, 70% / 0.15)"
    }
  },
  "UXI8021": {
    "name": "Rose Triple",
    "sunColor": "hsl(330, 100%, 75%)",
    "sunSize": 11,
    "planets": [
      {
        "distance": 17,
        "size": 2.5,
        "speed": 4,
        "color": "hsl(325, 90%, 70%)",
        "delay": 0
      },
      {
        "distance": 25,
        "size": 3,
        "speed": 6,
        "color": "hsl(335, 85%, 65%)",
        "delay": 0.8
      },
      {
        "distance": 34,
        "size": 2.3,
        "speed": 9,
        "color": "hsl(340, 80%, 60%)",
        "delay": 1.5
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(255, 20, 147, 0.15) 0%, transparent 50%), rgba(46, 26, 36, 0.9)",
      "borderColor": "hsl(330, 100%, 75%)",
      "boxShadow": "0 0 12px hsl(330, 100%, 75% / 0.4), inset 0 0 12px hsl(330, 100%, 75% / 0.15)"
    }
  },
  "UXI8022": {
    "name": "Mint Void",
    "sunColor": "hsl(150, 100%, 75%)",
    "sunSize": 13,
    "planets": [],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(0, 255, 127, 0.15) 0%, transparent 50%), rgba(26, 46, 36, 0.9)",
      "borderColor": "hsl(150, 100%, 75%)",
      "boxShadow": "0 0 12px hsl(150, 100%, 75% / 0.4), inset 0 0 12px hsl(150, 100%, 75% / 0.15)"
    }
  },
  "UXI8023": {
    "name": "Bronze Cluster",
    "sunColor": "hsl(30, 100%, 65%)",
    "sunSize": 12,
    "planets": [
      {
        "distance": 16,
        "size": 2.2,
        "speed": 4,
        "color": "hsl(25, 90%, 60%)",
        "delay": 0
      },
      {
        "distance": 22,
        "size": 2.8,
        "speed": 6,
        "color": "hsl(35, 85%, 55%)",
        "delay": 0.5
      },
      {
        "distance": 29,
        "size": 2.4,
        "speed": 8,
        "color": "hsl(40, 80%, 50%)",
        "delay": 1
      },
      {
        "distance": 36,
        "size": 2,
        "speed": 10,
        "color": "hsl(20, 75%, 45%)",
        "delay": 1.5
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(205, 127, 50, 0.15) 0%, transparent 50%), rgba(46, 36, 26, 0.9)",
      "borderColor": "hsl(30, 100%, 65%)",
      "boxShadow": "0 0 12px hsl(30, 100%, 65% / 0.4), inset 0 0 12px hsl(30, 100%, 65% / 0.15)"
    }
  },
  "UXI8024": {
    "name": "Lavender Twin",
    "sunColor": "hsl(280, 80%, 75%)",
    "sunSize": 10,
    "planets": [
      {
        "distance": 20,
        "size": 3,
        "speed": 6,
        "color": "hsl(275, 75%, 70%)",
        "delay": 0
      },
      {
        "distance": 30,
        "size": 2.8,
        "speed": 9,
        "color": "hsl(285, 70%, 65%)",
        "delay": 1.2
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(218, 112, 214, 0.15) 0%, transparent 50%), rgba(40, 30, 46, 0.9)",
      "borderColor": "hsl(280, 80%, 75%)",
      "boxShadow": "0 0 12px hsl(280, 80%, 75% / 0.4), inset 0 0 12px hsl(280, 80%, 75% / 0.15)"
    }
  },
  "UXI8025": {
    "name": "Peach Orbit",
    "sunColor": "hsl(20, 100%, 75%)",
    "sunSize": 11,
    "planets": [
      {
        "distance": 21,
        "size": 3.5,
        "speed": 6,
        "color": "hsl(15, 95%, 70%)",
        "delay": 0
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(255, 218, 185, 0.15) 0%, transparent 50%), rgba(46, 36, 30, 0.9)",
      "borderColor": "hsl(20, 100%, 75%)",
      "boxShadow": "0 0 12px hsl(20, 100%, 75% / 0.4), inset 0 0 12px hsl(20, 100%, 75% / 0.15)"
    }
  },
  "UXI8026": {
    "name": "Turquoise Dense",
    "sunColor": "hsl(175, 100%, 70%)",
    "sunSize": 8,
    "planets": [
      {
        "distance": 14,
        "size": 1.8,
        "speed": 3,
        "color": "hsl(170, 90%, 65%)",
        "delay": 0
      },
      {
        "distance": 18,
        "size": 2.2,
        "speed": 4,
        "color": "hsl(180, 85%, 60%)",
        "delay": 0.3
      },
      {
        "distance": 23,
        "size": 2.5,
        "speed": 5,
        "color": "hsl(185, 80%, 55%)",
        "delay": 0.6
      },
      {
        "distance": 28,
        "size": 2,
        "speed": 7,
        "color": "hsl(175, 75%, 50%)",
        "delay": 1
      },
      {
        "distance": 34,
        "size": 1.5,
        "speed": 9,
        "color": "hsl(170, 70%, 45%)",
        "delay": 1.5
      },
      {
        "distance": 40,
        "size": 1.2,
        "speed": 11,
        "color": "hsl(180, 65%, 40%)",
        "delay": 2
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(64, 224, 208, 0.15) 0%, transparent 50%), rgba(26, 40, 40, 0.9)",
      "borderColor": "hsl(175, 100%, 70%)",
      "boxShadow": "0 0 12px hsl(175, 100%, 70% / 0.4), inset 0 0 12px hsl(175, 100%, 70% / 0.15)"
    }
  },
  "UXI8027": {
    "name": "Maroon Lone",
    "sunColor": "hsl(340, 80%, 60%)",
    "sunSize": 14,
    "planets": [
      {
        "distance": 26,
        "size": 4,
        "speed": 8,
        "color": "hsl(335, 75%, 55%)",
        "delay": 0
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(128, 0, 0, 0.2) 0%, transparent 50%), rgba(46, 26, 26, 0.9)",
      "borderColor": "hsl(340, 80%, 60%)",
      "boxShadow": "0 0 12px hsl(340, 80%, 60% / 0.4), inset 0 0 12px hsl(340, 80%, 60% / 0.15)"
    }
  },
  "UXI8028": {
    "name": "Sage Void",
    "sunColor": "hsl(100, 50%, 70%)",
    "sunSize": 12,
    "planets": [],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(154, 205, 50, 0.12) 0%, transparent 50%), rgba(32, 40, 28, 0.9)",
      "borderColor": "hsl(100, 50%, 70%)",
      "boxShadow": "0 0 12px hsl(100, 50%, 70% / 0.4), inset 0 0 12px hsl(100, 50%, 70% / 0.15)"
    }
  },
  "UXI8029": {
    "name": "Sky Binary",
    "sunColor": "hsl(200, 100%, 75%)",
    "sunSize": 9,
    "planets": [
      {
        "distance": 18,
        "size": 2.8,
        "speed": 5,
        "color": "hsl(195, 90%, 70%)",
        "delay": 0
      },
      {
        "distance": 28,
        "size": 3.2,
        "speed": 8,
        "color": "hsl(205, 85%, 65%)",
        "delay": 1
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(135, 206, 235, 0.15) 0%, transparent 50%), rgba(26, 36, 46, 0.9)",
      "borderColor": "hsl(200, 100%, 75%)",
      "boxShadow": "0 0 12px hsl(200, 100%, 75% / 0.4), inset 0 0 12px hsl(200, 100%, 75% / 0.15)"
    }
  },
  "UXI8030": {
    "name": "Ruby Massive",
    "sunColor": "hsl(350, 100%, 70%)",
    "sunSize": 17,
    "planets": [
      {
        "distance": 32,
        "size": 3,
        "speed": 10,
        "color": "hsl(345, 90%, 65%)",
        "delay": 0
      },
      {
        "distance": 42,
        "size": 2.5,
        "speed": 13,
        "color": "hsl(355, 85%, 60%)",
        "delay": 1.5
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(255, 0, 127, 0.2) 0%, transparent 50%), rgba(50, 26, 30, 0.9)",
      "borderColor": "hsl(350, 100%, 70%)",
      "boxShadow": "0 0 12px hsl(350, 100%, 70% / 0.4), inset 0 0 12px hsl(350, 100%, 70% / 0.15)"
    }
  },
  "UXI8031": {
    "name": "Emerald Ring",
    "sunColor": "hsl(140, 100%, 65%)",
    "sunSize": 10,
    "planets": [
      {
        "distance": 16,
        "size": 2,
        "speed": 4,
        "color": "hsl(135, 90%, 60%)",
        "delay": 0
      },
      {
        "distance": 21,
        "size": 2.3,
        "speed": 5,
        "color": "hsl(145, 85%, 55%)",
        "delay": 0.4
      },
      {
        "distance": 27,
        "size": 2.6,
        "speed": 7,
        "color": "hsl(150, 80%, 50%)",
        "delay": 0.8
      },
      {
        "distance": 33,
        "size": 2.1,
        "speed": 9,
        "color": "hsl(130, 75%, 45%)",
        "delay": 1.2
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(0, 201, 87, 0.15) 0%, transparent 50%), rgba(26, 46, 30, 0.9)",
      "borderColor": "hsl(140, 100%, 65%)",
      "boxShadow": "0 0 12px hsl(140, 100%, 65% / 0.4), inset 0 0 12px hsl(140, 100%, 65% / 0.15)"
    }
  },
  "UXI8032": {
    "name": "Plum Solo",
    "sunColor": "hsl(290, 80%, 65%)",
    "sunSize": 12,
    "planets": [
      {
        "distance": 22,
        "size": 3.8,
        "speed": 7,
        "color": "hsl(285, 75%, 60%)",
        "delay": 0
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(221, 160, 221, 0.15) 0%, transparent 50%), rgba(40, 26, 40, 0.9)",
      "borderColor": "hsl(290, 80%, 65%)",
      "boxShadow": "0 0 12px hsl(290, 80%, 65% / 0.4), inset 0 0 12px hsl(290, 80%, 65% / 0.15)"
    }
  },
  "UXI8033": {
    "name": "Steel Void",
    "sunColor": "hsl(210, 20%, 70%)",
    "sunSize": 11,
    "planets": [],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(70, 130, 180, 0.1) 0%, transparent 50%), rgba(35, 35, 40, 0.9)",
      "borderColor": "hsl(210, 20%, 70%)",
      "boxShadow": "0 0 12px hsl(210, 20%, 70% / 0.4), inset 0 0 12px hsl(210, 20%, 70% / 0.15)"
    }
  },
  "UXI8034": {
    "name": "Tangerine Twin",
    "sunColor": "hsl(35, 100%, 70%)",
    "sunSize": 13,
    "planets": [
      {
        "distance": 21,
        "size": 3.2,
        "speed": 6,
        "color": "hsl(30, 95%, 65%)",
        "delay": 0
      },
      {
        "distance": 31,
        "size": 2.9,
        "speed": 9,
        "color": "hsl(40, 90%, 60%)",
        "delay": 1.3
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(255, 165, 0, 0.15) 0%, transparent 50%), rgba(46, 38, 26, 0.9)",
      "borderColor": "hsl(35, 100%, 70%)",
      "boxShadow": "0 0 12px hsl(35, 100%, 70% / 0.4), inset 0 0 12px hsl(35, 100%, 70% / 0.15)"
    }
  },
  "UXI8035": {
    "name": "Navy Compact",
    "sunColor": "hsl(230, 80%, 55%)",
    "sunSize": 8,
    "planets": [
      {
        "distance": 15,
        "size": 2,
        "speed": 4,
        "color": "hsl(225, 75%, 50%)",
        "delay": 0
      },
      {
        "distance": 20,
        "size": 2.4,
        "speed": 5,
        "color": "hsl(235, 70%, 45%)",
        "delay": 0.5
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(0, 0, 128, 0.15) 0%, transparent 50%), rgba(26, 26, 46, 0.9)",
      "borderColor": "hsl(230, 80%, 55%)",
      "boxShadow": "0 0 12px hsl(230, 80%, 55% / 0.4), inset 0 0 12px hsl(230, 80%, 55% / 0.15)"
    }
  },
  "UXI8036": {
    "name": "Copper Dense",
    "sunColor": "hsl(20, 90%, 65%)",
    "sunSize": 9,
    "planets": [
      {
        "distance": 14,
        "size": 1.6,
        "speed": 3,
        "color": "hsl(15, 85%, 60%)",
        "delay": 0
      },
      {
        "distance": 18,
        "size": 2,
        "speed": 4,
        "color": "hsl(25, 80%, 55%)",
        "delay": 0.3
      },
      {
        "distance": 23,
        "size": 2.3,
        "speed": 5,
        "color": "hsl(30, 75%, 50%)",
        "delay": 0.6
      },
      {
        "distance": 28,
        "size": 1.9,
        "speed": 7,
        "color": "hsl(10, 70%, 45%)",
        "delay": 1
      },
      {
        "distance": 34,
        "size": 1.4,
        "speed": 9,
        "color": "hsl(35, 65%, 40%)",
        "delay": 1.5
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(184, 115, 51, 0.15) 0%, transparent 50%), rgba(46, 32, 26, 0.9)",
      "borderColor": "hsl(20, 90%, 65%)",
      "boxShadow": "0 0 12px hsl(20, 90%, 65% / 0.4), inset 0 0 12px hsl(20, 90%, 65% / 0.15)"
    }
  },
  "UXI8037": {
    "name": "Orchid Distant",
    "sunColor": "hsl(310, 90%, 70%)",
    "sunSize": 10,
    "planets": [
      {
        "distance": 38,
        "size": 3.5,
        "speed": 14,
        "color": "hsl(305, 85%, 65%)",
        "delay": 0
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(218, 112, 214, 0.15) 0%, transparent 50%), rgba(46, 26, 42, 0.9)",
      "borderColor": "hsl(310, 90%, 70%)",
      "boxShadow": "0 0 12px hsl(310, 90%, 70% / 0.4), inset 0 0 12px hsl(310, 90%, 70% / 0.15)"
    }
  },
  "UXI8038": {
    "name": "Forest Triple",
    "sunColor": "hsl(110, 80%, 60%)",
    "sunSize": 11,
    "planets": [
      {
        "distance": 18,
        "size": 2.6,
        "speed": 5,
        "color": "hsl(105, 75%, 55%)",
        "delay": 0
      },
      {
        "distance": 26,
        "size": 3,
        "speed": 7,
        "color": "hsl(115, 70%, 50%)",
        "delay": 0.8
      },
      {
        "distance": 35,
        "size": 2.4,
        "speed": 10,
        "color": "hsl(120, 65%, 45%)",
        "delay": 1.6
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(34, 139, 34, 0.15) 0%, transparent 50%), rgba(26, 40, 26, 0.9)",
      "borderColor": "hsl(110, 80%, 60%)",
      "boxShadow": "0 0 12px hsl(110, 80%, 60% / 0.4), inset 0 0 12px hsl(110, 80%, 60% / 0.15)"
    }
  },
  "UXI8039": {
    "name": "Slate Void",
    "sunColor": "hsl(200, 15%, 65%)",
    "sunSize": 13,
    "planets": [],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(112, 128, 144, 0.1) 0%, transparent 50%), rgba(32, 35, 38, 0.9)",
      "borderColor": "hsl(200, 15%, 65%)",
      "boxShadow": "0 0 12px hsl(200, 15%, 65% / 0.4), inset 0 0 12px hsl(200, 15%, 65% / 0.15)"
    }
  },
  "UXI8040": {
    "name": "Scarlet Storm",
    "sunColor": "hsl(0, 100%, 65%)",
    "sunSize": 16,
    "planets": [
      {
        "distance": 28,
        "size": 4.2,
        "speed": 9,
        "color": "hsl(355, 95%, 60%)",
        "delay": 0
      },
      {
        "distance": 38,
        "size": 3.8,
        "speed": 12,
        "color": "hsl(5, 90%, 55%)",
        "delay": 1.5
      }
    ],
    "avatarStyle": {
      "background": "radial-gradient(circle at 30% 30%, rgba(255, 0, 0, 0.2) 0%, transparent 50%), rgba(50, 26, 26, 0.9)",
      "borderColor": "hsl(0, 100%, 65%)",
      "boxShadow": "0 0 12px hsl(0, 100%, 65% / 0.4), inset 0 0 12px hsl(0, 100%, 65% / 0.15)"
    }
  }
};