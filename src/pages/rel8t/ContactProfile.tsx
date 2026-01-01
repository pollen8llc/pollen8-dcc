import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { Rel8Header } from '@/components/rel8t/Rel8Header';
import { ContactHeader } from '@/components/rel8t/ContactHeader';
import { AnalyzeCard } from '@/components/rel8t/AnalyzeCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProfileCard from '@/components/connections/ProfileCard';
import { Mail, Phone, MapPin, Building2, Tag, Heart, Loader2, User, UserPlus, Cake, Calendar, Target, Users } from 'lucide-react';
import { getContactById } from "@/services/rel8t/contactService";
import { format } from "date-fns";

// Helper to show placeholder text for empty fields
const EmptyPlaceholder = ({ text }: { text: string }) => (
  <span className="text-muted-foreground/50 italic">{text}</span>
);

export default function ContactProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: contact, isLoading } = useQuery({
    queryKey: ["contact", id],
    queryFn: () => getContactById(id!),
    enabled: !!id,
  });

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

  // Extract affiliated user ID if exists (from joined profile data)
  const affiliatedUserId = contact.affiliations
    ?.find(aff => aff.affiliation_type === 'user' && aff.affiliated_user?.user_id)
    ?.affiliated_user?.user_id;

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

  const getRapportStatusColor = (status?: string) => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'red': return 'bg-red-500';
      case 'yellow':
      default: return 'bg-yellow-500';
    }
  };

  const getRapportStatusText = (status?: string) => {
    switch (status) {
      case 'green': return 'Strong Relationship';
      case 'red': return 'Cold / Needs Attention';
      case 'yellow':
      default: return 'Warm / Neutral';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Rel8Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-6 space-y-6 animate-fade-in">
        <ContactHeader
          contactId={contact.id}
          name={contact.preferred_name || contact.name}
          category={contact.category?.name || "Uncategorized"}
          status={(contact.status || "active") as "active" | "inactive"}
          tags={contact.tags || []}
          affiliatedUserId={affiliatedUserId}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Personal Identity & Context */}
        <Card className="glass-morphism bg-card/80 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Identity & Context
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Column 1 */}
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 md:h-5 md:w-5 text-primary/70 mt-1" />
                  <div>
                    <div className="text-xs md:text-sm text-muted-foreground">Full Name</div>
                    <div className="text-sm md:text-base font-medium">{contact.name}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 md:h-5 md:w-5 text-primary/70 mt-1" />
                  <div>
                    <div className="text-xs md:text-sm text-muted-foreground">Preferred Name</div>
                    <div className="text-sm md:text-base">
                      {contact.preferred_name || <EmptyPlaceholder text="No preferred name set" />}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary/70 mt-1" />
                  <div>
                    <div className="text-xs md:text-sm text-muted-foreground">Location</div>
                    <div className="text-sm md:text-base">
                      {contact.location || <EmptyPlaceholder text="No location specified" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 md:h-5 md:w-5 text-primary/70 mt-1" />
                  <div>
                    <div className="text-xs md:text-sm text-muted-foreground">Email</div>
                    <div className="text-sm md:text-base">
                      {contact.email || <EmptyPlaceholder text="No email added" />}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 md:h-5 md:w-5 text-primary/70 mt-1" />
                  <div>
                    <div className="text-xs md:text-sm text-muted-foreground">Phone</div>
                    <div className="text-sm md:text-base">
                      {contact.phone || <EmptyPlaceholder text="No phone added" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-3 md:pt-4 border-t border-border/50 mt-4">
              <h4 className="font-semibold mb-2 text-sm md:text-base">Bio</h4>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {contact.bio || <EmptyPlaceholder text="No bio added" />}
              </p>
            </div>
            
            <div className="pt-3 md:pt-4 border-t border-border/50 mt-4">
              <h4 className="font-semibold mb-2 text-sm md:text-base flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Hobbies / Interests
              </h4>
              {contact.interests && contact.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {contact.interests.map((interest) => (
                    <Badge key={interest} variant="outline" className="hover:scale-105 transition-transform">
                      {interest}
                    </Badge>
                  ))}
                </div>
              ) : (
                <EmptyPlaceholder text="No interests added" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analyze Card */}
        <AnalyzeCard contactId={contact.id} contactName={contact.preferred_name || contact.name} />

        {/* Relevant Dates */}
        <Card className="glass-morphism bg-card/80 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cake className="h-5 w-5 text-primary" />
              Relevant Dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="flex items-start gap-3">
                <Cake className="h-4 w-4 md:h-5 md:w-5 text-primary/70 mt-1" />
                <div>
                  <div className="text-xs md:text-sm text-muted-foreground">Birthday</div>
                  <div className="text-sm md:text-base">
                    {contact.birthday 
                      ? format(new Date(contact.birthday), "MMM d, yyyy")
                      : <EmptyPlaceholder text="No birthday added" />
                    }
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary/70 mt-1" />
                <div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    Anniversary {contact.anniversary_type && `(${contact.anniversary_type})`}
                  </div>
                  <div className="text-sm md:text-base">
                    {contact.anniversary 
                      ? format(new Date(contact.anniversary), "MMM d, yyyy")
                      : <EmptyPlaceholder text="No anniversary added" />
                    }
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 md:col-span-2">
                <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary/70 mt-1" />
                <div>
                  <div className="text-xs md:text-sm text-muted-foreground">Upcoming Event</div>
                  {contact.upcoming_event ? (
                    <>
                      <div className="text-sm md:text-base font-medium">{contact.upcoming_event}</div>
                      {contact.upcoming_event_date && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {format(new Date(contact.upcoming_event_date), "MMM d, yyyy")}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-sm md:text-base">
                      <EmptyPlaceholder text="No upcoming event" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional */}
        <Card className="glass-morphism bg-card/80 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Professional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 md:h-5 md:w-5 text-primary/70 mt-1" />
                <div>
                  <div className="text-xs md:text-sm text-muted-foreground">Current Company</div>
                  <div className="text-sm md:text-base">
                    {contact.organization || <EmptyPlaceholder text="No company specified" />}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 md:h-5 md:w-5 text-primary/70 mt-1" />
                <div>
                  <div className="text-xs md:text-sm text-muted-foreground">Role / Title</div>
                  <div className="text-sm md:text-base">
                    {contact.role || <EmptyPlaceholder text="No role specified" />}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 md:h-5 md:w-5 text-primary/70 mt-1" />
                <div>
                  <div className="text-xs md:text-sm text-muted-foreground">Industry / Category</div>
                  <div className="text-sm md:text-base">
                    {contact.industry || <EmptyPlaceholder text="No industry specified" />}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Tag className="h-4 w-4 md:h-5 md:w-5 text-primary/70 mt-1" />
                <div>
                  <div className="text-xs md:text-sm text-muted-foreground">Relationship Category</div>
                  {contact.category ? (
                    <Badge variant="outline" style={{ borderColor: contact.category.color }}>
                      {contact.category.name}
                    </Badge>
                  ) : (
                    <EmptyPlaceholder text="No category assigned" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="pt-3 md:pt-4 border-t border-border/50">
              <h4 className="font-semibold mb-2 text-sm md:text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                Professional Goals / Current Focus
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {contact.professional_goals || <EmptyPlaceholder text="No goals specified" />}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Social Graph / Community Context */}
        <Card className="glass-morphism bg-card/80 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Social Graph / Community Context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {contact.how_we_met && (
              <div>
                <h4 className="font-semibold mb-2 text-sm md:text-base">How You Met / Shared Context</h4>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{contact.how_we_met}</p>
              </div>
            )}
            
            {contact.events_attended && contact.events_attended.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-sm md:text-base">Events They Attend</h4>
                <div className="flex flex-wrap gap-2">
                  {contact.events_attended.map((event) => (
                    <Badge key={event} variant="secondary" className="hover:scale-105 transition-transform">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {contact.tags && contact.tags.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-sm md:text-base">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="hover:scale-105 transition-transform">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Notes */}
        {contact.notes && (
          <Card className="glass-morphism bg-card/80 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{contact.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Associated Contacts */}
        {associatedContacts.length > 0 && (
          <Card className="glass-morphism bg-card/80 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Associated Contacts ({associatedContacts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
