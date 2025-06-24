
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Labr8Navigation } from "@/components/labr8/Labr8Navigation";
import {
  Search,
  Filter,
  Plus,
  Star,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  DollarSign,
  TrendingUp,
  MessageSquare,
  FileText,
  Eye
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  avatar?: string;
  status: 'Active' | 'Inactive' | 'Potential';
  rating: number;
  totalProjects: number;
  totalSpent: number;
  lastContact: string;
  tags: string[];
  industry: string;
  notes: string;
}

const ClientDatabase: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Mock client data
  const clients: Client[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      company: "Tech Startup Inc.",
      email: "sarah@techstartup.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      status: "Active",
      rating: 5,
      totalProjects: 8,
      totalSpent: 45000,
      lastContact: "2 days ago",
      tags: ["VIP", "Tech"],
      industry: "Technology",
      notes: "Excellent client, always pays on time. Prefers modern designs."
    },
    {
      id: "2",
      name: "Michael Chen",
      company: "Marketing Agency",
      email: "m.chen@marketingpro.com",
      phone: "+1 (555) 234-5678",
      location: "New York, NY",
      status: "Active",
      rating: 4,
      totalProjects: 12,
      totalSpent: 67000,
      lastContact: "1 week ago",
      tags: ["Marketing", "Regular"],
      industry: "Marketing",
      notes: "Great communication, long-term partnership."
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      company: "E-commerce Co.",
      email: "emily@ecommerce.com",
      phone: "+1 (555) 345-6789",
      location: "Austin, TX",
      status: "Potential",
      rating: 0,
      totalProjects: 0,
      totalSpent: 0,
      lastContact: "3 days ago",
      tags: ["New Lead"],
      industry: "E-commerce",
      notes: "Interested in mobile app development. Follow up next week."
    }
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    const matchesIndustry = industryFilter === "all" || client.industry === industryFilter;
    
    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Inactive': return 'bg-gray-100 text-gray-700';
      case 'Potential': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Labr8Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Client Database</h1>
            <p className="text-muted-foreground">Manage your client relationships and project history</p>
          </div>
          
          <Button className="bg-[#00eada] hover:bg-[#00eada]/90 text-black">
            <Plus className="h-4 w-4 mr-2" />
            Add New Client
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search clients by name, company, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Potential">Potential</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="E-commerce">E-commerce</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Client Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={client.avatar} />
                      <AvatarFallback className="bg-[#00eada]/10 text-[#00eada]">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{client.name}</h3>
                      <p className="text-sm text-muted-foreground">{client.company}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(client.status)}>
                    {client.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{client.location}</span>
                  </div>
                </div>

                {/* Rating */}
                {client.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(client.rating)}</div>
                    <span className="text-sm text-muted-foreground">({client.rating}/5)</span>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-lg font-semibold">{client.totalProjects}</div>
                    <div className="text-xs text-muted-foreground">Projects</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-lg font-semibold">${client.totalSpent.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Spent</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {client.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedClient(client)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Client Details</DialogTitle>
                      </DialogHeader>
                      {selectedClient && (
                        <ClientDetailView client={selectedClient} />
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Building className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
            <p className="text-gray-500">Try adjusting your search filters or add a new client.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Client Detail View Component
const ClientDetailView: React.FC<{ client: Client }> = ({ client }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-[#00eada]/10 text-[#00eada] text-lg">
            {client.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{client.name}</h2>
          <p className="text-lg text-muted-foreground">{client.company}</p>
          <div className="flex items-center gap-4 mt-2">
            <Badge className={`${client.status === 'Active' ? 'bg-green-100 text-green-700' : 
                                client.status === 'Potential' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'}`}>
              {client.status}
            </Badge>
            {client.rating > 0 && (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < client.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-1">({client.rating}/5)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{client.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span>{client.industry}</span>
                </div>
              </CardContent>
            </Card>

            {/* Project Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#00eada]">{client.totalProjects}</div>
                    <div className="text-sm text-muted-foreground">Total Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">${client.totalSpent.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {client.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Project History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Project history will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="communications">
          <Card>
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Communication history will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{client.notes}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDatabase;
