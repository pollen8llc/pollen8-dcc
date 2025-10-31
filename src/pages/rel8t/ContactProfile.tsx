import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Rel8Header } from '@/components/rel8t/Rel8Header';
import { ContactHeader } from '@/components/rel8t/ContactHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProfileCard from '@/components/connections/ProfileCard';
import { Mail, Phone, MapPin, Building, Calendar, MessageSquare, Users } from 'lucide-react';

// Mock data - replace with actual data fetching
const mockContact = {
  id: '1',
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '(555) 123-4567',
  location: 'San Francisco, CA',
  company: 'Tech Corp Inc.',
  category: 'Partner',
  status: 'active' as const,
  tags: ['VIP', 'Tech'],
  bio: 'Experienced technology executive with over 15 years in the industry. Passionate about innovation and building strong business relationships. Always looking to connect with like-minded professionals.',
  lastEventAttended: '2024-01-15',
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
      <Rel8Header showProfileBanner />
      
      <div className="container mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Contact Header */}
        <ContactHeader
          contactId={mockContact.id}
          name={mockContact.name}
          category={mockContact.category}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Column 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{mockContact.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{mockContact.phone}</p>
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{mockContact.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{mockContact.company}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Width Bio/Notes */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Bio / Notes</p>
              <p className="text-sm leading-relaxed">{mockContact.bio}</p>
              {mockContact.notes && (
                <div className="mt-4 p-3 rounded-lg bg-muted/50">
                  <p className="text-sm">{mockContact.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Contact Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Contact Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Column 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${mockContact.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{mockContact.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Event Attended</p>
                    <p className="font-medium">{new Date(mockContact.lastEventAttended).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Communication</p>
                    <p className="font-medium">{new Date(mockContact.lastCommunication).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Introduction</p>
                    <p className="font-medium">{new Date(mockContact.lastIntroduction).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Width Status Footer Bar */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                <div className="flex items-center gap-4">
                  <Badge variant="teal">Engagement Score: 85%</Badge>
                  <Badge variant="tag">3 Events This Year</Badge>
                  <Badge variant="tag">12 Interactions</Badge>
                </div>
                <Badge variant="popularTag">High Priority</Badge>
              </div>
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockAssociatedContacts.map((contact) => (
                <ProfileCard
                  key={contact.id}
                  profile={contact as any}
                  connectionDepth={1}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
