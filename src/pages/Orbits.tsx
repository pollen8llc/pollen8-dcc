/**
 * Orbits - Recurring Social Commitment System
 * 
 * Orbits are NOT group chats. They are tracking systems for small inner circles
 * that meet on a recurring cadence. The system monitors consistency, attendance,
 * and relational momentum over time.
 * 
 * Visual language emphasizes: Presence, Drift, Consistency, Momentum
 * No social-media patterns. No chat feeds. No emojis.
 */

import { formatDistanceToNow, differenceInDays, format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Clock, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface OrbitMember {
  id: string;
  name: string;
  initials: string;
  status: 'active' | 'drifting' | 'inactive';
  lastAttended: Date;
  attendanceRate: number; // 0-100
}

interface MeetingAttendee {
  memberId: string;
  status: 'present' | 'missed' | 'late';
}

interface MeetingNote {
  memberId: string;
  content: string;
}

interface OrbitMeeting {
  id: string;
  date: Date;
  status: 'upcoming' | 'completed';
  attendees: MeetingAttendee[];
  notes: MeetingNote[];
}

interface Orbit {
  id: string;
  name: string;
  purpose: string;
  cadence: 'weekly' | 'biweekly' | 'monthly';
  members: OrbitMember[];
  meetings: OrbitMeeting[];
  healthScore: number; // 0-100
  userStatus: 'core' | 'peripheral' | 'drifting';
  lastInteraction: Date;
  trackingActive: boolean;
}

// ============================================================================
// MOCK DATA - Hardcoded for demonstration
// ============================================================================

const MOCK_ORBITS: Orbit[] = [
  {
    id: "orbit-1",
    name: "Morning Run Crew",
    purpose: "Weekly accountability for fitness and mental clarity",
    cadence: "weekly",
    healthScore: 85,
    userStatus: "core",
    lastInteraction: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    trackingActive: true,
    members: [
      { id: "m1", name: "You", initials: "ME", status: "active", lastAttended: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), attendanceRate: 92 },
      { id: "m2", name: "Sarah Chen", initials: "SC", status: "active", lastAttended: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), attendanceRate: 88 },
      { id: "m3", name: "Marcus Webb", initials: "MW", status: "active", lastAttended: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), attendanceRate: 75 },
    ],
    meetings: [
      { 
        id: "meet-1a", 
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), 
        status: "upcoming", 
        attendees: [],
        notes: []
      },
      { 
        id: "meet-1b", 
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 
        status: "completed", 
        attendees: [
          { memberId: "m1", status: "present" },
          { memberId: "m2", status: "present" },
          { memberId: "m3", status: "missed" },
        ],
        notes: [
          { memberId: "m1", content: "Good pace today. Feeling stronger each week." }
        ]
      },
      { 
        id: "meet-1c", 
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), 
        status: "completed", 
        attendees: [
          { memberId: "m1", status: "present" },
          { memberId: "m2", status: "present" },
          { memberId: "m3", status: "present" },
        ],
        notes: []
      },
    ],
  },
  {
    id: "orbit-2",
    name: "Accountability Pod",
    purpose: "Biweekly check-ins on personal and professional goals",
    cadence: "biweekly",
    healthScore: 62,
    userStatus: "peripheral",
    lastInteraction: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    trackingActive: true,
    members: [
      { id: "m4", name: "You", initials: "ME", status: "drifting", lastAttended: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000), attendanceRate: 58 },
      { id: "m5", name: "James Liu", initials: "JL", status: "active", lastAttended: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), attendanceRate: 85 },
      { id: "m6", name: "Priya Sharma", initials: "PS", status: "active", lastAttended: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), attendanceRate: 92 },
      { id: "m7", name: "David Park", initials: "DP", status: "drifting", lastAttended: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), attendanceRate: 42 },
    ],
    meetings: [
      { 
        id: "meet-2a", 
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 
        status: "upcoming", 
        attendees: [],
        notes: []
      },
      { 
        id: "meet-2b", 
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), 
        status: "completed", 
        attendees: [
          { memberId: "m4", status: "missed" },
          { memberId: "m5", status: "present" },
          { memberId: "m6", status: "present" },
          { memberId: "m7", status: "missed" },
        ],
        notes: [
          { memberId: "m5", content: "Missing half the group. Need to address this." }
        ]
      },
    ],
  },
  {
    id: "orbit-3",
    name: "Old College Friends",
    purpose: "Monthly connection to maintain long-term friendships",
    cadence: "monthly",
    healthScore: 38,
    userStatus: "drifting",
    lastInteraction: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    trackingActive: true,
    members: [
      { id: "m8", name: "You", initials: "ME", status: "drifting", lastAttended: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), attendanceRate: 35 },
      { id: "m9", name: "Alex Rivera", initials: "AR", status: "drifting", lastAttended: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), attendanceRate: 40 },
      { id: "m10", name: "Jordan Ellis", initials: "JE", status: "inactive", lastAttended: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), attendanceRate: 20 },
      { id: "m11", name: "Taylor Kim", initials: "TK", status: "active", lastAttended: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), attendanceRate: 75 },
    ],
    meetings: [
      { 
        id: "meet-3a", 
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 
        status: "upcoming", 
        attendees: [],
        notes: []
      },
      { 
        id: "meet-3b", 
        date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), 
        status: "completed", 
        attendees: [
          { memberId: "m8", status: "late" },
          { memberId: "m9", status: "present" },
          { memberId: "m10", status: "missed" },
          { memberId: "m11", status: "present" },
        ],
        notes: []
      },
      { 
        id: "meet-3c", 
        date: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000), 
        status: "completed", 
        attendees: [
          { memberId: "m8", status: "missed" },
          { memberId: "m9", status: "missed" },
          { memberId: "m10", status: "missed" },
          { memberId: "m11", status: "present" },
        ],
        notes: [
          { memberId: "m11", content: "Only one here. This orbit is losing momentum." }
        ]
      },
    ],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getOrbitColor(level: number) {
  if (level === 1) return "#22c55e"; // Inner circle - Green
  if (level === 2) return "#3b82f6"; // Middle circle - Blue
  return "#6b7280"; // Outer circle - Gray
}

