import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Trophy, Users, Activity, Star, MapPin, Mail, Phone, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';

interface ContactDetails {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  organization?: string;
  avatar_url?: string;
  location?: string;
  tags?: string[];
  notes?: string;
  last_contact_date?: string;
  created_at: string;
}

interface ContactActivity {
  id: string;
  activity_type: 'event_attendance' | 'content_interaction' | 'referral' | 'feedback';
  title: string;
  description: string;
  date: string;
  score: number;
}

interface ContactMetrics {
  engagementScore: number;
  eventsAttended: number;
  referralsMade: number;
  contentShared: number;
  lastActiveDate: string;
  joinDate: string;
  totalActivities: number;
}

const mockActivities: ContactActivity[] = [
  {
    id: '1',
    activity_type: 'event_attendance',
    title: 'Community Meetup #42',
    description: 'Attended monthly community gathering and participated in panel discussion',
    date: '2024-03-10T18:00:00Z',
    score: 15
  },
  {
    id: '2',
    activity_type: 'content_interaction',
    title: 'Shared Article: "Future of Tech Communities"',
    description: 'Shared community article on LinkedIn with thoughtful commentary',
    date: '2024-03-08T14:30:00Z',
    score: 8
  },
  {
    id: '3',
    activity_type: 'referral',
    title: 'Referred New Member',
    description: 'Successfully referred Sarah Johnson who became an active member',
    date: '2024-03-05T10:15:00Z',
    score: 20
  },
  {
    id: '4',
    activity_type: 'feedback',
    title: 'Event Feedback Provided',
    description: 'Provided detailed feedback on workshop format improvements',
    date: '2024-03-02T16:45:00Z',
    score: 10
  }
];

const ContactEvaluationPage: React.FC = () => {
  const { contactId } = useParams<{ contactId: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState<ContactDetails | null>(null);
  const [activities] = useState<ContactActivity[]>(mockActivities);
  const [metrics, setMetrics] = useState<ContactMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContactDetails = async () => {
      if (!contactId) {
        navigate('/nmn8/manage');
        return;
      }

      try {
        setLoading(true);
        
        // Load contact from rms_contacts
        const { data: contactData, error } = await supabase
          .from('rms_contacts')
          .select('*')
          .eq('id', contactId)
          .single();

        if (error) throw error;
        
        setContact(contactData);
        
        // Calculate metrics (in real app, this would come from activity tracking)
        const totalScore = activities.reduce((sum, activity) => sum + activity.score, 0);
        const eventActivities = activities.filter(a => a.activity_type === 'event_attendance');
        const referralActivities = activities.filter(a => a.activity_type === 'referral');
        const contentActivities = activities.filter(a => a.activity_type === 'content_interaction');
        
        const mockMetrics: ContactMetrics = {
          engagementScore: Math.min(100, totalScore),
          eventsAttended: eventActivities.length,
          referralsMade: referralActivities.length,
          contentShared: contentActivities.length,
          lastActiveDate: activities[0]?.date || contactData.created_at,
          joinDate: contactData.created_at,
          totalActivities: activities.length
        };
        
        setMetrics(mockMetrics);

      } catch (error) {
        console.error('Failed to load contact details:', error);
        toast({
          title: "Error",
          description: "Failed to load contact details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadContactDetails();
  }, [contactId, navigate]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getActivityIcon = (type: ContactActivity['activity_type']) => {
    switch (type) {
      case 'event_attendance':
        return Calendar;
      case 'content_interaction':
        return Activity;
      case 'referral':
        return Users;
      case 'feedback':
        return Star;
      default:
        return Trophy;
    }
  };

  const getActivityColor = (type: ContactActivity['activity_type']) => {
    switch (type) {
      case 'event_attendance':
        return 'bg-blue-500';
      case 'content_interaction':
        return 'bg-green-500';
      case 'referral':
        return 'bg-purple-500';
      case 'feedback':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getEngagementLevel = (score: number) => {
    if (score >= 80) return { label: 'High', color: 'text-green-500' };
    if (score >= 60) return { label: 'Medium', color: 'text-yellow-500' };
    if (score >= 40) return { label: 'Moderate', color: 'text-orange-500' };
    return { label: 'Low', color: 'text-red-500' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="h-8 w-48" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="glassmorphic-card">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="glassmorphic-card">
                  <CardHeader>
                    <Skeleton className="h-5 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!contact || !metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">Contact not found</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              The contact you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button onClick={() => navigate('/nmn8/manage')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Management
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const engagementLevel = getEngagementLevel(metrics.engagementScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/nmn8/manage')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Contact Evaluation</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Profile */}
            <Card className="glassmorphic-card">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar userId={contact.id || contact.name} size={64} />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-foreground">{contact.name}</h2>
                      <Badge className={`${engagementLevel.color} bg-white/10`}>
                        {engagementLevel.label} Engagement
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {contact.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {contact.email}
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {contact.phone}
                        </div>
                      )}
                      {contact.organization && (
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {contact.organization}
                        </div>
                      )}
                      {contact.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {contact.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              {contact.notes && (
                <CardContent className="pt-0">
                  <Separator className="mb-4" />
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-muted-foreground text-sm">{contact.notes}</p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Activity History */}
            <Card className="glassmorphic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => {
                    const IconComponent = getActivityIcon(activity.activity_type);
                    const colorClass = getActivityColor(activity.activity_type);
                    
                    return (
                      <div key={activity.id} className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-foreground">{activity.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>+{activity.score} pts</span>
                              <span>{new Date(activity.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Engagement Score */}
            <Card className="glassmorphic-card">
              <CardHeader>
                <CardTitle className="text-lg">Engagement Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {metrics.engagementScore}/100
                  </div>
                  <div className={`text-sm font-medium ${engagementLevel.color}`}>
                    {engagementLevel.label}
                  </div>
                </div>
                <Progress value={metrics.engagementScore} className="mb-2" />
                <p className="text-xs text-muted-foreground text-center">
                  Based on activity, events, and community participation
                </p>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card className="glassmorphic-card">
              <CardHeader>
                <CardTitle className="text-lg">Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Events Attended</span>
                  <span className="font-semibold">{metrics.eventsAttended}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Referrals Made</span>
                  <span className="font-semibold">{metrics.referralsMade}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Content Shared</span>
                  <span className="font-semibold">{metrics.contentShared}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Activities</span>
                  <span className="font-semibold">{metrics.totalActivities}</span>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="glassmorphic-card">
              <CardHeader>
                <CardTitle className="text-lg">Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Joined</div>
                  <div className="font-medium">
                    {new Date(metrics.joinDate).toLocaleDateString()}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground">Last Active</div>
                  <div className="font-medium">
                    {new Date(metrics.lastActiveDate).toLocaleDateString()}
                  </div>
                </div>
                {contact.last_contact_date && (
                  <>
                    <Separator />
                    <div>
                      <div className="text-sm text-muted-foreground">Last Contact</div>
                      <div className="font-medium">
                        {new Date(contact.last_contact_date).toLocaleDateString()}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactEvaluationPage;