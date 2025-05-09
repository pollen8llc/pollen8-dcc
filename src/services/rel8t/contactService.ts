
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Contact {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  organization?: string;
  role?: string;
  community_id?: string;
  notes?: string;
  last_contact_date?: string;
  created_at?: string;
  updated_at?: string;
}

export const getContacts = async (): Promise<Contact[]> => {
  try {
    const { data, error } = await supabase
      .from("rms_contacts")
      .select("*, communities(name)")
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
      .select("*, communities(name)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error(`Error fetching contact ${id}:`, error);
    toast({
      title: "Error fetching contact",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const createContact = async (contact: Omit<Contact, "id" | "user_id" | "created_at" | "updated_at">): Promise<Contact | null> => {
  try {
    const { data, error } = await supabase
      .from("rms_contacts")
      .insert([contact])
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Contact created",
      description: "Contact has been successfully created.",
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

export const updateContact = async (id: string, contact: Partial<Contact>): Promise<Contact | null> => {
  try {
    const { data, error } = await supabase
      .from("rms_contacts")
      .update(contact)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Contact updated",
      description: "Contact has been successfully updated.",
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
      description: "Contact has been successfully removed.",
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

export const getContactsByCommunityCounts = async (): Promise<{ communityName: string; count: number }[]> => {
  try {
    const { data, error } = await supabase
      .from("rms_contacts")
      .select(`
        communities (
          id,
          name
        )
      `);

    if (error) throw error;

    const communityMap = new Map<string, { communityName: string; count: number }>();
    
    data.forEach((record) => {
      if (record.communities) {
        const communityName = record.communities.name;
        const existing = communityMap.get(record.communities.id) || { 
          communityName,
          count: 0
        };
        existing.count++;
        communityMap.set(record.communities.id, existing);
      }
    });

    return Array.from(communityMap.values());
  } catch (error: any) {
    console.error("Error fetching community contact counts:", error);
    return [];
  }
};

export const getContactCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from("rms_contacts")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error fetching contact count:", error);
    return 0;
  }
};