function getHealthColor(score: number): string {
  if (score >= 70) return "text-teal-400";
  if (score >= 40) return "text-amber-400";
  return "text-rose-400";
}

function getHealthBorderColor(score: number): string {
  if (score >= 70) return "border-teal-500/30";
  if (score >= 40) return "border-amber-500/30";
  return "border-rose-500/30";
}

function getStatusColor(status: 'core' | 'peripheral' | 'drifting' | 'active' | 'inactive'): string {
  switch (status) {
    case 'core':
    case 'active':
      return "bg-teal-500/20 text-teal-400 border-teal-500/30";
    case 'peripheral':
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case 'drifting':
    case 'inactive':
      return "bg-rose-500/20 text-rose-400 border-rose-500/30";
  }
}

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * MinimalOrbitCanvas - Interactive canvas visualization for orbit card
 */
const MinimalOrbitCanvas = ({ 
  orbit, 
  onMemberClick,
  onHoverChange,
  isPaused
}: { 
  orbit: Orbit; 
  onMemberClick?: (member: OrbitMember) => void;
  onHoverChange?: (member: OrbitMember | null) => void;
  isPaused?: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const angleOffsetRef = useRef<number>(0);
  const pulseRef = useRef<number>(0);
  const nodesRef = useRef<Array<{ member: OrbitMember; x: number; y: number; radius: number }>>([]);
  const [hoveredNode, setHoveredNode] = useState<OrbitMember | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) * 0.4;

      // Draw orbit circles
      const orbitRadii = [
        maxRadius * 0.4,
        maxRadius * 0.65,
        maxRadius * 0.9,
      ];

      orbitRadii.forEach((radius, i) => {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${getOrbitColor(i + 1)}40`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 8]);
    ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw center node with pulse
    const baseRadius = 8;
      const pulseAmount = Math.sin(pulseRef.current) * 2;
    const radius = baseRadius + pulseAmount;

    const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius * 3
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 3, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

      // Store and draw member nodes
      nodesRef.current = [];
      orbit.members.forEach((member, index) => {
        let orbitLevel;
        switch (member.status) {
          case "active":
            orbitLevel = 0;
            break;
          case "drifting":
            orbitLevel = 1;
            break;
          default:
            orbitLevel = 2;
        }

        const nodeRadius = orbitRadii[orbitLevel];
        const angle = (index / orbit.members.length) * 2 * Math.PI + angleOffsetRef.current * (3 - orbitLevel);

        const x = centerX + nodeRadius * Math.cos(angle);
        const y = centerY + nodeRadius * Math.sin(angle);
        const nodeSize = hoveredNode?.id === member.id ? 14 : 12;

        // Store node position for interaction
        nodesRef.current.push({ member, x, y, radius: nodeSize });

        // Hover glow
        if (hoveredNode?.id === member.id) {
          const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, nodeSize * 2);
          glowGradient.addColorStop(0, `${getOrbitColor(orbitLevel + 1)}60`);
          glowGradient.addColorStop(1, "transparent");
      ctx.beginPath();
          ctx.arc(x, y, nodeSize * 2, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();
    }

        // Draw node
    ctx.beginPath();
        ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = getOrbitColor(orbitLevel + 1);
    ctx.fill();

        // Draw initials
    ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
        ctx.fillText(member.initials, x, y);
      });
    };

    const animate = (currentTime: number) => {
      if (!isPaused) {
        angleOffsetRef.current += 0.0005; // Quarter of original speed
      }
      pulseRef.current += 0.005;
      draw();
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate(0);

    // Mouse move handler for hover
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const hovered = nodesRef.current.find(node => {
        const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
        return distance <= node.radius + 5;
      });

      const member = hovered?.member || null;
      setHoveredNode(member);
      
      if (hovered) {
        setTooltipPos({ x: e.clientX, y: e.clientY });
      } else {
        setTooltipPos(null);
      }
      
      if (onHoverChange) {
        onHoverChange(member);
      }
      
      canvas.style.cursor = hovered ? 'pointer' : 'default';
    };
    
    // Mouse leave handler
    const handleMouseLeave = () => {
      setHoveredNode(null);
      setTooltipPos(null);
      if (onHoverChange) {
        onHoverChange(null);
      }
    };

    // Click handler
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const clicked = nodesRef.current.find(node => {
        const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
        return distance <= node.radius + 5;
      });

      if (clicked && onMemberClick) {
        onMemberClick(clicked.member);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
    };
  }, [orbit, hoveredNode, onMemberClick, onHoverChange, isPaused]);

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full absolute inset-0 cursor-pointer"
        style={{ background: 'transparent' }}
      />
      {/* Tooltip - Wider and Rectangular */}
      {hoveredNode && tooltipPos && (
        <div
          className="fixed z-50 bg-background/95 backdrop-blur-md border border-border rounded-lg p-4 shadow-xl pointer-events-none min-w-[320px]"
          style={{
            left: `${Math.min(tooltipPos.x + 15, window.innerWidth - 340)}px`,
            top: `${Math.max(tooltipPos.y - 10, 10)}px`,
            transform: tooltipPos.y < 150 ? 'translateY(0)' : 'translateY(-100%)'
          }}
        >
          <div className="flex items-center gap-4">
        <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0",
              hoveredNode.status === 'active' ? "bg-teal-500/20 text-teal-400" :
              hoveredNode.status === 'drifting' ? "bg-rose-500/20 text-rose-400" :
          "bg-muted text-muted-foreground"
        )}>
              {hoveredNode.initials}
        </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-foreground truncate">{hoveredNode.name}</p>
                <Badge variant="outline" className={cn("text-xs flex-shrink-0", getStatusColor(hoveredNode.status))}>
                  {hoveredNode.status}
                </Badge>
        </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground whitespace-nowrap">
                <span>Last: {format(hoveredNode.lastAttended, "MMM d, yyyy")}</span>
                <span>•</span>
                <span>Attendance: {hoveredNode.attendanceRate}%</span>
      </div>
        </div>
      </div>
    </div>
      )}
    </>
  );
};

/**
 * RotatingStatus - Rotates between last met and upcoming meeting status
 */
function RotatingStatus({ 
  orbit, 
  isPaused 
}: { 
  orbit: Orbit; 
  isPaused: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const daysSinceInteraction = differenceInDays(new Date(), orbit.lastInteraction);
  const isWarning = daysSinceInteraction > 14;
  const upcomingMeetings = orbit.meetings.filter(m => m.status === 'upcoming');
  const nextMeeting = upcomingMeetings[0];

  const statuses = [
    {
      label: "Last met",
      value: formatDistanceToNow(orbit.lastInteraction, { addSuffix: true }),
      icon: Clock,
      warning: isWarning
    },
    ...(nextMeeting ? [{
      label: "Next meeting",
      value: formatDistanceToNow(nextMeeting.date),
      icon: Clock,
      warning: false
    }] : [])
  ];

  useEffect(() => {
    if (isPaused || statuses.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % statuses.length);
    }, 3000); // Switch every 3 seconds

    return () => clearInterval(interval);
  }, [isPaused, statuses.length]);

  if (statuses.length === 0) return null;

  const currentStatus = statuses[currentIndex];
  const Icon = currentStatus.icon;

            return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="bg-background/90 backdrop-blur-md border border-border/50 rounded-lg px-2 md:px-4 py-1.5 md:py-2"
      >
        <div className={cn(
          "flex items-center gap-1.5 md:gap-2 text-xs md:text-sm",
          currentStatus.warning ? "text-rose-400" : "text-muted-foreground"
        )}>
          <Icon className="h-3 w-3 md:h-4 md:w-4" />
          <span className="font-medium">{currentStatus.label}:</span>
          <span>{currentStatus.value}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * FullScreenOrbitCard - Full screen card for each orbit
 */
function FullScreenOrbitCard({ 
  orbit, 
  onViewDetails,
  onHoverChange
}: { 
  orbit: Orbit; 
  onViewDetails: () => void;
  onHoverChange?: (member: OrbitMember | null) => void;
}) {
  const [hoveredMember, setHoveredMember] = useState<OrbitMember | null>(null);
  
  const handleHoverChange = (member: OrbitMember | null) => {
    setHoveredMember(member);
    if (onHoverChange) {
      onHoverChange(member);
    }
  };
  const daysSinceInteraction = differenceInDays(new Date(), orbit.lastInteraction);
  const isWarning = daysSinceInteraction > 14;
  const upcomingMeetings = orbit.meetings.filter(m => m.status === 'upcoming').length;

  const handleMemberClick = (member: OrbitMember) => {
    // Could navigate to member profile or show tooltip
    console.log('Clicked member:', member.name);
  };

  return (
    <div className={cn(
      "relative w-full h-full flex flex-col",
      "bg-gradient-to-br from-[#0a0a0f] via-[#0a0a0f] to-[#1a1a2e]"
    )}>
      {/* Interactive Canvas - Full Screen */}
      <div className="absolute inset-0 z-0">
        <MinimalOrbitCanvas 
          orbit={orbit} 
          onMemberClick={handleMemberClick}
          onHoverChange={handleHoverChange}
          isPaused={!!hoveredMember}
        />
            </div>

      {/* Top Edge - Minimal Header */}
      <div className="absolute top-0 left-0 right-0 z-10 px-6 py-4">
        <div className="flex items-start gap-4">
          {/* Left: Health Score - Large to match header height */}
              <div className={cn(
            "w-16 h-16 rounded-full border-4 flex items-center justify-center flex-shrink-0",
                orbit.healthScore >= 70 ? "border-teal-500" :
                orbit.healthScore >= 40 ? "border-amber-500" :
                "border-rose-500"
              )}>
            <span className={cn("text-2xl font-bold font-mono", getHealthColor(orbit.healthScore))}>
                    {orbit.healthScore}
                  </span>
          </div>

          {/* Right: Title, Subtitle, and Badges */}
          <div className="flex-1 min-w-0">
            {/* Title & Subtitle - Minimal */}
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-foreground truncate">
                {orbit.name}
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                {orbit.purpose}
              </p>
                </div>

            {/* Badges Row - Below Subtitle */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={cn("text-xs px-2 py-1", getStatusColor(orbit.userStatus))}>
                {orbit.userStatus}
              </Badge>
              <Badge variant="outline" className="text-xs px-2 py-1 bg-muted/30">
            <Users className="h-3 w-3 mr-1" />
                {orbit.members.length}
          </Badge>
              {isWarning && (
                <Badge variant="outline" className="text-xs px-2 py-1 bg-rose-500/20 text-rose-400 border-rose-500/30">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Attention
          </Badge>
              )}
          </div>
                </div>
              </div>
            </div>

      {/* Bottom Edge - Info Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-3 md:px-6 py-2 md:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Rotating Status - Smaller on Mobile */}
          <div className="text-xs md:text-sm flex-shrink min-w-0">
            <RotatingStatus orbit={orbit} isPaused={!!hoveredMember} />
          </div>

          {/* Right: View Details Button - Smaller on Mobile */}
          <Button 
            size="sm"
            onClick={onViewDetails}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg border-2 border-primary/20 text-xs md:text-sm px-3 md:px-6 py-2 md:py-2 h-8 md:h-10 flex-shrink-0"
          >
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">Details</span>
            <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}



// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function Orbits() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [hoveredMember, setHoveredMember] = useState<OrbitMember | null>(null);

  const currentOrbit = MOCK_ORBITS[currentIndex];

  const goToNext = () => {
    if (currentIndex < MOCK_ORBITS.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setDirection(-1);
        setCurrentIndex(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < MOCK_ORBITS.length - 1) {
        setDirection(1);
        setCurrentIndex(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      goToPrevious();
    } else if (info.offset.x < -threshold) {
      goToNext();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  if (MOCK_ORBITS.length === 0) {
  return (
      <div className="h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h3 className="text-2xl font-medium text-foreground mb-2">No Orbits Yet</h3>
            <p className="text-muted-foreground">
              Create your first orbit to begin tracking relational momentum.
            </p>
            </div>
            </div>
    </div>
  );
}

  return (
    <div className="h-screen h-[100dvh] bg-[#0a0a0f] overflow-hidden flex flex-col">
      <Navbar />
      
      {/* Main Slider Container */}
      <div className="flex-1 relative min-h-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 w-full h-full"
          >
            <FullScreenOrbitCard 
              orbit={currentOrbit}
              onViewDetails={() => navigate(`/orbits/${currentOrbit.id}`)}
              onHoverChange={setHoveredMember}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows - Hide when tooltip is visible */}
        {!hoveredMember && (
          <div className="absolute inset-0 flex items-center justify-between pointer-events-none z-20 px-4 md:px-8">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-14 w-14 rounded-full bg-background/95 backdrop-blur-md border-2 border-primary/30",
                "pointer-events-auto hover:bg-primary/10 hover:border-primary/50",
                "shadow-lg hover:shadow-xl transition-all",
                currentIndex === 0 && "opacity-30 cursor-not-allowed"
              )}
              onClick={goToPrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-7 w-7 text-primary" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-14 w-14 rounded-full bg-background/95 backdrop-blur-md border-2 border-primary/30",
                "pointer-events-auto hover:bg-primary/10 hover:border-primary/50",
                "shadow-lg hover:shadow-xl transition-all",
                currentIndex === MOCK_ORBITS.length - 1 && "opacity-30 cursor-not-allowed"
              )}
              onClick={goToNext}
              disabled={currentIndex === MOCK_ORBITS.length - 1}
            >
              <ChevronRight className="h-7 w-7 text-primary" />
            </Button>
          </div>
        )}

        {/* Indicator Dots - Hidden on Mobile */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 hidden md:flex">
          {MOCK_ORBITS.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "w-8 bg-primary" 
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to orbit ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
