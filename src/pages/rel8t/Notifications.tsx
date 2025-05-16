import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { MetricCard } from '@/components/rel8t/MetricCard';
import { OutreachCard } from '@/components/rel8t/OutreachCard';
import { DistributionChart } from '@/components/rel8t/DistributionChart';
import { StatisticsChart } from '@/components/rel8t/StatisticsChart';
import { Bell, CalendarClock, Users, UserPlus, Settings as SettingsIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getOutreach } from '@/services/rel8t/outreachService';
import { Rel8Navigation } from '@/components/rel8t/Rel8TNavigation';

// Placeholder data for analytics until we connect to real data
const mockStats = {
  contacts: 24,
  outreach: 12,
  pending: 5,
  distribution: [
    { name: 'Team A', value: 35 },
    { name: 'Team B', value: 25 },
    { name: 'Team C', value: 20 },
    { name: 'Team D', value: 20 }
  ],
  dailyStats: [
    { name: 'Mon', outreach: 4, contacts: 2 },
    { name: 'Tue', outreach: 3, contacts: 5 },
    { name: 'Wed', outreach: 5, contacts: 3 },
    { name: 'Thu', outreach: 2, contacts: 8 },
    { name: 'Fri', outreach: 6, contacts: 4 },
    { name: 'Sat', outreach: 2, contacts: 1 },
    { name: 'Sun', outreach: 1, contacts: 0 }
  ]
};

const Notifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('all');

  // Fetch notifications - pass "all" as the default tab
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['outreach-notifications'],
    queryFn: () => getOutreach("all"),
  });

  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'all'
    ? notifications
    : activeTab === 'pending'
      ? notifications.filter(n => n.status === 'pending')
      : notifications.filter(n => n.status === 'completed');

  const pendingCount = notifications.filter(n => n.status === 'pending').length;
  const completedCount = notifications.filter(n => n.status === 'completed').length;

  const handleCreateOutreach = () => {
    navigate('/rel8/wizard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">REL8 Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your relationships and outreach activities
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/rel8/contacts')}
            >
              <Users className="mr-2 h-4 w-4" />
              Contacts
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/rel8/settings')}
            >
              <SettingsIcon className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button onClick={handleCreateOutreach}>
              <UserPlus className="mr-2 h-4 w-4" />
              Build Relationship
            </Button>
          </div>
        </div>

        <Rel8Navigation />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Total Contacts"
            value={mockStats.contacts}
            icon={<Users className="h-6 w-6 text-blue-500" />}
            description="People in your network"
          />
          <MetricCard
            title="Outreach Activities"
            value={mockStats.outreach}
            icon={<Bell className="h-6 w-6 text-green-500" />}
            description="Total relationship touchpoints"
          />
          <MetricCard
            title="Pending Actions"
            value={pendingCount}
            icon={<CalendarClock className="h-6 w-6 text-amber-500" />}
            description="Upcoming actions needed"
            onActionClick={() => setActiveTab('pending')}
          />
        </div>
        
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Relationship Activities</CardTitle>
              <CardDescription>
                Manage your outreach and reminder activities
              </CardDescription>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
                <TabsList>
                  <TabsTrigger value="all">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending <Badge variant="secondary" className="ml-1">{pendingCount}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading activities...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <Bell className="mx-auto h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-2 text-lg font-semibold">No activities yet</h3>
                  <p className="text-muted-foreground mt-1">
                    {activeTab === 'all' 
                      ? "You haven't created any relationship activities" 
                      : activeTab === 'pending'
                        ? "You don't have any pending activities"
                        : "You haven't completed any activities yet"
                    }
                  </p>
                  <Button onClick={handleCreateOutreach} className="mt-4">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Relationship Plan
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <OutreachCard 
                      key={notification.id} 
                      outreach={notification}
                    />
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t">
              <Button 
                variant="outline" 
                onClick={handleCreateOutreach} 
                className="w-full sm:w-auto"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Build New Relationships
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
