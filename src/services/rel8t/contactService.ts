
import { supabase } from "@/integrations/supabase/client";

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  organization?: string;
  role?: string;
  notes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
  category?: string;
  last_contact_date?: string;
}

export interface ContactCategory {
  id: string;
  name: string;
  color: string;
  user_id: string;
}

// Get all contacts
export const getContacts = async (options?: { searchQuery?: string }): Promise<Contact[]> => {
  let query = supabase
    .from("rms_contacts")
    .select("*");
  
  if (options?.searchQuery) {
    query = query.or(`name.ilike.%${options.searchQuery}%,email.ilike.%${options.searchQuery}%,organization.ilike.%${options.searchQuery}%`);
  }
  
  const { data, error } = await query.order("name");
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data || [];
};

// Get contact count
export const getContactCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from("rms_contacts")
    .select("*", { count: 'exact', head: true });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return count || 0;
};

// Get a contact by ID
export const getContactById = async (id: string): Promise<Contact> => {
  const { data, error } = await supabase
    .from("rms_contacts")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Create a new contact
export const createContact = async (contact: Omit<Contact, "id" | "created_at" | "updated_at" | "user_id">): Promise<Contact> => {
  const { data: user } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from("rms_contacts")
    .insert([{ ...contact, user_id: user.user?.id }])
    .select();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data[0];
};

// Update a contact
export const updateContact = async (id: string, contact: Partial<Contact>): Promise<Contact> => {
  const { data, error } = await supabase
    .from("rms_contacts")
    .update(contact)
    .eq("id", id)
    .select();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data[0];
};

// Delete a contact
export const deleteContact = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("rms_contacts")
    .delete()
    .eq("id", id);
  
  if (error) {
    throw new Error(error.message);
  }
};

// Get contact categories
export const getCategories = async (): Promise<ContactCategory[]> => {
  const { data, error } = await supabase
    .from("rms_contact_categories")
    .select("*")
    .order("name");
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data || [];
};

// Create a new category
export const createCategory = async (category: Omit<ContactCategory, "id" | "user_id">): Promise<ContactCategory> => {
  const { data: user } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from("rms_contact_categories")
    .insert([{ ...category, user_id: user.user?.id }])
    .select();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data[0];
};

// Update a category
export const updateCategory = async (id: string, category: Partial<ContactCategory>): Promise<ContactCategory> => {
  const { data, error } = await supabase
    .from("rms_contact_categories")
    .update(category)
    .eq("id", id)
    .select();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data[0];
};

// Delete a category
export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("rms_contact_categories")
    .delete()
    .eq("id", id);
  
  if (error) {
    throw new Error(error.message);
  }
};
