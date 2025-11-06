import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Activity, Zap, Globe, Target, CheckCircle2 } from "lucide-react";
import { DotConnectorHeader } from "@/components/layout/DotConnectorHeader";
import NetworkWorldMap from "@/components/p8/NetworkWorldMap";
import LocationWorldMap from "@/components/p8/LocationWorldMap";
import EventsCard from "@/components/p8/EventsCard";
const P8Dashboard = () => {
  const metrics = [{
    label: "Total Members",
    value: "1,247",
    change: "+12%",
    icon: Users,
    color: "text-blue-500"
  }, {
    label: "Engagement Rate",
    value: "68%",
    change: "+5%",
    icon: Activity,
    color: "text-green-500"
  }, {
    label: "Active Regions",
    value: "8",
    change: "+2",
    icon: Globe,
    color: "text-purple-500"
  }, {
    label: "Integrations",
    value: "6",
    change: "+3",
    icon: Zap,
    color: "text-orange-500"
  }, {
    label: "Growth Rate",
    value: "+32%",
    change: "+8%",
    icon: TrendingUp,
    color: "text-cyan-500"
  }, {
    label: "Milestones",
    value: "4/10",
    change: "+1",
    icon: Target,
    color: "text-pink-500"
  }];
  const milestones = [{
    id: 1,
    title: "Define target audience",
    completed: true
  }, {
    id: 2,
    title: "Set up core integrations",
    completed: true
  }, {
    id: 3,
    title: "Launch first event",
    completed: false
  }, {
    id: 4,
    title: "Reach 100 members",
    completed: false
  }];
  const recentActivity = [{
    action: "New member joined",
    time: "2 min ago",
    type: "member"
  }, {
    action: "Discord integrated",
    time: "1 hour ago",
    type: "integration"
  }, {
    action: "Event created",
    time: "3 hours ago",
    type: "event"
  }, {
    action: "Milestone completed",
    time: "1 day ago",
    type: "milestone"
  }];
  const demographics = [{
    label: "Age 18-24",
    value: 35,
    color: "bg-blue-500"
  }, {
    label: "Age 25-34",
    value: 45,
    color: "bg-green-500"
  }, {
    label: "Age 35-44",
    value: 15,
    color: "bg-purple-500"
  }, {
    label: "Age 45+",
    value: 5,
    color: "bg-orange-500"
  }];
  return <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <DotConnectorHeader />
      <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6 animate-fade-in">

        {/* Network World Map */}
        <NetworkWorldMap />

        {/* Location World Map */}
        <LocationWorldMap />

        {/* Events Card */}
        <EventsCard />
      </div>
    </div>;
};
export default P8Dashboard;