import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Rel8Header } from '@/components/rel8t/Rel8Header';
import { ContactHeader } from '@/components/rel8t/ContactHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProfileCard from '@/components/connections/ProfileCard';
import { Mail, Phone, MapPin, Building, Calendar, MessageSquare, Users, TrendingUp, Activity, ChevronDown, Tag } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Mock data - replace with actual data fetching
const mockContact = {
  id: '1',
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '(555) 123-4567',
  location: 'San Francisco, CA',
  company: 'Tech Corp Inc.',
  category: 'Partner',
  groups: ['Board Members', 'Tech Leaders'],
  status: 'active' as const,
  tags: ['VIP', 'Tech'],
  bio: 'Experienced technology executive with over 15 years in the industry. Passionate about innovation and building strong business relationships. Always looking to connect with like-minded professionals.',
  lastCommunication: '2024-01-20',
  lastIntroduction: '2024-01-10',
  notes: 'Met at Tech Summit 2023. Very interested in our new product line. Follow up on potential partnership opportunities.',
};

const mockAssociatedContacts = [
  {
    id: '2',
    first_name: 'Jane',
    last_name: 'Doe',
    location: 'New York, NY',
    bio: 'Marketing professional specializing in B2B tech',
    interests: ['Marketing', 'Technology', 'Innovation'],
  },
  {
    id: '3',
    first_name: 'Mike',
    last_name: 'Johnson',
    location: 'Austin, TX',
    bio: 'Software engineer and startup founder',
    interests: ['Startups', 'AI', 'Development'],
  },
  {
    id: '4',
    first_name: 'Sarah',
    last_name: 'Williams',
    location: 'Seattle, WA',
    bio: 'Product manager with focus on user experience',
    interests: ['UX', 'Product', 'Design'],
  },
];

