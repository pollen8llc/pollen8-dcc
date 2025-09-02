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
  created_at: string;
  updated_at: string;
  user_id: string;
  category_id?: string;
  last_contact_date?: string;
  // Include category details when joined
  category?: ContactCategory;
  // Include groups when joined
  groups?: ContactGroup[];
}

export interface ContactCategory {
  id: string;
  name: string;
  color: string;
  // Make user_id optional since it's not returned in joined queries
  user_id?: string;
}

export interface ContactGroup {
  id: string;
  name: string;
  description?: string;
  color?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
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
  // Join data with proper error handling
  affiliated_user?: { id: string; email: string } | null | Record<string, any>;
  affiliated_contact?: Contact | null | Record<string, any>;
  affiliated_community?: { id: string; name: string } | null | Record<string, any>;
}

// Get all contacts
export const getContacts = async (options?: { searchQuery?: string }): Promise<Contact[]> => {
  let query = supabase
    .from("rms_contacts")
    .select(`
      *,
      category:category_id (
        id,
        name,
        color
      )
    `);
  
  let searchQuery = "";
  
  // Handle options parameter
  if (options && typeof options === "object" && "searchQuery" in options) {
    searchQuery = options.searchQuery || "";
  }
  
  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,organization.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
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

// Get a contact by ID with groups
export const getContactById = async (id: string): Promise<Contact | null> => {
  try {
    const { data, error } = await supabase
      .from("rms_contacts")
      .select(`
        *,
        category:category_id (
          id,
          name,
          color
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching contact:", error);
      throw new Error(error.message);
    }

    if (!data) {
      return null;
    }

    // Get groups that this contact belongs to
    const { data: groupMembers, error: groupMembersError } = await supabase
      .from("rms_contact_group_members")
      .select(`
        group:group_id (
          id,
          name,
          description,
          color,
          user_id,
          created_at,
          updated_at
        )
      `)
      .eq("contact_id", id);
    
    if (groupMembersError) {
      console.error("Error fetching group memberships:", groupMembersError);
    }

    // Add groups to the contact
    const groups = groupMembers?.map(member => member.group as ContactGroup) || [];
    
    return {
      ...data,
      groups
    };
  } catch (error) {
    console.error("Error in getContactById:", error);
    throw error;
  }
};

// Create a new contact
export const createContact = async (contact: Omit<Contact, "id" | "created_at" | "updated_at" | "user_id">): Promise<Contact> => {
  const { data: user } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from("rms_contacts")
    .insert([{ ...contact, user_id: user.user?.id }])
    .select(`
      *,
      category:category_id (
        id,
        name,
        color
      )
    `);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data[0];
};

// Update a contact
export const updateContact = async (id: string, contact: Partial<Contact>): Promise<Contact> => {
  // Remove groups from the contact data as they're stored in separate tables
  const { groups, ...contactData } = contact;
  
  console.log("Updating contact with ID:", id);
  console.log("Contact data to update:", contactData);
  
  const { data, error } = await supabase
    .from("rms_contacts")
    .update(contactData)
    .eq("id", id)
    .select(`
      *,
      category:category_id (
        id,
        name,
        color
      )
    `);
  
  if (error) {
    console.error("Error updating contact:", error);
    throw new Error(error.message);
  }
  
  console.log("Contact update result:", data);
  return data[0];
};

// Add an affiliation to a contact
export const addAffiliation = async (
  contactId: string,
  affiliation: {
    affiliation_type: 'user' | 'contact' | 'community';
    affiliated_user_id?: string;
    affiliated_contact_id?: string;
    affiliated_community_id?: string;
    relationship?: string;
  }
): Promise<ContactAffiliation> => {
  const { data: user } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from("rms_contact_affiliations")
    .insert([{ 
      contact_id: contactId, 
      user_id: user.user?.id,
      ...affiliation
    }])
    .select();
  
  if (error) {
    throw new Error(error.message);
  }
  
  // Return a properly typed affiliation object
  const result: ContactAffiliation = {
    ...data[0],
    affiliation_type: data[0].affiliation_type as 'user' | 'contact' | 'community',
    affiliated_user: null,
    affiliated_contact: null,
    affiliated_community: null
  };
  
  return result;
};

// Remove an affiliation
export const removeAffiliation = async (affiliationId: string): Promise<void> => {
  const { error } = await supabase
    .from("rms_contact_affiliations")
    .delete()
    .eq("id", affiliationId);
  
  if (error) {
    throw new Error(error.message);
  }
};

// Create a contact group
export const createContactGroup = async (
  group: {
    name: string;
    description?: string;
    color?: string;
  }
): Promise<ContactGroup> => {
  const { data: user } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from("rms_contact_groups")
    .insert([{ 
      ...group,
      user_id: user.user?.id
    }])
    .select();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data[0] as ContactGroup;
};

// Get all contact groups
export const getContactGroups = async (): Promise<ContactGroup[]> => {
  const { data, error } = await supabase
    .from("rms_contact_groups")
    .select("*")
    .order("name");
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data as ContactGroup[];
};

// Add a contact to a group
export const addContactToGroup = async (
  contactId: string,
  groupId: string
): Promise<void> => {
  console.log("Adding contact to group:", { contactId, groupId });
  
  const { error } = await supabase
    .from("rms_contact_group_members")
    .insert([{ 
      contact_id: contactId,
      group_id: groupId
    }]);
  
  if (error) {
    console.error("Error adding contact to group:", error);
    throw new Error(error.message);
  }
  
  console.log("Successfully added contact to group");
};

// Remove a contact from a group
export const removeContactFromGroup = async (
  contactId: string,
  groupId: string
): Promise<void> => {
  console.log("Removing contact from group:", { contactId, groupId });
  
  const { error } = await supabase
    .from("rms_contact_group_members")
    .delete()
    .match({ 
      contact_id: contactId,
      group_id: groupId
    });
  
  if (error) {
    console.error("Error removing contact from group:", error);
    throw new Error(error.message);
  }
  
  console.log("Successfully removed contact from group");
};

// Get all contacts in a group
export const getContactsInGroup = async (groupId: string): Promise<Contact[]> => {
  const { data, error } = await supabase
    .from("rms_contact_group_members")
    .select(`
      contact:contact_id (
        *,
        category:category_id (
          id,
          name,
          color
        )
      )
    `)
    .eq("group_id", groupId);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.map(item => item.contact) || [];
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

// Delete multiple contacts
export const deleteMultipleContacts = async (ids: string[]): Promise<void> => {
  const { error } = await supabase
    .from("rms_contacts")
    .delete()
    .in("id", ids);
  
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

// Update a contact group
export const updateContactGroup = async (
  id: string, 
  group: {
    name: string;
    description?: string;
    color?: string;
  }
): Promise<ContactGroup> => {
  const { data, error } = await supabase
    .from("rms_contact_groups")
    .update(group)
    .eq("id", id)
    .select();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data[0] as ContactGroup;
};

// Delete a contact group
export const deleteContactGroup = async (id: string): Promise<boolean> => {
  try {
    // First, remove all members from this group
    const { error: memberError } = await supabase
      .from("rms_contact_group_members")
      .delete()
      .eq("group_id", id);

    if (memberError) {
      throw new Error(`Error removing group members: ${memberError.message}`);
    }
    
    // Then delete the group itself
    const { error } = await supabase
      .from("rms_contact_groups")
      .delete()
      .eq("id", id);
    
    if (error) {
      throw new Error(`Error deleting group: ${error.message}`);
    }
    
    toast({
      title: "Group deleted",
      description: "Contact group has been successfully removed.",
    });
    
    return true;
  } catch (error: any) {
    console.error(`Error deleting contact group ${id}:`, error);
    toast({
      title: "Error deleting group",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};
