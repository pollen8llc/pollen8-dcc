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
  tags?: string[];
  location?: string;
  status?: string;
  interests?: string[];
  bio?: string;
  industry?: string;
  last_introduction_date?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  category_id?: string;
  last_contact_date?: string;
  category?: ContactCategory;
  affiliations?: ContactAffiliation[];
  // New fields for comprehensive profile management
  preferred_name?: string;
  next_followup_date?: string;
  rapport_status?: string;
  preferred_channel?: string;
  birthday?: string;
  anniversary?: string;
  anniversary_type?: string;
  upcoming_event?: string;
  upcoming_event_date?: string;
  professional_goals?: string;
  how_we_met?: string;
  events_attended?: string[];
}

export interface ContactCategory {
  id: string;
  name: string;
  color: string;
  user_id?: string;
}

export interface ContactAffiliation {
  id: string;
  contact_id: string;
  user_id: string;
  affiliated_user_id?: string | null;
  affiliated_contact_id?: string | null;
  affiliated_community_id?: string | null;
  affiliation_type: 'user' | 'contact' | 'community';
  relationship?: string;
  created_at: string;
  updated_at: string;
  affiliated_user?: { user_id: string; id?: string; email?: string } | null | Record<string, any>;
  affiliated_contact?: Contact | null | Record<string, any>;
  affiliated_community?: { id: string; name: string } | null | Record<string, any>;
}

export const getContacts = async (options?: { searchQuery?: string }): Promise<Contact[]> => {
  let query = supabase.from("rms_contacts").select(`*,category:category_id(id,name,color),affiliations:rms_contact_affiliations!contact_id(id,contact_id,user_id,affiliation_type,affiliated_user_id,relationship,created_at,updated_at)`).neq('status', 'pending');
  let searchQuery = "";
  if (options && typeof options === "object" && "searchQuery" in options) {
    searchQuery = options.searchQuery || "";
  }
  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,organization.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
  }
  const { data, error } = await query.order("name");
  if (error) throw new Error(error.message);
  const contacts = (data || []).map(contact => ({...contact,affiliations: contact.affiliations?.map((aff: any) => ({...aff,affiliation_type: aff.affiliation_type as 'user' | 'contact' | 'community',affiliated_user: null,affiliated_contact: null,affiliated_community: null})) || []}));
  return contacts;
};

export const getContactCount = async (): Promise<number> => {
  const { count, error } = await supabase.from("rms_contacts").select("*", { count: 'exact', head: true }).neq('status', 'pending');
  if (error) throw new Error(error.message);
  return count || 0;
};

export const getContactById = async (id: string): Promise<Contact | null> => {
  // First get the contact with category
  const { data: contact, error: contactError } = await supabase
    .from("rms_contacts")
    .select(`
      *,
      category:category_id(id,name,color)
    `)
    .eq("id", id)
    .single();
  
  if (contactError) throw new Error(contactError.message);
  if (!contact) return null;
  
  // Then get affiliations separately with user profile data
  const { data: affiliations, error: affiliationsError } = await supabase
    .from("rms_contact_affiliations")
    .select(`
      *,
      affiliated_contact:affiliated_contact_id(id,name,email,organization,role,location),
      affiliated_user:affiliated_user_id(user_id)
    `)
    .eq("contact_id", id);
  
  if (affiliationsError) throw new Error(affiliationsError.message);
  
  return {
    ...contact,
    affiliations: affiliations?.map((aff: any) => ({
      ...aff,
      affiliation_type: aff.affiliation_type as 'user' | 'contact' | 'community'
    })) || []
  };
};

export const createContact = async (contact: Omit<Contact, "id" | "created_at" | "updated_at" | "user_id">): Promise<Contact> => {
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("rms_contacts").insert([{ ...contact, user_id: user.user?.id }]).select(`*,category:category_id(id,name,color)`);
  if (error) throw new Error(error.message);
  return data[0];
};

export const updateContact = async (id: string, contact: Partial<Contact>): Promise<Contact> => {
  const { data, error } = await supabase.from("rms_contacts").update(contact).eq("id", id).select(`*,category:category_id(id,name,color)`);
  if (error) throw new Error(error.message);
  return data[0];
};

