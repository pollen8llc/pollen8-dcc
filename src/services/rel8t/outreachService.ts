
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type OutreachStatus = "pending" | "overdue" | "completed";
export type OutreachPriority = "low" | "medium" | "high";
export type OutreachFilterTab = "today" | "upcoming" | "overdue" | "completed" | "all";

export interface OutreachStatusCounts {
  today: number;
  upcoming: number;
  overdue: number;
  completed: number;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  organization?: string;
}

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
  contacts?: Contact[];
}

export const getOutreachStatusCounts = async (): Promise<OutreachStatusCounts> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get all outreach items
    const { data, error } = await supabase
      .from("rms_outreach")
      .select("id, due_date, status")
      .eq("user_id", user.id);
      
    if (error) throw error;
    
    // Process and categorize the data
    const counts = data?.reduce((acc, item) => {
      const dueDate = new Date(item.due_date);
      
      // Today's items (due today and pending)
      if (dueDate >= today && dueDate < tomorrow && item.status === 'pending') {
        acc.today++;
      }
      // Upcoming items (due after tomorrow and pending)
      else if (dueDate >= tomorrow && item.status === 'pending') {
        acc.upcoming++;
      }
      // Overdue items (due before today and still pending)
      else if (dueDate < today && item.status === 'pending') {
        acc.overdue++;
      }
      // Completed items
      else if (item.status === 'completed') {
        acc.completed++;
      }
      
      return acc;
    }, { today: 0, upcoming: 0, overdue: 0, completed: 0 });
    
    return counts || { today: 0, upcoming: 0, overdue: 0, completed: 0 };
  } catch (error: any) {
    console.error("Error fetching outreach counts:", error);
    return { today: 0, upcoming: 0, overdue: 0, completed: 0 };
  }
};

export const getOutreach = async (tab: OutreachFilterTab = "all"): Promise<Outreach[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let query = supabase
      .from("rms_outreach")
      .select(`
        *,
        contacts:rms_outreach_contacts(
          contact:contact_id(
            id,
            name,
            email,
            organization
          )
        )
      `)
      .eq("user_id", user.id);
    
    // Apply filter based on tab
    switch (tab) {
      case "today":
        query = query.gte("due_date", today.toISOString())
                     .lt("due_date", tomorrow.toISOString())
                     .eq("status", "pending");
        break;
      case "upcoming":
        query = query.gte("due_date", tomorrow.toISOString())
                     .eq("status", "pending");
        break;
      case "overdue":
        query = query.lt("due_date", today.toISOString())
                     .eq("status", "pending");
        break;
      case "completed":
        query = query.eq("status", "completed");
        break;
      // "all" tab doesn't need additional filters
    }
    
    // Execute query
    const { data, error } = await query.order("due_date", { ascending: true });
    
    if (error) throw error;
    
    // Process data to format contacts
    const formattedData = data?.map(item => {
      // Extract contacts from nested structure
      const contacts = item.contacts?.map(contactItem => contactItem.contact) || [];
      
      // Ensure priority is correctly typed
      const priority = item.priority as OutreachPriority;
      if (!['low', 'medium', 'high'].includes(priority)) {
        // Default to 'medium' if invalid value
        item.priority = 'medium';
      }
      
      return {
        ...item,
        priority: item.priority as OutreachPriority,
        contacts
      } as Outreach;
    });
    
    return formattedData || [];
  } catch (error: any) {
    console.error(`Error fetching ${tab} outreach:`, error);
    toast({
      title: `Error fetching outreach items`,
      description: error.message,
      variant: "destructive",
    });
    return [];
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
      title: "Status updated",
      description: `Outreach status has been changed to ${status}.`,
    });
    
    return true;
  } catch (error: any) {
    console.error(`Error updating outreach status:`, error);
    toast({
      title: "Error updating status",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

export const deleteOutreach = async (id: string): Promise<boolean> => {
  try {
    // First delete associated contacts
    const { error: contactError } = await supabase
      .from("rms_outreach_contacts")
      .delete()
      .eq("outreach_id", id);
    
    if (contactError) throw contactError;
    
    // Then delete the outreach
    const { error } = await supabase
      .from("rms_outreach")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    toast({
      title: "Outreach deleted",
      description: "Outreach item has been successfully removed.",
    });
    
    return true;
  } catch (error: any) {
    console.error(`Error deleting outreach:`, error);
    toast({
      title: "Error deleting outreach",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

export const createOutreach = async (outreach: Omit<Outreach, "id" | "user_id" | "created_at" | "updated_at">, contactIds: string[]): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Create outreach
    const { data, error } = await supabase
      .from("rms_outreach")
      .insert([{ ...outreach, user_id: user.id }])
      .select()
      .single();
    
    if (error) throw error;
    
    const outreachId = data.id;
    
    // Associate contacts if provided
    if (contactIds.length > 0) {
      const contactsToInsert = contactIds.map(contactId => ({
        outreach_id: outreachId,
        contact_id: contactId
      }));
      
      const { error: contactsError } = await supabase
        .from("rms_outreach_contacts")
        .insert(contactsToInsert);
      
      if (contactsError) {
        // If contact association fails, delete the outreach
        await supabase.from("rms_outreach").delete().eq("id", outreachId);
        throw contactsError;
      }
    }
    
    toast({
      title: "Outreach created",
      description: "New outreach item has been created successfully.",
    });
    
    return outreachId;
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