export default function ContactProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleActv8 = () => {
    console.log('Actv8 clicked');
    // Implement Actv8 functionality
  };

  const handleNomin8 = () => {
    console.log('Nomin8 clicked');
    // Implement Nomin8 functionality
  };

  const handleEvalu8 = () => {
    console.log('Evalu8 clicked');
    // Implement Evalu8 functionality
  };

  const handleEdit = () => {
    navigate(`/rel8/contacts/${id}/edit`);
  };

  const handleDelete = () => {
    console.log('Delete clicked');
    // Implement delete functionality with confirmation
  };

  return (
    <div className="min-h-screen bg-background">
      <Rel8Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Contact Header */}
        <ContactHeader
          contactId={mockContact.id}
          name={mockContact.name}
          category={mockContact.category}
          groups={mockContact.groups}
          status={mockContact.status}
          tags={mockContact.tags}
          onActv8={handleActv8}
          onNomin8={handleNomin8}
          onEvalu8={handleEvalu8}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Section 1: Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
              {/* Column 1 */}
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-sm md:text-base truncate">{mockContact.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-sm md:text-base">{mockContact.phone}</p>
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-sm md:text-base truncate">{mockContact.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground">Company</p>
                    <p className="font-medium text-sm md:text-base truncate">{mockContact.company}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Width Bio/Notes */}
            <div className="pt-3 md:pt-4 border-t">
              <p className="text-xs md:text-sm text-muted-foreground mb-2">Bio / Notes</p>
              <p className="text-sm md:text-base leading-relaxed">{mockContact.bio}</p>
              {mockContact.notes && (
                <div className="mt-3 md:mt-4 p-3 rounded-lg bg-muted/50">
                  <p className="text-xs md:text-sm">{mockContact.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tags & Categories Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Tags & Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tags Section */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {mockContact.tags.map((tag, index) => (
                  <Badge key={index} variant="tag">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border/50" />

            {/* Categories Section */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">Categories</p>
              <div className="flex flex-wrap gap-2">
                {mockContact.category && (
                  <Badge variant="teal">
                    {mockContact.category}
                  </Badge>
                )}
                {mockContact.groups.map((group, index) => (
                  <Badge key={index} variant="default" className="gap-1">
                    <Users className="h-3 w-3" />
                    {group}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Contact Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Contact Status & Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status Card - Accordion */}
            <Card className="relative overflow-hidden border-2 border-primary/20 bg-card/40 backdrop-blur-xl hover:border-primary/50 hover:bg-card/60 transition-all duration-300 animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
              <Accordion type="single" collapsible>
                <AccordionItem value="status" className="border-none relative">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline group">
                    <div className="flex items-center gap-3 w-full">
                      <div className={`h-3 w-3 rounded-full flex-shrink-0 transition-transform duration-300 group-hover:scale-125 ${mockContact.status === 'active' ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-gray-500'}`} />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">Contact Status</p>
                        <p className="text-xs text-muted-foreground capitalize">{mockContact.status}</p>
                      </div>
                      <Badge variant={mockContact.status === 'active' ? 'teal' : 'secondary'} className="text-xs">
                        {mockContact.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="pt-3 border-t border-primary/10 space-y-3 animate-fade-in">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status History</span>
                        <Badge variant="outline" className="text-xs">Last 6 months</Badge>
                      </div>
                      <div className="h-24 bg-background/50 backdrop-blur-sm rounded-lg flex items-center justify-center border border-primary/10">
                        <TrendingUp className="h-8 w-8 text-muted-foreground/30" />
                        <span className="ml-2 text-sm text-muted-foreground">Activity timeline chart</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-background/60 backdrop-blur-sm rounded border border-primary/10">
                          <p className="text-muted-foreground">Active Days</p>
                          <p className="font-semibold text-green-500">142/180</p>
                        </div>
                        <div className="p-2 bg-background/60 backdrop-blur-sm rounded border border-primary/10">
                          <p className="text-muted-foreground">Response Rate</p>
                          <p className="font-semibold">87%</p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            {/* Last Communication Card - Accordion */}
            <Card className="relative overflow-hidden border-2 border-primary/20 bg-card/40 backdrop-blur-xl hover:border-primary/50 hover:bg-card/60 transition-all duration-300 animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
              <Accordion type="single" collapsible>
                <AccordionItem value="communication" className="border-none relative">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline group">
                    <div className="flex items-center gap-3 w-full">
                      <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">Last Communication</p>
                        <p className="text-xs text-muted-foreground">{new Date(mockContact.lastCommunication).toLocaleDateString()}</p>
                      </div>
                      <Badge variant="tag" className="text-xs">Email</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="pt-3 border-t border-primary/10 space-y-3 animate-fade-in">
                      <p className="text-sm font-medium">Communication Timeline</p>
                      <div className="space-y-2">
                        <div className="flex gap-2 p-2 bg-background/50 backdrop-blur-sm rounded border border-primary/10 hover:bg-background/70 transition-colors">
                          <Mail className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm">Partnership discussion follow-up</p>
                            <p className="text-xs text-muted-foreground">Jan 20, 2024</p>
                          </div>
                        </div>
                        <div className="flex gap-2 p-2 bg-background/50 backdrop-blur-sm rounded border border-primary/10 hover:bg-background/70 transition-colors">
                          <Phone className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm">Phone call - 15 minutes</p>
                            <p className="text-xs text-muted-foreground">Jan 18, 2024</p>
                          </div>
                        </div>
                        <div className="flex gap-2 p-2 bg-background/50 backdrop-blur-sm rounded border border-primary/10 hover:bg-background/70 transition-colors">
                          <MessageSquare className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm">Meeting invitation sent</p>
                            <p className="text-xs text-muted-foreground">Jan 12, 2024</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="p-2 bg-background/60 backdrop-blur-sm rounded text-center border border-primary/10">
                          <p className="text-muted-foreground">Emails</p>
                          <p className="font-semibold">24</p>
                        </div>
                        <div className="p-2 bg-background/60 backdrop-blur-sm rounded text-center border border-primary/10">
                          <p className="text-muted-foreground">Calls</p>
                          <p className="font-semibold">8</p>
                        </div>
                        <div className="p-2 bg-background/60 backdrop-blur-sm rounded text-center border border-primary/10">
                          <p className="text-muted-foreground">Meetings</p>
                          <p className="font-semibold">5</p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            {/* Last Introduction Card - Accordion */}
            <Card className="relative overflow-hidden border-2 border-primary/20 bg-card/40 backdrop-blur-xl hover:border-primary/50 hover:bg-card/60 transition-all duration-300 animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
              <Accordion type="single" collapsible>
                <AccordionItem value="introduction" className="border-none relative">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline group">
                    <div className="flex items-center gap-3 w-full">
                      <Users className="h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">Last Introduction</p>
                        <p className="text-xs text-muted-foreground">{new Date(mockContact.lastIntroduction).toLocaleDateString()}</p>
                      </div>
                      <Badge variant="tag" className="text-xs">2 Connections</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="pt-3 border-t border-primary/10 space-y-3 animate-fade-in">
                      <p className="text-sm font-medium">Introduction History</p>
                      <div className="space-y-2">
                        <div className="p-2 bg-background/50 backdrop-blur-sm rounded border border-primary/10 hover:bg-background/70 transition-colors">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Sarah Williams ↔ Mike Johnson</span>
                            <span className="text-xs text-muted-foreground">Jan 10, 2024</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Product collaboration opportunity</p>
                        </div>
                        <div className="p-2 bg-background/50 backdrop-blur-sm rounded border border-primary/10 hover:bg-background/70 transition-colors">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Jane Doe ↔ Tech Corp</span>
                            <span className="text-xs text-muted-foreground">Dec 15, 2023</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Marketing partnership discussion</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-background/60 backdrop-blur-sm rounded border border-primary/10">
                          <p className="text-muted-foreground">Total Intros</p>
                          <p className="font-semibold">12</p>
                        </div>
                        <div className="p-2 bg-background/60 backdrop-blur-sm rounded border border-primary/10">
                          <p className="text-muted-foreground">Success Rate</p>
                          <p className="font-semibold">92%</p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            {/* Engagement Summary Card */}
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="teal" className="text-xs">Engagement Score: 85%</Badge>
                    <Badge variant="tag" className="text-xs">3 Events This Year</Badge>
                    <Badge variant="tag" className="text-xs">12 Interactions</Badge>
                  </div>
                  <Badge variant="popularTag" className="text-xs">High Priority</Badge>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Section 3: Network - Associated Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Associated Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mockAssociatedContacts.map((contact) => {
                const fullName = `${contact.first_name} ${contact.last_name}`;
                return (
                  <Card 
                    key={contact.id}
                    onClick={() => navigate(`/profile/${contact.id}`)}
                    className="cursor-pointer hover:shadow-md transition-all bg-card/80 backdrop-blur-sm border-2 bg-gradient-to-br from-card/80 to-card/40 hover:border-primary/30 hover:shadow-primary/10 hover:shadow-2xl group relative overflow-hidden"
                  >
                    {/* Gradient border effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                    
                    <CardContent className="p-5 relative z-10">
                      <div className="flex items-center">
                        <div className="bg-primary/10 rounded-full p-2 mr-3 group-hover:bg-primary/20 transition-colors">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                            {contact.first_name?.[0]}{contact.last_name?.[0]}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-lg truncate group-hover:text-primary transition-colors">{fullName}</h3>
                          <p className="text-muted-foreground text-sm">Community Member</p>
                          {contact.location && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <p className="text-xs text-muted-foreground truncate">{contact.location}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
