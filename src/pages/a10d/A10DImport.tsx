import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from '@/components/Navbar';
import { A10DNavigation } from "@/components/a10d/A10DNavigation";
import { ExternalLink, Zap, Search, Filter, Users, BarChart3, Star, Download } from "lucide-react";

const integrationOptions = [
  {
    id: 'eventbrite',
    name: 'Eventbrite',
    description: 'Ticketing, RSVPs, venues',
    category: 'Ticketing & Events',
    color: 'from-orange-500/30 to-orange-600/30 border-orange-500/50',
    status: 'Coming Soon'
  },
  {
    id: 'luma',
    name: 'Luma',
    description: 'Community-first events + RSVPs, waitlists',
    category: 'Community Events',
    color: 'from-purple-500/30 to-purple-600/30 border-purple-500/50',
    status: 'Coming Soon'
  },
  {
    id: 'meetup',
    name: 'Meetup',
    description: 'Groups, events, RSVPs',
    category: 'Community Events',
    color: 'from-red-500/30 to-red-600/30 border-red-500/50',
    status: 'Coming Soon'
  },
  {
    id: 'ticketmaster',
    name: 'Ticketmaster',
    description: 'Large-scale ticketing & discovery',
    category: 'Ticketing & Events',
    color: 'from-blue-500/30 to-blue-600/30 border-blue-500/50',
    status: 'Coming Soon'
  },
  {
    id: 'universe',
    name: 'Universe',
    description: 'Ticketing API by Ticketmaster',
    category: 'Ticketing & Events',
    color: 'from-indigo-500/30 to-indigo-600/30 border-indigo-500/50',
    status: 'Coming Soon'
  },
  {
    id: 'splashthat',
    name: 'SplashThat',
    description: 'Guest lists, registrations, event data',
    category: 'Event Management',
    color: 'from-cyan-500/30 to-cyan-600/30 border-cyan-500/50',
    status: 'Coming Soon'
  },
  {
    id: 'bevy',
    name: 'Bevy',
    description: 'Community-led events, chapters',
    category: 'Community Events',
    color: 'from-green-500/30 to-green-600/30 border-green-500/50',
    status: 'Coming Soon'
  },
  {
    id: 'hopin',
    name: 'Hopin',
    description: 'Hybrid/virtual conferences, analytics',
    category: 'Conference & Summit',
    color: 'from-pink-500/30 to-pink-600/30 border-pink-500/50',
    status: 'Coming Soon'
  },
  {
    id: 'airmeet',
    name: 'Airmeet',
    description: 'Conferences, webinars, expos',
    category: 'Conference & Summit',
    color: 'from-sky-500/30 to-sky-600/30 border-sky-500/50',
    status: 'Coming Soon'
  },
  {
    id: 'bizzabo',
    name: 'Bizzabo',
    description: 'Enterprise conference management',
    category: 'Conference & Summit',
    color: 'from-slate-500/30 to-slate-600/30 border-slate-500/50',
    status: 'Coming Soon'
  }
];

const categories = Array.from(new Set(integrationOptions.map(option => option.category)));

export default function A10DImport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleConnect = (integrationId: string) => {
    // TODO: Implement connection logic for each integration
    console.log(`Connecting to ${integrationId}`);
  };

  // Filter integrations based on search and category
  const filteredIntegrations = useMemo(() => {
    return integrationOptions.filter(integration => {
      const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           integration.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
                             integration.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Group integrations by category
  const integrationsByCategory = useMemo(() => {
    const groups = filteredIntegrations.reduce((acc, integration) => {
      const category = integration.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(integration);
      return acc;
    }, {} as Record<string, typeof integrationOptions>);

    return groups;
  }, [filteredIntegrations]);

  // Statistics
  const stats = useMemo(() => {
    const totalIntegrations = integrationOptions.length;
    const availableIntegrations = integrationOptions.filter(option => option.status !== 'Coming Soon').length;
    const categoriesCount = categories.length;
    const comingSoonCount = integrationOptions.filter(option => option.status === 'Coming Soon').length;

    return {
      totalIntegrations,
      availableIntegrations,
      categoriesCount,
      comingSoonCount
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Navigation */}
        <A10DNavigation />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Import Contacts</h1>
            <p className="text-muted-foreground mt-1">
              Connect your event platforms to automatically import attendees and build your community database
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
          </div>
                </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Integrations</p>
                  <p className="text-2xl font-bold">{stats.totalIntegrations}</p>
                </div>
                <Download className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available Now</p>
                  <p className="text-2xl font-bold">{stats.availableIntegrations}</p>
                </div>
                <Zap className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">{stats.categoriesCount}</p>
                </div>
                <Filter className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Coming Soon</p>
                  <p className="text-2xl font-bold">{stats.comingSoonCount}</p>
                </div>
                <Star className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

                {/* Integration Categories */}
        <div className="space-y-8">
          {Object.entries(integrationsByCategory).map(([category, groupIntegrations]) => {
            const getCategoryColor = (category: string) => {
              switch (category) {
                case 'Ticketing & Events':
                  return 'from-orange-500 to-orange-600';
                case 'Community Events':
                  return 'from-purple-500 to-purple-600';
                case 'Event Management':
                  return 'from-cyan-500 to-cyan-600';
                case 'Conference & Summit':
                  return 'from-pink-500 to-pink-600';
                default:
                  return 'from-primary to-primary/80';
              }
            };

            const getCategoryIcon = (category: string) => {
              switch (category) {
                case 'Ticketing & Events':
                  return Download;
                case 'Community Events':
                  return Users;
                case 'Event Management':
                  return BarChart3;
                case 'Conference & Summit':
                  return Star;
                default:
                  return Zap;
              }
            };

            const Icon = getCategoryIcon(category);
            const colorClass = getCategoryColor(category);
            
            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClass}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold">{category}</h2>
                  <Badge variant="secondary" className="ml-2">
                    {groupIntegrations.length}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {groupIntegrations.map((option) => (
                    <Card 
                      key={option.id}
                      className={`group hover:scale-105 transition-all duration-300 hover:shadow-lg border-0 
                                  bg-gradient-to-r ${option.color} backdrop-blur-md border`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{option.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {option.description}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {option.status}
                            </Badge>
                          </div>
                          
                          <Button
                            onClick={() => handleConnect(option.id)}
                            disabled={option.status === 'Coming Soon'}
                            size="sm"
                            variant={option.status === 'Coming Soon' ? 'outline' : 'default'}
                          >
                            {option.status === 'Coming Soon' ? (
                              'Soon'
                            ) : (
                              <>
                                Connect
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">No integrations found</h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Footer Note */}
        <div className="text-center mt-16 p-6 rounded-xl bg-muted/50 backdrop-blur-sm">
          <p className="text-muted-foreground">
            More integrations coming soon. Have a specific platform in mind?{" "}
            <Button variant="link" className="p-0 h-auto text-primary">
              Let us know
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}