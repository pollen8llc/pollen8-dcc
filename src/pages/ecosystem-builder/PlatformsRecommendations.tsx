import React, { useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Search, Star } from 'lucide-react';
import { MOCK_PLATFORMS } from '@/data/ecosystemBuilderMock';

const PlatformsRecommendations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Platforms' },
    { id: 'event-management', label: 'Event Management' },
    { id: 'communication', label: 'Communication' },
    { id: 'member-management', label: 'Member Management' },
    { id: 'crm-analytics', label: 'CRM & Analytics' },
    { id: 'payments', label: 'Payments' }
  ];

  const filteredPlatforms = MOCK_PLATFORMS.filter(platform => {
    const matchesSearch = platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         platform.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || platform.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Shell>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Platform Recommendations</h1>
          <p className="text-muted-foreground">
            Discover the best tools for your community across 12 categories
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search platforms..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full justify-start flex-wrap h-auto">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Recommended for You */}
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-start gap-4">
            <Star className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Recommended Starter Stack</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Based on your community profile, we recommend starting with these platforms:
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-sm">WhatsApp</Badge>
                <Badge variant="secondary" className="text-sm">Luma</Badge>
                <Badge variant="secondary" className="text-sm">Airtable</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Platforms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlatforms.map((platform) => (
            <Card key={platform.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold">{platform.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {platform.category.replace('-', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{platform.description}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium mb-1">Best For:</p>
                    <div className="flex flex-wrap gap-1">
                      {platform.bestFor.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Pricing:</p>
                    <p className="text-muted-foreground">{platform.pricing}</p>
                  </div>

                  {platform.integrations.length > 0 && (
                    <div>
                      <p className="font-medium">Integrates with:</p>
                      <p className="text-muted-foreground">{platform.integrations.join(', ')}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    Add to Stack
                  </Button>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredPlatforms.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No platforms found matching your search.</p>
          </Card>
        )}
      </div>
    </Shell>
  );
};

export default PlatformsRecommendations;
