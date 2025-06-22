
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  DollarSign, 
  Calendar, 
  Scale, 
  Megaphone, 
  Laptop, 
  Store, 
  Handshake, 
  Users 
} from 'lucide-react';

interface Domain {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  providers: number;
}

const domains: Domain[] = [
  {
    id: 1,
    title: "Fundraising & Sponsorship",
    description: "Grant writers, fundraising consultants, sponsor prospecting agencies",
    icon: DollarSign,
    color: "bg-green-500",
    providers: 24
  },
  {
    id: 2,
    title: "Event Production & Logistics",
    description: "Venue managers, caterers, AV techs, security, insurance",
    icon: Calendar,
    color: "bg-blue-500",
    providers: 18
  },
  {
    id: 3,
    title: "Legal & Compliance",
    description: "Legal advisors, accountants, permit specialists, insurance brokers",
    icon: Scale,
    color: "bg-purple-500",
    providers: 12
  },
  {
    id: 4,
    title: "Marketing & Communications",
    description: "Designers, developers, social media managers, printers, PR",
    icon: Megaphone,
    color: "bg-orange-500",
    providers: 31
  },
  {
    id: 5,
    title: "Technology & Digital Infrastructure",
    description: "App/web developers, CRM consultants, livestream techs",
    icon: Laptop,
    color: "bg-indigo-500",
    providers: 22
  },
  {
    id: 6,
    title: "Vendor & Marketplace Management",
    description: "Vendor managers, logistics coordinators, payment processors",
    icon: Store,
    color: "bg-pink-500",
    providers: 15
  },
  {
    id: 7,
    title: "Partnership Development & Collaboration",
    description: "Collab consultants, brokers, network facilitators",
    icon: Handshake,
    color: "bg-teal-500",
    providers: 19
  },
  {
    id: 8,
    title: "Community Engagement & Relationship Management",
    description: "Community managers, engagement strategists, DEI consultants",
    icon: Users,
    color: "bg-cyan-500",
    providers: 27
  }
];

const ModernModul8Dashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

  const handleDomainSelect = (domain: Domain) => {
    setSelectedDomain(domain);
    // Store selected domain in sessionStorage for use in directory
    sessionStorage.setItem('selectedDomain', JSON.stringify(domain));
    navigate('/modul8/directory');
  };

  const handleViewStatus = () => {
    navigate('/modul8/status');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Modul8</h1>
              <p className="text-muted-foreground mt-2">
                Connect with service providers across 8 key domains
              </p>
            </div>
            <Button onClick={handleViewStatus} variant="outline">
              View My Projects
            </Button>
          </div>
        </div>

        {/* Domain Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {domains.map((domain) => {
            const Icon = domain.icon;
            return (
              <Card 
                key={domain.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handleDomainSelect(domain)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", domain.color)}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {domain.providers} providers
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {domain.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {domain.description}
                  </p>
                  <Button className="w-full group-hover:bg-primary/90">
                    Explore Providers
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm">Your recent provider engagements will appear here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModernModul8Dashboard;
