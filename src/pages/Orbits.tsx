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

import { useState } from "react";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { 
  Users, 
  Clock, 
  ArrowLeft, 
  Check, 
  X, 
  AlertTriangle,
  Circle,
  CalendarClock,
  TrendingDown,
  Radio
} from "lucide-react";
import { cn } from "@/lib/utils";

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

function getHealthBgColor(score: number): string {
  if (score >= 70) return "bg-teal-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-rose-500";
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

function getCadenceLabel(cadence: 'weekly' | 'biweekly' | 'monthly'): string {
  switch (cadence) {
    case 'weekly': return 'Meets Weekly';
    case 'biweekly': return 'Meets Biweekly';
    case 'monthly': return 'Meets Monthly';
  }
}

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * OrbitCard - Dashboard view of a single orbit
 * Shows key metrics at a glance: health, status, last interaction
 */
function OrbitCard({ 
  orbit, 
  onClick 
}: { 
  orbit: Orbit; 
  onClick: () => void;
}) {
  const daysSinceInteraction = differenceInDays(new Date(), orbit.lastInteraction);
  const isWarning = daysSinceInteraction > 14;

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:scale-[1.02]",
        "glass-morphism",
        getHealthBorderColor(orbit.healthScore)
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        {/* Orbit Name & Purpose */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-foreground">{orbit.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{orbit.purpose}</p>
        </div>

        {/* Metrics Row */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Badge variant="outline" className="bg-muted/30">
            <Users className="h-3 w-3 mr-1" />
            {orbit.members.length} members
          </Badge>
          <Badge variant="outline" className={getStatusColor(orbit.userStatus)}>
            {orbit.userStatus.charAt(0).toUpperCase() + orbit.userStatus.slice(1)}
          </Badge>
        </div>

        {/* Health Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Orbit Health</span>
            <span className={cn("text-sm font-mono font-medium", getHealthColor(orbit.healthScore))}>
              {orbit.healthScore}
            </span>
          </div>
          <Progress 
            value={orbit.healthScore} 
            className="h-1.5" 
          />
        </div>

        {/* Last Interaction */}
        <div className={cn(
          "flex items-center gap-2 text-sm",
          isWarning ? "text-rose-400" : "text-muted-foreground"
        )}>
          <Clock className="h-4 w-4" />
          <span>
            Last met {formatDistanceToNow(orbit.lastInteraction, { addSuffix: true })}
          </span>
          {isWarning && <AlertTriangle className="h-4 w-4" />}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * MemberRow - Individual member in the detail view
 * Shows status, last attendance, and attendance rate
 */
function MemberRow({ member }: { member: OrbitMember }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-3">
        {/* Initials Avatar */}
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
          member.status === 'active' ? "bg-teal-500/20 text-teal-400" :
          member.status === 'drifting' ? "bg-rose-500/20 text-rose-400" :
          "bg-muted text-muted-foreground"
        )}>
          {member.initials}
        </div>
        <div>
          <p className="font-medium text-foreground">{member.name}</p>
          <p className="text-xs text-muted-foreground">
            Last attended: {format(member.lastAttended, "MMM d, yyyy")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* Attendance Rate Mini Bar */}
        <div className="w-16">
          <Progress value={member.attendanceRate} className="h-1" />
          <p className="text-xs text-muted-foreground text-right mt-0.5">{member.attendanceRate}%</p>
        </div>
        <Badge variant="outline" className={getStatusColor(member.status)}>
          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
        </Badge>
      </div>
    </div>
  );
}

/**
 * MeetingCard - Display a single meeting (upcoming or past)
 * Shows date, attendance grid, and notes
 */
function MeetingCard({ 
  meeting, 
  members,
  isUpcoming,
  onRsvp,
  userRsvp
}: { 
  meeting: OrbitMeeting; 
  members: OrbitMember[];
  isUpcoming: boolean;
  onRsvp?: (status: 'attending' | 'cant-attend' | 'late') => void;
  userRsvp?: 'attending' | 'cant-attend' | 'late' | null;
}) {
  const getMemberById = (id: string) => members.find(m => m.id === id);

  return (
    <div className={cn(
      "p-4 rounded-lg border",
      isUpcoming ? "border-primary/30 bg-primary/5" : "border-border/30 bg-muted/10"
    )}>
      {/* Date & Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{format(meeting.date, "EEEE, MMM d, yyyy")}</span>
        </div>
        {isUpcoming && (
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            In {formatDistanceToNow(meeting.date)}
          </Badge>
        )}
      </div>

      {/* RSVP Buttons for Upcoming Meetings */}
      {isUpcoming && onRsvp && (
        <div className="flex gap-2 mb-4">
          <Button 
            size="sm" 
            variant={userRsvp === 'attending' ? 'default' : 'outline'}
            onClick={() => onRsvp('attending')}
            className="flex-1"
          >
            <Check className="h-4 w-4 mr-1" />
            Attending
          </Button>
          <Button 
            size="sm" 
            variant={userRsvp === 'cant-attend' ? 'destructive' : 'outline'}
            onClick={() => onRsvp('cant-attend')}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-1" />
            Can't Attend
          </Button>
          <Button 
            size="sm" 
            variant={userRsvp === 'late' ? 'secondary' : 'outline'}
            onClick={() => onRsvp('late')}
            className="flex-1"
          >
            <Clock className="h-4 w-4 mr-1" />
            Late
          </Button>
        </div>
      )}

      {/* Attendance Grid for Completed Meetings */}
      {!isUpcoming && meeting.attendees.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {meeting.attendees.map((attendee) => {
            const member = getMemberById(attendee.memberId);
            if (!member) return null;
            return (
              <div 
                key={attendee.memberId}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded text-xs",
                  attendee.status === 'present' ? "bg-teal-500/20 text-teal-400" :
                  attendee.status === 'late' ? "bg-amber-500/20 text-amber-400" :
                  "bg-rose-500/20 text-rose-400"
                )}
              >
                <span>{member.initials}</span>
                {attendee.status === 'present' && <Check className="h-3 w-3" />}
                {attendee.status === 'missed' && <X className="h-3 w-3" />}
                {attendee.status === 'late' && <Clock className="h-3 w-3" />}
              </div>
            );
          })}
        </div>
      )}

      {/* Meeting Notes */}
      {meeting.notes.length > 0 && (
        <div className="space-y-2 mt-3 pt-3 border-t border-border/30">
          {meeting.notes.map((note, idx) => {
            const member = getMemberById(note.memberId);
            return (
              <div key={idx} className="text-sm">
                <span className="text-muted-foreground">{member?.initials}: </span>
                <span className="text-foreground/80">{note.content}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * OrbitDetailView - Expanded view of a single orbit
 * Shows full member list, meetings, and status updates
 */
function OrbitDetailView({ 
  orbit, 
  onBack 
}: { 
  orbit: Orbit; 
  onBack: () => void;
}) {
  const [userRsvp, setUserRsvp] = useState<'attending' | 'cant-attend' | 'late' | null>(null);
  const [meetingNote, setMeetingNote] = useState("");

  const upcomingMeeting = orbit.meetings.find(m => m.status === 'upcoming');
  const pastMeetings = orbit.meetings.filter(m => m.status === 'completed').slice(0, 5);

  // Determine warning messages
  const warnings: string[] = [];
  if (orbit.userStatus === 'drifting') {
    warnings.push("You are drifting from this Orbit");
  }
  if (orbit.healthScore < 50) {
    warnings.push("Orbit health has declined");
  }
  const driftingMembers = orbit.members.filter(m => m.status === 'drifting' || m.status === 'inactive');
  if (driftingMembers.length >= 2) {
    warnings.push("Absence increases distance");
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orbits
      </Button>

      {/* Orbit Profile Header */}
      <Card className={cn("glass-morphism", getHealthBorderColor(orbit.healthScore))}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Left: Name, Purpose, Cadence */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">{orbit.name}</h2>
              <p className="text-muted-foreground mb-4">{orbit.purpose}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className="bg-muted/30">
                  <CalendarClock className="h-3 w-3 mr-1" />
                  {getCadenceLabel(orbit.cadence)}
                </Badge>
                <Badge variant="outline" className={getStatusColor(orbit.userStatus)}>
                  Your Status: {orbit.userStatus.charAt(0).toUpperCase() + orbit.userStatus.slice(1)}
                </Badge>
                {orbit.trackingActive && (
                  <Badge variant="outline" className="bg-teal-500/20 text-teal-400 border-teal-500/30">
                    <Radio className="h-3 w-3 mr-1" />
                    Tracking Active
                  </Badge>
                )}
              </div>
            </div>

            {/* Right: Health Indicator */}
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-24 h-24 rounded-full border-4 flex items-center justify-center",
                orbit.healthScore >= 70 ? "border-teal-500" :
                orbit.healthScore >= 40 ? "border-amber-500" :
                "border-rose-500"
              )}>
                <div className="text-center">
                  <span className={cn("text-3xl font-bold font-mono", getHealthColor(orbit.healthScore))}>
                    {orbit.healthScore}
                  </span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide mt-2">Health</span>
            </div>
          </div>

          {/* Warning Messages */}
          {warnings.length > 0 && (
            <div className="mt-6 space-y-2">
              {warnings.map((warning, idx) => (
                <div key={idx} className="flex items-center gap-2 text-rose-400 text-sm">
                  <TrendingDown className="h-4 w-4" />
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inner Circle Members */}
      <Card className="glass-morphism border-border/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Circle className="h-4 w-4 text-primary" />
            Inner Circle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            {orbit.members.map((member) => (
              <MemberRow key={member.id} member={member} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meeting Cycle Section */}
      <Card className="glass-morphism border-border/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-primary" />
            Meeting Cycle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Next Scheduled Meeting */}
          {upcomingMeeting && (
            <div>
              <h4 className="text-sm text-muted-foreground uppercase tracking-wide mb-3">Next Meeting</h4>
              <MeetingCard 
                meeting={upcomingMeeting} 
                members={orbit.members}
                isUpcoming={true}
                onRsvp={setUserRsvp}
                userRsvp={userRsvp}
              />

              {/* Status Update / Note Input */}
              <div className="mt-4">
                <label className="text-sm text-muted-foreground block mb-2">
                  Meeting Note (optional, max 140 characters)
                </label>
                <Textarea 
                  value={meetingNote}
                  onChange={(e) => setMeetingNote(e.target.value.slice(0, 140))}
                  placeholder="A brief note tied to this meeting..."
                  className="resize-none"
                  rows={2}
                />
                <div className="text-xs text-muted-foreground text-right mt-1">
                  {meetingNote.length}/140
                </div>
              </div>
            </div>
          )}

          {/* Past Meetings */}
          {pastMeetings.length > 0 && (
            <div>
              <h4 className="text-sm text-muted-foreground uppercase tracking-wide mb-3 mt-6">Past Meetings</h4>
              <div className="space-y-3">
                {pastMeetings.map((meeting) => (
                  <MeetingCard 
                    key={meeting.id}
                    meeting={meeting} 
                    members={orbit.members}
                    isUpcoming={false}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function Orbits() {
  const [selectedOrbit, setSelectedOrbit] = useState<Orbit | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-5xl px-4 py-8 pb-24">
        {selectedOrbit ? (
          // Detail View
          <OrbitDetailView 
            orbit={selectedOrbit} 
            onBack={() => setSelectedOrbit(null)} 
          />
        ) : (
          // Dashboard View
          <>
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Your Orbits</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Orbits track recurring commitments with your inner circles. 
                Each orbit monitors consistency, attendance, and relational momentum over time.
              </p>
              <Badge variant="outline" className="mt-4 bg-muted/30">
                {MOCK_ORBITS.length} Active Orbits
              </Badge>
            </div>

            {/* Orbits Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {MOCK_ORBITS.map((orbit) => (
                <OrbitCard 
                  key={orbit.id}
                  orbit={orbit}
                  onClick={() => setSelectedOrbit(orbit)}
                />
              ))}
            </div>

            {/* Empty State (if needed) */}
            {MOCK_ORBITS.length === 0 && (
              <Card className="glass-morphism border-dashed">
                <CardContent className="p-12 text-center">
                  <Circle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Orbits Yet</h3>
                  <p className="text-muted-foreground">
                    Create your first orbit to begin tracking relational momentum.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
