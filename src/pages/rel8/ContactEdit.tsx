import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Trash2, Mail, Phone, MapPin, Building, User, Tag, Edit, Settings, UserPlus, Heart, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Rel8Header } from "@/components/rel8t/Rel8Header";
import ContactForm from "@/components/rel8t/ContactForm";
import { NominationDialog } from "@/components/nomin8/NominationDialog";
import { useUser } from "@/contexts/UserContext";
import { 
  getContactById, 
  updateContact, 
  deleteContact 
} from "@/services/rel8t/contactService";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ContactEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUser } = useUser();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nominationDialogOpen, setNominationDialogOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<'view' | 'edit' | 'manage' | 'engage'>('view');

  // Fetch contact details
  const { data: contact, isLoading } = useQuery({
    queryKey: ["contact", id],
    queryFn: () => getContactById(id as string),
    enabled: !!id,
  });

  // Update contact mutation
  const updateMutation = useMutation({
    mutationFn: async (values: any) => {
      if (!id) throw new Error("Contact ID is required");
      
      console.log("ContactEdit mutation - received values:", values);
      
      // Update basic contact data
      const updatedContact = await updateContact(id, values);
      
      return updatedContact;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contact", id] });
      toast({
        title: "Contact updated",
        description: "Contact has been successfully updated.",
      });
      navigate("/rel8/contacts");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update contact.",
        variant: "destructive",
      });
    },
  });

  // Delete contact mutation
  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!id) throw new Error("Contact ID is required");
      return deleteContact(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast({
        title: "Contact deleted",
        description: "Contact has been successfully deleted.",
      });
      navigate("/rel8/contacts");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete contact.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (values: any) => {
    updateMutation.mutate(values);
  };

  const handleCancel = () => {
    navigate("/rel8/contacts");
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Determine the correct user ID for avatar display
  const getAvatarUserId = () => {
    if (!contact) return "UXI8000";
    
    // First check if contact has an affiliated user (nominated member)
    const userAffiliation = contact.affiliations?.find(
      (aff: any) => aff.affiliation_type === 'user' && aff.affiliated_user_id
    );
    
    if (userAffiliation?.affiliated_user_id) {
      return userAffiliation.affiliated_user_id;
    }
    
    // Fallback: check if contact has a member role
    const isMember = contact.role && contact.role.toLowerCase().includes('member');
    return isMember ? contact.user_id : "UXI8000";
  };

  const handleModeChange = (mode: 'view' | 'edit' | 'manage' | 'engage') => {
    setCurrentMode(mode);
  };

  const handleManageAction = (action: string) => {
    if (action === "NOMINATE") {
      setNominationDialogOpen(true);
    } else if (action === "EVALUATE") {
      // Navigate to evaluation page
      navigate(`/elavu8/${id}`);
    } else {
      toast({
        title: "Coming Soon",
        description: `${action} feature will be available soon.`,
      });
    }
  };

  const handleEngageAction = (action: string) => {
    toast({
      title: "Coming Soon", 
      description: `${action} feature will be available soon.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Rel8Header showProfileBanner={false} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary" />
              <p className="mt-4 text-muted-foreground">Loading contact details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!contact && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Rel8Header showProfileBanner={false} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4 text-muted-foreground">Contact not found</h2>
            <p className="text-muted-foreground mt-2">The contact you're looking for doesn't exist.</p>
            <Button 
              onClick={() => navigate("/rel8/contacts")}
              variant="outline"
              size="sm"
              className="mt-4 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Contacts
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Rel8Header showProfileBanner={false} />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/rel8">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/rel8/contacts">Contacts</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Edit Contact</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Button aligned right */}
        <div className="flex">
          <Button
            onClick={() => navigate('/rel8/contacts')}
            variant="outline"
            size="sm"
            className="ml-auto flex items-center gap-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Contacts</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        {contact && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <Avatar userId={getAvatarUserId()} size={80} className="mx-auto sm:mx-0" />
              
              <div className="flex-1 space-y-3 w-full text-center sm:text-left">
                <div>
                  <h1 className="text-2xl font-bold">{contact.name}</h1>
                  {contact.email && (
                    <p className="text-muted-foreground">{contact.email}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
                  {contact.organization && (
                    <Badge variant="outline" className="bg-muted/20 border-muted">
                      <Building className="w-3 h-3 mr-1" />
                      {contact.organization}
                    </Badge>
                  )}
                  {contact.role && (
                    <Badge variant="outline" className="bg-muted/20 border-muted">
                      <User className="w-3 h-3 mr-1" />
                      {contact.role}
                    </Badge>
                  )}
                  {contact.location && (
                    <Badge variant="outline" className="bg-muted/20 border-muted">
                      <MapPin className="w-3 h-3 mr-1" />
                      {contact.location}
                    </Badge>
                  )}
                </div>

                {/* Dynamic Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 w-full justify-center sm:justify-start">
                  {currentMode === 'view' && (
                    <>
                      <Button 
                        onClick={() => handleModeChange('edit')} 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        onClick={() => handleModeChange('manage')} 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                      <Button 
                        onClick={() => handleModeChange('engage')} 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Engage
                      </Button>
                    </>
                  )}
                  
                  {currentMode === 'edit' && (
                    <>
                      <Button 
                        onClick={() => handleModeChange('view')} 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={updateMutation.isPending || deleteMutation.isPending}
                        className="w-full sm:w-auto flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </>
                  )}

                  {currentMode === 'manage' && (
                    <>
                      <Button 
                        onClick={() => handleModeChange('view')} 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button 
                        onClick={() => handleManageAction("NOMINATE")} 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Nominate
                      </Button>
                      <Button 
                        onClick={() => handleManageAction("EVALUATE")} 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Evaluate
                      </Button>
                    </>
                  )}

                  {currentMode === 'engage' && (
                    <>
                      <Button 
                        onClick={() => handleModeChange('view')} 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button 
                        onClick={() => handleEngageAction("BUILD RAPPORT")} 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Build Rapport
                      </Button>
                      <Button 
                        onClick={() => handleEngageAction("SEND INVITE")} 
                        variant="outline" 
                        size="sm"
                        disabled={!contact.email}
                        className="w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Invite
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {currentMode === 'edit' ? (
              /* Edit Form */
              <Card className="bg-card/40 backdrop-blur-md border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle>Edit Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContactForm
                    initialValues={{
                      name: contact.name,
                      email: contact.email || '',
                      phone: contact.phone || '',
                      organization: contact.organization || '',
                      role: contact.role || '',
                      notes: contact.notes || '',
                      tags: contact.tags || [],
                      category_id: contact.category_id || '',
                      location: contact.location || ''
                    }}
                    onSubmit={handleSubmit}
                    onCancel={() => handleModeChange('view')}
                    isSubmitting={updateMutation.isPending}
                  />
                </CardContent>
              </Card>
            ) : (
              /* Profile View */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <Card className="bg-card/40 backdrop-blur-md border border-border/50 shadow-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {contact.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{contact.email}</span>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{contact.phone}</span>
                      </div>
                    )}
                    {contact.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{contact.location}</span>
                      </div>
                    )}
                    {contact.organization && (
                      <div className="flex items-center gap-3">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{contact.organization}</div>
                          {contact.role && <div className="text-xs text-muted-foreground">{contact.role}</div>}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Groups & Category */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-primary" />
                      Organization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {contact.tags && contact.tags.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {contact.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notes Section - Only show in profile view */}
            {currentMode !== 'edit' && contact.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {contact.notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the contact
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactEdit;