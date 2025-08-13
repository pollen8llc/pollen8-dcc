import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Building2, 
  Heart, 
  Briefcase, 
  Mail, 
  TrendingUp,
  UserCheck,
  Globe,
  Lock,
  Tag,
  HelpCircle,
  BarChart3,
  Quote,
  CheckCircle2,
  Clock,
  Send
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { getPlatformMetrics, getMetricsChartData, PlatformMetrics } from "@/services/metricsService";

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = "text-primary", 
  description 
}) => (
  <Card className="relative overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`${color} opacity-80`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

const MetricsLoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
);

const AdminMetrics = () => {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['platform-metrics'],
    queryFn: getPlatformMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['metrics-chart-data'],
    queryFn: getMetricsChartData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (metricsLoading || chartLoading) {
    return <MetricsLoadingSkeleton />;
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Failed to load metrics data. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartConfig = {
    users: {
      label: "Users",
      color: "hsl(var(--chart-1))",
    },
    posts: {
      label: "Posts",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="space-y-6">
      {/* User Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Users className="mr-2 h-5 w-5 text-primary" />
          User Metrics
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <MetricCard
            title="Total Users"
            value={metrics.users.total}
            icon={<Users className="h-4 w-4" />}
            color="text-blue-500"
          />
          <MetricCard
            title="Active Users"
            value={metrics.users.activeUsers}
            icon={<UserCheck className="h-4 w-4" />}
            color="text-green-500"
            description="Last 30 days"
          />
          <MetricCard
            title="Admins"
            value={metrics.users.admins}
            icon={<Users className="h-4 w-4" />}
            color="text-red-500"
          />
          <MetricCard
            title="Organizers"
            value={metrics.users.organizers}
            icon={<Building2 className="h-4 w-4" />}
            color="text-purple-500"
          />
          <MetricCard
            title="Service Providers"
            value={metrics.users.serviceProviders}
            icon={<Briefcase className="h-4 w-4" />}
            color="text-orange-500"
          />
          <MetricCard
            title="Members"
            value={metrics.users.members}
            icon={<Users className="h-4 w-4" />}
            color="text-cyan-500"
          />
        </div>
      </div>

      {/* Content Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          Content Metrics
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          <MetricCard
            title="Total Posts"
            value={metrics.content.totalPosts}
            icon={<FileText className="h-4 w-4" />}
            color="text-blue-500"
          />
          <MetricCard
            title="Articles"
            value={metrics.content.articles}
            icon={<FileText className="h-4 w-4" />}
            color="text-green-500"
          />
          <MetricCard
            title="Questions"
            value={metrics.content.questions}
            icon={<HelpCircle className="h-4 w-4" />}
            color="text-yellow-500"
          />
          <MetricCard
            title="Polls"
            value={metrics.content.polls}
            icon={<BarChart3 className="h-4 w-4" />}
            color="text-purple-500"
          />
          <MetricCard
            title="Quotes"
            value={metrics.content.quotes}
            icon={<Quote className="h-4 w-4" />}
            color="text-pink-500"
          />
          <MetricCard
            title="Comments"
            value={metrics.content.totalComments}
            icon={<MessageSquare className="h-4 w-4" />}
            color="text-orange-500"
          />
          <MetricCard
            title="Tags"
            value={metrics.content.totalTags}
            icon={<Tag className="h-4 w-4" />}
            color="text-cyan-500"
          />
        </div>
      </div>

      {/* Community & Engagement Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Building2 className="mr-2 h-5 w-5 text-primary" />
            Communities
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="Total Communities"
              value={metrics.communities.total}
              icon={<Building2 className="h-4 w-4" />}
              color="text-blue-500"
            />
            <MetricCard
              title="Public"
              value={metrics.communities.public}
              icon={<Globe className="h-4 w-4" />}
              color="text-green-500"
            />
            <MetricCard
              title="Private"
              value={metrics.communities.private}
              icon={<Lock className="h-4 w-4" />}
              color="text-orange-500"
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Heart className="mr-2 h-5 w-5 text-primary" />
            Engagement
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <MetricCard
              title="Total Votes"
              value={metrics.engagement.totalVotes}
              icon={<TrendingUp className="h-4 w-4" />}
              color="text-red-500"
            />
            <MetricCard
              title="Saved Articles"
              value={metrics.engagement.savedArticles}
              icon={<Heart className="h-4 w-4" />}
              color="text-pink-500"
            />
          </div>
        </div>
      </div>

      {/* Modul8 Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Briefcase className="mr-2 h-5 w-5 text-primary" />
          Modul8 Platform
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <MetricCard
            title="Service Requests"
            value={metrics.modul8.totalServiceRequests}
            icon={<FileText className="h-4 w-4" />}
            color="text-blue-500"
          />
          <MetricCard
            title="Active Proposals"
            value={metrics.modul8.activeProposals}
            icon={<Clock className="h-4 w-4" />}
            color="text-yellow-500"
          />
          <MetricCard
            title="Completed Deals"
            value={metrics.modul8.completedDeals}
            icon={<CheckCircle2 className="h-4 w-4" />}
            color="text-green-500"
          />
          <MetricCard
            title="Service Providers"
            value={metrics.modul8.serviceProviders}
            icon={<Briefcase className="h-4 w-4" />}
            color="text-purple-500"
          />
          <MetricCard
            title="Organizers"
            value={metrics.modul8.organizers}
            icon={<Building2 className="h-4 w-4" />}
            color="text-cyan-500"
          />
        </div>
      </div>

      {/* REL8T Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Mail className="mr-2 h-5 w-5 text-primary" />
          REL8T Platform
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Contacts"
            value={metrics.rel8t.totalContacts}
            icon={<Users className="h-4 w-4" />}
            color="text-blue-500"
          />
          <MetricCard
            title="Active Triggers"
            value={metrics.rel8t.activeTriggers}
            icon={<TrendingUp className="h-4 w-4" />}
            color="text-green-500"
          />
          <MetricCard
            title="Emails Sent"
            value={metrics.rel8t.emailsSent}
            icon={<Send className="h-4 w-4" />}
            color="text-purple-500"
          />
          <MetricCard
            title="Pending Emails"
            value={metrics.rel8t.pendingEmails}
            icon={<Clock className="h-4 w-4" />}
            color="text-orange-500"
          />
        </div>
      </div>

      {/* Growth Charts */}
      {chartData?.userGrowth && chartData.userGrowth.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                User Growth (6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="var(--color-users)" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Content Growth (6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.contentGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="posts" 
                      fill="var(--color-posts)" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminMetrics;