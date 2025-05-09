
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Outreach {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed" | "overdue";
  due_date: string;
  created_at?: string;
  updated_at?: string;
  contacts?: { id: string; name: string }[];
}

export const getOutreach = async (filter?: string): Promise<Outreach[]> => {
  try {
    let query = supabase
      .from("rms_outreach")
      .select(`
        *,
        rms_outreach_contacts!inner(
          rms_contacts(id, name)
        )
      `);
    
    if (filter === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      query = query
        .gte("due_date", today.toISOString())
        .lt("due_date", tomorrow.toISOString())
        .eq("status", "pending");
    } else if (filter === "upcoming") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      query = query
        .gte("due_date", tomorrow.toISOString())
        .eq("status", "pending");
    } else if (filter === "overdue") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      query = query
        .lt("due_date", today.toISOString())
        .eq("status", "pending");
    } else if (filter === "completed") {
      query = query.eq("status", "completed");
    }

    const { data, error } = await query.order("due_date");

    if (error) throw error;

    // Process the nested data structure
    const result = data.map(item => {
      const contacts = item.rms_outreach_contacts.map((oc: any) => ({
        id: oc.rms_contacts.id,
        name: oc.rms_contacts.name
      }));

      return {
        ...item,
        contacts
      };
    });
    
    return result || [];
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

export const getSingleOutreach = async (id: string): Promise<Outreach | null> => {
  try {
    const { data, error } = await supabase
      .from("rms_outreach")
      .select(`
        *,
        rms_outreach_contacts(
          contact_id,
          rms_contacts(id, name, email, phone, organization)
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    
    if (!data) return null;
    
    // Transform the data structure
    const contacts = data.rms_outreach_contacts.map((oc: any) => ({
      id: oc.rms_contacts.id,
      name: oc.rms_contacts.name,
      email: oc.rms_contacts.email,
      phone: oc.rms_contacts.phone,
      organization: oc.rms_contacts.organization
    }));

    return {
      ...data,
      contacts
    };
  } catch (error: any) {
    console.error(`Error fetching outreach ${id}:`, error);
    return null;
  }
};

export const createOutreach = async (
  outreach: Pick<Outreach, "title" | "description" | "priority" | "due_date">,
  contactIds: string[]
): Promise<Outreach | null> => {
  try {
    // Insert the outreach entry
    const { data: outreachData, error: outreachError } = await supabase
      .from("rms_outreach")
      .insert([{
        title: outreach.title,
        description: outreach.description,
        priority: outreach.priority,
        status: "pending", // Default status
        due_date: outreach.due_date
      }])
      .select()
      .single();

    if (outreachError) throw outreachError;
    
    if (!outreachData) throw new Error("Failed to create outreach");
    
    // Now insert the junction table entries
    if (contactIds.length > 0) {
      const junctionEntries = contactIds.map(contactId => ({
        outreach_id: outreachData.id,
        contact_id: contactId
      }));
      
      const { error: junctionError } = await supabase
        .from("rms_outreach_contacts")
        .insert(junctionEntries);
        
      if (junctionError) throw junctionError;
    }
    
    toast({
      title: "Outreach created",
      description: "The relationship outreach has been scheduled.",
    });
    
    // Return the created outreach with contacts
    return {
      ...outreachData,
      contacts: [] // We don't have the contact details here yet
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

export const updateOutreachStatus = async (id: string, status: "pending" | "completed" | "overdue"): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("rms_outreach")
      .update({ status })
      .eq("id", id);

    if (error) throw error;
    
    toast({
      title: "Outreach updated",
      description: `Outreach status changed to ${status}.`,
    });
    
    return true;
  } catch (error: any) {
    console.error(`Error updating outreach ${id}:`, error);
    toast({
      title: "Error updating outreach",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

export const deleteOutreach = async (id: string): Promise<boolean> => {
  try {
    // Delete from outreach table (cascade will handle junction table)
    const { error } = await supabase
      .from("rms_outreach")
      .delete()
      .eq("id", id);

    if (error) throw error;
    
    toast({
      title: "Outreach deleted",
      description: "The outreach has been deleted.",
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

export const getOutreachStatusCounts = async (): Promise<{
  today: number;
  upcoming: number;
  overdue: number;
  completed: number;
}> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Today's outreach
    const { count: todayCount, error: todayError } = await supabase
      .from("rms_outreach")
      .select("*", { count: "exact", head: true })
      .gte("due_date", today.toISOString())
      .lt("due_date", tomorrow.toISOString())
      .eq("status", "pending");
      
    if (todayError) throw todayError;
    
    // Upcoming outreach
    const { count: upcomingCount, error: upcomingError } = await supabase
      .from("rms_outreach")
      .select("*", { count: "exact", head: true })
      .gte("due_date", tomorrow.toISOString())
      .eq("status", "pending");
      
    if (upcomingError) throw upcomingError;
    
    // Overdue outreach
    const { count: overdueCount, error: overdueError } = await supabase
      .from("rms_outreach")
      .select("*", { count: "exact", head: true })
      .lt("due_date", today.toISOString())
      .eq("status", "pending");
      
    if (overdueError) throw overdueError;
    
    // Completed outreach
    const { count: completedCount, error: completedError } = await supabase
      .from("rms_outreach")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed");
      
    if (completedError) throw completedError;
    
    return {
      today: todayCount || 0,
      upcoming: upcomingCount || 0,
      overdue: overdueCount || 0,
      completed: completedCount || 0
    };
  } catch (error) {
    console.error("Error fetching outreach counts:", error);
    return { today: 0, upcoming: 0, overdue: 0, completed: 0 };
  }
};
