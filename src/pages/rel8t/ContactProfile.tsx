import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { Rel8Header } from '@/components/rel8t/Rel8Header';
import { ContactHeader } from '@/components/rel8t/ContactHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProfileCard from '@/components/connections/ProfileCard';
import { Mail, Phone, MapPin, Building2, Tag, Heart, Loader2, User, UserPlus } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getContactById } from "@/services/rel8t/contactService";
import { format } from "date-fns";

export default function ContactProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: contact, isLoading } = useQuery({
    queryKey: ["contact", id],
    queryFn: () => getContactById(id!),
    enabled: !!id,
  });

  const handleActv8 = () => {
    console.log('Actv8 clicked');
  };

  const handleNomin8 = () => {
    console.log('Nomin8 clicked');
  };

  const handleEvalu8 = () => {
    console.log('Evalu8 clicked');
  };

  const handleEdit = () => {
    navigate(`/rel8/contacts/${id}/edit`);
  };

  const handleDelete = () => {
    console.log('Delete clicked');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Rel8Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-background">
        <Rel8Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Contact not found</p>
        </div>
      </div>
    );
  }

  const associatedContacts = contact.affiliations
    ?.filter(aff => aff.affiliation_type === 'contact' && aff.affiliated_contact)
    .map(aff => ({
      profile: {
        id: aff.affiliated_contact!.id,
        first_name: aff.affiliated_contact!.name.split(' ')[0] || '',
        last_name: aff.affiliated_contact!.name.split(' ').slice(1).join(' ') || '',
        location: aff.affiliated_contact!.location || '',
        bio: aff.affiliated_contact!.organization || '',
        interests: [],
      }
    })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Rel8Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-6 space-y-6 animate-fade-in">
        <ContactHeader
          contactId={contact.id}
          name={contact.name}
          category={contact.category?.name || "Uncategorized"}
          status={(contact.status || "active") as "active" | "inactive"}
          tags={contact.tags || []}
          onActv8={handleActv8}
          onNomin8={handleNomin8}
          onEvalu8={handleEvalu8}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Basic Information */}
        <Card className="glass-morphism bg-card/80 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
              {/* Column 1 */}
              <div className="space-y-3 md:space-y-4">
                {contact.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 md:h-5 md:w-5 text-primary/70 mt-1" />
                    <div>
                      <div className="text-xs md:text-sm text-muted-foreground">Email</div>
                      <div className="text-sm md:text-base">{contact.email}</div>
                    </div>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 md:h-5 md:w-5 text-primary/70 mt-1" />
                    <div>
                      <div className="text-xs md:text-sm text-muted-foreground">Phone</div>
                      <div className="text-sm md:text-base">{contact.phone}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Column 2 */}
              <div className="space-y-3 md:space-y-4">
                {contact.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary/70 mt-1" />
                    <div>
                      <div className="text-xs md:text-sm text-muted-foreground">Location</div>
                      <div className="text-sm md:text-base">{contact.location}</div>
                    </div>
                  </div>
                )}
                {contact.organization && (
                  <div className="flex items-start gap-3">
                    <Building2 className="h-4 w-4 md:h-5 md:w-5 text-primary/70 mt-1" />
                    <div>
                      <div className="text-xs md:text-sm text-muted-foreground">Organization</div>
                      <div className="text-sm md:text-base">{contact.organization}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {contact.notes && (
              <div className="pt-3 md:pt-4 border-t border-border/50">
                <h4 className="font-semibold mb-2 text-sm md:text-base">Notes</h4>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{contact.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Teal separator */}
        {contact.bio && (
          <div className="h-px bg-gradient-to-r from-transparent via-[#00eada] to-transparent opacity-50" />
        )}

        {/* Bio - Glassmorphic Card */}
        {contact.bio && (
          <Card 
            className="relative overflow-hidden glass-morphism border-0 backdrop-blur-md" 
            style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)' }}
          >
            <CardContent className="p-6">
              <h4 className="font-semibold mb-3 text-sm md:text-base">Bio</h4>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{contact.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Details */}
        <Card className="glass-morphism bg-card/80 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {contact.tags && contact.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="hover:scale-105 transition-transform">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {contact.category && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Category</h4>
                <Badge variant="outline" style={{ borderColor: contact.category.color }} className="hover:scale-105 transition-transform">
                  {contact.category.name}
                </Badge>
              </div>
            )}
            
            {contact.interests && contact.interests.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {contact.interests.map((interest) => (
                    <Badge key={interest} variant="outline" className="hover:scale-105 transition-transform">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Status & Activity */}
        <Card className="glass-morphism bg-card/80 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Contact Status & Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="status" className="border-border/50">
                <AccordionTrigger className="hover:text-primary">Contact Status</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">Status:</span> {contact.status || "Active"}
                    </p>
                    {contact.last_contact_date && (
                      <p className="text-sm">
                        <span className="font-semibold">Last Contact:</span>{" "}
                        {format(new Date(contact.last_contact_date), "MMM d, yyyy")}
                      </p>
                    )}
                    {contact.last_introduction_date && (
                      <p className="text-sm">
                        <span className="font-semibold">Last Introduction:</span>{" "}
                        {format(new Date(contact.last_introduction_date), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Associated Contacts */}
        <Card className="glass-morphism bg-card/80 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Associated Contacts ({associatedContacts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {associatedContacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {associatedContacts.map((assocContact) => (
                  <div 
                    key={assocContact.profile.id} 
                    className="cursor-pointer hover:scale-105 transition-transform" 
                    onClick={() => navigate(`/rel8/contactprofile/${assocContact.profile.id}`)}
                  >
                    <ProfileCard {...assocContact} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No associated contacts
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
