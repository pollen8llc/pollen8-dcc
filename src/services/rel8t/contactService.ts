
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  organization?: string;
  role?: string;
  notes?: string;
  tags: string[];
  last_contact_date?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export const getContacts = async (): Promise<Contact[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("rms_contacts")
      .select("*")
      .eq("user_id", user.id)
      .order("name");

    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error("Error fetching contacts:", error);
    toast({
      title: "Error fetching contacts",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

export const getContact = async (id: string): Promise<Contact | null> => {
  try {
    const { data, error } = await supabase
      .from("rms_contacts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error(`Error fetching contact ${id}:`, error);
    toast({
      title: "Error fetching contact details",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const createContact = async (contactData: Omit<Contact, "id" | "user_id" | "created_at" | "updated_at">): Promise<Contact | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");
    
    // Ensure tags is an array
    const tags = contactData.tags || [];
    
    // Create the contact with the current user's ID
    const { data, error } = await supabase
      .from("rms_contacts")
      .insert([{ ...contactData, user_id: user.id, tags }])
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Contact created",
      description: "Contact has been successfully added to your network.",
    });
    
    return data;
  } catch (error: any) {
    console.error("Error creating contact:", error);
    toast({
      title: "Error creating contact",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const updateContact = async (id: string, contactData: Partial<Contact>): Promise<Contact | null> => {
  try {
    const { data, error } = await supabase
      .from("rms_contacts")
      .update(contactData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Contact updated",
      description: "Contact details have been successfully updated.",
    });
    
    return data;
  } catch (error: any) {
    console.error(`Error updating contact ${id}:`, error);
    toast({
      title: "Error updating contact",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const deleteContact = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("rms_contacts")
      .delete()
      .eq("id", id);

    if (error) throw error;
    
    toast({
      title: "Contact deleted",
      description: "Contact has been removed from your network.",
    });
    
    return true;
  } catch (error: any) {
    console.error(`Error deleting contact ${id}:`, error);
    toast({
      title: "Error deleting contact",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

export const getContactCount = async (): Promise<number> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");
    
    const { count, error } = await supabase
      .from("rms_contacts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error fetching contact count:", error);
    return 0;
  }
};

// Helper function to get contacts by tags
const getContactsByTags = async (): Promise<{ tagName: string; count: number }[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");
    
    const { data: contacts, error } = await supabase
      .from("rms_contacts")
      .select("tags")
      .eq("user_id", user.id);

    if (error) throw error;
    
    // Create a map to count occurrences of each tag
    const tagCountMap = new Map<string, number>();
    
    // Count tags
    contacts.forEach(contact => {
      if (contact.tags && Array.isArray(contact.tags)) {
        contact.tags.forEach(tag => {
          if (tag) {
            tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1);
          }
        });
      }
    });
    
    // Convert map to array of objects
    return Array.from(tagCountMap.entries()).map(([tagName, count]) => ({
      tagName,
      count
    }));
  } catch (error) {
    console.error("Error counting contacts by tags:", error);
    return [];
  }
};

export const getContactsByCommunityCounts = async (): Promise<{ communityName: string; count: number }[]> => {
  try {
    const tagCounts = await getContactsByTags();
    
    // Convert tag counts to the expected format
    // (since we're no longer using communities, we'll use tags as communities)
    return tagCounts.map(tag => ({
      communityName: tag.tagName,
      count: tag.count
    }));
  } catch (error) {
    console.error("Error fetching contacts by community:", error);
    return [];
  }
};
