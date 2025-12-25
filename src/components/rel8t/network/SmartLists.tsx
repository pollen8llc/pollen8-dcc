import { mockNetworkContacts, industries } from "@/data/mockNetworkData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Building2, Globe, Users } from "lucide-react";

export function SmartLists() {
  // Calculate industry distribution
  const industryData = industries.map(industry => ({
    name: industry,
    value: mockNetworkContacts.filter(c => c.industry === industry).length
  })).filter(d => d.value > 0);

  // Color palette for pie chart
  const COLORS = [
    'hsl(174, 100%, 46%)',
    'hsl(217, 91%, 60%)',
    'hsl(271, 91%, 65%)',
    'hsl(330, 81%, 60%)',
    'hsl(25, 95%, 53%)',
    'hsl(142, 71%, 45%)',
    'hsl(48, 96%, 53%)',
    'hsl(0, 84%, 60%)',
  ];

  // Calculate relationship type distribution
  const typeDistribution = [
    { type: 'collaborator', label: 'Collaborators', count: mockNetworkContacts.filter(c => c.relationshipType === 'collaborator').length },
    { type: 'thought_partner', label: 'Thought Partners', count: mockNetworkContacts.filter(c => c.relationshipType === 'thought_partner').length },
    { type: 'creative_peer', label: 'Creative Peers', count: mockNetworkContacts.filter(c => c.relationshipType === 'creative_peer').length },
    { type: 'socialite', label: 'Connectors', count: mockNetworkContacts.filter(c => c.relationshipType === 'socialite').length },
    { type: 'mentor', label: 'Mentors', count: mockNetworkContacts.filter(c => c.relationshipType === 'mentor').length },
    { type: 'mentee', label: 'Mentees', count: mockNetworkContacts.filter(c => c.relationshipType === 'mentee').length },
    { type: 'influencer', label: 'Influencers', count: mockNetworkContacts.filter(c => c.relationshipType === 'influencer').length },
    { type: 'career_ally', label: 'Career Allies', count: mockNetworkContacts.filter(c => c.relationshipType === 'career_ally').length },
    { type: 'future_opportunity', label: 'Future Opportunities', count: mockNetworkContacts.filter(c => c.relationshipType === 'future_opportunity').length },
  ].filter(d => d.count > 0);

  // Location distribution
  const locations = [...new Set(mockNetworkContacts.map(c => c.location))];
  const locationData = locations.map(loc => ({
    location: loc,
    count: mockNetworkContacts.filter(c => c.location === loc).length
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Geographic Distribution */}
      <Card className="glass-card md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Geographic Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locationData.map((loc, index) => (
              <div 
                key={loc.location}
                className="p-4 rounded-lg bg-card/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-2 h-8 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{loc.location}</span>
                </div>
                <span className="text-2xl font-bold text-primary">{loc.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Industry Distribution */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Industry Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(215 25% 10%)', 
                    border: '1px solid hsl(215 25% 18%)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Relationship Types */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Relationship Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {typeDistribution.map((item, index) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{item.label}</span>
                </div>
                <Badge variant="secondary">{item.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
