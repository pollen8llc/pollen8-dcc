import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent } from '@/components/ui/card';
import { Rel8Header } from "@/components/rel8t/Rel8Header";
import ContactForm from "@/components/rel8t/ContactForm";
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
      navigate(`/rel8/contactprofile/${id}`);
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
    if (id) {
      navigate(`/rel8/contactprofile/${id}`);
    } else {
      navigate("/rel8/contacts");
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
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
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/rel8" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/rel8/contacts" className="text-muted-foreground hover:text-primary transition-colors">
                  Contacts
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink className="text-foreground font-medium">Edit Contact</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {contact && (
          <Card className="backdrop-blur-md bg-card/80 border-primary/20 shadow-lg hover:shadow-primary/10 transition-shadow">
            <CardContent className="p-8">
              {/* Header Section */}
              <div className="flex justify-between items-start mb-8 pb-6 border-b border-border/50">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Edit Contact
                  </h2>
                  <p className="text-muted-foreground mt-2">Update contact information and details</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCancel} 
                    variant="outline" 
                    size="sm"
                    className="hover:bg-primary/10 hover:border-primary/50 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleDelete} 
                    variant="destructive" 
                    size="sm"
                    className="hover:shadow-lg hover:shadow-destructive/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Form Section */}
              <ContactForm
                initialValues={{
                  name: contact.name,
                  email: contact.email || '',
                  phone: contact.phone || '',
                  organization: contact.organization || '',
                  role: contact.role || '',
                  industry: contact.industry || '',
                  notes: contact.notes || '',
                  tags: contact.tags || [],
                  category_id: contact.category_id || '',
                  location: contact.location || '',
                  status: (contact.status as 'active' | 'inactive') || 'active',
                  interests: contact.interests || [],
                  bio: contact.bio || '',
                  last_introduction_date: contact.last_introduction_date || ''
                }}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={updateMutation.isPending}
              />
            </CardContent>
          </Card>
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