import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, Activity, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';

// Mock analytics data
const mockAnalytics = [
  {
    id: '1',
    title: 'Community Engagement Score',
    value: 87,
    trend: '+12%',
    description: 'Overall engagement across all community activities',
    category: 'Engagement',
    lastUpdated: '2024-03-10'
  },
  {
    id: '2',
    title: 'Event Attendance Rate',
    value: 73,
    trend: '+5%',
    description: 'Percentage of invited members attending events',
    category: 'Events',
    lastUpdated: '2024-03-09'
  },
  {
    id: '3',
    title: 'Member Retention',
    value: 91,
    trend: '+8%',
    description: 'Members staying active over the past 6 months',
    category: 'Retention',
    lastUpdated: '2024-03-08'
  },
  {
    id: '4',
    title: 'Content Interaction',
    value: 65,
    trend: '-3%',
    description: 'Likes, comments, and shares on community content',
    category: 'Content',
    lastUpdated: '2024-03-10'
  },
  {
    id: '5',
    title: 'New Member Growth',
    value: 24,
    trend: '+15%',
    description: 'New members joined this month',
    category: 'Growth',
    lastUpdated: '2024-03-11'
  },
  {
    id: '6',
    title: 'Volunteer Participation',
    value: 42,
    trend: '+7%',
    description: 'Active volunteers contributing to community initiatives',
    category: 'Volunteers',
    lastUpdated: '2024-03-07'
  }
];

type AnalyticsCategory = 'all' | 'Engagement' | 'Events' | 'Retention' | 'Content' | 'Growth' | 'Volunteers';

const Evalu8Dashboard: React.FC = () => {
  const [analytics] = useState(mockAnalytics);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AnalyticsCategory>('all');

  const filteredAnalytics = useMemo(() => {
    return analytics.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || 
                             item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [analytics, searchQuery, selectedCategory]);

  // Group analytics by category
  const analyticsByCategory = useMemo(() => {
    const groups: Record<string, typeof mockAnalytics> = {};
    
    filteredAnalytics.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });

    return groups;
  }, [filteredAnalytics]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Engagement':
        return 'bg-primary/80 text-primary-foreground border-primary/40';
      case 'Events':
        return 'bg-green-500/80 text-white border-green-500/40';
      case 'Retention':
        return 'bg-blue-500/80 text-white border-blue-500/40';
      case 'Content':
        return 'bg-orange-500/80 text-white border-orange-500/40';
      case 'Growth':
        return 'bg-purple-500/80 text-white border-purple-500/40';
      case 'Volunteers':
        return 'bg-pink-500/80 text-white border-pink-500/40';
      default:
        return 'bg-muted/80 text-muted-foreground border-muted/40';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Engagement':
        return Activity;
      case 'Events':
        return Users;
      case 'Retention':
        return TrendingUp;
      case 'Content':
        return BarChart3;
      case 'Growth':
        return TrendingUp;
      case 'Volunteers':
        return Users;
      default:
        return BarChart3;
    }
  };

  const getTrendColor = (trend: string) => {
    if (trend.startsWith('+')) return 'text-green-500';
    if (trend.startsWith('-')) return 'text-red-500';
    return 'text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Evalu8 Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Understand behavior, gather insights, and measure engagement
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search analytics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-48">
            <Select value={selectedCategory} onValueChange={(value: AnalyticsCategory) => setSelectedCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Engagement">Engagement</SelectItem>
                <SelectItem value="Events">Events</SelectItem>
                <SelectItem value="Retention">Retention</SelectItem>
                <SelectItem value="Content">Content</SelectItem>
                <SelectItem value="Growth">Growth</SelectItem>
                <SelectItem value="Volunteers">Volunteers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Analytics by Category */}
        <div className="space-y-8">
          {Object.entries(analyticsByCategory).map(([category, categoryAnalytics]) => {
            if (categoryAnalytics.length === 0) return null;
            
            const Icon = getCategoryIcon(category);
            
            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-primary/80">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold">{category}</h2>
                  <Badge variant="secondary" className="ml-2">
                    {categoryAnalytics.length}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {categoryAnalytics.map((item) => (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-medium">{item.title}</CardTitle>
                          <Badge className={getCategoryColor(item.category)}>
                            {item.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-3xl font-bold text-foreground">{item.value}%</span>
                            <span className={`text-sm font-medium ${getTrendColor(item.trend)}`}>
                              {item.trend}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <div className="text-xs text-muted-foreground">
                            Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {filteredAnalytics.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">No analytics found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Evalu8Dashboard;