export const deleteContact = async (id: string): Promise<void> => {
  // First, get the actv8_contact_id if one exists for this contact
  const { data: actv8Contact } = await supabase
    .from("rms_actv8_contacts")
    .select("id")
    .eq("contact_id", id)
    .maybeSingle();
  
  // If there's an actv8 contact, we need to nullify the reference in rms_outreach first
  // (because it has NO ACTION delete rule instead of CASCADE)
  if (actv8Contact) {
    await supabase
      .from("rms_outreach")
      .update({ actv8_contact_id: null })
      .eq("actv8_contact_id", actv8Contact.id);
  }
  
  // Now delete the contact - CASCADE will handle the rest
  const { error } = await supabase.from("rms_contacts").delete().eq("id", id);
  if (error) throw new Error(error.message);
};

export const deleteMultipleContacts = async (ids: string[]): Promise<void> => {
  const { error } = await supabase.from("rms_contacts").delete().in("id", ids);
  if (error) throw new Error(error.message);
};

export const updateMultipleContacts = async (
  ids: string[], 
  updates: { category_id?: string; industry?: string; location?: string }
): Promise<void> => {
  const { error } = await supabase
    .from("rms_contacts")
    .update(updates)
    .in("id", ids);
  
  if (error) throw new Error(error.message);
};

export const addAffiliation = async (contactId: string, affiliation: { affiliation_type: 'user' | 'contact' | 'community'; affiliated_user_id?: string; affiliated_contact_id?: string; affiliated_community_id?: string; relationship?: string; }): Promise<ContactAffiliation> => {
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("rms_contact_affiliations").insert([{ contact_id: contactId, user_id: user.user?.id, ...affiliation }]).select();
  if (error) throw new Error(error.message);
  return {...data[0], affiliation_type: data[0].affiliation_type as 'user' | 'contact' | 'community', affiliated_user: null, affiliated_contact: null, affiliated_community: null};
};

export const removeAffiliation = async (affiliationId: string): Promise<void> => {
  const { error } = await supabase.from("rms_contact_affiliations").delete().eq("id", affiliationId);
  if (error) throw new Error(error.message);
};

export const getCategories = async (): Promise<ContactCategory[]> => {
  const { data, error } = await supabase.from("rms_contact_categories").select("*").order("name");
  if (error) throw new Error(error.message);
  return data || [];
};

export const createCategory = async (category: Omit<ContactCategory, "id" | "user_id">): Promise<ContactCategory> => {
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("rms_contact_categories").insert([{ ...category, user_id: user.user?.id }]).select();
  if (error) throw new Error(error.message);
  return data[0];
};

export const updateCategory = async (id: string, category: Partial<ContactCategory>): Promise<ContactCategory> => {
  const { data, error } = await supabase.from("rms_contact_categories").update(category).eq("id", id).select();
  if (error) throw new Error(error.message);
  return data[0];
};

export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase.from("rms_contact_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
};

export const approveContact = async (contactId: string): Promise<void> => {
  // Update contact status to active
  const { error: contactError } = await supabase
    .from("rms_contacts")
    .update({ status: 'active' })
    .eq("id", contactId)
    .eq("status", "pending");
  
  if (contactError) throw new Error(contactError.message);
  
  // Increment rel8_contacts iota when contact is approved
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.rpc('increment_iota_metric', {
      p_user_id: user.id,
      p_metric_type: 'rel8_contacts',
      p_increment: 1
    });
  }
  
  // Delete the associated notification
  const { error: notificationError } = await supabase
    .from("cross_platform_notifications")
    .delete()
    .eq("notification_type", "invite_contact")
    .eq("metadata->>contact_id", contactId);
  
  if (notificationError) {
    console.error("Error deleting notification:", notificationError);
    // Don't throw - contact approval succeeded, notification deletion is optional
  }
};

export const rejectContact = async (contactId: string): Promise<void> => {
  // Delete the contact
  const { error: contactError } = await supabase
    .from("rms_contacts")
    .delete()
    .eq("id", contactId)
    .eq("status", "pending");
  
  if (contactError) throw new Error(contactError.message);
  
  // Also delete the associated notification
  const { error: notificationError } = await supabase
    .from("cross_platform_notifications")
    .delete()
    .eq("notification_type", "invite_contact")
    .eq("metadata->>contact_id", contactId);
  
  if (notificationError) {
    console.error("Error deleting notification:", notificationError);
    // Don't throw - contact deletion succeeded, notification deletion is optional
  }
};
