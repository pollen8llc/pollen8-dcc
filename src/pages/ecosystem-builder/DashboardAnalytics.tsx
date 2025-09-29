import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Users, Calendar, ArrowUpRight, Lightbulb } from 'lucide-react';
import { MOCK_ANALYTICS } from '@/data/ecosystemBuilderMock';

const DashboardAnalytics = () => {
  const navigate = useNavigate();
  const analytics = MOCK_ANALYTICS;

  return (
    <Shell>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Community Analytics</h1>
            <p className="text-muted-foreground">Track growth, engagement, and optimization opportunities</p>
          </div>
          <Button onClick={() => navigate('/ecosystem-builder/platforms')}>
            <Lightbulb className="h-4 w-4 mr-2" />
            Get Recommendations
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          {analytics.engagement.map((metric) => (
            <Card key={metric.metric} className="p-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-muted-foreground">{metric.metric}</p>
                <div className={`flex items-center text-xs ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <ArrowUpRight className="h-3 w-3" />
                  {metric.change}%
                </div>
              </div>
              <p className="text-3xl font-bold">{metric.value.toLocaleString()}</p>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="growth" className="space-y-6">
          <TabsList>
            <TabsTrigger value="growth">
              <TrendingUp className="h-4 w-4 mr-2" />
              Growth
            </TabsTrigger>
            <TabsTrigger value="engagement">
              <Users className="h-4 w-4 mr-2" />
              Engagement
            </TabsTrigger>
            <TabsTrigger value="platforms">
              <BarChart3 className="h-4 w-4 mr-2" />
              Platforms
            </TabsTrigger>
            <TabsTrigger value="insights">
              <Lightbulb className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="growth" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Member Growth</h3>
              <div className="space-y-2">
                {analytics.memberGrowth.map((data) => (
                  <div key={data.month} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{data.month}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-64 h-8 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${(data.count / 612) * 100}%` }}
                        />
                      </div>
                      <span className="font-medium w-12 text-right">{data.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6">
                <h4 className="font-semibold mb-2">Growth Rate</h4>
                <p className="text-3xl font-bold text-green-600">+17%</p>
                <p className="text-sm text-muted-foreground">vs last month</p>
              </Card>
              <Card className="p-6">
                <h4 className="font-semibold mb-2">Retention</h4>
                <p className="text-3xl font-bold">89%</p>
                <p className="text-sm text-muted-foreground">30-day retention</p>
              </Card>
              <Card className="p-6">
                <h4 className="font-semibold mb-2">Churn Risk</h4>
                <p className="text-3xl font-bold text-yellow-600">34</p>
                <p className="text-sm text-muted-foreground">members at risk</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Member Segments</h3>
              <div className="space-y-4">
                {analytics.relationships.map((rel) => (
                  <div key={rel.type}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{rel.type}</span>
                      <span className="text-sm text-muted-foreground">{rel.count} members</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary"
                        style={{ width: `${(rel.count / 612) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Event Attendance</h4>
                <p className="text-3xl font-bold mb-2">78%</p>
                <p className="text-sm text-muted-foreground">Average attendance rate</p>
                <div className="mt-4 space-y-2 text-sm">
                  <p>Last event: 142 attendees</p>
                  <p>Total events: 24</p>
                </div>
              </Card>
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Message Activity</h4>
                <p className="text-3xl font-bold mb-2">1,453</p>
                <p className="text-sm text-muted-foreground">Messages this week</p>
                <div className="mt-4 space-y-2 text-sm">
                  <p>Peak hours: 7-9 PM</p>
                  <p>Most active: Weekdays</p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Platform Usage</h3>
              <div className="space-y-4">
                {analytics.platformUsage.map((platform) => (
                  <div key={platform.platform} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{platform.platform}</span>
                        <span className="text-sm text-muted-foreground">
                          {platform.active}/{platform.users} active
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${(platform.active / platform.users) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                Optimization Opportunity
              </h4>
              <p className="text-sm mb-4">
                Only 58% of Discord members are actively engaged. Consider running an engagement campaign or hosting more voice events.
              </p>
              <Button size="sm" variant="outline">View Playbook</Button>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">AI-Powered Insights</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Strong Growth Trajectory</p>
                      <p className="text-sm text-muted-foreground">
                        Your 17% month-over-month growth outpaces 78% of similar communities. Keep momentum by launching a referral program.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Member Activation Gap</p>
                      <p className="text-sm text-muted-foreground">
                        34 members haven't engaged in 30+ days. Send a re-engagement campaign focused on upcoming events.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Event Optimization</p>
                      <p className="text-sm text-muted-foreground">
                        Your highest attendance events are Tuesday evenings. Consider moving more events to this time slot.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Benchmark Comparison</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Your Growth Rate</span>
                    <span className="font-medium text-green-600">17%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category Average</span>
                    <span className="font-medium">12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top Performers</span>
                    <span className="font-medium">23%</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold mb-4">Recommended Actions</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">→</span>
                    <span>Launch partnerships module (Modul8)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">→</span>
                    <span>Implement tiered membership</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">→</span>
                    <span>Add event waitlist feature</span>
                  </li>
                </ul>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default DashboardAnalytics;
