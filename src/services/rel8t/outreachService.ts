
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type OutreachPriority = "low" | "medium" | "high";
export type OutreachStatus = "pending" | "completed" | "overdue";

export interface Outreach {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: OutreachPriority;
  status: OutreachStatus;
  due_date: string;
  created_at?: string;
  updated_at?: string;
  contacts?: { id: string; name: string }[];
}

export interface OutreachWithContacts extends Outreach {
  contacts: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    organization?: string;
  }[];
}

export interface OutreachStatusCounts {
  today: number;
  upcoming: number;
  overdue: number;
  completed: number;
}

export const getOutreach = async (status?: string): Promise<Outreach[]> => {
  try {
    let query = supabase
      .from("rms_outreach")
      .select(`
        *,
        rms_outreach_contacts(
          *,
          rms_contacts(
            id,
            name
          )
        )
      `);
    
    if (status) {
      const now = new Date();
      const today = new Date(now.setHours(23, 59, 59, 999)).toISOString();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const startOfTomorrow = new Date(tomorrow.setHours(0, 0, 0, 0)).toISOString();
      
      switch (status) {
        case "today":
          query = query
            .eq("status", "pending")
            .lte("due_date", today);
          break;
        case "upcoming":
          query = query
            .eq("status", "pending")
            .gt("due_date", today);
          break;
        case "overdue":
          query = query
            .eq("status", "overdue");
          break;
        case "completed":
          query = query
            .eq("status", "completed");
          break;
      }
    }
    
    query = query.order("due_date");
    
    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map(item => {
      // Extract contacts from the nested structure
      const contacts = item.rms_outreach_contacts
        .map((oc: any) => oc.rms_contacts)
        .filter(Boolean);

      // Convert to the expected type with proper type casting
      const outreach: Outreach = {
        id: item.id,
        user_id: item.user_id,
        title: item.title,
        description: item.description,
        priority: item.priority as OutreachPriority,
        status: item.status as OutreachStatus,
        due_date: item.due_date,
        created_at: item.created_at,
        updated_at: item.updated_at,
        contacts
      };
      
      return outreach;
    });
  } catch (error: any) {
    console.error("Error fetching outreach:", error);
    toast({
      title: "Error fetching outreach",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

export const getOutreachWithDetail = async (id: string): Promise<OutreachWithContacts | null> => {
  try {
    const { data, error } = await supabase
      .from("rms_outreach")
      .select(`
        *,
        rms_outreach_contacts(
          *,
          rms_contacts(
            id,
            name,
            email,
            phone,
            organization
          )
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    const contacts = data.rms_outreach_contacts
      .map((oc: any) => oc.rms_contacts)
      .filter(Boolean);

    const outreach: OutreachWithContacts = {
      id: data.id,
      user_id: data.user_id,
      title: data.title,
      description: data.description,
      priority: data.priority as OutreachPriority,
      status: data.status as OutreachStatus,
      due_date: data.due_date,
      created_at: data.created_at,
      updated_at: data.updated_at,
      contacts
    };
    
    return outreach;
  } catch (error: any) {
    console.error(`Error fetching outreach ${id}:`, error);
    toast({
      title: "Error fetching outreach details",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const createOutreach = async (outreach: Omit<Outreach, "id" | "user_id" | "created_at" | "updated_at" | "status">, contactIds: string[]): Promise<Outreach | null> => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");

    // Create the outreach
    const outreachToInsert = {
      ...outreach,
      status: "pending" as OutreachStatus, // Set default status
      user_id: user.id
    };

    const { data, error } = await supabase
      .from("rms_outreach")
      .insert([outreachToInsert])
      .select()
      .single();

    if (error) throw error;
    
    // Associate contacts with the outreach
    if (contactIds.length > 0) {
      const outreachContactsToInsert = contactIds.map(contactId => ({
        outreach_id: data.id,
        contact_id: contactId
      }));
      
      const { error: junctionError } = await supabase
        .from("rms_outreach_contacts")
        .insert(outreachContactsToInsert);

      if (junctionError) throw junctionError;
    }
    
    toast({
      title: "Relationship outreach created",
      description: "Your relationship outreach has been successfully created.",
    });
    
    // Return the created outreach with empty contacts array and proper type casting
    return {
      ...data,
      priority: data.priority as OutreachPriority,
      status: data.status as OutreachStatus,
      contacts: []
    };
  } catch (error: any) {
    console.error("Error creating outreach:", error);
    toast({
      title: "Error creating outreach",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const updateOutreach = async (id: string, outreach: Partial<Outreach>, contactIds?: string[]): Promise<Outreach | null> => {
  try {
    // Update outreach
    const { data, error } = await supabase
      .from("rms_outreach")
      .update(outreach)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    // Update contacts if provided
    if (contactIds !== undefined) {
      // First, delete existing associations
      const { error: deleteError } = await supabase
        .from("rms_outreach_contacts")
        .delete()
        .eq("outreach_id", id);
      
      if (deleteError) throw deleteError;
      
      // Then, insert new associations
      if (contactIds.length > 0) {
        const outreachContactsToInsert = contactIds.map(contactId => ({
          outreach_id: id,
          contact_id: contactId
        }));
        
        const { error: insertError } = await supabase
          .from("rms_outreach_contacts")
          .insert(outreachContactsToInsert);
          
        if (insertError) throw insertError;
      }
    }
    
    toast({
      title: "Outreach updated",
      description: "Your relationship outreach has been successfully updated.",
    });
    
    return data;
  } catch (error: any) {
    console.error(`Error updating outreach ${id}:`, error);
    toast({
      title: "Error updating outreach",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const updateOutreachStatus = async (id: string, status: OutreachStatus): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("rms_outreach")
      .update({ status })
      .eq("id", id);

    if (error) throw error;
    
    toast({
      title: "Outreach status updated",
      description: `Outreach has been marked as ${status}.`,
    });
    
    return true;
  } catch (error: any) {
    console.error(`Error updating outreach status ${id}:`, error);
    toast({
      title: "Error updating outreach status",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

export const deleteOutreach = async (id: string): Promise<boolean> => {
  try {
    // Delete the outreach (cascade should handle the junction table)
    const { error } = await supabase
      .from("rms_outreach")
      .delete()
      .eq("id", id);

    if (error) throw error;
    
    toast({
      title: "Outreach deleted",
      description: "The relationship outreach has been successfully removed.",
    });
    
    return true;
  } catch (error: any) {
    console.error(`Error deleting outreach ${id}:`, error);
    toast({
      title: "Error deleting outreach",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

export const getOutreachStatusCounts = async (): Promise<OutreachStatusCounts> => {
  try {
    // Get current date info
    const now = new Date();
    const today = new Date(now.setHours(23, 59, 59, 999)).toISOString();
    
    // Get all outreach
    const { data, error } = await supabase
      .from("rms_outreach")
      .select('*');

    if (error) throw error;

    // Initialize counters
    const counts: OutreachStatusCounts = {
      today: 0,
      upcoming: 0,
      overdue: 0,
      completed: 0
    };
    
    // Count outreach by status
    data.forEach(item => {
      if (item.status === 'completed') {
        counts.completed++;
      } else if (item.status === 'overdue') {
        counts.overdue++;
      } else if (item.status === 'pending') {
        // Check if due today or upcoming
        if (new Date(item.due_date) <= new Date(today)) {
          counts.today++;
        } else {
          counts.upcoming++;
        }
      }
    });
    
    return counts;
  } catch (error: any) {
    console.error("Error fetching outreach status counts:", error);
    return {
      today: 0,
      upcoming: 0,
      overdue: 0,
      completed: 0
    };
  }
};

export const getOutreachCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from("rms_outreach")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error fetching outreach count:", error);
    return 0;
  }
};

export const getInactiveContactsCount = async (): Promise<number> => {
  try {
    // Get all contacts
    const { data: contacts, error: contactsError } = await supabase
      .from("rms_contacts")
      .select("id");

    if (contactsError) throw contactsError;
    
    // Get all contacts that are assigned to any outreach
    const { data: assignedContacts, error: assignedError } = await supabase
      .from("rms_outreach_contacts")
      .select("contact_id");

    if (assignedError) throw assignedError;
    
    // Extract the IDs of contacts that have been assigned to outreach
    const assignedContactIds = new Set(assignedContacts.map(item => item.contact_id));
    
    // Count contacts that don't have any assigned outreach
    const inactiveContacts = contacts.filter(contact => !assignedContactIds.has(contact.id));
    
    return inactiveContacts.length;
  } catch (error) {
    console.error("Error calculating inactive contacts:", error);
    return 0;
  }
};
