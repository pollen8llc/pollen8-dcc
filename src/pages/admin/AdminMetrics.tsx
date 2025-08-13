import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Users, BookOpen, MessageSquare, Building, Heart, ThumbsUp, TrendingUp, Activity, Target, Send, Mail, Briefcase, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getPlatformMetrics, getMetricsChartData } from '@/services/metricsService';

// Enhanced Metric Card Component with glassmorphic design
interface MetricCardProps {
  icon: React.ElementType;
  value: number | string;
  label: string;
  description?: string;
  color: string;
  bgColor: string;
  progress?: number;
  trend?: number;
}

const EnhancedMetricCard: React.FC<MetricCardProps> = ({ 
  icon: Icon, 
  value, 
  label, 
  description, 
  color, 
  bgColor, 
  progress, 
  trend 
}) => (
  <div className={`glass-morphism glass-morphism-hover rounded-2xl p-4 sm:p-6 border border-primary/10 bg-gradient-to-br ${bgColor} hover:scale-105 transition-all duration-300 animate-fade-in group`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm px-2 py-1 rounded-lg bg-white/10 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
          <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
          <span className="font-medium">{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
    
    <div className="space-y-3">
      <div className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
        {value}
      </div>
      <div className="text-sm font-medium text-muted-foreground">
        {label}
      </div>
      
      {progress !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="text-xs font-medium text-primary">{progress}%</span>
          </div>
          <div className="relative">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${color} transition-all duration-500 ease-out rounded-full`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
      
      {description && (
        <div className="text-xs text-muted-foreground/80">
          {description}
        </div>
      )}
    </div>
  </div>
);

// Loading skeleton component
const MetricsLoadingSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="glass-morphism rounded-2xl p-6 animate-pulse">
          <div className="w-12 h-12 bg-primary/20 rounded-xl mb-4"></div>
          <div className="h-8 bg-primary/10 rounded mb-2"></div>
          <div className="h-4 bg-primary/10 rounded w-2/3"></div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="glass-morphism rounded-2xl p-6">
          <div className="h-6 bg-primary/10 rounded mb-4"></div>
          <div className="h-64 bg-primary/5 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

const AdminMetrics = () => {
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useQuery({
    queryKey: ['platform-metrics'],
    queryFn: getPlatformMetrics,
    refetchInterval: 30000,
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['metrics-chart-data'],
    queryFn: getMetricsChartData,
    refetchInterval: 60000,
  });

  if (metricsLoading || chartLoading) {
    return <MetricsLoadingSkeleton />;
  }

  if (metricsError) {
    return (
      <div className="glass-morphism rounded-2xl p-8 text-center border border-destructive/20">
        <div className="text-destructive mb-2">Error loading metrics</div>
        <div className="text-sm text-muted-foreground">Please try refreshing the page</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="glass-morphism rounded-2xl p-8 text-center">
        <div className="text-muted-foreground">No metrics data available</div>
      </div>
    );
  }

  // Calculate progress percentages (example targets)
  const userProgress = Math.min((metrics.users.total / 1000) * 100, 100);
  const contentProgress = Math.min((metrics.content.totalPosts / 500) * 100, 100);
  const engagementProgress = Math.min((metrics.engagement.totalVotes / 200) * 100, 100);

  return (
    <div className="space-y-8">
      {/* Enhanced User Metrics */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <Users className="w-5 h-5 text-black" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">User Analytics</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedMetricCard
            icon={Users}
            value={metrics.users.total.toLocaleString()}
            label="Total Users"
            description="Platform registrations"
            color="from-primary to-primary/80"
            bgColor="from-primary/5 to-primary/10"
            progress={userProgress}
            trend={12}
          />
          <EnhancedMetricCard
            icon={Activity}
            value={metrics.users.activeUsers.toLocaleString()}
            label="Active Users"
            description="Last 30 days"
            color="from-blue-500 to-blue-600"
            bgColor="from-blue-500/5 to-blue-500/10"
            progress={Math.min((metrics.users.activeUsers / metrics.users.total) * 100, 100)}
            trend={8}
          />
          <EnhancedMetricCard
            icon={Building}
            value={metrics.communities.total.toLocaleString()}
            label="Communities"
            description="Active communities"
            color="from-green-500 to-green-600"
            bgColor="from-green-500/5 to-green-500/10"
            progress={Math.min((metrics.communities.total / 50) * 100, 100)}
            trend={15}
          />
          <EnhancedMetricCard
            icon={Users}
            value={`${metrics.communities.public}/${metrics.communities.private}`}
            label="Public/Private"
            description="Community visibility"
            color="from-purple-500 to-purple-600"
            bgColor="from-purple-500/5 to-purple-500/10"
            progress={Math.min((metrics.communities.public / metrics.communities.total) * 100, 100)}
            trend={5}
          />
        </div>
      </div>

      {/* Enhanced Content Metrics */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Content Analytics</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedMetricCard
            icon={BookOpen}
            value={metrics.content.articles.toLocaleString()}
            label="Articles"
            description="Knowledge articles"
            color="from-primary to-primary/80"
            bgColor="from-primary/5 to-primary/10"
            progress={Math.min((metrics.content.articles / 100) * 100, 100)}
            trend={18}
          />
          <EnhancedMetricCard
            icon={MessageSquare}
            value={metrics.content.questions.toLocaleString()}
            label="Questions"
            description="User questions"
            color="from-yellow-500 to-yellow-600"
            bgColor="from-yellow-500/5 to-yellow-500/10"
            progress={Math.min((metrics.content.questions / 50) * 100, 100)}
            trend={25}
          />
          <EnhancedMetricCard
            icon={Heart}
            value={metrics.content.quotes.toLocaleString()}
            label="Quotes"
            description="Inspirational quotes"
            color="from-pink-500 to-pink-600"
            bgColor="from-pink-500/5 to-pink-500/10"
            progress={Math.min((metrics.content.quotes / 30) * 100, 100)}
            trend={10}
          />
          <EnhancedMetricCard
            icon={TrendingUp}
            value={metrics.content.polls.toLocaleString()}
            label="Polls"
            description="Community polls"
            color="from-orange-500 to-orange-600"
            bgColor="from-orange-500/5 to-orange-500/10"
            progress={Math.min((metrics.content.polls / 20) * 100, 100)}
            trend={30}
          />
        </div>
      </div>

      {/* Enhanced Engagement Metrics */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <ThumbsUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Engagement Analytics</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedMetricCard
            icon={ThumbsUp}
            value={metrics.engagement.totalVotes.toLocaleString()}
            label="Total Votes"
            description="Content engagement"
            color="from-green-500 to-green-600"
            bgColor="from-green-500/5 to-green-500/10"
            progress={engagementProgress}
            trend={22}
          />
          <EnhancedMetricCard
            icon={MessageSquare}
            value={metrics.content.totalComments.toLocaleString()}
            label="Comments"
            description="User discussions"
            color="from-blue-500 to-blue-600"
            bgColor="from-blue-500/5 to-blue-500/10"
            progress={Math.min((metrics.content.totalComments / 1000) * 100, 100)}
            trend={16}
          />
          <EnhancedMetricCard
            icon={Heart}
            value={metrics.engagement.savedArticles.toLocaleString()}
            label="Saved Articles"
            description="User bookmarks"
            color="from-purple-500 to-purple-600"
            bgColor="from-purple-500/5 to-purple-500/10"
            progress={Math.min((metrics.engagement.savedArticles / 300) * 100, 100)}
            trend={14}
          />
          <EnhancedMetricCard
            icon={Target}
            value={metrics.content.totalTags.toLocaleString()}
            label="Tags"
            description="Content categories"
            color="from-teal-500 to-teal-600"
            bgColor="from-teal-500/5 to-teal-500/10"
            progress={Math.min((metrics.content.totalTags / 100) * 100, 100)}
            trend={8}
          />
        </div>
      </div>

      {/* Modul8 Platform Metrics */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Modul8 Platform</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedMetricCard
            icon={Briefcase}
            value={metrics.modul8.totalServiceRequests.toLocaleString()}
            label="Service Requests"
            description="Total requests"
            color="from-purple-500 to-purple-600"
            bgColor="from-purple-500/5 to-purple-500/10"
            progress={Math.min((metrics.modul8.totalServiceRequests / 100) * 100, 100)}
            trend={35}
          />
          <EnhancedMetricCard
            icon={Clock}
            value={metrics.modul8.activeProposals.toLocaleString()}
            label="Active Proposals"
            description="In progress"
            color="from-yellow-500 to-yellow-600"
            bgColor="from-yellow-500/5 to-yellow-500/10"
            progress={Math.min((metrics.modul8.activeProposals / 50) * 100, 100)}
            trend={20}
          />
          <EnhancedMetricCard
            icon={CheckCircle2}
            value={metrics.modul8.completedDeals.toLocaleString()}
            label="Completed Deals"
            description="Successful projects"
            color="from-green-500 to-green-600"
            bgColor="from-green-500/5 to-green-500/10"
            progress={Math.min((metrics.modul8.completedDeals / 30) * 100, 100)}
            trend={45}
          />
          <EnhancedMetricCard
            icon={Users}
            value={`${metrics.modul8.serviceProviders}/${metrics.modul8.organizers}`}
            label="Providers/Organizers"
            description="Platform participants"
            color="from-blue-500 to-blue-600"
            bgColor="from-blue-500/5 to-blue-500/10"
            progress={Math.min(((metrics.modul8.serviceProviders + metrics.modul8.organizers) / 100) * 100, 100)}
            trend={28}
          />
        </div>
      </div>

      {/* REL8T Platform Metrics */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">REL8T Platform</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedMetricCard
            icon={Users}
            value={metrics.rel8t.totalContacts.toLocaleString()}
            label="Total Contacts"
            description="Relationship management"
            color="from-teal-500 to-teal-600"
            bgColor="from-teal-500/5 to-teal-500/10"
            progress={Math.min((metrics.rel8t.totalContacts / 500) * 100, 100)}
            trend={18}
          />
          <EnhancedMetricCard
            icon={Target}
            value={metrics.rel8t.activeTriggers.toLocaleString()}
            label="Active Triggers"
            description="Automation rules"
            color="from-blue-500 to-blue-600"
            bgColor="from-blue-500/5 to-blue-500/10"
            progress={Math.min((metrics.rel8t.activeTriggers / 50) * 100, 100)}
            trend={25}
          />
          <EnhancedMetricCard
            icon={Send}
            value={metrics.rel8t.emailsSent.toLocaleString()}
            label="Emails Sent"
            description="Outreach communications"
            color="from-green-500 to-green-600"
            bgColor="from-green-500/5 to-green-500/10"
            progress={Math.min((metrics.rel8t.emailsSent / 1000) * 100, 100)}
            trend={40}
          />
          <EnhancedMetricCard
            icon={Clock}
            value={metrics.rel8t.pendingEmails.toLocaleString()}
            label="Pending Emails"
            description="Queue status"
            color="from-orange-500 to-orange-600"
            bgColor="from-orange-500/5 to-orange-500/10"
            progress={Math.min((metrics.rel8t.pendingEmails / 100) * 100, 100)}
            trend={-5}
          />
        </div>
      </div>

      {/* Enhanced Growth Charts */}
      {chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-morphism glass-morphism-hover rounded-2xl p-6 border border-primary/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-black" />
              </div>
              <h4 className="text-lg font-semibold text-foreground">User Growth</h4>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-morphism glass-morphism-hover rounded-2xl p-6 border border-primary/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-foreground">Content Growth</h4>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData.contentGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="posts" radius={[4, 4, 0, 0]}>
                  {chartData.contentGrowth.map((_, index) => (
                    <Cell key={`cell-${index}`} fill="hsl(var(--primary))" opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMetrics;