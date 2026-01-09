import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Rel8Header } from "@/components/rel8t/Rel8Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, MapPin } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UnifiedAvatar } from "@/components/ui/unified-avatar";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Contact {
  id: string;
  name: string;
  email: string | null;
  organization: string | null;
  location: string | null;
  industry: string | null;
}

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { toast } = useToast();
  const [category, setCategory] = useState<Category | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategoryAndContacts = async () => {
      if (!currentUser || !id) return;

      setIsLoading(true);
      try {
        // Load category
        const { data: categoryData, error: categoryError } = await supabase
          .from('rms_contact_categories')
          .select('*')
          .eq('id', id)
          .eq('user_id', currentUser.id)
          .single();

        if (categoryError) throw categoryError;
        setCategory(categoryData);

        // Load contacts for this category
        const { data: contactsData, error: contactsError } = await supabase
          .from('rms_contacts')
          .select('id, name, email, organization, location, industry')
          .eq('user_id', currentUser.id)
          .eq('category_id', id)
          .order('name');

        if (contactsError) throw contactsError;
        setContacts(contactsData || []);
      } catch (error: any) {
        console.error('Error loading category:', error);
        toast({
          title: "Failed to load category",
          description: error.message,
          variant: "destructive"
        });
        navigate('/rel8/categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryAndContacts();
  }, [currentUser, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Rel8Header />
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex justify-center py-12">Loading...</div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Rel8Header />
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Category not found</p>
            <Button onClick={() => navigate('/rel8/categories')} className="mt-4">
              Back to Categories
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Rel8Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-4 sm:py-8 pb-32 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mt-4 sm:mt-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/rel8/categories')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: category.color || '#6366f1' }} 
            />
            <div>
              <h1 className="text-2xl font-bold">{category.name}</h1>
              <p className="text-sm text-muted-foreground">
                {contacts.length} contact{contacts.length !== 1 ? 's' : ''} in this category
              </p>
            </div>
          </div>
        </div>

        {/* Contacts Grid */}
        {contacts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {contacts.map((contact) => (
              <Link 
                key={contact.id} 
                to={`/rel8/contactprofile/${contact.id}`}
                className="block"
              >
                <Card className="h-full cursor-pointer hover:shadow-lg transition-all hover:border-primary/30 group">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-2 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                        <UnifiedAvatar userId="UXI8000" size={32} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                          {contact.name}
                        </h3>
                        {contact.organization && (
                          <p className="text-sm text-muted-foreground truncate">
                            {contact.organization}
                          </p>
                        )}
                        {contact.location && (
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <p className="text-xs text-muted-foreground truncate">
                              {contact.location}
                            </p>
                          </div>
                        )}
                        {contact.industry && (
                          <Badge 
                            variant="outline" 
                            className="text-xs mt-2 bg-secondary/20 border-secondary/40"
                          >
                            {contact.industry}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg">No contacts in this category</h3>
              <p className="text-muted-foreground mb-4">
                Add contacts to this category to see them here
              </p>
              <Button onClick={() => navigate(`/rel8/contacts/new?category=${id}`)}>
                Add Contact
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
