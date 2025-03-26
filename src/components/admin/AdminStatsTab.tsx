
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Line, LineChart } from "recharts";
import { TimeSeriesData } from "@/models/types";

interface AdminStatsTabProps {
  communityId: string;
}

// Mock data for development
const mockMemberGrowth: TimeSeriesData[] = [
  { date: "Jan", value: 5 },
  { date: "Feb", value: 8 },
  { date: "Mar", value: 12 },
  { date: "Apr", value: 15 },
  { date: "May", value: 20 },
  { date: "Jun", value: 25 },
  { date: "Jul", value: 30 },
  { date: "Aug", value: 35 },
  { date: "Sep", value: 40 },
  { date: "Oct", value: 45 },
  { date: "Nov", value: 50 },
  { date: "Dec", value: 55 },
];

const mockEngagement = [
  { date: "Jan", posts: 2, comments: 5 },
  { date: "Feb", posts: 3, comments: 8 },
  { date: "Mar", posts: 4, comments: 10 },
  { date: "Apr", posts: 5, comments: 15 },
  { date: "May", posts: 7, comments: 20 },
  { date: "Jun", posts: 8, comments: 22 },
  { date: "Jul", posts: 10, comments: 30 },
  { date: "Aug", posts: 12, comments: 35 },
  { date: "Sep", posts: 13, comments: 40 },
  { date: "Oct", posts: 15, comments: 45 },
  { date: "Nov", posts: 16, comments: 50 },
  { date: "Dec", posts: 20, comments: 60 },
];

const AdminStatsTab = ({ communityId }: AdminStatsTabProps) => {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Members</CardTitle>
            <CardDescription>Total community members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">67</div>
            <p className="text-sm text-green-500 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Engagement</CardTitle>
            <CardDescription>Activity rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42%</div>
            <p className="text-sm text-green-500 mt-1">+5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Content</CardTitle>
            <CardDescription>Total posts & resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">128</div>
            <p className="text-sm text-green-500 mt-1">+8% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Member Growth</CardTitle>
            <CardDescription>Monthly member count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer 
                config={{
                  members: {
                    label: "Members",
                    theme: {
                      light: "#10b981",
                      dark: "#34d399"
                    }
                  }
                }}
              >
                <LineChart data={mockMemberGrowth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    width={40}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent indicator="line" />
                    }
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="members"
                    stroke="var(--color-members)" 
                    strokeWidth={2}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    dot={{ r: 0 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Engagement</CardTitle>
            <CardDescription>Posts and comments by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer
                config={{
                  posts: {
                    label: "Posts",
                    theme: {
                      light: "#6366f1",
                      dark: "#818cf8"
                    }
                  },
                  comments: {
                    label: "Comments",
                    theme: {
                      light: "#ec4899",
                      dark: "#f472b6"
                    }
                  }
                }}
              >
                <BarChart data={mockEngagement}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    width={40}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent indicator="line" />
                    }
                  />
                  <Bar 
                    dataKey="posts" 
                    name="posts"
                    fill="var(--color-posts)" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={40}
                  />
                  <Bar 
                    dataKey="comments" 
                    name="comments"
                    fill="var(--color-comments)" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={40}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStatsTab;
